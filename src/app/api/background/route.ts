import { NextRequest, NextResponse } from "next/server"
import { checkRateLimit } from "@/app/server/lib/rateLimit"
import { getClientIp } from "@/app/server/lib/clientIp"

const ASSETS_BASE = "https://raw.githubusercontent.com/AhmadIbrahiim/speakeasy/main/public/assets"

export async function GET(request: NextRequest) {
  // Rate limit before anything else. Background MP3s are static assets and the
  // dev/UI hits them often, so the limit is generous.
  const ip = getClientIp(request)
  const rl = checkRateLimit(`background:${ip}`, { limit: 120, windowSeconds: 60 })
  if (!rl.allowed) {
    return NextResponse.json(
      {
        error: {
          code: "rate_limited",
          message: "Too many requests. Try again in a few seconds.",
          retry_after_seconds: rl.retry_after_seconds,
        },
      },
      { status: 429 },
    )
  }

  try {
    // Get the file parameter from the URL
    const fileParam = request.nextUrl.searchParams.get("file")

    // Return error if no file parameter was provided
    if (!fileParam) {
      return NextResponse.json({ error: "File parameter is required" }, { status: 400 })
    }

    // Strict allowlist: only simple lowercase mp3 basenames are accepted.
    // This rejects path traversal payloads (../, leading /, backslashes, etc.).
    if (!/^[a-z0-9-]+\.mp3$/.test(fileParam)) {
      return NextResponse.json({ error: "Invalid file parameter" }, { status: 400 })
    }

    // ponytail: served from the public GitHub repo (CORS *) so the 224MB of
    // tracks stay out of the Worker upload. Move to R2 once it's enabled.
    // The strict basename allowlist above keeps this inside public/assets.
    return NextResponse.redirect(`${ASSETS_BASE}/${fileParam}`, 308)
  } catch (error) {
    console.error("Error serving background file:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
