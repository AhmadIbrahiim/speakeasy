"use client"
/**
 * VoicemailGreetingComponent
 *
 * Top-level orchestration layer for the greeting builder. State + side effects
 * live in dedicated hooks (`useApiKey`, `useGreetingAudio`, `useMusicPreview`);
 * presentational UI lives in panel components under `./voicemail/`. This file
 * wires them together and renders the dialogs.
 */
import { useState, useRef, useLayoutEffect } from "react"
import { Voice, VoiceResponse } from "@/types"
import { ErrorBanner, type ErrorBannerData } from "./ui/errorBanner"
import { PageTarget } from "./server/mainForm"
import { FeedbackDialog } from "./ui/feedbackDialog"
import { ApiKeyDialog } from "@/components/ui/apiKeyDialog"
import { useApiKey } from "./hooks/useApiKey"
import { useGreetingAudio } from "./hooks/useGreetingAudio"
import { useMusicPreview } from "./hooks/useMusicPreview"
import { ScriptEditorPanel } from "./voicemail/ScriptEditorPanel"
import { VoiceAccentPanel } from "./voicemail/VoiceAccentPanel"
import { MusicPanel } from "./voicemail/MusicPanel"
import { MixPanel } from "./voicemail/MixPanel"
import { OutputPanel } from "./voicemail/OutputPanel"

type Props = {
  voices: Voice
  allVoices: VoiceResponse[]
  target: PageTarget
}

export function VoicemailGreetingComponent({ voices, allVoices, target }: Props) {
  void voices // retained for callsite stability; unused at the orchestration layer

  const [text, setText] = useState(
    target === PageTarget.MAIN
      ? "Thank you for calling. I apologize for missing your call. I'm busy right now, but if you leave your name, number, and message, I will return your call as soon as possible."
      : `Thank you for calling. We appreciate your patience as we try to answer each call as quickly as possible
⌛⌛⌛⌛⌛⌛⌛⌛⌛⌛⌛⌛⌛⌛⌛⌛⌛⌛⌛⌛
Thank you for holding, all our lines are currently busy. We apologize for the delay and will be with you shortly.
⌛⌛⌛⌛⌛⌛⌛⌛⌛⌛⌛⌛⌛⌛⌛⌛⌛⌛⌛⌛
Thank you for your patience, please stay on the line while we direct your call to the next available representative
⌛⌛⌛⌛⌛⌛⌛⌛⌛⌛⌛⌛⌛⌛⌛⌛⌛⌛⌛⌛`,
  )
  const [music, setMusic] = useState<string>("popular-corporate-upbeat")
  const [showFeedback, setShowFeedback] = useState(false)
  const [errorBanner, setErrorBanner] = useState<ErrorBannerData | null>(null)
  const scriptRef = useRef<HTMLTextAreaElement>(null)

  const apiKey = useApiKey()
  const musicPreview = useMusicPreview()

  // Auto-grow the script textarea so it acts like a real writing surface.
  useLayoutEffect(() => {
    const el = scriptRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight}px`
  }, [text])

  // Default to American accent when available, else fall back to whatever's first.
  const availableAccents = Array.from(new Set(allVoices.map((voice) => voice.labels.accent)))
  const initialAccent = availableAccents.includes("American") ? "American" : availableAccents.length > 0 ? availableAccents[0] : "American"

  const [accent, setAccent] = useState<string>(initialAccent)
  const [voiceVolume, setVoiceVolume] = useState<number>(100)
  const [bgVolume, setBgVolume] = useState<number>(15)

  const getDefaultVoice = () => {
    const voiceWithAccent = allVoices.find((v) => v.labels.accent === accent)
    return voiceWithAccent?.voice_id || (allVoices.length > 0 ? allVoices[0].voice_id : "")
  }

  const [selectedVoice, setVoice] = useState<string>(getDefaultVoice())
  const selectedVoiceName = allVoices.find((v) => v.voice_id === selectedVoice)?.name || "Select Voice"

  // Filter voices by selected accent; show everything if nothing matches.
  const filteredVoices = allVoices.filter((voice) => voice.labels.accent === accent)
  const displayedVoices = filteredVoices.length > 0 ? filteredVoices : allVoices

  const greetingAudio = useGreetingAudio({
    text,
    voice: selectedVoice,
    voiceName: selectedVoiceName,
    music,
    voiceVolume,
    bgVolume,
    cartesiaApiKey: apiKey.cartesiaApiKey,
    ensureApiKey: apiKey.ensureApiKey,
    onAuthError: apiKey.invalidateKey,
    onOtherError: setErrorBanner,
    onDownloaded: () => setShowFeedback(true),
  })

  const handlePlay = async () => {
    setErrorBanner(null)
    await greetingAudio.play()
  }

  const handleDownload = async () => {
    setErrorBanner(null)
    await greetingAudio.download()
  }

  const handleAccentChange = (value: string) => {
    setAccent(value)
    const firstVoiceWithAccent = allVoices.find((v) => v.labels.accent === value)
    if (firstVoiceWithAccent) setVoice(firstVoiceWithAccent.voice_id)
  }

  return (
    <>
      <div className="w-full p-4 sm:p-6 bg-white rounded-2xl">
        <div className="mb-6 text-left">
          <h2 className="font-serif text-2xl sm:text-[28px] font-semibold tracking-[-0.02em] text-ink mb-1">Write. Pick. Mix. Generate.</h2>
          <p className="text-stone-600 text-[14.5px]">Each change re-renders in under a second.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3 space-y-4">
            <ScriptEditorPanel text={text} onTextChange={setText} target={target} onSelectTemplate={setText} scriptRef={scriptRef} />
            <VoiceAccentPanel
              accent={accent}
              onAccentChange={handleAccentChange}
              availableAccents={availableAccents}
              selectedVoice={selectedVoice}
              onVoiceChange={setVoice}
              displayedVoices={displayedVoices}
            />
          </div>

          <div className="lg:col-span-2 space-y-4">
            <MusicPanel
              music={music}
              onMusicChange={setMusic}
              isMusicPlaying={musicPreview.isMusicPlaying}
              isMusicLoading={musicPreview.isMusicLoading}
              onPreviewToggle={() => musicPreview.toggle(music)}
            />
            <MixPanel voiceVolume={voiceVolume} onVoiceVolumeChange={setVoiceVolume} bgVolume={bgVolume} onBgVolumeChange={setBgVolume} />
          </div>
        </div>

        <div className="mt-6">
          <ErrorBanner
            error={errorBanner}
            onDismiss={() => setErrorBanner(null)}
            onAction={errorBanner?.code === "voice_not_found" ? () => document.getElementById("workspace")?.scrollIntoView({ behavior: "smooth" }) : undefined}
            actionLabel={errorBanner?.code === "voice_not_found" ? "Pick another voice" : undefined}
          />
        </div>

        <OutputPanel
          audio={greetingAudio.audio}
          isPlaying={greetingAudio.isPlaying}
          isPending={greetingAudio.isPending}
          onPlay={handlePlay}
          onDownload={handleDownload}
          downloadDisabled={!greetingAudio.hasGeneratedAudio}
        />
      </div>

      <FeedbackDialog open={showFeedback} onOpenChange={setShowFeedback} />
      <ApiKeyDialog open={apiKey.showApiKeyDialog} onOpenChange={apiKey.setShowApiKeyDialog} onSave={apiKey.saveApiKey} error={apiKey.apiKeyError} />
    </>
  )
}

// PauseIcon is imported by `ui/playButton` — keep it re-exported here to
// preserve the existing import path. `props: any` preserves the loose
// `size={15}` callsite that lucide-style icons accept.
export function PauseIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="14" y="4" width="4" height="16" rx="1" />
      <rect x="6" y="4" width="4" height="16" rx="1" />
    </svg>
  )
}
