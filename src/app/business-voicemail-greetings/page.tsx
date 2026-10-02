import type { Metadata } from "next"
import SeoPage from "@/components/seoPage"
import { PAGES } from "@/content/pages"
import { SITE } from "@/config/site"

const page = PAGES.find((p) => p.path === "/business-voicemail-greetings")!

export const metadata: Metadata = {
  title: page.title,
  description: page.description,
  alternates: { canonical: `${SITE.url}${page.path}` },
  openGraph: { title: page.title, description: page.description, url: `${SITE.url}${page.path}`, type: "website" },
}

export default function Page() {
  return <SeoPage page={page} />
}
