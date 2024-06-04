import { randomUUID } from "crypto"
import { ElevenLabsClient } from "elevenlabs"
import { createWriteStream } from "fs"
import { resolve } from "path"

class ELabs {
  private static instance: ElevenLabsClient

  private constructor() {
    // Initialize the API connection here
  }

  public static getInstance(): ElevenLabsClient {
    if (!ELabs.instance) {
      this.instance = new ElevenLabsClient({
        apiKey: process.env.ELEVENLABS_API_KEY,
      })
    }
    return ELabs.instance
  }
}

export default ELabs.getInstance()
