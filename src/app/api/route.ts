import { NextResponse } from "next/server"
import { promises as fsPromises } from "fs"
import fs from "fs"
import path from "path"
import generateVoices from "../server/config/voices"
import BlobStorageService from "../server/lib/BlobStorage"

export async function POST(req: Request, res: NextResponse) {
  try {
    const { text, id, bgId } = await req.json()

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 })
    }

    if (!text) {
      return NextResponse.json({ message: "Text is required" }, { status: 400 })
    }

    const isDevelopment = process.env.NODE_ENV === "development"

    const { fileName, fileId, preProcess, fileUrl, backgroundUrl } = await generateVoices({
      text,
      id,
      bg: bgId,
    })

    // Get the audio buffer for the voice
    let audioBuffer: Buffer

    if (isDevelopment) {
      // In development, read from local file
      let usersPath = path.join("output/", `${fileId}.mp3`)
      audioBuffer = fs.readFileSync(usersPath)
    } else {
      // In production, get the file from Vercel Blob
      if (fileUrl) {
        audioBuffer = await BlobStorageService.downloadAudio(fileUrl)
      } else {
        throw new Error("Failed to get audio URL")
      }
    }

    // Create headers with proper content-type and content-length
    const headers = new Headers({
      "Content-Type": "audio/mpeg",
      "Content-Length": audioBuffer.byteLength.toString(),
      "Cache-Control": "public, max-age=31536000",
      "X-Content-Type-Options": "nosniff",
    })

    // Return response with audio data and background URL in headers
    headers.set("X-Background-URL", backgroundUrl || "")

    return new Response(audioBuffer, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.log(error)
    return new Response(JSON.stringify({ error: "Error generating audio" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}
