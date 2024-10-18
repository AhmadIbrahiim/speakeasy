export type Voice = Record<string, VoiceResponse>

export type VoiceResponse = {
  name: string
  preview_url: string
  id: string
  language: string
  description: string
}
