# Secret Rotation Runbook

## Why this runbook exists

A pre-OSS security audit of this repository (see commit `7ba8501` —
"security: Wave A pre-OSS blockers") found two classes of credential
exposure that block public release:

1. **In-source secrets.** A hardcoded Gemini API key in
   `scripts/generate-thumbnail.ts`, four hardcoded ElevenLabs `sk_*`
   keys in `src/config/index.ts`, and a real Vercel Blob token in
   `historical docs in git history`. The values were replaced with `process.env.*`
   references in that commit, but the original literals remain in
   git history and must be assumed compromised.
2. **A leaked `.env` file** containing live values for every
   provider the app talks to (Cartesia, ElevenLabs, Vercel Blob,
   Gemini). The `.env` was not pushed to the public remote, but it
   was shared across machines outside the repo's chain of custody
   and must also be treated as compromised.

Every credential listed below must be rotated **before** the
repository is made public. This document is the operational checklist
for doing that safely, in the right order, with no downtime for
visitors mid-rotation.

## Compromised credential inventory

| Provider | Env var | Dashboard | Leaked prefix(es) | Source of leak |
| --- | --- | --- | --- | --- |
| Cartesia | `CARTESIA_API_KEY` | <https://play.cartesia.ai/keys> | `sk_c..` | `.env` |
| ElevenLabs | `ELEVENLABS_API_KEY` | <https://elevenlabs.io/app/settings/api-keys> | `sk_5..`, `sk_7..`, `sk_1..`, `sk_c..` (4 keys total) | `src/config/index.ts` |
| Vercel Blob | `BLOB_READ_WRITE_TOKEN` | <https://vercel.com/dashboard/stores> | `verc..` (`vercel_blob_rw_WvCflkhH..`) | `.env`, `historical docs in git history` |
| Gemini | `GEMINI_API_KEY` | <https://aistudio.google.com/app/apikey> | `AIza..` | `.env`, `scripts/generate-thumbnail.ts` |

> Full key values are intentionally omitted. If you need the exact
> leaked strings (e.g. to confirm a `gitleaks` finding is the same
> token), retrieve them from the pre-rotation `.env` backup that
> lives outside the repo — do not paste them here.

## Order of operations

Rotate in this order to keep the live app working throughout:

1. **Cartesia first.** Every visitor's voice-generation flow
   depends on this provider, so a stale key would be the most
   visible failure. Rotating first means any breakage surfaces
   while you still have all other keys intact for triage.
2. **Gemini second.** Only used by the offline content pipeline
   (`scripts/content-pipeline.ts`), so user-facing impact is zero.
3. **ElevenLabs third.** The UI tab is "Coming Soon" today, so
   user-facing impact is also zero, but rotate it now to keep
   the inventory clean.
4. **Vercel Blob last.** Revoking the old Blob token mid-rotation
   would break the audio cache (`/api/background` reads, voice
   audio writes) until the new token is in place on every deploy
   target. Rotate it only after all three above are confirmed
   healthy.

Within each provider, follow steps A through E in order, and do not
revoke the old key (step D) until the new key has passed step C on
every environment.

## Rotation procedure (per provider)

The same five-step pattern applies to every provider. Provider-
specific commands are inline.

### 1. Cartesia (`CARTESIA_API_KEY`)

**A. Issue a NEW key.**
- Open <https://play.cartesia.ai/keys>.
- Click "Create API key", name it `voicemail-greeting-<YYYY-MM-DD>`.
- Copy the new value once — Cartesia will not show it again.

**B. Update environment in every deploy target.**
- **Vercel:** Project → Settings → Environment Variables → edit
  `CARTESIA_API_KEY` for Production, Preview, and Development.
  Redeploy or trigger a new deployment to pick up the change.
- **Render:** Service → Environment → edit `CARTESIA_API_KEY` →
  Save Changes. Render will redeploy automatically.
- **Local `.env`:** update the value on every developer machine
  that has a working `.env`.

**C. Smoke-test the affected endpoint.**

```bash
# Production
curl -sS https://<your-prod-domain>/api/voices | jq '.voices | length'

# Local
curl -sS http://localhost:3000/api/voices | jq '.voices | length'
```

A passing test returns `200` with a non-zero voices array length. If
you get `401`/`403`, the new key is not yet live on that environment —
do not proceed to step D.

**D. Revoke the OLD key.**
- Back in <https://play.cartesia.ai/keys>, delete the previous key.
- Wait 60 seconds and re-run step C to confirm the app still works
  on the NEW key (and not because the old one is still accepted).

**E. Record the rotation** in the log table at the bottom of this
file (date, provider, your initials, first 4 chars of the new key,
revocation timestamp).

### 2. Gemini (`GEMINI_API_KEY`)

**A. Issue a NEW key.**
- Open <https://aistudio.google.com/app/apikey>.
- Click "Create API key", scope to the same Google Cloud project
  used previously (or a new one if rotating ownership too).
- Copy the new `AIza...` value.

**B. Update environment in every deploy target.**
- **Vercel** and **Render:** as in Cartesia step B.
- **Local `.env`** on any machine that runs
  `scripts/content-pipeline.ts` or `scripts/generate-thumbnail.ts`.
- Note: Gemini is only used by offline scripts, so a missed deploy
  target will not break visitor traffic — but you still want the
  inventory consistent.

**C. Smoke-test.**

```bash
# Run the content pipeline against a single test prompt and confirm
# it returns a non-empty response. From the repo root:
npm run content-pipeline -- --dry-run 2>&1 | tail -20
```

Look for a successful Gemini call in the output. A `401` or
`PERMISSION_DENIED` means the new key is not yet picked up.

**D. Revoke the OLD key** in the Google AI Studio dashboard.

**E. Record the rotation** in the log table.

### 3. ElevenLabs (`ELEVENLABS_API_KEY`)

The four leaked keys all came from a single ElevenLabs account.
Revoke all four in one pass; issue ONE new key (the old key-rotation
"load spreading" pattern was removed in commit `7ba8501`).

**A. Issue a NEW key.**
- Open <https://elevenlabs.io/app/settings/api-keys>.
- Click "Create API Key", name it `voicemail-greeting-<YYYY-MM-DD>`.
- Copy the new `sk_*` value.

**B. Update environment in every deploy target** as above
(Vercel, Render, local `.env`).

**C. Smoke-test.**

The ElevenLabs tab in the UI is currently "Coming Soon", so there is
no end-user flow to exercise. Validate the key directly:

```bash
curl -sS -H "xi-api-key: $ELEVENLABS_API_KEY" \
  https://api.elevenlabs.io/v1/voices | jq '.voices | length'
```

A passing test returns `200` with a non-zero array length.

**D. Revoke ALL FOUR old keys** in the ElevenLabs dashboard. Do not
leave any of them active.

**E. Record the rotation** in the log table.

### 4. Vercel Blob (`BLOB_READ_WRITE_TOKEN`) — DO THIS LAST

Revoking this token before the new one is deployed everywhere will
break the audio cache on `/api/background` and on greeting playback.
Do not start this section until Cartesia, Gemini, and ElevenLabs are
all on new keys and confirmed healthy.

**A. Issue a NEW token.**
- Open <https://vercel.com/dashboard/stores>.
- Pick the Blob store used by this project.
- "Create Token" → Read/Write scope → copy the new
  `vercel_blob_rw_*` value.

**B. Update environment in every deploy target** (Vercel, Render,
local `.env`). For Vercel specifically: even though the Blob store
lives inside Vercel, the token still has to be set as a Project
Environment Variable on the consuming project — it is not injected
automatically unless the store is linked.

**C. Smoke-test.**

```bash
# 1. Health
curl -sS -o /dev/null -w "%{http_code}\n" https://<your-prod-domain>/api/health

# 2. Voices (proves Cartesia still works after Blob change)
curl -sS https://<your-prod-domain>/api/voices | jq '.voices | length'

# 3. Generate a full greeting end-to-end through the UI and confirm
#    the resulting audio plays back. The first generation writes to
#    Blob; a second generation of the same input proves the cache
#    read path still works against the new token.
```

If any step fails, do **not** proceed to revocation — debug first.

**D. Revoke the OLD token** in the Vercel Blob dashboard. Wait
60 seconds, then re-run all three smoke tests above to confirm the
app is running entirely on the new token.

**E. Record the rotation** in the log table.

## Validation checklist (post-rotation)

Run these in order after all four providers are rotated. All must
pass before the repository is made public.

- [ ] `curl -sS -o /dev/null -w "%{http_code}\n" https://<prod>/api/health` returns `200`.
- [ ] `curl -sS https://<prod>/api/voices | jq '.voices | length'` returns `200` with a non-empty voices array.
- [ ] Generate a 1-sentence greeting through the UI end-to-end and confirm playback works.
- [ ] Vercel Blob round-trip: upload a tiny test object (e.g. `echo hi | npx vercel blob put test.txt`), confirm it appears in the dashboard, then delete it.
- [ ] `gitleaks detect --source . --no-git` reports no findings against the working tree.
- [ ] `gitleaks detect --source .` reports zero findings (post-history-rewrite state). The scanner is configured at `.gitleaks.toml` and runs on every push via `.github/workflows/ci.yml`. If you find historical leaks here, see `docs/security/history-rewrite-checklist.md`.
- [ ] `.env` on every developer machine has been refreshed with the new values; no machine is still running the old keys.
- [ ] All old keys show as revoked / deleted in their respective provider dashboards.

## Rotation log

Append a row every time a key is rotated. Keep this table in commit
history so future operators can see when each credential was last
touched.

| Date (UTC) | Provider | Rotator (initials) | New-key prefix (first 4) | Old key revoked at (UTC) |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |
