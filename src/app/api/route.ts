import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import generateVoices from "../server/config/voices"
import BlobStorageService from "../server/lib/BlobStorage"

type ApiErrorCode = "invalid_key" | "rate_limited" | "quota_exceeded" | "server" | "validation" | "voice_not_found" | "unknown"

type ApiError = {
  code: ApiErrorCode
  message: string
  retry_after_seconds?: number
}

function jsonError(err: ApiError, httpStatus: number) {
  return NextResponse.json({ error: err }, { status: httpStatus })
}

function classifyCartesiaError(err: unknown): { api: ApiError; http: number } {
  const e = err as { status?: number; message?: string; error?: { message?: string } } | undefined
  const upstream = e?.status ?? 0
  const upstreamMessage = e?.error?.message || e?.message

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
  return {
    api: { code: "unknown", message: upstreamMessage || "Something went wrong generating your audio." },
    http: 500,
  }
}

export async function POST(req: Request) {
  let body: { text?: string; id?: string; bgId?: string; cartesiaApiKey?: string }
  try {
    body = await req.json()
  } catch {
    return jsonError({ code: "validation", message: "Invalid request body." }, 400)
  }

  const { text, id, bgId, cartesiaApiKey } = body

  if (!id) return jsonError({ code: "validation", message: "Pick a voice before generating." }, 400)
  if (!text) return jsonError({ code: "validation", message: "Write a greeting before generating." }, 400)
  if (!cartesiaApiKey) return jsonError({ code: "invalid_key", message: "Add your Cartesia API key to generate audio." }, 401)

  const isDevelopment = process.env.NODE_ENV === "development"

  try {
    const { fileId, fileUrl, backgroundUrl } = await generateVoices({
      text: `<break time="1.5s"/> ${text} <break time="1s"/>`,
      id,
      bg: bgId || "",
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
