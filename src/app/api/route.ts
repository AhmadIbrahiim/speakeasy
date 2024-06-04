import { NextResponse } from "next/server"
import generateVoices, { addMusic } from "../server/config/voices"
import ElevenLabs from "../server/lib/ElevenLabs"
import { readFileSync } from "fs"
const FFmpeg = require("fluent-ffmpeg")

const runtime = "node"

export async function GET(req: Request, res: NextResponse) {
  // Your API logic goes here
  const { fileId, fileName } = await generateVoices({
    text: `... <break time="2.0s" /> Hello, I am a voice assistant. I can help you with your tasks. How can I help you today?`,
  })

  await addMusic(fileName, fileId)
  const audioInMp3Buffer = readFileSync(`temp/${fileId}-bg.mp3`)

  return new Response(audioInMp3Buffer, {
    status: 200,
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Length": audioInMp3Buffer.byteLength.toString(),
    },
  })
}
