# Security Policy

## Supported versions

Only the latest `main` branch is supported. Older tags do not receive security fixes.

| Version | Supported |
| ------- | --------- |
| `main`  | ✅        |
| any tag | ❌        |

## Reporting a vulnerability

**Preferred:** open a private security advisory via GitHub →
[github.com/AhmadIbrahiim/voicemail-greeting/security/advisories/new](https://github.com/AhmadIbrahiim/voicemail-greeting/security/advisories/new).
That keeps the disclosure non-public until a fix is ready.

**Fallback:** email **me@ahmed-ibrahim.com** with the subject prefix `[SECURITY]`.

Expect an acknowledgement within **72 hours**. We'll work on a fix in a private
branch, coordinate disclosure with you, and credit you in the release notes
(unless you'd rather stay anonymous).

Please include:

- A clear description of the vulnerability and its impact
- Steps to reproduce (proof-of-concept code is welcome)
- Affected commit SHA or branch
- Any suggested remediation

## Threat model

This is the rough model the codebase is hardened against. Reports outside this
model are still welcome, but we may classify them as "won't fix" if they fall
into the *out of scope* list below.

- **Visitor's BYO Cartesia API key** is the primary credential surface. It is
  pasted in a browser dialog, stored in `localStorage`, and forwarded to the
  server proxy ONLY at request time. The server never persists it.
- **Server-side environment variables** (`CARTESIA_API_KEY`, `BLOB_READ_WRITE_TOKEN`,
  `ELEVENLABS_API_KEY`, `GEMINI_API_KEY`) are all optional. They live only in
  the deploy host's secret store. Compromise of the deploy host compromises them.
- **`POST /api`** is rate-limited per IP (10 requests / 60 s by default). A
  determined attacker behind a rotating proxy can still drive cost; consider
  enabling Cloudflare or similar at the edge for serious production use.
- **`GET /api/background`** is path-traversal hardened via a strict basename
  allowlist (`^[a-z0-9-]+\.mp3$`). Any change to this route must preserve the
  allowlist invariant.
- **Generated audio files** stored in Vercel Blob are publicly addressable by
  URL but use a non-guessable MD5 of input parameters as the filename.
- **`/api/voices`** returns the cached Cartesia voice catalog. No user-specific
  data flows through this route.

## Out of scope

- DoS that exhausts the deploy host's rate-limit budget. Use edge protection
  (Cloudflare, CDN throttling) for that.
- Cross-tenant access. The app is single-tenant; there is no per-user data.
- Attacks requiring physical access to a visitor's device or browser.
- Social-engineering attacks against the maintainer.
- Reports based purely on outdated CVE feeds for transitive dependencies, with
  no exploitation path through this codebase.

## Past advisories

None yet.
