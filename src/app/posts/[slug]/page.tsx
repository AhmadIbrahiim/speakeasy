import { getPostBySlug, getSortedPostsData } from "@/lib/posts"
import BaseLayout from "@/components/baseLayout"
import markdownToHtml from "@/lib/markdownToHtml"
import Image from "next/image"
import { Metadata } from "next"
import { ArticleJsonLd } from "@/components/JsonLd"
import { SITE } from "@/config/site"

type Params = {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
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

export default async function Post({ params }: Params) {
  const postData = getPostBySlug(params.slug, ["title", "content", "image", "date", "description"])
  const contentHtml = await markdownToHtml(postData.content)

  return (
    <BaseLayout hideHero>
      <ArticleJsonLd
        headline={postData.title}
        description={postData.description}
        datePublished={postData.date}
        image={postData.image}
        url={`${SITE.url}/posts/${params.slug}`}
        author={{
          name: `${SITE.name} Team`,
        }}
      />
      <section className="gap-6 px-4 w-full max-w-[1200px]" id="blog-content">
        <div className="px-4 py-6">
          <article className="prose prose-gray mx-auto dark:prose-invert">
            <div className="space-y-2 not-prose mb-7">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl lg:leading-[3.5rem]">{postData.title}</h1>
              <p className="text-gray-500 dark:text-gray-400">Posted on {postData.date ? new Date(postData.date).toLocaleDateString() : ""}</p>
            </div>

            {postData.image && (
              <div className="mb-6">
                <Image src={postData.image} alt={postData.title} width={800} height={450} className="rounded-lg" priority />
              </div>
            )}

            <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
          </article>
        </div>
      </section>
    </BaseLayout>
  )
}
