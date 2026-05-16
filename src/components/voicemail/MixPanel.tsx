"use client"

import { Settings2, Volume2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

interface MixPanelProps {
  voiceVolume: number
  onVoiceVolumeChange: (v: number) => void
  bgVolume: number
  onBgVolumeChange: (v: number) => void
}

export function MixPanel({ voiceVolume, onVoiceVolumeChange, bgVolume, onBgVolumeChange }: MixPanelProps) {
  return (
    <div className="bg-cream-50 p-5 rounded-2xl border-2 border-ink">
      <Label className="flex items-center gap-2 text-[13px] font-semibold text-stone-600 uppercase tracking-wider mb-4">
        <span className="font-serif italic text-accent text-base normal-case font-bold tracking-normal">iv.</span>
        <Settings2 className="w-4 h-4 text-ink" strokeWidth={2} />
        Mix the levels
      </Label>
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="flex items-center text-[13px] text-ink font-medium">
              <Volume2 className="w-3.5 h-3.5 mr-1.5" />
              Voice
            </Label>
            <span className="font-mono text-[12px] font-medium text-stone-600">{voiceVolume}%</span>
          </div>
          <Slider defaultValue={[voiceVolume]} max={100} step={1} onValueChange={(value: number[]) => onVoiceVolumeChange(value[0])} className="my-2" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="flex items-center text-[13px] text-ink font-medium">
              <Volume2 className="w-3.5 h-3.5 mr-1.5" />
              Music
            </Label>
            <span className="font-mono text-[12px] font-medium text-stone-600">{bgVolume}%</span>
          </div>
          <Slider defaultValue={[bgVolume]} max={100} step={1} onValueChange={(value: number[]) => onBgVolumeChange(value[0])} className="my-2" />
        </div>
      </div>
      <p className="font-serif italic text-[12.5px] text-stone-500 mt-3 pt-3 border-t border-dashed border-ink/20">Keep music under 25% so the voice cuts through.</p>
    </div>
  )
}
