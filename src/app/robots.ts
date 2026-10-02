import type { MetadataRoute } from "next"
import { SITE } from "@/config/site"

// ponytail: everything public is crawlable by every bot. Training-bot opt-outs are an owner
// decision made in the Cloudflare dashboard, not here.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${SITE.url}/sitemap.xml`,
  }
}
