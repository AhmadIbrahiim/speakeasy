import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare"

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-contained server bundle (.next/standalone) for Docker / Render.
  output: "standalone",
}

export default nextConfig

// Gives `next dev` the Worker bindings from wrangler.jsonc.
initOpenNextCloudflareForDev()
