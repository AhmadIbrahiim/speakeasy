import { getPostBySlug, getSortedPostsData } from "@/lib/posts"
import BaseLayout from "@/components/baseLayout"
import markdownToHtml from "@/lib/markdownToHtml"
import Link from "next/link"
import Image from "next/image"
import { Metadata } from "next"
import { ArticleJsonLd } from "@/components/JsonLd"
import { SITE } from "@/config/site"
import { ArrowLeft, ArrowRight, Clock } from "lucide-react"

function formatDate(iso: string) {
  if (!iso) return ""
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

// ~225 wpm average reading speed. Round up, floor at 1.
function readingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 225))
}

type Params = {
  params: Promise<{ slug: string }>
}

// Only prerendered slugs exist; the Worker has no filesystem to read new posts from.
export const dynamicParams = false

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params
  const postData = getPostBySlug(params.slug, ["title", "description", "image"])
  return {
    title: postData.title,
    description: postData.description,
    alternates: {
      canonical: `${SITE.url}/posts/${params.slug}`,
    },
    openGraph: {
      title: postData.title,
      description: postData.description,
      type: "article",
      url: `${SITE.url}/posts/${params.slug}`,
      images: [
        {
          url: postData.image,
          width: 1200,
          height: 630,
          alt: postData.title,
        },
      ],
    },
  }
}

export async function generateStaticParams() {
  const posts = getSortedPostsData()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function Post(props: Params) {
  const params = await props.params
  const postData = getPostBySlug(params.slug, ["title", "content", "image", "date", "description"])
  const contentHtml = await markdownToHtml(postData.content)
  const minutes = readingTime(postData.content || "")

  return (
    <BaseLayout>
      <ArticleJsonLd
        headline={postData.title}
        description={postData.description}
        datePublished={postData.date}
        image={postData.image}
        url={`${SITE.url}/posts/${params.slug}`}
        author={{ name: `${SITE.name} Team` }}
      />

      <article className="w-full max-w-[760px] mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-16">
        <Link
          href="/posts"
          className="inline-flex items-center gap-1.5 text-[14px] font-medium text-stone-600 hover:text-accent transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" strokeWidth={2.5} />
          All posts
        </Link>

        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-5 text-[12px] font-mono text-stone-500">
            <span>{formatDate(postData.date)}</span>
            <span className="text-stone-300">·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {minutes} min read
            </span>
          </div>
          <h1 className="font-serif text-[clamp(34px,5vw,52px)] leading-[1.05] tracking-[-0.03em] font-semibold text-ink text-balance">{postData.title}</h1>
          {postData.description && <p className="mt-4 text-[18px] leading-relaxed text-stone-600">{postData.description}</p>}
        </header>

        {postData.image && (
          <div className="mb-10 rounded-2xl overflow-hidden border-2 border-ink shadow-ink-lg">
            <Image src={postData.image} alt={postData.title} width={1200} height={750} className="w-full h-auto" priority />
          </div>
        )}

        {/* Repo-controlled markdown rendered via remark — no untrusted input flows through this path. */}
        <div id="blog-content" dangerouslySetInnerHTML={{ __html: contentHtml }} />

        <div className="mt-12 pt-8 border-t-2 border-ink/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Link
            href="/posts"
            className="inline-flex items-center gap-1.5 text-[14px] font-medium text-stone-600 hover:text-accent transition-colors group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" strokeWidth={2.5} />
            More posts
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-accent text-white px-5 py-2.5 rounded-full text-[14px] font-semibold border-2 border-ink shadow-ink hover:shadow-ink-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
            Make your own greeting <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
          </Link>
        </div>
      </article>
    </BaseLayout>
  )
}
