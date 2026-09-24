import { CartesiaVoiceResponse } from "@/types"
import seedCache from "../data/voices-cache.json"

const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000

// ponytail: in-memory only, per Worker isolate. Nothing is persisted server-side;
// a cold isolate starts from the bundled seed.
let memory: VoiceCachePayload | null = null

export type VoiceCachePayload = {
  fetchedAt: string
  count: number
  voices: CartesiaVoiceResponse[]
}

class VoiceCache {
  static readonly TTL_MS = TWO_WEEKS_MS

  static isFresh(payload: VoiceCachePayload): boolean {
    const fetchedAt = new Date(payload.fetchedAt).getTime()
    if (!Number.isFinite(fetchedAt)) return false
    return Date.now() - fetchedAt < this.TTL_MS
  }

  static ageDescription(payload: VoiceCachePayload): string {
    const ageMs = Date.now() - new Date(payload.fetchedAt).getTime()
    const days = Math.floor(ageMs / 86_400_000)
    const hours = Math.floor((ageMs % 86_400_000) / 3_600_000)
    return days > 0 ? `${days}d ${hours}h` : `${hours}h`
  }

  /**
   * The catalog bundled with the repo. Committed at build time so the app
   * always has a full voice list even with no CARTESIA_API_KEY and no live
   * cache (fresh deploy, cold isolate, local dev with no key). It is a
   * read-only floor. It is never written to, only refreshed by a live API
   * fetch into the in-memory cache.
   */
  static seed(): VoiceCachePayload {
    return seedCache as VoiceCachePayload
  }

  static async read(): Promise<VoiceCachePayload> {
    return memory ?? this.seed()
  }

  static async write(voices: CartesiaVoiceResponse[]): Promise<VoiceCachePayload> {
    memory = { fetchedAt: new Date().toISOString(), count: voices.length, voices }
    return memory
  }
}

export default VoiceCache
