# Deploying Speakeasy

Production: **Cloudflare Workers**, worker `speakeasy`, custom domain `voicemail.ahmed-ibrahim.com`.
Built with `@opennextjs/cloudflare`. Deploys are **manual** (no CI deploy). Nothing is stored server-side.

> Rule: every push to GitHub is followed by a deploy, and every deploy is committed + pushed.

## Deploy

```bash
npx wrangler login     # once per machine (opens browser)
npx wrangler whoami    # confirm the right account
npm run deploy         # opennextjs-cloudflare build && deploy
```

Then commit + push what you deployed (`main` is protected, so open a PR and merge it).

Check it:

```bash
curl https://voicemail.ahmed-ibrahim.com/api/health
```

## Local

```bash
npm run dev            # next dev
npm run preview        # production build running in workerd on :8787
```

## Custom domain

`routes[].custom_domain` in `wrangler.jsonc` creates the DNS record + certificate on deploy.
If `voicemail` ever gets another DNS record, delete it first (Cloudflare dashboard → DNS).

## Secrets

Set on the Worker, never in `wrangler.jsonc`:

```bash
npx wrangler secret put CARTESIA_API_KEY   # optional, lets the server refresh the voice catalog
```

Local: put the same keys in `.dev.vars`.

## Rollback

```bash
npx wrangler deployments list
npx wrangler rollback <version-id>
```

## Notes

- Background tracks (`public/assets/*.mp3`, ~225MB) are **not** uploaded to the Worker (`public/.assetsignore`).
  `/api/background` redirects to the public GitHub raw URL on `main`, so a new track only works once it's on `main`.
- Voice catalog: bundled `src/app/server/data/voices-cache.json`, plus an in-memory copy per Worker isolate.
- After changing bindings in `wrangler.jsonc`, run `npm run cf-typegen`.
- Logs: `npx wrangler tail speakeasy`.
