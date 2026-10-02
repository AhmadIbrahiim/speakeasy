import { getSortedPostsData } from "@/lib/posts"
import { MetadataRoute } from "next"
import { SITE } from "@/config/site"

// Bump when the landing pages' copy actually changes.
const SEO_UPDATED = "2026-10-02"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getSortedPostsData()

  // Base URL
  const baseUrl = SITE.url

  // Generate sitemap entries for blog posts
  const blogPosts = posts.map((post) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  // Main routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(SEO_UPDATED),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    ...["voicemail-greetings", "voicemail-greeting-mp3", "business-voicemail-greetings"].map((p) => ({
      url: `${baseUrl}/${p}`,
      lastModified: new Date(SEO_UPDATED),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    {
      url: `${baseUrl}/hold`,
      lastModified: new Date(SEO_UPDATED),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/posts`,
      lastModified: new Date(SEO_UPDATED),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(SEO_UPDATED),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(SEO_UPDATED),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(SEO_UPDATED),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ]

  return [...routes, ...blogPosts]
}
