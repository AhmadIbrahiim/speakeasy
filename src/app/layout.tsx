import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.scss"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    template: "%s | Perfect Greet",
    default: "Free Pro Voicemail Greeting - No Credit Card Needed | Perfect Greet",
  },
  applicationName: "Perfect Greet",

  description: "Create professional and personalized voicemail greetings for free! No credit card or sign-up required. Generate your custom audio file in seconds and make a lasting impression.",
  keywords: "free voicemail greeting, voicemail, no credit card required, free audio file, custom voicemail",
  robots: "index, follow",
  openGraph: {
    title: "Free Pro Voicemail Greeting - No Credit Card Needed | Perfect Greet",
    description: "Create professional and personalized voicemail greetings for free! No credit card or sign-up required. Generate your custom audio file in seconds and make a lasting impression.",
    type: "website",
    locale: "en_US",
    siteName: "Perfect Greet",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
