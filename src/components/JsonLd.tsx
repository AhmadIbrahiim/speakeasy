import React from "react"
import { SITE } from "@/config/site"

type ServiceJsonLdProps = {
  name: string
  description: string
  url: string
  image?: string
  provider?: {
    name: string
    url: string
  }
}

type ArticleJsonLdProps = {
  headline: string
  description: string
  datePublished: string
  image: string
  url: string
  author: {
    name: string
  }
}

type FAQJsonLdProps = {
  questions: Array<{
    question: string
    answer: string
  }>
}

export const ServiceJsonLd = ({ name, description, url, image, provider }: ServiceJsonLdProps) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url,
    ...(image && { image }),
    ...(provider && {
      provider: {
        "@type": "Organization",
        name: provider.name,
        url: provider.url,
      },
    }),
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}

export const ArticleJsonLd = ({ headline, description, datePublished, image, url, author }: ArticleJsonLdProps) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    image,
    datePublished,
    url,
    author: {
      "@type": "Person",
      name: author.name,
    },
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}

export const FAQJsonLd = ({ questions }: FAQJsonLdProps) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}

const AUTHOR = { "@type": "Person", name: "Ahmed Ibrahim", url: "https://ahmed-ibrahim.com", sameAs: [SITE.socials.github, "https://ahmed-ibrahim.com"] }

// The app itself. Every fact here is also stated on the page; no ratings or reviews are claimed.
export const WebApplicationJsonLd = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE.name,
    alternateName: "Speakeasy free voicemail greeting maker",
    url: SITE.url,
    description:
      "Free, open-source voicemail greeting maker. Write or pick a script, choose an AI voice, add optional background music and download an MP3. Generates speech from text; does not record your own voice.",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any (web browser)",
    browserRequirements: "Requires JavaScript",
    isAccessibleForFree: true,
    license: "https://opensource.org/licenses/MIT",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    featureList: ["AI voices", "Optional background music", "Greeting script templates", "MP3 download", "No account on this site"],
    author: AUTHOR,
    sameAs: [SITE.socials.github],
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}

export const PersonJsonLd = () => <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", ...AUTHOR }) }} />
