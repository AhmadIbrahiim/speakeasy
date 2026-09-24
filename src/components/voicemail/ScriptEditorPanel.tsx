"use client"

import * as React from "react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { TemplateSelector } from "@/components/ui/templateSelector"
import { PageTarget } from "@/components/server/mainForm"

interface ScriptEditorPanelProps {
  text: string
  onTextChange: (value: string) => void
  target: PageTarget
  onSelectTemplate: (templateText: string) => void
  scriptRef: React.RefObject<HTMLTextAreaElement | null>
}

export function ScriptEditorPanel({ text, onTextChange, target, onSelectTemplate, scriptRef }: ScriptEditorPanelProps) {
  // `target` is forwarded to TemplateSelector via the surrounding form context;
  // we keep it in the prop signature so the parent doesn't need to pull the
  // template selector out of this panel for target-specific behavior later.
  void target

  return (
    <div className="bg-cream-50 p-5 rounded-2xl border-2 border-ink">
      <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
        <Label className="flex items-center gap-2 text-[13px] font-semibold text-stone-600 uppercase tracking-wider">
          <span className="font-serif italic text-accent text-base normal-case font-bold tracking-normal">i.</span>
          Your script
        </Label>
        <TemplateSelector onSelectTemplate={onSelectTemplate} />
      </div>
      <Textarea
        ref={scriptRef}
        className="w-full min-h-[260px] text-[15.5px] leading-[1.65] resize-none p-4 sm:p-5 rounded-xl border-2 border-ink bg-white focus:bg-white focus-visible:outline-none focus-visible:ring-0 focus-visible:border-accent transition-colors overflow-hidden"
        onChange={(e) => onTextChange(e.target.value)}
        value={text}
        placeholder="Write your greeting…"
        rows={1}
      />
      <ScriptMeter text={text} />
    </div>
  )
}

export function ScriptMeter({ text }: { text: string }) {
  const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0
  const chars = text.length
  // Sonic 3.5 averages ~165 WPM at default speed; round per-second math.
  const seconds = Math.round((words / 165) * 60)
  const duration = words === 0 ? "0:00" : `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`
  return (
    <div className="flex items-center justify-between mt-2 px-1 text-[11.5px] font-mono text-stone-500 tabular-nums">
      <span>
        {words} {words === 1 ? "word" : "words"} · {chars} {chars === 1 ? "char" : "chars"}
      </span>
      <span>~{duration} spoken</span>
    </div>
  )
}
