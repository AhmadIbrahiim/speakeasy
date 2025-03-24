import { NextResponse } from "next/server"

export async function GET() {
  const robotsTxt = `
# *
User-agent: *
Allow: /

# Host
Host: https://www.perfectgreet.site

# Sitemaps
Sitemap: https://www.perfectgreet.site/sitemap.xml
`

  return new NextResponse(robotsTxt, {
    headers: {
      "Content-Type": "text/plain",
    },
  })
}
