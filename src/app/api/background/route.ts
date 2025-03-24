import fs from "fs"
import path from "path"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Get the file parameter from the URL
    const fileParam = request.nextUrl.searchParams.get("file")

    // Return error if no file parameter was provided
    if (!fileParam) {
      return NextResponse.json({ error: "File parameter is required" }, { status: 400 })
    }

    // Sanitize the file parameter to prevent path traversal attacks
    const sanitizedFile = fileParam.replace(/\.\.\//g, "").replace(/\\/g, "")
    const filePath = path.join(process.cwd(), "public/assets", sanitizedFile)

    // Check if the file exists
    try {
      fs.accessSync(filePath, fs.constants.F_OK)
    } catch (error) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Read the file
    const fileBuffer = fs.readFileSync(filePath)

    // Determine content type based on file extension
    const fileExtension = path.extname(filePath).toLowerCase()
    let contentType = "application/octet-stream"

    if (fileExtension === ".mp3") {
      contentType = "audio/mpeg"
    } else if (fileExtension === ".wav") {
      contentType = "audio/wav"
    } else if (fileExtension === ".ogg") {
      contentType = "audio/ogg"
    }

    // Return the file with appropriate headers
    const headers = {
      "Content-Type": contentType,
      "Content-Length": fileBuffer.byteLength.toString(),
      "Cache-Control": "public, max-age=31536000",
      "X-Content-Type-Options": "nosniff",
      // Add CORS headers to allow client-side access
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    }

    return new Response(fileBuffer, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error("Error serving background file:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
