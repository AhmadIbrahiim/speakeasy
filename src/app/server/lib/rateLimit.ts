/**
 * In-memory per-IP token bucket rate limiter.
 *
 * NOTE: This is single-instance only — entries live in process memory and are
 * NOT shared across replicas, regions, or serverless cold starts. For
 * distributed / multi-instance deployments, swap this for a Redis-backed
 * implementation (e.g. Upstash @upstash/ratelimit).
 *
 * Each entry tracks a request count within a fixed window. When the window
 * elapses, the entry resets. Entries are pruned lazily on access — there is
 * no background sweep, so memory growth is bounded by the number of distinct
 * client IPs seen within `windowSeconds`.
 */

export interface RateLimitResult {
  allowed: boolean
  retry_after_seconds?: number
}

interface Bucket {
  count: number
  resetAt: number // epoch ms when this window expires
}

const buckets = new Map<string, Bucket>()

const DEFAULT_LIMIT = 10
const DEFAULT_WINDOW_SECONDS = 60

export function checkRateLimit(ip: string, opts?: { limit?: number; windowSeconds?: number }): RateLimitResult {
  const limit = opts?.limit ?? DEFAULT_LIMIT
  const windowSeconds = opts?.windowSeconds ?? DEFAULT_WINDOW_SECONDS
  const now = Date.now()

  const existing = buckets.get(ip)

  // Lazy prune: if this IP's window has expired, drop the stale bucket.
  if (existing && existing.resetAt <= now) {
    buckets.delete(ip)
  }

  const bucket = buckets.get(ip)

  if (!bucket) {
    buckets.set(ip, { count: 1, resetAt: now + windowSeconds * 1000 })
    return { allowed: true }
  }

  if (bucket.count >= limit) {
    const retry_after_seconds = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000))
    return { allowed: false, retry_after_seconds }
  }

  bucket.count += 1
  return { allowed: true }
}

// Exported for tests; not part of the production API.
export function __resetRateLimitForTests(): void {
  buckets.clear()
}
