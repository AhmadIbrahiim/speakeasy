import { getCloudflareContext } from "@opennextjs/cloudflare"

/**
 * Best-effort cache on the Worker's R2 bucket (binding `CACHE`, see wrangler.jsonc).
 * `next dev` gets a local R2 simulation via initOpenNextCloudflareForDev.
 * Callers treat any failure as a cache miss.
 */
const bucket = () => getCloudflareContext().env.CACHE

const R2Cache = {
  async get(key: string): Promise<ArrayBuffer | null> {
    const obj = await bucket().get(key)
    return obj ? obj.arrayBuffer() : null
  },

  async put(key: string, body: ArrayBuffer | string, contentType: string): Promise<void> {
    await bucket().put(key, body, { httpMetadata: { contentType } })
  },
}

export default R2Cache
