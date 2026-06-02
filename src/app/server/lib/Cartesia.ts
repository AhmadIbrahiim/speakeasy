import { CARTESIA_API_KEY } from "@/config"
import { Cartesia } from "@cartesia/cartesia-js"
import { CartesiaVoiceResponse } from "@/types"
import { RawOutputFormat } from "@cartesia/cartesia-js/resources/tts/tts.mjs"
import VoiceCache from "./VoiceCache"

const CARTESIA_VERSION = "2026-03-01"
const CARTESIA_VOICES_URL = "https://api.cartesia.ai/voices"
const PAGE_LIMIT = 100
const MAX_PAGES = 100
// Upstream timeouts. Voice listing is small JSON, so 30s is generous.
// Audio generation can take longer (whole MP3 is buffered), so 60s.
const VOICES_FETCH_TIMEOUT_MS = 30_000
const GENERATE_TIMEOUT_MS = 60_000

type ListVoicesPage = {
  data: CartesiaVoiceResponse[]
  has_more: boolean
}

let voicesInflight: Promise<CartesiaVoiceResponse[]> | null = null

class CartesiaService {
  private static instance: Cartesia

  private constructor() {
    // Initialize the API connection here
  }

  public static getInstance(): Cartesia {
    if (!CartesiaService.instance) {
      this.instance = new Cartesia({
        apiKey: CARTESIA_API_KEY,
      })
    }
    return CartesiaService.instance
  }

  /**
   * Returns every Cartesia voice. Cached for 2 weeks to avoid paginating
   * the full catalog on every request. On TTL expiry, paginates all pages
   * fresh and rewrites the cache. If a refresh fails while a stale cache
   * exists, the stale cache is served so the site never goes voice-less.
   */
  public static async listVoices(): Promise<CartesiaVoiceResponse[]> {
    const cached = await VoiceCache.read()
    if (VoiceCache.isFresh(cached)) {
      console.log(`[voices] cache hit · ${cached.count} voices · age ${VoiceCache.ageDescription(cached)}`)
      return cached.voices
    }

    // No API key means we cannot refresh. Serve whatever VoiceCache.read()
    // returned, which is the bundled seed when no live cache exists, so the
    // catalog is always populated.
    if (!CARTESIA_API_KEY) {
      console.log(`[voices] no API key · serving cached/seed catalog · ${cached.count} voices`)
      return cached.voices
    }

    if (voicesInflight) return voicesInflight

    voicesInflight = (async () => {
      try {
        console.log(`[voices] cache stale · paginating from API`)
        const voices = await CartesiaService.fetchAllVoicesPaginated()
        const saved = await VoiceCache.write(voices)
        console.log(`[voices] refreshed · ${saved.count} voices · written ${saved.fetchedAt}`)
        return voices
      } catch (error) {
        // Refresh failed. Serve the stale cache (or bundled seed) so the
        // catalog is never empty.
        console.error("[voices] refresh failed, serving cached/seed catalog:", error)
        console.warn(`[voices] serving cached/seed catalog · ${cached.count} voices · age ${VoiceCache.ageDescription(cached)}`)
        return cached.voices
      } finally {
        voicesInflight = null
      }
    })()

    return voicesInflight
  }

  private static async fetchAllVoicesPaginated(): Promise<CartesiaVoiceResponse[]> {
    const all: CartesiaVoiceResponse[] = []
    let startingAfter: string | undefined

    for (let page = 0; page < MAX_PAGES; page++) {
      const url = new URL(CARTESIA_VOICES_URL)
      url.searchParams.set("limit", String(PAGE_LIMIT))
      if (startingAfter) url.searchParams.set("starting_after", startingAfter)

      // Per-request timeout. If Cartesia hangs, we abort and let the upstream
      // error layer classify the AbortError as a 504-style timeout response.
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), VOICES_FETCH_TIMEOUT_MS)

      let response: Response
      try {
        response = await fetch(url.toString(), {
          headers: {
            "Cartesia-Version": CARTESIA_VERSION,
            "X-API-Key": CARTESIA_API_KEY || "",
          },
          cache: "no-store",
          signal: controller.signal,
        })
      } catch (err) {
        if ((err as { name?: string })?.name === "AbortError") {
          // Tagged so classifyCartesiaError() upstream maps this to a 504.
          throw new Error(`Cartesia voices/list aborted after ${VOICES_FETCH_TIMEOUT_MS}ms (timeout)`)
        }
        throw err
      } finally {
        clearTimeout(timer)
      }

      if (!response.ok) {
        throw new Error(`Cartesia voices/list failed: ${response.status} ${response.statusText}`)
      }

      const page_data = (await response.json()) as ListVoicesPage
      if (!page_data.data?.length) break

      all.push(...page_data.data)
      console.log(`[voices] page ${page + 1} · +${page_data.data.length} · total ${all.length} · has_more=${page_data.has_more}`)

      if (!page_data.has_more) break
      startingAfter = page_data.data[page_data.data.length - 1].id
    }

    return all
  }

  // Utility method for text-to-speech generation
  public static async generate({
    text,
    voice,
    model_id = "sonic-3.5",
    output_format = "mp3_44100_128",
    cartesiaApiKey,
  }: {
    text: string
    voice: string
    model_id?: string
    output_format?: string
    cartesiaApiKey?: string
  }) {
    const client = cartesiaApiKey ? new Cartesia({ apiKey: cartesiaApiKey }) : CartesiaService.getInstance()

    // Parse the output format
    let outputFormatObj

    if (output_format === "mp3_44100_128") {
      outputFormatObj = {
        container: "mp3" as const,
        sample_rate: 44100,
        bitRate: 128000,
      }
    } else if (output_format.startsWith("wav")) {
      outputFormatObj = {
        container: "wav" as const,
        sample_rate: 44100,
        encoding: "pcm_f32le" as const,
      }
    } else {
      // Default to MP3
      outputFormatObj = {
        container: "mp3" as const,
        sample_rate: 44100,
        bit_rate: 128000,
      }
    }

    // The @cartesia/cartesia-js SDK accepts a `signal` in RequestOptions
    // (see node_modules/@cartesia/cartesia-js/internal/request-options.d.ts).
    // We pair an AbortController with a 60s timeout so the audio call can't
    // hang the route handler indefinitely.
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), GENERATE_TIMEOUT_MS)

    try {
      return await client.tts.generate(
        {
          model_id: model_id,
          transcript: text,
          voice: {
            mode: "id",
            id: voice,
          },
          language: "en",
          output_format: { ...outputFormatObj } as RawOutputFormat,
          generation_config: {
            volume: 1.0,
            speed: 1.0,
          },
        },
        { signal: controller.signal },
      )
    } catch (err) {
      if ((err as { name?: string })?.name === "AbortError") {
        throw new Error(`Cartesia tts.generate aborted after ${GENERATE_TIMEOUT_MS}ms (timeout)`)
      }
      throw err
    } finally {
      clearTimeout(timer)
    }
  }
}

export default CartesiaService
