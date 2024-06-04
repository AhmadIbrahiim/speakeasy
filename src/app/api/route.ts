import { NextResponse } from "next/server"
import generateVoices from "../server/config/voices"
import ElevenLabs from "../server/lib/ElevenLabs"
import { readFileSync } from "fs"

const runtime = "node"

export async function GET(req: Request, res: NextResponse) {
  // Your API logic goes here
  const file = await generateVoices({ text: "Hello, World!" })

  const imageBuffer = readFileSync(file)

  return new Response(imageBuffer, {
    status: 200,
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Length": imageBuffer.byteLength.toString(),
    },
  })
}
