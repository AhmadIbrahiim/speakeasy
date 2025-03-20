import { NextResponse } from "next/server"
import generateVoices, { addMusic } from "../server/config/voices"
import CartesiaService from "../server/lib/Cartesia"
import BlobStorageService from "../server/lib/BlobStorage"
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
    const finalText = `<break time="2s" /> ${text} <break time="1s" />`
    // Generate the voice audio
    const { fileId, fileName, preProcess, fileUrl } = await generateVoices({
      text: finalText?.replaceAll("⌛", `<break time="0.5s" />"`),
      id,
      bg: bgId,
    })

    // Process the audio with background music if needed
    let audioBuffer: Buffer
    const isDevelopment = process.env.NODE_ENV === "development"

    if (preProcess) {
      const result = await addMusic(fileName, fileId, bgId)

      if (isDevelopment) {
        // In development, read from local file
        let usersPath = path.join("output/", `${fileId}-bg.mp3`)
        audioBuffer = fs.readFileSync(usersPath)

        // Clean up temporary files in development
        let wavePath = path.join("output/", `${fileId}-bg.wav`)
        let originalPath = path.join("output/", `${fileId}.mp3`)
        try {
          fs.unlinkSync(wavePath)
          fs.unlinkSync(originalPath)
        } catch (error) {
          console.log("Error deleting file", error)
        }
      } else {
        // In production, get the file from Vercel Blob
        if (result.bgUrl) {
          audioBuffer = await BlobStorageService.downloadAudio(result.bgUrl)
        } else {
          throw new Error("Failed to get processed audio URL")
        }
      }
    } else {
      // File already exists, retrieve it
      if (isDevelopment) {
        // In development, read from local file
        let usersPath = path.join("output/", `${fileId}-bg.mp3`)
        audioBuffer = fs.readFileSync(usersPath)
      } else {
        // In production, get the file from Vercel Blob
        if (fileUrl) {
          audioBuffer = await BlobStorageService.downloadAudio(fileUrl)
        } else {
          throw new Error("Failed to get existing audio URL")
        }
      }
    }

    // Create headers with proper content-type and content-length
    const headers = new Headers({
      "Content-Type": "audio/mpeg",
      "Content-Length": audioBuffer.byteLength.toString(),
      "Cache-Control": "public, max-age=31536000",
      "X-Content-Type-Options": "nosniff",
    })

    return new Response(audioBuffer, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.log(JSON.stringify(error, null, 10))
    return new Response(JSON.stringify(error, null, 10), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}
