import { describe, it, expect, beforeEach, vi } from "vitest"
import { NextRequest } from "next/server"

// IMPORTANT: vi.mock is hoisted above imports. We stub CartesiaService here
// so the route never reaches the real Cartesia API in any test (success or
// failure path). Per-test behavior is configured via mockResolvedValueOnce
// / mockRejectedValueOnce.
vi.mock("@/app/server/lib/Cartesia", () => {
  return {
    default: {
      listVoices: vi.fn(),
    },
  }
})

import { GET } from "@/app/api/voices/route"
import CartesiaService from "@/app/server/lib/Cartesia"
import { __resetRateLimitForTests } from "@/app/server/lib/rateLimit"

const listVoicesMock = CartesiaService.listVoices as unknown as ReturnType<typeof vi.fn>

const TEST_IP = "10.0.1.1"

function makeRequest(opts?: { ip?: string }): NextRequest {
  const ip = opts?.ip ?? TEST_IP
  return new NextRequest("http://localhost/api/voices", {
    headers: {
      "x-vercel-forwarded-for": ip,
    },
  })
}

describe("GET /api/voices — contract", () => {
  beforeEach(() => {
    __resetRateLimitForTests()
    listVoicesMock.mockReset()
  })

  it("returns 200 with a voices array", async () => {
    listVoicesMock.mockResolvedValueOnce([
      {
        id: "694f9389-aac1-45b6-b726-9d9369183238",
        name: "Test Voice",
        description: "test",
        language: "en",
      },
    ])

    const res = await GET(makeRequest())
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(Array.isArray(body.voices)).toBe(true)
    expect(body.voices.length).toBeGreaterThan(0)
    const first = body.voices[0]
    expect(typeof first.voice_id).toBe("string")
    expect(typeof first.name).toBe("string")
    expect(first.labels).toBeDefined()
  })

  it("falls back to sample voices when upstream fails", async () => {
    listVoicesMock.mockRejectedValueOnce(new Error("upstream down"))

    const res = await GET(makeRequest({ ip: "10.0.1.2" }))
    // Route deliberately returns 200 with fallback data instead of 5xx so
    // the UI keeps working when Cartesia is unreachable.
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(Array.isArray(body.voices)).toBe(true)
    // The fallback sample list in the route currently has 3 entries — assert
    // shape and that the known sample voice id is present.
    expect(body.voices.length).toBeGreaterThanOrEqual(1)
    const ids = body.voices.map((v: { voice_id: string }) => v.voice_id)
    expect(ids).toContain("694f9389-aac1-45b6-b726-9d9369183238")
  })

  it("returns 429 when rate limit exceeded", async () => {
    // /api/voices uses a 60/min limiter (more generous than /api because the
    // catalog is cached). Make 61 calls from the same IP — first 60 pass,
    // 61st must be 429 rate_limited.
    listVoicesMock.mockResolvedValue([])

    const RL_IP = "10.0.1.250"
    let last: Response | undefined
    for (let i = 0; i < 61; i++) {
      last = await GET(makeRequest({ ip: RL_IP }))
    }
    expect(last).toBeDefined()
    expect(last!.status).toBe(429)
    const body = await last!.json()
    expect(body.error.code).toBe("rate_limited")
    expect(body.error.retry_after_seconds).toBeGreaterThan(0)
  })
})
