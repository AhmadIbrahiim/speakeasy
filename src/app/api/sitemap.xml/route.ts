import { PROD_URL } from "@/app/config/constants"
import { getSortedPostsData } from "@/lib/posts"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const allPosts = getSortedPostsData()
  // Your API logic goes here
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${PROD_URL}/</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>

      <url>
        <loc>${PROD_URL}/posts</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>
      ${allPosts
        .map(
          (post) =>
            `<url>
        <loc>${PROD_URL}/posts/${post.id}</loc>
        <lastmod>${new Date(post.date).toISOString()}</lastmod>
      </url>`,
        )
        .join("")}
    </urlset>

        `

  return new Response(xml, {
    status: 200,
    headers: {
      // Cache for 1 day w/ swr
      "Cache-control": "public, s-maxage=86400, stale-while-revalidate",
      "content-type": "application/xml",
    },
  })
}
