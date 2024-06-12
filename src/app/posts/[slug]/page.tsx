import { getPostBySlug, getSortedPostsData } from "@/lib/posts"
import BaseLayout from "@/components/baseLayout"
import markdownToHtml from "@/lib/markdownToHtml"
import Image from "next/image"

async function Home(props: any) {
  const slug = props.params.slug
  const pagePost = getPostBySlug(slug, ["title", "content", "image"])
  const content = await markdownToHtml(pagePost?.content)
  return (
    <BaseLayout hideHero>
      {/* Keep the existing code here */}

      <section className="gap-6 px-4 w-full max-w-[1200px]  " id="blog-content">
        {/* Add this <section> tag below the existing <section> tag */}
        <div className="px-4 py-6 ">
          <article className="prose prose-gray mx-auto dark:prose-invert">
            <div className="space-y-2 not-prose mb-7">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl lg:leading-[3.5rem]">{pagePost?.title}</h1>
              <p className="text-gray-500 dark:text-gray-400">Posted on August 24, 2023</p>
            </div>

            {/* Image hero in blog post */}
            <Image src={pagePost.image} alt="Blog Post Image" width={1250} height={340} className="aspect-video object-contain" />

            <div dangerouslySetInnerHTML={{ __html: content }} />
          </article>
        </div>
      </section>
    </BaseLayout>
  )
}

export default Home
