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

export const OrganizationJsonLd = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.organization.name,
    url: SITE.url,
    logo: SITE.organization.logo,
    description: "Create professional and personalized voicemail greetings for free! No credit card or sign-up required.",
    sameAs: [SITE.socials.twitter, SITE.socials.facebook, SITE.socials.github],
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}
