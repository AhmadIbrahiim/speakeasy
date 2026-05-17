import { getSortedPostsData } from "@/lib/posts"
import BaseLayout from "@/components/baseLayout"
import Link from "next/link"
import { ArrowRight, BookOpen } from "lucide-react"

import type { Metadata } from "next"
import { SITE } from "@/config/site"

export const metadata: Metadata = {
  title: "Notes & guides",
  description: "Short reads on voicemail scripts, on-hold copy, and getting your voice into a phone system that doesn't sound like a robot.",
  alternates: { canonical: `${SITE.url}/posts/` },
}

function formatDate(iso: string) {
  if (!iso) return ""
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

type CardProps = { title: string; description: string; image: string; slug: string; date: string }

function PostCard({ title, description, image, slug, date }: CardProps) {
  return (
    <Link
      href={`/posts/${slug}`}
      prefetch={false}
      className="group block bg-white border-2 border-ink rounded-2xl overflow-hidden shadow-ink hover:shadow-ink-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
      <div className="aspect-[16/10] bg-cream-200 border-b-2 border-ink overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={`Cover image for ${title}`} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" loading="lazy" />
      </div>
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-3 text-[11.5px] font-mono text-stone-500">
          <span>{formatDate(date)}</span>
        </div>
        <h2 className="font-serif text-[20px] sm:text-[22px] font-semibold tracking-[-0.015em] text-ink leading-snug mb-2 group-hover:text-accent transition-colors">{title}</h2>
        <p className="text-[14px] text-stone-600 leading-relaxed line-clamp-3 mb-4">{description}</p>
        <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-ink">
          Read
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />
        </span>
      </div>
    </Link>
  )
}

export default function PostsIndex() {
  const posts = getSortedPostsData()

  return (
    <BaseLayout hideHero>
      <section className="w-full max-w-[1200px] mx-auto px-4 md:px-6 pt-8 md:pt-16 pb-8">
        <div className="max-w-[760px]">
          <span className="inline-flex items-center gap-2 bg-ink text-cream-100 px-3.5 py-1.5 rounded-full text-xs font-medium -rotate-2 mb-5">
            <BookOpen className="w-3.5 h-3.5 text-accent-warm" /> {posts.length} reads
          </span>
          <h1 className="font-serif text-[clamp(40px,6vw,64px)] leading-[1.02] tracking-[-0.035em] font-semibold text-ink mb-4 text-balance">Notes from the workshop.</h1>
          <p className="text-[18px] leading-relaxed text-stone-600 max-w-[640px]">
            Short reads on voicemail scripts, on-hold copy, and getting your voice into a phone system that doesn&apos;t sound like a robot. No corporate filler.
          </p>
        </div>
      </section>

      <section className="w-full max-w-[1200px] mx-auto px-4 md:px-6 pb-16 md:pb-20">
        {posts.length === 0 ? (
          <div className="bg-white border-2 border-ink rounded-2xl p-12 text-center shadow-ink-lg">
            <p className="font-serif italic text-[18px] text-stone-500">No posts yet — check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {posts.map((post) => (
              <PostCard key={post.slug} title={post.title} description={post.description} image={post.image} slug={post.slug} date={post.date} />
            ))}
          </div>
        )}
      </section>

      <section className="w-full max-w-[1200px] mx-auto px-4 md:px-6 pb-16">
        <div className="bg-cream-200 border-2 border-ink rounded-2xl px-6 sm:px-10 py-8 sm:py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <h2 className="font-serif text-[22px] sm:text-[26px] font-semibold tracking-[-0.015em] text-ink mb-1">Ready to make your own greeting?</h2>
            <p className="text-[14.5px] text-stone-600">Open the workspace — your first MP3 takes about a minute.</p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-accent text-white px-6 py-3 rounded-full text-[15px] font-semibold border-2 border-ink shadow-ink hover:shadow-ink-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all whitespace-nowrap">
            Open workspace <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
        </div>
      </section>
    </BaseLayout>
  )
}
