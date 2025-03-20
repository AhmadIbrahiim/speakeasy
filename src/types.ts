export type Voice = Record<string, VoiceResponse[]>

export type VoiceResponse = {
  name: string
  preview_url?: string
  voice_id: string
  labels: {
    accent: string
    gender?: string
    age?: string
  }
  voice_verification?: {
    language: string
  }
  description?: string
}
