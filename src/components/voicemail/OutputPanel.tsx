"use client"

import { useEffect, useRef, useState } from "react"
import { Download, Loader } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PlayButton } from "@/components/ui/playButton"
import { Waveform } from "@/components/ui/waveform"
import { cn } from "@/lib/utils"

interface OutputPanelProps {
  audio: HTMLAudioElement | undefined
  isPlaying: boolean
  isPending: boolean
  onPlay: () => void
  onDownload: () => void
  downloadDisabled: boolean
}

const DEMO_SRC = "/demo/demo-greeting.mp3"

export function OutputPanel({ audio: generated, isPlaying: generatedPlaying, isPending, onPlay, onDownload, downloadDisabled }: OutputPanelProps) {
  // Before anything is generated, the play button plays a sample so visitors can hear the result.
  const [demo, setDemo] = useState<HTMLAudioElement>()
  const [demoPlaying, setDemoPlaying] = useState(false)
  const demoRef = useRef<HTMLAudioElement | undefined>(undefined)

  const stopDemo = () => {
    demoRef.current?.pause()
    setDemoPlaying(false)
  }

  // Created on mount so the waveform shows the demo's real shape before anyone presses play.
  useEffect(() => {
    const a = new Audio(DEMO_SRC)
    a.onended = () => setDemoPlaying(false)
    a.onpause = () => setDemoPlaying(false)
    a.onplay = () => setDemoPlaying(true)
    demoRef.current = a
    setDemo(a)
    return () => a.pause()
  }, [])

  const toggleDemo = () => {
    const a = demoRef.current
    if (!a) return
    if (a.paused) void a.play().catch(() => setDemoPlaying(false))
    else a.pause()
  }

  useEffect(() => {
    if (generated) stopDemo()
  }, [generated])

  const isDemo = !generated
  const audio = generated ?? demo
  const isPlaying = isDemo ? demoPlaying : generatedPlaying

  return (
    <div className="rounded-2xl bg-cream-100 border-2 border-ink overflow-hidden">
      <div className="px-5 pt-4 pb-3 flex items-center gap-3 sm:gap-4">
        <PlayButton isPlaying={isPlaying} isLoading={isPending} onClick={isDemo ? toggleDemo : onPlay} />
        <Waveform audio={audio} isPlaying={isPlaying} className="flex-1 min-w-0" emptyMessage="Press play to hear a demo, or generate your own" />
      </div>
      <div className="px-5 pb-4 pt-2 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 border-t-2 border-ink/10 bg-cream-50/40">
        <div className="font-mono text-[11px] text-stone-500">
          {isDemo && <span className="mr-2 rounded-full bg-accent-warm/30 border border-ink/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink">Demo</span>}
          <span className="inline-flex items-center gap-1.5">
            <span className={cn("w-1.5 h-1.5 rounded-full", isPlaying ? "bg-accent animate-pulse" : isDemo ? "bg-accent-warm" : "bg-accent-forest")} />
            {isDemo ? (isPlaying ? "playing demo" : "demo greeting · press play") : isPlaying ? "playing" : "ready"}
          </span>
          <span className="mx-2 text-stone-300">·</span>
          <span>sonic-3.5</span>
          <span className="mx-2 text-stone-300">·</span>
          <span>wav · 44.1kHz</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            onClick={onDownload}
            disabled={downloadDisabled}
            className="h-11 rounded-full border-2 border-ink bg-white text-ink font-medium hover:bg-cream-50 disabled:opacity-40 disabled:cursor-not-allowed gap-2">
            <Download className="w-4 h-4" />
            Download
          </Button>
          <Button
            onClick={() => {
              stopDemo()
              onPlay()
            }}
            disabled={isPending}
            className="h-11 rounded-full border-2 border-ink bg-accent hover:bg-accent text-white font-semibold shadow-ink hover:shadow-ink-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all disabled:opacity-60 gap-2">
            {isPending && <Loader className="w-4 h-4 animate-spin" />}
            Generate greeting
          </Button>
        </div>
      </div>
    </div>
  )
}
