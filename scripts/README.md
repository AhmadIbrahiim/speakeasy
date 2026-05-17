# scripts/

These scripts are **optional content-authoring tooling**, not part of the runtime app. They are only needed if you want to regenerate blog posts or thumbnails. You do **not** need to run anything in this directory to develop or use Perfect Greet — `npm install && npm run dev` is enough.

There are two scripts here, both written for the project maintainer's content workflow:

- `content-pipeline.ts` — orchestrates blog-post generation (topic discovery → markdown post → thumbnail).
- `generate-thumbnail.ts` — generates a single social-card / blog thumbnail PNG via Google Gemini's image-generation model.

Both refuse to run unless their required env vars are set, so a contributor who runs them accidentally will see a clear error and exit instead of half-doing something. See the individual sections below.

---

## `content-pipeline.ts`

**Purpose.** End-to-end blog-content pipeline: searches for trending topics in the project's niche, scores them by relevance, generates a markdown post per topic from a template, writes the post under `src/posts/`, and invokes `generate-thumbnail` to produce a matching image under `public/posts/`.

**Status.** The topic-discovery step is a stub — the original implementation called a placeholder `api.example.com` endpoint that never existed. The script currently short-circuits with a warning and produces no posts until that step is wired up to a real topic-discovery API (Google Trends, SEMrush, or similar). The rest of the pipeline (markdown templating, file writes, thumbnail dispatch) is functional once `searchTopics` returns data.

**Required env vars.**

| Var | Purpose |
| --- | --- |
| `CONTENT_API_KEY` | Credentials for whichever topic-discovery API you wire `searchTopics` up to. |
| `GEMINI_API_KEY`  | Indirectly required because the pipeline shells out to `npm run generate-thumbnail` per topic. |

**Run.**

```bash
CONTENT_API_KEY=... GEMINI_API_KEY=... npm run pipeline
```

**Expected output.**

- Console logs as each topic is processed.
- New `.md` files under `src/posts/`.
- New `.png` files under `public/posts/` (one per generated post).

**You do NOT need to run this to develop or use the app.** The shipped blog posts under `src/posts/` are committed to the repo — the Next.js build reads them directly.

---

## `generate-thumbnail.ts`

**Purpose.** Generates a single 3:2 blog/social-card PNG for a given title via Google Gemini's `gemini-2.0-flash-exp-image-generation` model, and writes it to `public/posts/<kebab-title>.png`.

**Required env vars.**

| Var | Purpose |
| --- | --- |
| `GEMINI_API_KEY` | Auth for Google Gemini. Get one at https://aistudio.google.com/app/apikey. |

**Run.**

```bash
GEMINI_API_KEY=... npm run generate-thumbnail "Your Article Title"
```

**Expected output.**

- `Generating thumbnail for: <title>` in the console.
- A new file at `public/posts/<kebab-title>.png`.

**You do NOT need to run this to develop or use the app.** Blog thumbnails are checked in alongside their posts.

---

## Caveats for forkers

These scripts are wired to the maintainer's workflow and may not work for you out of the box:

- `content-pipeline.ts` references an internal topic-discovery endpoint that is not implemented in this repo (see "Status" above).
- `generate-thumbnail.ts` targets a specific Gemini model (`gemini-2.0-flash-exp-image-generation`) whose availability, response shape, and image-generation quirks change without notice. You may need to swap models, parse a different response shape, or rebuild prompts.
- Neither script is covered by the test suite — they were never meant to be part of the runtime contract. If you fork the project for your own content, expect to rewrite them.

If you only care about running Perfect Greet, ignore this directory entirely.

---

## Self-hosting without Docker (PM2)

Docker is the canonical production path for Perfect Greet — see the root `README.md` "Deploy" section, plus the included `Dockerfile` and `render.yaml`. If you specifically want to self-host on a long-running VM under PM2 process management instead, three namespaced scripts live in `package.json`:

| Script                   | What it does                                                                                              |
| ------------------------ | --------------------------------------------------------------------------------------------------------- |
| `npm run prod:pm2`       | Builds the app, removes any existing PM2 entry named `voicemail-greeting`, then starts a fresh one.       |
| `npm run prod:pm2:start` | Starts the PM2-managed `next start` process on port 3030.                                                 |
| `npm run prod:pm2:stop`  | Stops the PM2-managed process.                                                                            |

These are namespaced under `prod:pm2:*` so they don't compete visually with the canonical Docker path. Requirements:

- `pm2` installed globally: `npm install -g pm2`
- Node 20+ (see the `engines` field in `package.json`)
- Port 3030 free (or edit the `prod:pm2:start` script to pick another port)

If you're not specifically committed to PM2, prefer Docker. It runs as a non-root user and ships with a health check out of the box.
