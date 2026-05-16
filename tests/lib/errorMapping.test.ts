import { describe, it, expect } from "vitest"
import { classifyCartesiaError } from "@/app/api/errorMapping"

describe("classifyCartesiaError", () => {
  it("maps Cartesia 401 to invalid_key / http 401", () => {
    const { api, http } = classifyCartesiaError({ status: 401, message: "Unauthorized" })
    expect(api.code).toBe("invalid_key")
    expect(http).toBe(401)
  })

  it("maps Cartesia 403 to invalid_key / http 401", () => {
    const { api, http } = classifyCartesiaError({ status: 403, message: "Forbidden" })
    expect(api.code).toBe("invalid_key")
    expect(http).toBe(401)
  })

  it("maps Cartesia 402 to quota_exceeded / http 402", () => {
    const { api, http } = classifyCartesiaError({ status: 402, message: "Payment Required" })
    expect(api.code).toBe("quota_exceeded")
    expect(http).toBe(402)
  })

  it("maps Cartesia 404 to voice_not_found / http 404", () => {
    const { api, http } = classifyCartesiaError({ status: 404, message: "Not Found" })
    expect(api.code).toBe("voice_not_found")
    expect(http).toBe(404)
  })

  it("maps Cartesia 429 to rate_limited / http 429 with retry_after_seconds present", () => {
    const { api, http } = classifyCartesiaError({ status: 429, message: "Too Many Requests" })
    expect(api.code).toBe("rate_limited")
    expect(http).toBe(429)
    expect(api.retry_after_seconds).toBeDefined()
    expect(typeof api.retry_after_seconds).toBe("number")
  })

  it("maps Cartesia 500-599 to server / http 502", () => {
    for (const status of [500, 502, 503, 599]) {
      const { api, http } = classifyCartesiaError({ status, message: "Server boom" })
      expect(api.code).toBe("server")
      expect(http).toBe(502)
    }
  })

  it("maps AbortError to server / http 504 (timeout path)", () => {
    const { api, http } = classifyCartesiaError({ name: "AbortError", message: "The operation was aborted" })
    expect(api.code).toBe("server")
    expect(http).toBe(504)
  })

  it('maps a message containing "timeout" to server / http 504', () => {
    const { api, http } = classifyCartesiaError({ message: "request timeout after 10s" })
    expect(api.code).toBe("server")
    expect(http).toBe(504)
  })

  it("falls through to unknown / http 500 without leaking upstream message", () => {
    const upstreamSecret = "DB password leaked in upstream message"
    const { api, http } = classifyCartesiaError({ status: 418, message: upstreamSecret })
    expect(api.code).toBe("unknown")
    expect(http).toBe(500)
    expect(api.message).not.toContain(upstreamSecret)
    expect(api.message).not.toContain("DB password")
  })
})
