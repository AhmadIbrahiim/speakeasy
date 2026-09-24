import { describe, it, expect, beforeEach } from "vitest"
import { POST } from "@/app/api/route"
import { __resetRateLimitForTests } from "@/app/server/lib/rateLimit"

/**
 * Per-IP simulation:
 *
 * The route's getClientIp() prefers platform single-source headers first
 * (x-vercel-forwarded-for, cf-connecting-ip, fly-client-ip, true-client-ip).
 * We use `x-vercel-forwarded-for` because it's read directly with no proxy-hop
 * accounting, which keeps the test independent of TRUSTED_PROXY_HOPS env state.
 *
 * To run more than ~10 requests under the same IP for the rate-limit test we
 * just keep the header constant. To isolate validation tests from each other
 * (and from the rate-limit test) we either reset the limiter in beforeEach
 * (default 10/min window) OR use a unique IP per test.
 */
const TEST_IP = "10.0.0.1"

function makeRequest(body: unknown, opts?: { ip?: string; rawBody?: string; contentLength?: string }): Request {
  const ip = opts?.ip ?? TEST_IP
  const raw = opts?.rawBody ?? JSON.stringify(body)
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-vercel-forwarded-for": ip,
  }
  if (opts?.contentLength) headers["content-length"] = opts.contentLength
  return new Request("http://localhost/api", {
    method: "POST",
    body: raw,
    headers,
  })
}

const VALID_VOICE_ID = "694f9389-aac1-45b6-b726-9d9369183238"

describe("POST /api — validation contract", () => {
  beforeEach(() => {
    __resetRateLimitForTests()
  })

  it("returns 400 validation for missing voice id", async () => {
    const res = await POST(
      makeRequest({ id: "", text: "Hi there", cartesiaApiKey: "sk-test" }),
    )
    expect(res.status).toBe(400)
    const body: any = await res.json()
    expect(body.error.code).toBe("validation")
    expect(body.error.message).toMatch(/voice/i)
  })

  it("returns 400 validation for malformed voice id", async () => {
    const res = await POST(
      makeRequest({ id: "not-a-uuid", text: "Hi there", cartesiaApiKey: "sk-test" }),
    )
    expect(res.status).toBe(400)
    const body: any = await res.json()
    expect(body.error.code).toBe("validation")
    expect(body.error.message).toMatch(/voice id/i)
  })

  it("returns 400 validation for missing greeting text", async () => {
    const res = await POST(
      makeRequest({ id: VALID_VOICE_ID, text: "", cartesiaApiKey: "sk-test" }),
    )
    expect(res.status).toBe(400)
    const body: any = await res.json()
    expect(body.error.code).toBe("validation")
    expect(body.error.message).toMatch(/greeting/i)
  })

  it("returns 400 validation for oversized text payload", async () => {
    // 4001 chars — one over the cap. Total JSON stays under the 16KB body cap
    // (~4.1KB) so we exercise the field-length gate, not the body-size gate.
    const oversizedText = "x".repeat(4001)
    const res = await POST(
      makeRequest({ id: VALID_VOICE_ID, text: oversizedText, cartesiaApiKey: "sk-test" }),
    )
    expect(res.status).toBe(400)
    const body: any = await res.json()
    expect(body.error.code).toBe("validation")
    expect(body.error.message).toMatch(/too long/i)
  })

  it("returns 413 for oversized JSON body", async () => {
    // 20KB of payload guarantees we exceed the 16KB body cap regardless of
    // whether the route trusts content-length or only the streamed bytes.
    const huge = "x".repeat(20_000)
    const rawBody = JSON.stringify({
      id: VALID_VOICE_ID,
      text: huge,
      cartesiaApiKey: "sk-test",
    })
    const res = await POST(
      makeRequest(undefined, { rawBody, contentLength: String(rawBody.length) }),
    )
    expect(res.status).toBe(413)
    const body: any = await res.json()
    expect(body.error.code).toBe("validation")
    expect(body.error.message).toMatch(/too large/i)
  })

  it("returns 401 invalid_key when cartesiaApiKey missing", async () => {
    const res = await POST(
      makeRequest({ id: VALID_VOICE_ID, text: "Hello there." }),
    )
    expect(res.status).toBe(401)
    const body: any = await res.json()
    expect(body.error.code).toBe("invalid_key")
    expect(body.error.message).toMatch(/cartesia api key/i)
  })
})

describe("POST /api — rate limiting", () => {
  const RL_IP = "10.0.0.99"

  beforeEach(() => {
    __resetRateLimitForTests()
  })

  it("returns 429 when rate limit exceeded", async () => {
    // Default limiter: 10 requests / 60s. We send 11 requests from the same
    // simulated IP. We deliberately use an INVALID voice id so each call
    // short-circuits at the validation gate without ever reaching Cartesia —
    // the rate limiter sits before validation, so it still counts every hit.
    const badBody = { id: "not-a-uuid", text: "Hi", cartesiaApiKey: "sk-test" }
    const responses: Response[] = []
    for (let i = 0; i < 11; i++) {
      const res = await POST(makeRequest(badBody, { ip: RL_IP }))
      responses.push(res)
    }

    // First 10 hit the validation 400 (limiter passed). 11th must be 429.
    for (let i = 0; i < 10; i++) {
      expect(responses[i].status).toBe(400)
    }

    const last = responses[10]
    expect(last.status).toBe(429)
    const body: any = await last.json()
    expect(body.error.code).toBe("rate_limited")
    expect(body.error.retry_after_seconds).toBeGreaterThan(0)
  })
})
