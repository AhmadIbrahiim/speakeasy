import { VoicemailIcon } from "lucide-react"
import Link from "next/link"
import React from "react"

export function BaseLayout({ children, hideHero = false }: { children: React.ReactElement | React.ReactElement[]; hideHero?: boolean }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 max-md:p-8 pb-0 ">
      <div className="flex flex-col min-h-[100dvh]">
        <header className="fixed top-0 left-0 right-0 z-50 bg-white  shadow-sm max-w-[1200px] mx-auto w-full px-4 lg:px-6 h-14 flex items-center">
          <Link className="flex items-center justify-center" href="/">
            <VoicemailIcon className="h-6 w-6" />
            <span className="sr-only">Voicemail Greetings</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="/posts">
              Blog
            </Link>
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="#feature">
              Features
            </Link>
            <Link className="text-sm font-medium hover:underline underline-offset-4" href="#contact">
              Contact
            </Link>
          </nav>
        </header>

        {hideHero ? null : (
          <section className="w-full max-w-[1200px] mx-auto py-12 ">
            <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-2 items-center gap-8">
              <div className="space-y-4 text-left">
                <div className="space-y-6">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">100% Free Pro Voicemail Greeting</h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl  ">
                    Create professional and personalized voicemail greetings for free! No credit card or sign-up required. Generate your custom audio file in seconds and make a lasting impression.
                  </p>
                </div>
                <Link
                  className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 "
                  href="/">
                  Try It Now
                </Link>
              </div>
              <img alt="Voicemail Greetings" className="mx-auto aspect-video overflow-hidden rounded-xl " width={500} src="https://mixavox.com/_nuxt/img/illus-recording.14859e6.svg" />
            </div>
          </section>
        )}

        {children}
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
          <p className="text-xs text-gray-500 ">2024 PrefectGreet. All rights reserved. </p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link className="text-xs hover:underline underline-offset-4" href="#">
              Terms of Service
            </Link>
            <Link className="text-xs hover:underline underline-offset-4" href="#">
              Privacy
            </Link>
          </nav>
        </footer>
      </div>
    </main>
  )
}

export default BaseLayout
