import { CARTESIA_API_KEY } from "@/config"
import { NextRequest, NextResponse } from "next/server"
import CartesiaService from "@/app/server/lib/Cartesia"
import { CartesiaVoiceResponse } from "@/types"
import { checkRateLimit } from "@/app/server/lib/rateLimit"
import { getClientIp } from "@/app/server/lib/clientIp"

export async function GET(req: NextRequest) {
  // Rate limit before anything else (cheapest possible reject). Limit is
  // generous because the catalog is cached for 14 days — most callers hit cache.
  const ip = getClientIp(req)
  const rl = checkRateLimit(`voices:${ip}`, { limit: 60, windowSeconds: 60 })
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
    // Fetch voices directly from Cartesia API using our service
    const voicesData = await CartesiaService.listVoices()

    // Transform the Cartesia API response to match our application's expected format
    const transformedVoices = voicesData.map((voice: CartesiaVoiceResponse) => ({
      voice_id: voice.id,
      name: voice.name,
      description: voice.description || "",
      labels: {
        // We need to determine accent from somewhere - for now using language as a fallback
        accent: voice.language === "en" ? "American" : voice.language,
        gender: "unknown", // The API doesn't provide gender info in the response
        age: "adult", // The API doesn't provide age info in the response
      },
    }))

    return NextResponse.json({
      voices: transformedVoices,
    })
  } catch (error) {
    console.error("Error fetching voices:", error)

    // Fallback to sample voices if API fails
    const sampleVoices = [
      {
        voice_id: "694f9389-aac1-45b6-b726-9d9369183238",
        name: "Barbershop Man",
        description: "A deep, rich, male voice with an Indian accent.",
        labels: {
          accent: "Indian",
          gender: "male",
          age: "middle-aged",
        },
      },
      {
        voice_id: "a0e99841-438c-4a64-b679-ae501e7d6091",
        name: "Professional Woman",
        description: "Clear, professional female voice.",
        labels: {
          accent: "American",
          gender: "female",
          age: "adult",
        },
      },
      {
        voice_id: "c48c5c61-fe2c-4b74-90e5-d4d0d8e1a342",
        name: "British Narrator",
        description: "Polished British male narrator voice.",
        labels: {
          accent: "British",
          gender: "male",
          age: "adult",
        },
      },
    ]

    return NextResponse.json(
      {
        voices: sampleVoices,
      },
      { status: 200 },
    ) // Return 200 with fallback data instead of 500
  }
}
