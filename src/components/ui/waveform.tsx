"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface WaveformProps {
  audio: HTMLAudioElement | null | undefined
  isPlaying: boolean
  className?: string
  bars?: number
  emptyMessage?: string
}

export function Waveform({ audio, isPlaying, className, bars = 72, emptyMessage = "Generate to preview" }: WaveformProps) {
  const [peaks, setPeaks] = React.useState<number[] | null>(null)
  const [decoding, setDecoding] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [currentTime, setCurrentTime] = React.useState(0)
  const [duration, setDuration] = React.useState(0)
  const rafRef = React.useRef<number | null>(null)
  const lastSrcRef = React.useRef<string | undefined>(undefined)

  React.useEffect(() => {
    const src = audio?.src
    if (!src) {
      setPeaks(null)
      setProgress(0)
      setCurrentTime(0)
      setDuration(0)
      lastSrcRef.current = undefined
      return
    }
    if (lastSrcRef.current === src) return
    lastSrcRef.current = src

    let cancelled = false
    setPeaks(null)
    setProgress(0)
    setCurrentTime(0)
    setDecoding(true)
    ;(async () => {
      try {
        const res = await fetch(src)
        const arr = await res.arrayBuffer()
        const Ctx = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        const ctx = new Ctx()
        const decoded = await ctx.decodeAudioData(arr)
        await ctx.close()
        if (cancelled) return
        const ch = decoded.getChannelData(0)
        const block = Math.max(1, Math.floor(ch.length / bars))
        const result: number[] = new Array(bars)
        for (let i = 0; i < bars; i++) {
          let sum = 0
          const start = i * block
          for (let j = 0; j < block; j++) sum += Math.abs(ch[start + j] ?? 0)
          result[i] = sum / block
        }
        const max = Math.max(...result, 0.001)
        const gamma = 0.6
        setPeaks(result.map((v) => Math.pow(v / max, gamma)))
        setDuration(decoded.duration)
      } catch (err) {
        console.warn("[waveform] decode failed", err)
      } finally {
        if (!cancelled) setDecoding(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [audio?.src, bars])

  React.useEffect(() => {
    if (!audio) return
    if (!isPlaying) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      if (audio.duration && Number.isFinite(audio.duration)) {
        setProgress(audio.currentTime / audio.duration)
        setCurrentTime(audio.currentTime)
      }
      return
    }
    const tick = () => {
      if (audio.duration && Number.isFinite(audio.duration)) {
        setProgress(audio.currentTime / audio.duration)
        setCurrentTime(audio.currentTime)
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [audio, isPlaying])

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audio || !duration || !peaks) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    audio.currentTime = ratio * duration
    setProgress(ratio)
    setCurrentTime(audio.currentTime)
  }

  const idle = React.useMemo(() => Array.from({ length: bars }, (_, i) => 0.2 + Math.abs(Math.sin(i * 0.42)) * 0.35 + (i % 5 === 0 ? 0.12 : 0)), [bars])
  const display = peaks ?? idle

  const fmt = (s: number) => {
    if (!Number.isFinite(s)) return "0:00"
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`
  }

  return (
    <div className={cn("flex items-center gap-3 min-w-0 w-full", className)}>
      <div
        onClick={peaks ? handleSeek : undefined}
        className={cn("relative flex-1 min-w-0 h-12 flex items-center gap-[2px] group", peaks ? "cursor-pointer" : "cursor-default")}
        role={peaks ? "slider" : undefined}
        aria-label="Audio progress"
        aria-valuemin={0}
        aria-valuemax={peaks ? Math.round(duration) : undefined}
        aria-valuenow={peaks ? Math.round(currentTime) : undefined}>
        {display.map((v, i) => {
          const h = Math.max(12, v * 100)
          const ratio = i / display.length
          const playheadDist = Math.abs(ratio - progress)
          const isPlayed = peaks && ratio < progress
          const isAtHead = peaks && playheadDist < 1.5 / display.length
          return (
            <div
              key={i}
              className={cn("flex-1 min-w-[1.5px] rounded-[1px]", decoding && !peaks && "animate-pulse", "transition-colors duration-150")}
              style={{
                height: `${h}%`,
                background: !peaks ? "rgba(26, 25, 22, 0.22)" : isAtHead ? "#1A1916" : isPlayed ? "#E64A2B" : "rgba(26, 25, 22, 0.4)",
                transform: isAtHead ? "scaleY(1.12)" : undefined,
                transition: "background 150ms, transform 80ms",
              }}
            />
          )
        })}
        {!peaks && !decoding && <span className="absolute inset-0 flex items-center justify-center font-serif italic text-[14px] text-stone-500 pointer-events-none">{emptyMessage}</span>}
        {decoding && <span className="absolute inset-0 flex items-center justify-center font-mono text-[11px] text-stone-500 pointer-events-none">decoding waveform…</span>}
      </div>
      <div className="font-mono text-[11px] text-stone-500 tabular-nums whitespace-nowrap min-w-[72px] text-right">{peaks ? `${fmt(currentTime)} / ${fmt(duration)}` : "—:— / —:—"}</div>
    </div>
  )
}
