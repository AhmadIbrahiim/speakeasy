export type Voice = Record<string, VoiceResponse[]>

// Original Cartesia API response type for reference
export type CartesiaVoiceResponse = {
  id: string
  is_owner: boolean
  name: string
  description: string
  created_at: string
  language: string
  embedding?: number[]
  is_starred?: boolean
}

// Our app's internal voice representation
export type VoiceResponse = {
  name: string
  preview_url?: string
  voice_id: string // Maps to id from Cartesia
  labels: {
    accent: string // Derived from language or other metadata
    gender?: string // May not be available from Cartesia
    age?: string // May not be available from Cartesia
  }
  voice_verification?: {
    language: string
  }
  description?: string
}
