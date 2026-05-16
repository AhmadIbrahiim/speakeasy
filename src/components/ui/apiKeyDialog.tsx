"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowRight, Eye, EyeOff, KeyRound, ShieldCheck, Sparkles } from "lucide-react"
import React from "react"

type Provider = "cartesia" | "elevenlabs"

interface ApiKeyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (apiKey: string) => void
  error?: string
  defaultProvider?: Provider
}

const STEPS: { label: string; href?: string }[] = [
  { label: "Create a free Cartesia account", href: "https://cartesia.ai/" },
  { label: "Open the API Keys dashboard", href: "https://play.cartesia.ai/keys" },
  { label: 'Click "Create API Key" and give it a name' },
  { label: "Paste the key below — that's it" },
]

export function ApiKeyDialog({ open, onOpenChange, onSave, error, defaultProvider = "cartesia" }: ApiKeyDialogProps) {
  const [provider, setProvider] = React.useState<Provider>(defaultProvider)
  const [value, setValue] = React.useState("")
  const [reveal, setReveal] = React.useState(false)
  const [localError, setLocalError] = React.useState("")

  React.useEffect(() => {
    if (open) {
      setValue("")
      setReveal(false)
      setLocalError("")
    }
  }, [open])

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (!trimmed) {
      setLocalError("Paste your Cartesia API key to continue.")
      return
    }
    onSave(trimmed)
  }

  const displayError = error || localError

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] w-[calc(100%-2rem)] p-0 overflow-hidden bg-white border-0 shadow-2xl max-h-[92vh] sm:rounded-2xl">
        <div className="relative max-h-[92vh] overflow-y-auto">
          <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-indigo-200/60 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-fuchsia-200/50 blur-3xl" aria-hidden />

          <div className="relative px-6 sm:px-8 pt-8 pb-7">
            <DialogHeader className="space-y-3 text-left">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 blur-md opacity-60" aria-hidden />
                  <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center text-white shadow-lg">
                    <KeyRound className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">
                  <Sparkles className="w-3.5 h-3.5" />
                  1,000 free credits · ~20 min
                </div>
              </div>
              <DialogTitle className="text-2xl font-semibold text-gray-900 tracking-tight">Bring your own voice engine</DialogTitle>
              <DialogDescription className="text-gray-600 text-sm leading-relaxed">
                We used to cover Cartesia (~$200/mo) so this stayed free — that math stopped working. Good news: every new Cartesia account gets 1,000 free credits, more than enough for personal use.
              </DialogDescription>
            </DialogHeader>

            <Tabs value={provider} onValueChange={(v) => setProvider(v as Provider)} className="mt-6">
              <TabsList className="grid grid-cols-2 w-full bg-gray-100/80 p-1 rounded-xl h-auto">
                <TabsTrigger value="cartesia" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  Cartesia
                </TabsTrigger>
                <TabsTrigger value="elevenlabs" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm" disabled>
                  ElevenLabs
                  <span className="ml-1.5 text-[10px] uppercase tracking-wide text-gray-400">Soon</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="cartesia" className="mt-6 space-y-5">
                <ol className="space-y-1.5">
                  {STEPS.map((step, i) => (
                    <li key={i} className="group flex items-start gap-3">
                      <span className="flex-shrink-0 h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white text-xs font-semibold flex items-center justify-center shadow-sm">{i + 1}</span>
                      {step.href ? (
                        <a
                          href={step.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-between rounded-lg px-3 py-1.5 -mx-1 text-sm text-gray-800 hover:bg-gray-50 hover:text-indigo-600 transition-colors">
                          <span>{step.label}</span>
                          <ArrowRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-indigo-500" />
                        </a>
                      ) : (
                        <span className="flex-1 text-sm text-gray-800 pt-1.5">{step.label}</span>
                      )}
                    </li>
                  ))}
                </ol>

                <div className="space-y-2">
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <Input
                      autoFocus
                      type={reveal ? "text" : "password"}
                      value={value}
                      onChange={(e) => {
                        setValue(e.target.value)
                        if (localError) setLocalError("")
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSubmit()
                      }}
                      placeholder="sk_..."
                      className="h-12 pr-11 pl-10 text-base bg-white border-gray-200 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:border-indigo-400 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => setReveal((r) => !r)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                      aria-label={reveal ? "Hide API key" : "Show API key"}>
                      {reveal ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {displayError && (
                    <div className="text-red-600 text-sm flex items-start gap-1.5 pl-1">
                      <span aria-hidden>⚠</span>
                      <span>{displayError}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-start gap-2.5 text-xs text-gray-500 bg-gray-50/80 border border-gray-100 rounded-xl px-3.5 py-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <p className="leading-relaxed">Your key lives only in this browser. It&apos;s sent to our server to generate audio, never stored or logged. Cartesia isn&apos;t affiliated with us.</p>
                </div>

                <Button onClick={handleSubmit} className="w-full h-12 text-base font-medium rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-700 hover:to-fuchsia-700 text-white shadow-lg shadow-indigo-500/20">
                  Connect &amp; continue
                </Button>
              </TabsContent>

              <TabsContent value="elevenlabs" className="mt-6">
                <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/60 py-10 px-6 text-center">
                  <Sparkles className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-700">ElevenLabs support is on the way</div>
                  <div className="text-xs text-gray-500 mt-1">For now, use Cartesia — similar free tier, same 60-second setup.</div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
