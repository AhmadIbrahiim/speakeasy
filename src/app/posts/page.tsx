import { getSortedPostsData } from "@/lib/posts"
import RootLayout from "../layout"
import BaseLayout from "@/components/baseLayout"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

type BlogProps = {
  title: string
  description: string
  image: string
  slug: string
}
const Blog = ({ title, description, image, slug }: BlogProps) => (
  <div className="group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-transform duration-300 ease-in-out hover:-translate-y-2">
    <Link href={`/posts/${slug}`} className="block" prefetch={false}>
      <img src={image} alt="Blog Post Image" width={600} height={400} className="aspect-video object-cover w-full" />
    </Link>
    <div className="p-4 bg-white dark:bg-gray-950">
      <h3 className="text-xl font-bold mb-2">
        <Link href={`/posts/${slug}`} className="hover:underline" prefetch={false}>
          {title}
        </Link>
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-4">{description}</p>
      <Link href={`/posts/${slug}`} className="inline-flex items-center font-medium text-primary hover:underline" prefetch={false}>
        Read More
        <ArrowRightIcon className="ml-1 w-4 h-4" />
      </Link>
    </div>
  </div>
)

function Home() {
  const allPostsData = getSortedPostsData()
  return (
    <BaseLayout>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-6 py-12 md:py-16 lg:py-20 w-full max-w-[1200px] mx-auto ">
        {allPostsData.map(({ id, title, description, image }) => (
          <Blog key={id} title={title} description={description} image={image} slug={id} />
        ))}
      </section>
    </BaseLayout>
  )
}

export default Home
