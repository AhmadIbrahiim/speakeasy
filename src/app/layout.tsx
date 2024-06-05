import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.scss"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Create Free Voicemail Greetings | Professional Voicemail Generator",
  description: "Generate high-quality professional voicemail greetings for free. Customize tone, language, and content with ease. No subscription required. Start now at PrefectGreet.site",
  keywords:
    "free voicemail greetings, professional voicemail generator, customize voicemail greetings, business voicemail greetings, personal voicemail greetings, professional voice artists, voicemail greeting service, 100% free voicemail greetings",
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
