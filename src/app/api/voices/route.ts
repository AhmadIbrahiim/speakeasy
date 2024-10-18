import Cartesia from "@cartesia/cartesia-js"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  // Your API logic goes here
  const cr = new Cartesia({
    apiKey: process.env.ELEVENLABS_API_KEY,
  })

  const voices = await cr.voices.list()

  return NextResponse.json({
    voices,
  })
}
