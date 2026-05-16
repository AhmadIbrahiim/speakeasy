/**
 * In-memory per-IP token bucket rate limiter.
 *
 * NOTE: This is single-instance only — entries live in process memory and are
 * NOT shared across replicas, regions, or serverless cold starts. For
 * distributed / multi-instance deployments, swap this for a Redis-backed
 * implementation (e.g. Upstash @upstash/ratelimit).
 *
 * Memory management: stale entries are pruned both lazily on access AND in
 * batched sweeps whenever the bucket map crosses MAX_BUCKETS. The hard cap
 * prevents unbounded growth from one-off IPs that never come back.
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
// Hard cap on tracked IPs. Above this, we sweep stale entries; if still
// over cap, we evict insertion-order-oldest. 10k IPs ≈ ~600KB at this shape,
// safe for any host. Tune via env if needed.
const MAX_BUCKETS = Number(process.env.RATE_LIMIT_MAX_BUCKETS) || 10_000

function sweepExpired(now: number): void {
  const stale: string[] = []
  buckets.forEach((bucket, ip) => {
    if (bucket.resetAt <= now) stale.push(ip)
  })
  for (const ip of stale) buckets.delete(ip)
}

function evictOldest(targetSize: number): void {
  // Map preserves insertion order, so Array.from gives oldest-first.
  const keys = Array.from(buckets.keys())
  for (let i = 0; i < keys.length && buckets.size > targetSize; i++) {
    buckets.delete(keys[i])
  }
}

export function checkRateLimit(ip: string, opts?: { limit?: number; windowSeconds?: number }): RateLimitResult {
  const limit = opts?.limit ?? DEFAULT_LIMIT
  const windowSeconds = opts?.windowSeconds ?? DEFAULT_WINDOW_SECONDS
  const now = Date.now()

  // Lazy prune the requested IP first.
  const existing = buckets.get(ip)
  if (existing && existing.resetAt <= now) {
    buckets.delete(ip)
  }

  // Cap-based sweep: if we're over the hard cap, drop expired entries first;
  // if still over, evict the oldest insertions until we're back under.
  if (buckets.size >= MAX_BUCKETS) {
    sweepExpired(now)
    if (buckets.size >= MAX_BUCKETS) {
      evictOldest(Math.floor(MAX_BUCKETS * 0.9))
    }
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
