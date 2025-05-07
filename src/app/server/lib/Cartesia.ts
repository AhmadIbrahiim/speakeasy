import { CARTESIA_API_KEY } from "@/config"
import { CartesiaClient } from "@cartesia/cartesia-js"
import { CartesiaVoiceResponse } from "@/types"

class CartesiaService {
  private static instance: CartesiaClient

  private constructor() {
    // Initialize the API connection here
  }

  public static getInstance(): CartesiaClient {
    if (!CartesiaService.instance) {
      this.instance = new CartesiaClient({
        apiKey: CARTESIA_API_KEY,
      })
    }
    return CartesiaService.instance
  }

  // Method to list available voices
  public static async listVoices(): Promise<CartesiaVoiceResponse[]> {
    try {
      const response = await fetch("https://api.cartesia.ai/voices/", {
        headers: {
          "Cartesia-Version": "2024-11-13",
          "X-API-Key": CARTESIA_API_KEY || "",
        },
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()
      return data.data // Return the array of voice data
    } catch (error) {
      console.error("Error listing voices:", error)
      return [] // Return empty array on error
    }
  }

  // Utility method for text-to-speech generation
  public static async generate({
    text,
    voice,
    model_id = "sonic-2",
    output_format = "mp3_44100_128",
    cartesiaApiKey,
  }: {
    text: string
    voice: string
    model_id?: string
    output_format?: string
    cartesiaApiKey?: string
  }) {
    const client = cartesiaApiKey ? new CartesiaClient({ apiKey: cartesiaApiKey }) : CartesiaService.getInstance()

    // Parse the output format
    let outputFormatObj

    if (output_format === "mp3_44100_128") {
      outputFormatObj = {
        container: "mp3" as const,
        sampleRate: 44100,
        bitRate: 128000,
      }
    } else if (output_format.startsWith("wav")) {
      outputFormatObj = {
        container: "wav" as const,
        sampleRate: 44100,
        encoding: "pcm_f32le" as const,
      }
    } else {
      // Default to MP3
      outputFormatObj = {
        container: "mp3" as const,
        sampleRate: 44100,
        bitRate: 128000,
      }
    }

    return client.tts.bytes({
      modelId: model_id,
      transcript: text,
      voice: {
        mode: "id",
        id: voice,
      },
      language: "en",
      outputFormat: outputFormatObj,
    })
  }
}

export default CartesiaService
