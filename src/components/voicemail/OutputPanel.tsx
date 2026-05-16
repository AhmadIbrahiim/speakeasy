"use client"

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

export function OutputPanel({ audio, isPlaying, isPending, onPlay, onDownload, downloadDisabled }: OutputPanelProps) {
  return (
    <div className="rounded-2xl bg-cream-100 border-2 border-ink overflow-hidden">
      <div className="px-5 pt-4 pb-3 flex items-center gap-3 sm:gap-4">
        <PlayButton isPlaying={isPlaying} isLoading={isPending} onClick={onPlay} />
        <Waveform audio={audio} isPlaying={isPlaying} className="flex-1 min-w-0" emptyMessage="Generate to see the waveform" />
      </div>
      <div className="px-5 pb-4 pt-2 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 border-t-2 border-ink/10 bg-cream-50/40">
        <div className="font-mono text-[11px] text-stone-500">
          <span className="inline-flex items-center gap-1.5">
            <span className={cn("w-1.5 h-1.5 rounded-full", isPlaying ? "bg-accent animate-pulse" : audio ? "bg-accent-forest" : "bg-stone-400")} />
            {isPlaying ? "playing" : audio ? "ready" : "no preview yet"}
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
            onClick={onPlay}
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
