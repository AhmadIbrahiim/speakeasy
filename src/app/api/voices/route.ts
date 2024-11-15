import { ELEVENLABS_API_KEY } from "@/config"
import { ElevenLabs, ElevenLabsClient } from "elevenlabs"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  // Your API logic goes here
  const elevenlabs = new ElevenLabsClient({
    apiKey: ELEVENLABS_API_KEY,
  })

  const voices = await elevenlabs.voices.getAll()

  return NextResponse.json({
    voices,
  })
}
