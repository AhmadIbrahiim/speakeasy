import { CARTESIA_API_KEY } from "@/config"
import { CartesiaClient } from "@cartesia/cartesia-js"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  // Initialize Cartesia client
  const cartesia = new CartesiaClient({
    apiKey: CARTESIA_API_KEY,
  })

  try {
    // Fetch voices from Cartesia API
    // The client will need to be updated when Cartesia provides a method to list voices
    // For now, we're using a more comprehensive list of sample voices
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
      {
        voice_id: "d39f8b5e-c12a-4d85-8640-5d36f82c32f8",
        name: "Corporate Presenter",
        description: "Clear, authoritative voice for corporate presentations.",
        labels: {
          accent: "American",
          gender: "female",
          age: "middle-aged",
        },
      },
      {
        voice_id: "e7b2bf1f-9f5a-4e93-a25d-9823bd4d1a14",
        name: "British Businesswoman",
        description: "Professional female British accent.",
        labels: {
          accent: "British",
          gender: "female",
          age: "adult",
        },
      },
      {
        voice_id: "f63a5e3c-0a77-4c9f-b32b-d729eb93ebde",
        name: "Australian Presenter",
        description: "Warm Australian male voice.",
        labels: {
          accent: "Australian",
          gender: "male",
          age: "young-adult",
        },
      },
    ]

    // When the Cartesia API supports listing voices, replace with:
    // const voices = await cartesia.voices.getAll()

    return NextResponse.json({
      voices: sampleVoices,
    })
  } catch (error) {
    console.error("Error fetching voices:", error)
    return NextResponse.json({ error: "Failed to fetch voices" }, { status: 500 })
  }
}
