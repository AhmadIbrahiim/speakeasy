import { promises as fs } from "fs"
import path from "path"
import { put, list } from "@vercel/blob"
import { CartesiaVoiceResponse } from "@/types"

const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000
const CACHE_FILENAME = "voices-cache.json"
const LOCAL_CACHE_PATH = path.join(process.cwd(), "output", CACHE_FILENAME)
const BLOB_KEY = `cache/${CACHE_FILENAME}`

export type VoiceCachePayload = {
  fetchedAt: string
  count: number
  voices: CartesiaVoiceResponse[]
}

class VoiceCache {
  static readonly TTL_MS = TWO_WEEKS_MS

  private static isDev(): boolean {
    return process.env.NODE_ENV === "development"
  }

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

  static async read(): Promise<VoiceCachePayload | null> {
    if (this.isDev()) {
      try {
        const raw = await fs.readFile(LOCAL_CACHE_PATH, "utf-8")
        return JSON.parse(raw) as VoiceCachePayload
      } catch {
        return null
      }
    }
    try {
      const { blobs } = await list({ prefix: BLOB_KEY })
      const match = blobs.find((b: { pathname: string }) => b.pathname === BLOB_KEY)
      if (!match) return null
      const res = await fetch(match.url, { cache: "no-store" })
      if (!res.ok) return null
      return (await res.json()) as VoiceCachePayload
    } catch (error) {
      console.warn("[VoiceCache] read failed:", error)
      return null
    }
  }

  static async write(voices: CartesiaVoiceResponse[]): Promise<VoiceCachePayload> {
    const payload: VoiceCachePayload = {
      fetchedAt: new Date().toISOString(),
      count: voices.length,
      voices,
    }
    const json = JSON.stringify(payload, null, this.isDev() ? 2 : 0)

    if (this.isDev()) {
      await fs.mkdir(path.dirname(LOCAL_CACHE_PATH), { recursive: true })
      await fs.writeFile(LOCAL_CACHE_PATH, json, "utf-8")
      return payload
    }

    const blob = new Blob([json], { type: "application/json" })
    await put(BLOB_KEY, blob, {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
    })
    return payload
  }
}

export default VoiceCache
