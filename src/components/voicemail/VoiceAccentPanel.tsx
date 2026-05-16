"use client"

import { Mic2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Combobox } from "@/components/ui/combobox"
import { cn } from "@/lib/utils"
import type { VoiceResponse } from "@/types"

interface VoiceAccentPanelProps {
  accent: string
  onAccentChange: (accent: string) => void
  availableAccents: string[]
  selectedVoice: string
  onVoiceChange: (voiceId: string) => void
  displayedVoices: VoiceResponse[]
}

export function VoiceAccentPanel({ accent, onAccentChange, availableAccents, selectedVoice, onVoiceChange, displayedVoices }: VoiceAccentPanelProps) {
  return (
    <div className="bg-cream-50 p-5 rounded-2xl border-2 border-ink">
      <Label className="flex items-center gap-2 text-[13px] font-semibold text-stone-600 uppercase tracking-wider mb-4">
        <span className="font-serif italic text-accent text-base normal-case font-bold tracking-normal">ii.</span>
        <Mic2 className="w-4 h-4 text-ink" strokeWidth={2} />
        Voice &amp; accent
      </Label>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-[12px] text-stone-500 mb-1.5 block">Accent</Label>
          <Combobox
            value={accent}
            onValueChange={onAccentChange}
            options={availableAccents.map((a) => ({
              value: a,
              label: a.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
            }))}
            placeholder="Pick an accent"
            searchPlaceholder="Search accents…"
            ariaLabel="Accent"
          />
        </div>
        <div>
          <Label className="text-[12px] text-stone-500 mb-1.5 block">Voice</Label>
          <Combobox
            value={selectedVoice}
            onValueChange={onVoiceChange}
            options={displayedVoices.map((v) => ({
              value: v.voice_id,
              label: v.name,
              description: v.description,
              group: v.labels.accent?.replace(/\b\w/g, (c) => c.toUpperCase()),
            }))}
            placeholder="Pick a voice"
            searchPlaceholder={`Search ${displayedVoices.length} voices…`}
            emptyMessage="No voice matches"
            ariaLabel="Voice"
            renderItem={(o, sel) => (
              <div className="flex flex-col min-w-0">
                <span className={cn("truncate text-[14px]", sel && "font-semibold")}>{o.label}</span>
                {o.description && <span className="truncate text-[11.5px] text-stone-500 mt-0.5">{o.description}</span>}
              </div>
            )}
          />
        </div>
      </div>
    </div>
  )
}
