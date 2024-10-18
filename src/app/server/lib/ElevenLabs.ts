import { randomUUID } from "crypto"
import Cartesia from "@cartesia/cartesia-js"
import { createWriteStream } from "fs"
import { resolve } from "path"

class ELabs {
  private static instance: Cartesia

  private constructor() {
    // Initialize the API connection here
  }

  public static getInstance(): Cartesia {
    if (!ELabs.instance) {
      this.instance = new Cartesia({
        apiKey: process.env.ELEVENLABS_API_KEY,
      })
    }
    return ELabs.instance
  }
}

export default ELabs.getInstance()
