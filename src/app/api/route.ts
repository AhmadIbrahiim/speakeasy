import { NextResponse } from "next/server"
import generateVoices, { addMusic } from "../server/config/voices"
import ElevenLabs from "../server/lib/ElevenLabs"
import fs from "fs"
import path from "path"

export async function POST(req: Request, res: NextResponse) {
  try {
    const { text, id, bgId = "background" } = await req.json()

    console.log({
      text,
      id,
      bgId,
    })
    // Your API logic goes here
    const { fileId, fileName } = await generateVoices({
      text: `"<break time="2.0s" />" ${text} "<break time="2.0s" />"`,
      id,
      bg: bgId,
    })

    await addMusic(fileName, fileId, bgId)
    let usersPath = path.join("output/", `${fileId}-bg.mp3`)
    let wavePath = path.join("output/", `${fileId}-bg.wav`)
    let originalPath = path.join("output/", `${fileId}.mp3`)
    let audioInMp3Buffer = fs.readFileSync(usersPath)

    // Remove the file after reading it
    // fs.unlinkSync(usersPath)
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
