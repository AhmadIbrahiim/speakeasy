import { defineCloudflareConfig } from "@opennextjs/cloudflare"
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache"

// Prerendered pages (posts, sitemap) are served from Workers static assets.
// Read-only: fine because nothing here revalidates at runtime.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
})
