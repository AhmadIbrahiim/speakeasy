import { describe, it, expect } from "vitest"
import VoiceCache, { VoiceCachePayload } from "@/app/server/lib/VoiceCache"

// Builds a minimal payload — voices/count are not exercised by the pure
// time-math helpers under test, so an empty array is fine.
function buildPayload(fetchedAt: string): VoiceCachePayload {
  return {
    fetchedAt,
    count: 0,
    voices: [],
  }
}

describe("VoiceCache.isFresh", () => {
  it("returns true for a payload fetched < 14 days ago", () => {
    const payload = buildPayload(new Date().toISOString())
    expect(VoiceCache.isFresh(payload)).toBe(true)
  })

  it("returns false for a payload fetched > 14 days ago", () => {
    const fifteenDaysAgo = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
    const payload = buildPayload(fifteenDaysAgo)
    expect(VoiceCache.isFresh(payload)).toBe(false)
  })

  it("returns false for malformed fetchedAt", () => {
    const payload = buildPayload("not-a-date")
    expect(VoiceCache.isFresh(payload)).toBe(false)
  })

  it("returns false at exactly the TTL boundary (age >= TTL is stale)", () => {
    const atBoundary = new Date(Date.now() - VoiceCache.TTL_MS).toISOString()
    const payload = buildPayload(atBoundary)
    expect(VoiceCache.isFresh(payload)).toBe(false)
  })
})

describe("VoiceCache.ageDescription", () => {
  it("formats hours-only correctly for a fresh payload", () => {
    const payload = buildPayload(new Date().toISOString())
    // Just-fetched -> 0d 0h, which collapses to "0h"
    expect(VoiceCache.ageDescription(payload)).toMatch(/^\d+h$/)
  })

  it("formats days+hours correctly for a 3-day-old payload", () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    const payload = buildPayload(threeDaysAgo)
    expect(VoiceCache.ageDescription(payload)).toMatch(/^\d+d \d+h$/)
  })
})
