import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.scss"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Perfect Greet | Free Pro Voicemail Greeting - No Credit Card Needed",
  description: "Create professional and personalized voicemail greetings for free! No credit card or sign-up required. Generate your custom audio file in seconds and make a lasting impression.",
  keywords: "free voicemail greeting, voicemail, no credit card required, free audio file, custom voicemail",
  robots: "index, follow",
  openGraph: {
    title: "Perfect Greet | Free Pro Voicemail Greeting - No Credit Card Needed",
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
