# Deploying Speakeasy

Production: **Cloudflare Workers**, worker `speakeasy`, custom domain `voicemail.ahmed-ibrahim.com`
(zone `ahmed-ibrahim.com` is on the same Cloudflare account). Built with `@opennextjs/cloudflare`.

> Rule: every push to `main` is deployed, and every deploy is committed + pushed. CI enforces the first half.

## Automatic (normal path)

Push to `main` → `.github/workflows/ci.yml` runs gitleaks, typecheck, lint, tests → job `deploy` runs `npm run deploy`.

## Manual

```bash
npx wrangler login     # once
npm run deploy         # opennextjs-cloudflare build && deploy
```

Then commit + push whatever you deployed.

Local:

```bash
npm run dev            # next dev, with local R2 simulated by wrangler
npm run preview        # production build running in workerd on :8787
```

## First-time setup

1. **GitHub secrets** (Settings → Secrets → Actions):
   - `CLOUDFLARE_API_TOKEN`: dash.cloudflare.com → My Profile → API Tokens → *Edit Cloudflare Workers* template,
     plus **Zone → DNS → Edit** and **Account → Workers R2 Storage → Edit** on `ahmed-ibrahim.com`.
   - `CLOUDFLARE_ACCOUNT_ID`: `32c0304e2189e3b53907e574701b7122`
2. **R2 cache (optional)**: enable R2 in the dashboard, then
   ```bash
   npx wrangler r2 bucket create speakeasy-cache
   ```
   uncomment `r2_buckets` in `wrangler.jsonc`, and deploy. Without it the app works but regenerates identical audio.
3. **Custom domain**: `routes[].custom_domain` in `wrangler.jsonc` creates the DNS record + cert on deploy.
   If `voicemail` already has a DNS record (e.g. the old Vercel CNAME), delete it first in DNS settings.

## Secrets / env

Set on the Worker, never in `wrangler.jsonc`:

```bash
npx wrangler secret put CARTESIA_API_KEY   # optional, server-side voice catalog refresh
```

Local: put the same keys in `.dev.vars`.

## Rollback

```bash
npx wrangler deployments list
npx wrangler rollback <version-id>
```

## Notes

- Background tracks (`public/assets/*.mp3`, ~225MB) are **not** uploaded to the Worker (`public/.assetsignore`); `/api/background` redirects to the public GitHub raw URL on `main`. A new track only works once it's pushed to `main`. Move them to R2 once R2 is enabled.
- After changing bindings in `wrangler.jsonc`, run `npm run cf-typegen`.
- Logs: `npx wrangler tail speakeasy` or dashboard → Workers → speakeasy → Logs.
