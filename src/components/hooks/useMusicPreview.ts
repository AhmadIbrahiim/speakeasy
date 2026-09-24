/**
 * useMusicPreview
 *
 * Owns the lifecycle of the background-music preview <Audio> element so the
 * form panel doesn't have to. The hook exposes a single `toggle(filename)`
 * action — if the matching track is already playing it pauses it; otherwise
 * it stops any prior track and starts the new one.
 *
 * The audio file is resolved via `/api/background?file={filename}.mp3`.
 */
import { useRef, useState, useEffect } from "react"

export interface UseMusicPreviewResult {
  isMusicPlaying: boolean
  isMusicLoading: boolean
  /** Toggle play/pause for the given music track filename (no extension). */
  toggle: (musicFileName: string) => Promise<void>
}

export function useMusicPreview(): UseMusicPreviewResult {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [isMusicLoading, setIsMusicLoading] = useState(false)
  const musicAudioRef = useRef<HTMLAudioElement | null>(null)

  // Pause any active preview if the component using this hook unmounts.
  useEffect(() => {
    return () => {
      if (musicAudioRef.current) {
        musicAudioRef.current.pause()
        musicAudioRef.current = null
      }
    }
  }, [])

  const toggle = async (musicFileName: string): Promise<void> => {
    try {
      if (isMusicPlaying && musicAudioRef.current) {
        musicAudioRef.current.pause()
        setIsMusicPlaying(false)
        return
      }

      setIsMusicLoading(true)

      // Stop any currently playing audio
      if (musicAudioRef.current) {
        musicAudioRef.current.pause()
      }

      // Create new audio element with the correct assets path
      const audio = new Audio(`/api/background?file=${musicFileName}.mp3`)
      musicAudioRef.current = audio

      audio.addEventListener("ended", () => {
        setIsMusicPlaying(false)
      })

      await audio.play()
      setIsMusicPlaying(true)
      setIsMusicLoading(false)
    } catch (error) {
      console.error("Error playing audio:", error)
      setIsMusicLoading(false)
      setIsMusicPlaying(false)
    }
  }

  return { isMusicPlaying, isMusicLoading, toggle }
}
