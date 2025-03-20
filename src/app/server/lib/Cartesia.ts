import { CARTESIA_API_KEY } from "@/config"
import { CartesiaClient } from "@cartesia/cartesia-js"

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

  // Utility method for text-to-speech generation
  public static async generate({ text, voice, model_id = "sonic-2", output_format = "mp3_44100_128" }: { text: string; voice: string; model_id?: string; output_format?: string }) {
    const client = CartesiaService.getInstance()

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
