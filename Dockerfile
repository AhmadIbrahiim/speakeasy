# syntax=docker/dockerfile:1.7
# Multi-stage build for Next.js on Render (and any Docker host).
# Final image ≈ 230 MB: node-slim + ffmpeg + Next standalone bundle.

# ────────────────────────────────────────────────────────────────────────────
# 1. Dependencies — install once, cache aggressively
# ────────────────────────────────────────────────────────────────────────────
FROM node:20-slim AS deps
WORKDIR /app

# Build tools only in case node-web-audio-api needs to compile (most arches
# have prebuilt binaries, this is the safety net).
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund

# ────────────────────────────────────────────────────────────────────────────
# 2. Builder — compile Next.js, produce standalone output
# ────────────────────────────────────────────────────────────────────────────
FROM node:20-slim AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# ────────────────────────────────────────────────────────────────────────────
# 3. Runner — minimal runtime with ffmpeg
# ────────────────────────────────────────────────────────────────────────────
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# ffmpeg is the whole reason we're not on serverless. Keep the layer slim:
# install only what's needed, then clean the apt lists.
RUN apt-get update \
    && apt-get install -y --no-install-recommends ffmpeg ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Non-root user. Next's standalone server runs fine without root.
RUN groupadd -r app --gid 1001 \
    && useradd -r -g app -u 1001 -m -d /home/app app

# Copy the standalone server + static assets + public dir.
# These three are what Next produces in "output: standalone" mode.
COPY --from=builder --chown=app:app /app/public ./public
COPY --from=builder --chown=app:app /app/.next/standalone ./
COPY --from=builder --chown=app:app /app/.next/static ./.next/static

# Writable scratch dir for any temp audio files generated at request time.
RUN mkdir -p /app/output && chown -R app:app /app/output

USER app

EXPOSE 3000

# Render probes /api/health; Docker HEALTHCHECK is a belt-and-braces.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
