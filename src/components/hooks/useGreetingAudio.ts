/**
 * useGreetingAudio
 *
 * Orchestrates the "generate → play → download" loop for the voicemail
 * greeting. Wraps the `useCreateAudioBuffer` mutation, owns the resulting
 * HTMLAudioElement, and surfaces play/pause/download to the UI.
 *
 * Errors are routed: auth failures (`invalid_key`) call `onAuthError` so the
 * parent can re-prompt for a key; everything else calls `onOtherError` with
 * an `ErrorBannerData` payload for inline display.
 *
 * Analytics pushes (`window.dataLayer`, `window.clarity`) happen here because
 * they are bound to the play/download intent, not to UI rendering.
 */
import { useState } from "react"
import { useCreateAudioBuffer, GenerateAudioError } from "@/app/queries/useCreateAudioBuffer"
import type { ErrorBannerData } from "@/components/ui/errorBanner"

export interface UseGreetingAudioOptions {
  text: string
  voice: string
  music: string
  voiceVolume: number // 0-100
  bgVolume: number // 0-100
  cartesiaApiKey: string
  /** Called when the user lacks a usable API key (open dialog & invalidate). */
  ensureApiKey: () => boolean
  onAuthError: (message: string) => void
  onOtherError: (banner: ErrorBannerData) => void
  /** Fired after a successful download to prompt for feedback. */
  onDownloaded?: () => void
  /** Optional human-readable voice name for analytics payloads. */
  voiceName?: string
}

export interface UseGreetingAudioResult {
  audio: HTMLAudioElement | undefined
  isPlaying: boolean
  isPending: boolean
  /** Generated mixed audio response from the latest successful request. */
  hasGeneratedAudio: boolean
  play: () => Promise<void>
  pause: () => void
  download: () => Promise<void>
}

export function useGreetingAudio(opts: UseGreetingAudioOptions): UseGreetingAudioResult {
  const { text, voice, music, voiceVolume, bgVolume, cartesiaApiKey, ensureApiKey, onAuthError, onOtherError, onDownloaded, voiceName } = opts
  const [audio, setAudio] = useState<HTMLAudioElement>()
  const [isPlaying, setIsPlaying] = useState(false)
  const { mutation } = useCreateAudioBuffer(text, voice, music)

  const routeError = (err: unknown): void => {
    const apiErr = err instanceof GenerateAudioError ? err : null
    const code = apiErr?.code ?? "unknown"
    const message = apiErr?.message ?? (err instanceof Error ? err.message : "Couldn't generate audio.")
    if (code === "invalid_key") {
      onAuthError(message)
      return
    }
    onOtherError({ code, message, retryAfterSeconds: apiErr?.retryAfterSeconds })
  }

  const play = async (): Promise<void> => {
    if (isPlaying) {
      audio?.pause()
      setIsPlaying(false)
      return
    }
    if (!ensureApiKey()) return

    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event: "play_voicemail_greeting",
      event_category: "search",
      search_term: text,
    })
    window?.clarity?.("set", "search_term", text)
    window?.clarity?.("event", "play_voicemail_greeting")

    window.dataLayer.push({
      event: "select_content",
      content_type: "voice",
      item_id: voice,
    })
    window?.clarity?.("event", "select_content")

    return mutation
      .mutateAsync({
        voiceVolume: voiceVolume / 100,
        bgVolume: bgVolume / 100,
        outputFormat: "wav",
        cartesiaApiKey,
      })
      .then(async (d: Response) => {
        const buffer = await d.blob()
        const url = URL.createObjectURL(buffer)
        const newAudio = new Audio(url)

        setAudio(newAudio)
        newAudio.onended = () => setIsPlaying(false)
        newAudio.onplay = () => setIsPlaying(true)
        newAudio.onloadedmetadata = () => newAudio.play()
      })
      .catch(routeError)
  }

  const pause = (): void => {
    audio?.pause()
    setIsPlaying(false)
  }

  const download = async (): Promise<void> => {
    if (!ensureApiKey()) return
    return mutation
      .mutateAsync({
        voiceVolume: voiceVolume / 100,
        bgVolume: bgVolume / 100,
        outputFormat: "mp3",
        cartesiaApiKey,
      })
      .then(async (d: Response) => {
        const buffer = await d.blob()
        const url = URL.createObjectURL(buffer)
        const a = document.createElement("a")
        a.href = url
        a.download = "VoicemailGreeting.mp3"
        a.click()

        onDownloaded?.()

        window.dataLayer = window.dataLayer || []
        window.dataLayer.push({
          event: "download_voicemail",
          voice_id: voice,
          voice_name: voiceName,
          background_music: music,
        })
        window?.clarity?.("event", "download_voicemail")
      })
      .catch(routeError)
  }

  return {
    audio,
    isPlaying,
    isPending: mutation.isPending,
    hasGeneratedAudio: !!mutation.data,
    play,
    pause,
    download,
  }
}
