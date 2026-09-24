// Rendered at build time: the Worker has no filesystem to read posts from.
export const dynamic = "force-static"

import { NextResponse } from "next/server"
import { SITE } from "@/config/site"

export async function GET() {
  const robotsTxt = `
# *
User-agent: *
Allow: /

# Host
Host: ${SITE.url}

# Sitemaps
Sitemap: ${SITE.url}/sitemap.xml
`

  return new NextResponse(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
    },
  })
}
