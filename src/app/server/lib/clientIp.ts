/**
 * Client IP extraction shared across API routes.
 *
 * The order matters for security:
 *   1) Platform-specific single-source headers (x-vercel-forwarded-for,
 *      cf-connecting-ip, fly-client-ip, true-client-ip) — set by the edge
 *      and NOT appendable by user-controllable hops.
 *   2) x-forwarded-for indexed from the right by TRUSTED_PROXY_HOPS — only
 *      consulted when the operator has declared how many trusted proxies
 *      sit between us and the public internet. Indexing from the left is
 *      unsafe because attackers can append arbitrary prefix entries.
 *   3) x-real-ip as a last resort.
 *
 * Default TRUSTED_PROXY_HOPS=0 means "trust no XFF entry" and fall through
 * to platform headers / x-real-ip.
 */

// Number of trusted reverse-proxy hops between the deployment and the public
// internet (Vercel = 1, Render = 1, Cloudflare-in-front-of-Vercel = 2).
// Header semantics: each proxy APPENDS the IP it received the request from,
// so for N trusted hops the real client IP sits at parts[length - N].
// Default 0 means "trust no XFF entry" and fall through to platform headers.
const TRUSTED_PROXY_HOPS = Math.max(0, Number(process.env.TRUSTED_PROXY_HOPS) || 0)

export function getClientIp(req: Request): string {
  // Platform-specific single-source headers FIRST. These are set by the
  // platform's edge (not appended-to by user-controllable hops), so they
  // are the most reliable signal when available.
  const platform = req.headers.get("x-vercel-forwarded-for") || req.headers.get("cf-connecting-ip") || req.headers.get("fly-client-ip") || req.headers.get("true-client-ip")
  if (platform) return platform.trim()

  // x-forwarded-for. We only consult it if the operator explicitly declared
  // how many trusted proxies sit between us and the public internet — that
  // is the only safe way to index past attacker-controlled prefix entries.
  if (TRUSTED_PROXY_HOPS > 0) {
    const xff = req.headers.get("x-forwarded-for")
    if (xff) {
      const parts = xff
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean)
      const idx = parts.length - TRUSTED_PROXY_HOPS
      if (idx >= 0 && idx < parts.length) return parts[idx]
      // Header is shorter than the declared hop count → spoofed or
      // misconfigured. Refuse to attribute; fall through.
    }
  }

  const real = req.headers.get("x-real-ip")
  if (real) return real.trim()
  return "unknown"
}
