"use client"

import * as React from "react"
import { AlertTriangle, Clock, KeyRound, ServerCrash, Wifi, X, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ApiErrorCode } from "@/app/queries/useCreateAudioBuffer"

type Severity = "error" | "warn"

type Variant = {
  Icon: LucideIcon
  label: string
  severity: Severity
}

const VARIANTS: Record<ApiErrorCode, Variant> = {
  invalid_key: { Icon: KeyRound, label: "Cartesia key rejected", severity: "error" },
  quota_exceeded: { Icon: AlertTriangle, label: "Cartesia credits exhausted", severity: "warn" },
  rate_limited: { Icon: Clock, label: "Rate-limited by Cartesia", severity: "warn" },
  server: { Icon: ServerCrash, label: "Cartesia server error", severity: "error" },
  voice_not_found: { Icon: AlertTriangle, label: "Voice unavailable", severity: "warn" },
  validation: { Icon: AlertTriangle, label: "Missing input", severity: "warn" },
  network: { Icon: Wifi, label: "Network error", severity: "error" },
  unknown: { Icon: AlertTriangle, label: "Something went wrong", severity: "error" },
}

export type ErrorBannerData = {
  code: ApiErrorCode
  message: string
  retryAfterSeconds?: number
}

interface ErrorBannerProps {
  error: ErrorBannerData | null
  onDismiss: () => void
  onAction?: () => void
  actionLabel?: string
}

export function ErrorBanner({ error, onDismiss, onAction, actionLabel }: ErrorBannerProps) {
  React.useEffect(() => {
    if (!error) return
    if (error.code === "invalid_key" || error.code === "quota_exceeded") return
    const timer = window.setTimeout(onDismiss, 8000)
    return () => window.clearTimeout(timer)
  }, [error, onDismiss])

  if (!error) return null
  const v = VARIANTS[error.code] ?? VARIANTS.unknown
  const { Icon } = v
  const severity = v.severity

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        "relative mb-4 rounded-2xl border-2 border-ink overflow-hidden",
        severity === "error" ? "bg-accent/10" : "bg-accent-warm/15",
        "animate-in fade-in-0 slide-in-from-top-1 duration-200",
      )}>
      <div className="flex items-start gap-3 p-4 pr-12">
        <div className={cn("flex-shrink-0 mt-0.5 w-9 h-9 rounded-xl border-2 border-ink grid place-items-center", severity === "error" ? "bg-accent text-white" : "bg-accent-warm text-ink")}>
          <Icon className="w-4 h-4" strokeWidth={2.2} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-serif font-semibold text-[15.5px] text-ink leading-tight">{v.label}</div>
          <p className="text-[13.5px] text-stone-700 mt-0.5 leading-relaxed">{error.message}</p>
          {error.retryAfterSeconds ? <p className="text-[12px] font-mono text-stone-500 mt-1.5">retry in ~{error.retryAfterSeconds}s</p> : null}
          {onAction && actionLabel ? (
            <button
              type="button"
              onClick={onAction}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-ink bg-white text-ink text-[12.5px] font-semibold hover:bg-cream-50 hover:shadow-ink hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
              {actionLabel}
            </button>
          ) : null}
        </div>
      </div>
      <button type="button" onClick={onDismiss} aria-label="Dismiss" className="absolute right-2.5 top-2.5 p-1.5 rounded-md text-stone-600 hover:text-ink hover:bg-white/60 transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
