import { Metadata } from "next"
import { SITE } from "@/config/site"

const TITLE = "Free Voicemail Greeting Maker (AI Voices, MP3 Download)"
const DESCRIPTION =
  "Make a free voicemail greeting with an AI voice. Pick or write a script, add optional music, and download an MP3. No account on this site and no credit card."

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | ${SITE.name}` },
  description: DESCRIPTION,
  alternates: { canonical: `${SITE.url}/` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: `${SITE.url}/`,
    siteName: SITE.name,
  },
  twitter: { card: "summary", title: TITLE, description: DESCRIPTION },
}
