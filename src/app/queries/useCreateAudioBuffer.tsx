import { useMutation } from "@tanstack/react-query"
import { mixAudioClientSide } from "../utils/audioMixer"

type MixingOptions = {
  voiceVolume?: number
  bgVolume?: number
  outputFormat?: "wav" | "mp3"
  cartesiaApiKey?: string
}

export type ApiErrorCode = "invalid_key" | "rate_limited" | "quota_exceeded" | "server" | "validation" | "voice_not_found" | "network" | "unknown"

export class GenerateAudioError extends Error {
  code: ApiErrorCode
  status: number
  retryAfterSeconds?: number
  constructor(code: ApiErrorCode, message: string, status: number, retryAfterSeconds?: number) {
    super(message)
    this.name = "GenerateAudioError"
    this.code = code
    this.status = status
    this.retryAfterSeconds = retryAfterSeconds
  }
}

const request = async (text: string, id: string, bgId: string, options?: MixingOptions) => {
  let response: Response
  try {
    response = await fetch("/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, id, bgId, cartesiaApiKey: options?.cartesiaApiKey }),
    })
  } catch {
    throw new GenerateAudioError("network", "We couldn't reach the server. Check your connection and try again.", 0)
  }

  if (!response.ok) {
    let parsed: { error?: { code?: ApiErrorCode; message?: string; retry_after_seconds?: number } } = {}
    try {
      parsed = await response.json()
    } catch {}
    const err = parsed.error
    throw new GenerateAudioError(err?.code ?? "unknown", err?.message ?? `Request failed (${response.status}).`, response.status, err?.retry_after_seconds)
  }

  const backgroundUrl = response.headers.get("X-Background-URL") || ""
  const voiceBuffer = await response.arrayBuffer()
  return { voiceBuffer, backgroundUrl }
}

export const useCreateAudioBuffer = (text: string, id: string, bg: string) => {
  const mutation = useMutation({
    mutationFn: async (options?: MixingOptions) => {
      const { voiceBuffer, backgroundUrl } = await request(text, id, bg, options)

      if (voiceBuffer && backgroundUrl) {
        const absoluteBackgroundUrl = backgroundUrl.startsWith("/") ? `${window.location.origin}${backgroundUrl}` : backgroundUrl
        const mixedBlob = await mixAudioClientSide(voiceBuffer, absoluteBackgroundUrl, options?.voiceVolume ?? 1.0, options?.bgVolume ?? 0.3, options?.outputFormat ?? "wav")
        return new Response(mixedBlob)
      }
      return new Response(voiceBuffer)
    },
  })

  return { mutation }
}
