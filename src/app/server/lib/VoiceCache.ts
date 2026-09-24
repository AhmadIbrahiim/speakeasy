import R2Cache from "./R2Cache"
import { CartesiaVoiceResponse } from "@/types"
import seedCache from "../data/voices-cache.json"

const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000
const CACHE_KEY = "cache/voices-cache.json"

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
   * cache (fresh deploy, R2 unreachable, local dev with no key). It is a
   * read-only floor. It is never written to, only refreshed by a live API
   * fetch into the R2 runtime cache.
   */
  static seed(): VoiceCachePayload {
    return seedCache as VoiceCachePayload
  }

  static async read(): Promise<VoiceCachePayload> {
    try {
      const raw = await R2Cache.get(CACHE_KEY)
      if (!raw) return this.seed()
      return JSON.parse(new TextDecoder().decode(raw)) as VoiceCachePayload
    } catch (error) {
      console.warn("[VoiceCache] read failed, serving bundled seed:", error)
      return this.seed()
    }
  }

  static async write(voices: CartesiaVoiceResponse[]): Promise<VoiceCachePayload> {
    const payload: VoiceCachePayload = {
      fetchedAt: new Date().toISOString(),
      count: voices.length,
      voices,
    }
    await R2Cache.put(CACHE_KEY, JSON.stringify(payload), "application/json")
    return payload
  }
}

export default VoiceCache
