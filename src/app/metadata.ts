import { Metadata } from "next"
import { SITE } from "@/config/site"

export const metadata: Metadata = {
  title: `Free Pro Voicemail Greeting Generator - No Credit Card Needed | ${SITE.name}`,
  description: "Create professional and personalized voicemail greetings for free! Choose from 35+ premium voices, add background music, and download instantly. No credit card or sign-up required.",
  keywords: "free voicemail greeting, professional voicemail, voicemail generator, custom voicemail, business greeting, no credit card, instant download, AI voice generator",
  alternates: {
    canonical: `${SITE.url}/`,
  },
  openGraph: {
    title: `Free Pro Voicemail Greeting Generator | ${SITE.name}`,
    description: "Create professional and personalized voicemail greetings for free! Choose from 35+ premium voices, add background music, and download instantly. No credit card or sign-up required.",
    type: "website",
    url: `${SITE.url}/`,
    images: [
      {
        url: `${SITE.url}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: `${SITE.name} Voicemail Generator`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Free Pro Voicemail Greeting Generator | ${SITE.name}`,
    description: "Create professional and personalized voicemail greetings for free! No credit card or sign-up required.",
    images: [`${SITE.url}/og-image.jpg`],
  },
}
