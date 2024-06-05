import { NextResponse } from "next/server"
import generateVoices, { addMusic } from "../server/config/voices"
import ElevenLabs from "../server/lib/ElevenLabs"
import fs from "fs"
import path from "path"

export async function GET(req: Request, res: NextResponse) {
  try {
    // Your API logic goes here
    const { fileId, fileName } = await generateVoices({
      text: `... <break time="2.0s" /> Hello, I am a voice assistant. I can help you with your tasks. How can I help you today? <break time="2.0s" /> ...`,
    })

    await addMusic(fileName, fileId)
    let usersPath = path.join("/tmp/", `${fileId}-bg.mp3`)
    let wavePath = path.join("/tmp/", `${fileId}-bg.wav`)
    let originalPath = path.join("/tmp/", `${fileId}.mp3`)
    let audioInMp3Buffer = fs.readFileSync(usersPath)

    // Remove the file after reading it
    fs.unlinkSync(usersPath)
    fs.unlinkSync(wavePath)
    fs.unlinkSync(originalPath)
    return new Response(audioInMp3Buffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioInMp3Buffer.byteLength.toString(),
      },
    })
  } catch (error) {
    console.log(JSON.stringify(error, null, 10))
    return new Response(
      JSON.stringify(error, null, 10),

      {
        status: 500,
      },
    )
  }
}
