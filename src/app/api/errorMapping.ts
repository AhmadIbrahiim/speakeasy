// Error mapping for upstream Cartesia failures. Lives in a sibling module
// (not route.ts) because Next.js route files may only export the route
// handlers and a fixed set of segment-config exports — exporting helper
// functions from route.ts trips a build-time type error.

export type ApiErrorCode = "invalid_key" | "rate_limited" | "quota_exceeded" | "server" | "validation" | "voice_not_found" | "unknown"

export type ApiError = {
  code: ApiErrorCode
  message: string
  retry_after_seconds?: number
}

export function classifyCartesiaError(err: unknown): { api: ApiError; http: number } {
  const e = err as { name?: string; status?: number; message?: string; error?: { message?: string } } | undefined
  const upstream = e?.status ?? 0
  const upstreamMessage = e?.error?.message || e?.message || ""
  const errName = e?.name || ""

  // Timeout / abort — covers both fetch AbortError and SDK aborts. Mapped to 504
  // so the client can retry without thinking the upstream key is bad.
  // NOTE: we never surface upstreamMessage to the client here; the curated string is fixed.
  const looksAborted = errName === "AbortError" || /\baborted\b/i.test(upstreamMessage) || /\btimeout\b/i.test(upstreamMessage)
  if (looksAborted) {
    return {
      api: { code: "server", message: "Cartesia took too long to respond. Try again." },
      http: 504,
    }
  }

  if (upstream === 401 || upstream === 403) {
    return {
      api: { code: "invalid_key", message: "Cartesia rejected your API key. Paste a new one to keep generating." },
      http: 401,
    }
  }
  if (upstream === 402) {
    return {
      api: { code: "quota_exceeded", message: "Your Cartesia credits are exhausted. Add credit on cartesia.ai or paste a different key." },
      http: 402,
    }
  }
  if (upstream === 404) {
    return {
      api: { code: "voice_not_found", message: "That voice is no longer available in Cartesia. Pick another voice and try again." },
      http: 404,
    }
  }
  if (upstream === 429) {
    return {
      api: { code: "rate_limited", message: "Cartesia rate-limited this request. Give it a few seconds and try again.", retry_after_seconds: 10 },
      http: 429,
    }
  }
  if (upstream >= 500 && upstream < 600) {
    return {
      api: { code: "server", message: "Cartesia returned a server error. Try again in a moment." },
      http: 502,
    }
  }
  // Generic catch-all — deliberately does NOT leak raw upstream messages.
  return {
    api: { code: "unknown", message: "Something went wrong generating your audio." },
    http: 500,
  }
}
