import { useMutation } from "@tanstack/react-query"
import { mixAudioClientSide } from "../utils/audioMixer"

type MixingOptions = {
  voiceVolume?: number
  bgVolume?: number
  outputFormat?: "wav" | "mp3"
  cartesiaApiKey?: string
}

const request = async (text: string, id: string, bgId: string, options?: MixingOptions) => {
  const response = await fetch("/api", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, id, bgId, cartesiaApiKey: options?.cartesiaApiKey }),
  })

  // Get the background URL from the response header
  const backgroundUrl = response.headers.get("X-Background-URL") || ""

  // Get the voice audio as ArrayBuffer
  const voiceBuffer = await response.arrayBuffer()

  return { voiceBuffer, backgroundUrl }
}

// Define the function to call the mutation
export const useCreateAudioBuffer = (text: string, id: string, bg: string) => {
  const mutation = useMutation({
    mutationFn: async (options?: MixingOptions) => {
      try {
        // Get the voice audio and background URL
        const { voiceBuffer, backgroundUrl } = await request(text, id, bg, options)

        // If we have both voice and background, mix them client-side
        if (voiceBuffer && backgroundUrl) {
          // The background URL is relative, so we need to make it absolute
          const absoluteBackgroundUrl = backgroundUrl.startsWith("/") ? `${window.location.origin}${backgroundUrl}` : backgroundUrl

          // Mix the audio with client-side Web Audio API
          const mixedBlob = await mixAudioClientSide(
            voiceBuffer,
            absoluteBackgroundUrl,
            options?.voiceVolume || 1.0, // voice volume
            options?.bgVolume || 0.3, // background volume
            options?.outputFormat || "wav", // output format
          )

          return new Response(mixedBlob)
        } else {
          // If we don't have a background URL, just return the voice
          return new Response(voiceBuffer)
        }
      } catch (error) {
        console.error("Error in audio processing:", error)
        throw error
      }
    },
  })

  return { mutation }
}
