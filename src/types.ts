export type Voice = Record<string, VoiceResponse>

export type VoiceResponse = {
  name: string
  preview_url: string
  voice_id: string
  labels: {
    accent: string
  }
  voice_verification: {
    language: string
  }
}
