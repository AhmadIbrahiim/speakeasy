"use client"

import { Music4 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Combobox } from "@/components/ui/combobox"
import { PlayButton } from "@/components/ui/playButton"
import CONSTANTS from "@/app/config/constants"

interface MusicPanelProps {
  music: string
  onMusicChange: (music: string) => void
  isMusicPlaying: boolean
  isMusicLoading: boolean
  onPreviewToggle: () => void
}

export function MusicPanel({ music, onMusicChange, isMusicPlaying, isMusicLoading, onPreviewToggle }: MusicPanelProps) {
  return (
    <div className="bg-cream-50 p-5 rounded-2xl border-2 border-ink">
      <Label className="flex items-center gap-2 text-[13px] font-semibold text-stone-600 uppercase tracking-wider mb-3">
        <span className="font-serif italic text-accent text-base normal-case font-bold tracking-normal">iii.</span>
        <Music4 className="w-4 h-4 text-ink" strokeWidth={2} />
        Background music
      </Label>
      <div className="flex items-center gap-2">
        <div className="flex-grow min-w-0">
          <Combobox
            value={music}
            onValueChange={onMusicChange}
            options={CONSTANTS.BG_MUSIC.map((m) => ({
              value: m.file,
              label: m.text,
              group: m.categories[0],
            }))}
            placeholder="Choose music"
            searchPlaceholder={`Search ${CONSTANTS.BG_MUSIC.length} tracks…`}
            emptyMessage="No tracks match"
            ariaLabel="Background music"
          />
        </div>
        <PlayButton isPlaying={isMusicPlaying} isLoading={isMusicLoading} onClick={onPreviewToggle} />
      </div>
    </div>
  )
}
