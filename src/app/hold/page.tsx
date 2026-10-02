import type { Metadata } from "next"
import HoldClient from "@/components/holdClient"
import { SITE } from "@/config/site"

export const metadata: Metadata = {
  title: "Free On-Hold Message Maker (AI Voice, MP3 Download)",
  description: "Make a free on-hold message with an AI voice and optional background music, then download it as an MP3 for your phone system.",
  alternates: { canonical: `${SITE.url}/hold` },
}

export default function Hold() {
  return <HoldClient />
}
