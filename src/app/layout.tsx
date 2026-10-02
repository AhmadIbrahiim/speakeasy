import type { Metadata, Viewport } from "next"
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google"
import { GoogleTagManager } from "@next/third-parties/google"
import "./globals.scss"
import { PersonJsonLd, WebApplicationJsonLd } from "@/components/JsonLd"
import { SITE } from "@/config/site"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono", display: "swap" })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    template: "%s | Speakeasy",
    default: "Free Voicemail Greeting Maker | Speakeasy",
  },
  applicationName: "Speakeasy",

  description: "Create professional and personalized voicemail greetings for free! No credit card or sign-up required. Generate your custom audio file in seconds and make a lasting impression.",
  keywords: "free voicemail greeting, voicemail, no credit card required, free audio file, custom voicemail",
  metadataBase: new URL(SITE.url),
  robots: "index, follow",
  openGraph: {
    title: "Free Voicemail Greeting Maker | Speakeasy",
    description: "Make a free voicemail greeting with an AI voice and download an MP3.",
    type: "website",
    locale: "en_US",
    siteName: "Speakeasy",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}>
      <head>
        <WebApplicationJsonLd />
        <PersonJsonLd />
      </head>
      <GoogleTagManager gtmId="GTM-NWHBPJB6" />

      <body className="font-sans">{children}</body>
    </html>
  )
}
