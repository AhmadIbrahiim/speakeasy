import type { Metadata, Viewport } from "next"
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google"
import { GoogleTagManager } from "@next/third-parties/google"
import "./globals.scss"
import { OrganizationJsonLd, ServiceJsonLd } from "@/components/JsonLd"
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
    default: "Free Pro Voicemail Greeting - No Credit Card Needed | Speakeasy",
  },
  applicationName: "Speakeasy",

  description: "Create professional and personalized voicemail greetings for free! No credit card or sign-up required. Generate your custom audio file in seconds and make a lasting impression.",
  keywords: "free voicemail greeting, voicemail, no credit card required, free audio file, custom voicemail",
  robots: "index, follow",
  openGraph: {
    title: "Free Pro Voicemail Greeting - No Credit Card Needed | Speakeasy",
    description: "Create professional and personalized voicemail greetings for free! No credit card or sign-up required. Generate your custom audio file in seconds and make a lasting impression.",
    type: "website",
    locale: "en_US",
    siteName: "Speakeasy",
  },
  alternates: {
    canonical: `${SITE.url}/`,
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
        <OrganizationJsonLd />
        <ServiceJsonLd
          name={`${SITE.name} Voicemail Greeting Generator`}
          description="Create professional and personalized voicemail greetings for free! No credit card or sign-up required."
          url={SITE.url}
          provider={{
            name: SITE.organization.name,
            url: SITE.url,
          }}
        />
      </head>
      <GoogleTagManager gtmId="GTM-NWHBPJB6" />

      <body className="font-sans">{children}</body>
    </html>
  )
}
