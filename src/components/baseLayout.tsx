import { VoicemailIcon } from "lucide-react"
import Link from "next/link"
import React from "react"
import NavMenu from "./ui/NavigationMenu"

export function BaseLayout({ children, hideHero = false, title = "Voicemail Greeting" }: { children: React.ReactElement | React.ReactElement[]; hideHero?: boolean; title?: string }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 max-md:p-8 pb-0 ">
      <div className="flex flex-col min-h-[100dvh]">
        <header className="fixed top-0 left-0 right-0 z-50 bg-white  shadow-sm max-w-[1200px] mx-auto w-full px-4 lg:px-6 h-14 flex items-center">
          <Link className="flex items-center justify-center" href="/">
            <VoicemailIcon className="h-6 w-6" />
            <span className="sr-only">Voicemail Greetings</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <NavMenu />
          </nav>
        </header>

        {hideHero ? null : (
          <section className="w-full max-w-[1200px] mx-auto py-12 ">
            <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-2 items-center gap-8">
              <div className="space-y-4 text-left">
                <div className="space-y-6">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">100% Free Pro {title}</h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl  ">
                    Create professional and personalized {String(title).toLocaleLowerCase()} for free! No credit card or sign-up required. Generate your custom audio file in seconds and make a lasting
                    impression.
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

        <footer className="w-full border-t mt-auto">
          <div className="mx-auto max-w-[1200px] p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-6">
              <div>
                <h3 className="text-base font-semibold mb-4">Perfect Greet</h3>
                <p className="text-sm text-gray-500 mb-4">Create professional voicemail greetings for free, no credit card required.</p>
                <div className="flex space-x-4">
                  <a href="https://twitter.com/perfectgreet" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-600 hover:text-gray-900">
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                  </a>
                  <a href="https://facebook.com/perfectgreet" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-600 hover:text-gray-900">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </a>
                </div>
              </div>
              <div>
                <h3 className="text-base font-semibold mb-4">Useful Links</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/" className="text-gray-600 hover:text-gray-900 hover:underline">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/hold" className="text-gray-600 hover:text-gray-900 hover:underline">
                      On-Hold Messages
                    </Link>
                  </li>
                  <li>
                    <Link href="/posts" className="text-gray-600 hover:text-gray-900 hover:underline">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="text-gray-600 hover:text-gray-900 hover:underline">
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-base font-semibold mb-4">Legal</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/privacy-policy" className="text-gray-600 hover:text-gray-900 hover:underline">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-gray-600 hover:text-gray-900 hover:underline">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t pt-6">
              <p className="text-xs text-gray-500">© {new Date().getFullYear()} PerfectGreet. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}

export default BaseLayout
