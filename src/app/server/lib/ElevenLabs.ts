// Dormant integration: the ElevenLabs adapter exists for a future TTS provider
// tab that the UI currently labels "Coming Soon". To prevent dead code from
// becoming a foot-gun (missing env keys at runtime, accidental upstream calls,
// surprised reviewers), the whole path is feature-flagged behind
// ELEVENLABS_ENABLED. When the flag is anything other than the string "true",
// importing the default export throws a clear deployment-config error before a
// real network call can happen.
//
// To activate locally:
//   ELEVENLABS_ENABLED=true ELEVENLABS_API_KEY=sk_... npm run dev
//
// See `.env.example` and `src/app/server/get-voices.ts` for the consumer side.
import { ELEVENLABS_API_KEY } from "@/config"
import { ElevenLabsClient } from "elevenlabs"

const ELEVENLABS_ENABLED = process.env.ELEVENLABS_ENABLED === "true"

class ELabs {
  private static instance: ElevenLabsClient | null = null

  private constructor() {
    // Initialize the API connection here
  }

  public static getInstance(): ElevenLabsClient {
    if (!ELEVENLABS_ENABLED) {
      throw new Error(
        "ElevenLabs is not enabled in this deployment. Set ELEVENLABS_ENABLED=true (and ELEVENLABS_API_KEY) to opt in. See .env.example for details.",
      )
    }
    if (!ELabs.instance) {
      ELabs.instance = new ElevenLabsClient({
        apiKey: ELEVENLABS_API_KEY,
      })
    }
    return ELabs.instance
  }
}

// Lazy proxy: do NOT construct the ElevenLabs client at module import time.
// Any property access (e.g. `elabs.voices.getAll()`) is forwarded to a real
// instance — and that instance creation is what throws when the feature flag
// is off. This keeps import-side-effect-free modules importable for typecheck
// / build / tests without ELEVENLABS_API_KEY being set.
const elabsProxy = new Proxy({} as ElevenLabsClient, {
  get(_target, prop: string | symbol) {
    const instance = ELabs.getInstance()
    const value = (instance as unknown as Record<string | symbol, unknown>)[prop]
    if (typeof value === "function") {
      return (value as (...args: unknown[]) => unknown).bind(instance)
    }
    return value
  },
})

export default elabsProxy
