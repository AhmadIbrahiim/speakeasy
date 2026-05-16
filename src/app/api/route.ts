import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import generateVoices from "../server/config/voices"
import BlobStorageService from "../server/lib/BlobStorage"
import { checkRateLimit } from "../server/lib/rateLimit"
import { getClientIp } from "../server/lib/clientIp"
import { classifyCartesiaError, type ApiError } from "./errorMapping"

// Hard caps enforced before we ever touch upstream.
const MAX_BODY_BYTES = 16384
const MAX_TEXT_LENGTH = 4000
const VOICE_ID_PATTERN = /^[a-f0-9-]{8,40}$/i
const BG_ID_PATTERN = /^[a-z0-9-]+$/

function jsonError(err: ApiError, httpStatus: number) {
  return NextResponse.json({ error: err }, { status: httpStatus })
}

export async function POST(req: Request) {
  // 1) Rate limit before anything else (cheapest possible reject).
  const ip = getClientIp(req)
  // Per-route bucket — see rateLimit.ts. Reads on /api/voices and
  // /api/background must not burn the generate budget.
  const rl = checkRateLimit(`generate:${ip}`)
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
