import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import generateVoices from "../server/config/voices"
import BlobStorageService from "../server/lib/BlobStorage"
import { checkRateLimit } from "../server/lib/rateLimit"

type ApiErrorCode = "invalid_key" | "rate_limited" | "quota_exceeded" | "server" | "validation" | "voice_not_found" | "unknown"

type ApiError = {
  code: ApiErrorCode
  message: string
  retry_after_seconds?: number
}

// Hard caps enforced before we ever touch upstream.
const MAX_BODY_BYTES = 16384
const MAX_TEXT_LENGTH = 4000
const VOICE_ID_PATTERN = /^[a-f0-9-]{8,40}$/i
const BG_ID_PATTERN = /^[a-z0-9-]+$/

function jsonError(err: ApiError, httpStatus: number) {
  return NextResponse.json({ error: err }, { status: httpStatus })
}

function getClientIp(req: Request): string {
  // x-forwarded-for can be a comma-separated chain; the client is the first entry.
  const xff = req.headers.get("x-forwarded-for")
  if (xff) {
    const first = xff.split(",")[0]?.trim()
    if (first) return first
  }
  const real = req.headers.get("x-real-ip")
  if (real) return real.trim()
  return "unknown"
}

function classifyCartesiaError(err: unknown): { api: ApiError; http: number } {
  const e = err as { name?: string; status?: number; message?: string; error?: { message?: string } } | undefined
  const upstream = e?.status ?? 0
  const upstreamMessage = e?.error?.message || e?.message || ""
  const errName = e?.name || ""

  // Timeout / abort — covers both fetch AbortError and SDK aborts. Mapped to 504
  // so the client can retry without thinking the upstream key is bad.
  // NOTE: we never surface upstreamMessage to the client here; the curated string is fixed.
  const looksAborted = errName === "AbortError" || /\baborted\b/i.test(upstreamMessage) || /\btimeout\b/i.test(upstreamMessage)
  if (looksAborted) {
    return {
      api: { code: "server", message: "Cartesia took too long to respond. Try again." },
      http: 504,
    }
  }

  if (upstream === 401 || upstream === 403) {
    return {
      api: { code: "invalid_key", message: "Cartesia rejected your API key. Paste a new one to keep generating." },
      http: 401,
    }
  }
  if (upstream === 402) {
    return {
      api: { code: "quota_exceeded", message: "Your Cartesia credits are exhausted. Add credit on cartesia.ai or paste a different key." },
      http: 402,
    }
  }
  if (upstream === 404) {
    return {
      api: { code: "voice_not_found", message: "That voice is no longer available in Cartesia. Pick another voice and try again." },
      http: 404,
    }
  }
  if (upstream === 429) {
    return {
      api: { code: "rate_limited", message: "Cartesia rate-limited this request. Give it a few seconds and try again.", retry_after_seconds: 10 },
      http: 429,
    }
  }
  if (upstream >= 500 && upstream < 600) {
    return {
      api: { code: "server", message: "Cartesia returned a server error. Try again in a moment." },
      http: 502,
    }
  }
  // Generic catch-all — deliberately does NOT leak raw upstream messages.
  return {
    api: { code: "unknown", message: "Something went wrong generating your audio." },
    http: 500,
  }
}

export async function POST(req: Request) {
  // 1) Rate limit before anything else (cheapest possible reject).
  const ip = getClientIp(req)
  const rl = checkRateLimit(ip)
  if (!rl.allowed) {
    return jsonError(
      {
        code: "rate_limited",
        message: "Too many requests. Try again in a few seconds.",
        retry_after_seconds: rl.retry_after_seconds,
      },
      429,
    )
  }

  // 2) Reject oversize bodies before parsing. We trust content-length here as
  // a cheap gate; downstream JSON parsing still applies its own limits.
  const contentLengthHeader = req.headers.get("content-length")
  if (contentLengthHeader) {
    const len = Number(contentLengthHeader)
    if (Number.isFinite(len) && len > MAX_BODY_BYTES) {
      return jsonError({ code: "validation", message: "Request body too large (16KB max)." }, 413)
    }
  }

  let body: { text?: unknown; id?: unknown; bgId?: unknown; cartesiaApiKey?: unknown }
  try {
    body = await req.json()
  } catch {
    return jsonError({ code: "validation", message: "Invalid request body." }, 400)
  }

  const { text, id, bgId, cartesiaApiKey } = body

  // 3) Field-level guards. Order: presence -> type -> shape -> length.
  if (!id) return jsonError({ code: "validation", message: "Pick a voice before generating." }, 400)
  if (typeof id !== "string" || !VOICE_ID_PATTERN.test(id)) {
    return jsonError({ code: "validation", message: "Invalid voice id." }, 400)
  }

  if (!text) return jsonError({ code: "validation", message: "Write a greeting before generating." }, 400)
  if (typeof text !== "string") {
    return jsonError({ code: "validation", message: "Invalid greeting text." }, 400)
  }
  if (text.length > MAX_TEXT_LENGTH) {
    return jsonError({ code: "validation", message: "Greeting text too long (4000 char max)." }, 400)
  }

  if (bgId !== undefined && bgId !== null && bgId !== "") {
    if (typeof bgId !== "string" || !BG_ID_PATTERN.test(bgId)) {
      return jsonError({ code: "validation", message: "Invalid background id." }, 400)
    }
  }

  if (!cartesiaApiKey || typeof cartesiaApiKey !== "string") {
    return jsonError({ code: "invalid_key", message: "Add your Cartesia API key to generate audio." }, 401)
  }

  const isDevelopment = process.env.NODE_ENV === "development"

  try {
    const { fileId, fileUrl, backgroundUrl } = await generateVoices({
      text: `<break time="1.5s"/> ${text} <break time="1s"/>`,
      id,
      bg: typeof bgId === "string" ? bgId : "",
      cartesiaApiKey,
    })

    let audioBuffer: Buffer
    if (isDevelopment) {
      audioBuffer = fs.readFileSync(path.join("output/", `${fileId}.mp3`))
    } else {
      if (!fileUrl) throw new Error("Audio upload returned no URL")
      audioBuffer = await BlobStorageService.downloadAudio(fileUrl)
    }

    const headers = new Headers({
      "Content-Type": "audio/mpeg",
      "Content-Length": audioBuffer.byteLength.toString(),
      "Cache-Control": "public, max-age=31536000",
      "X-Content-Type-Options": "nosniff",
      "X-Background-URL": backgroundUrl || "",
    })
    return new Response(audioBuffer, { status: 200, headers })
  } catch (error: unknown) {
    console.error("[/api] generate failed:", error)
    const { api, http } = classifyCartesiaError(error)
    return jsonError(api, http)
  }
}
