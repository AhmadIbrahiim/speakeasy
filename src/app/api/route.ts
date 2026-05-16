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

// Number of trusted reverse-proxy hops between the deployment and the public
// internet (Vercel = 1, Render = 1, Cloudflare-in-front-of-Vercel = 2).
// Header semantics: each proxy APPENDS the IP it received the request from,
// so for N trusted hops the real client IP sits at parts[length - N].
// Default 0 means "trust no XFF entry" and fall through to platform headers.
const TRUSTED_PROXY_HOPS = Math.max(0, Number(process.env.TRUSTED_PROXY_HOPS) || 0)

function getClientIp(req: Request): string {
  // Platform-specific single-source headers FIRST. These are set by the
  // platform's edge (not appended-to by user-controllable hops), so they
  // are the most reliable signal when available.
  const platform = req.headers.get("x-vercel-forwarded-for") || req.headers.get("cf-connecting-ip") || req.headers.get("fly-client-ip") || req.headers.get("true-client-ip")
  if (platform) return platform.trim()

  // x-forwarded-for. We only consult it if the operator explicitly declared
  // how many trusted proxies sit between us and the public internet — that
  // is the only safe way to index past attacker-controlled prefix entries.
  if (TRUSTED_PROXY_HOPS > 0) {
    const xff = req.headers.get("x-forwarded-for")
    if (xff) {
      const parts = xff
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean)
      const idx = parts.length - TRUSTED_PROXY_HOPS
      if (idx >= 0 && idx < parts.length) return parts[idx]
      // Header is shorter than the declared hop count → spoofed or
      // misconfigured. Refuse to attribute; fall through.
    }
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

  // 2) Reject oversize bodies. We enforce the cap on actual bytes read — not
  // just content-length — because chunked transfers and missing-header clients
  // would otherwise bypass a header-only check. Quick header gate first to fail
  // fast without buffering, then a streaming reader bounded at MAX_BODY_BYTES.
  const contentLengthHeader = req.headers.get("content-length")
  if (contentLengthHeader) {
    const len = Number(contentLengthHeader)
    if (Number.isFinite(len) && len > MAX_BODY_BYTES) {
      return jsonError({ code: "validation", message: "Request body too large (16KB max)." }, 413)
    }
  }

  // Read up to MAX_BODY_BYTES+1 bytes; if we get the extra byte, the body
  // overran the cap regardless of what content-length claimed.
  let raw: string
  try {
    const reader = req.body?.getReader()
    if (!reader) {
      // No body stream — fall back to plain text() (small/empty body).
      raw = await req.text()
    } else {
      const chunks: Uint8Array[] = []
      let total = 0
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        if (value) {
          total += value.byteLength
          if (total > MAX_BODY_BYTES) {
            try {
              await reader.cancel()
            } catch {
              /* noop */
            }
            return jsonError({ code: "validation", message: "Request body too large (16KB max)." }, 413)
          }
          chunks.push(value)
        }
      }
      raw = new TextDecoder().decode(Buffer.concat(chunks.map((c) => Buffer.from(c))))
    }
  } catch {
    return jsonError({ code: "validation", message: "Could not read request body." }, 400)
  }

  let body: { text?: unknown; id?: unknown; bgId?: unknown; cartesiaApiKey?: unknown }
  try {
    body = raw ? JSON.parse(raw) : {}
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
