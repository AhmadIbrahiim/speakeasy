import { VoicemailIcon, Github, Coffee, Star } from "lucide-react"
import Link from "next/link"
import React from "react"
import NavMenu from "./ui/NavigationMenu"
import { SITE } from "@/config/site"

export function BaseLayout({ children, hideHero = false, title = "Voicemail Greeting" }: { children: React.ReactElement | React.ReactElement[]; hideHero?: boolean; title?: string }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between pt-16 sm:pt-20 pb-0 px-0">
      <div className="flex flex-col min-h-[100dvh]">
        <header className="fixed top-0 left-0 right-0 z-50 bg-cream-100/85 backdrop-blur-md border-b-2 border-ink/10">
          <div className="max-w-[1200px] mx-auto w-full px-4 lg:px-6 h-16 sm:h-[68px] flex items-center justify-between gap-3">
            <Link className="flex items-center gap-2.5 group" href="/">
              <span className="relative inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white border-2 border-ink shadow-ink transition-all group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:shadow-ink-lg">
                <VoicemailIcon className="h-4 w-4 text-ink" strokeWidth={2.4} />
              </span>
              <span className="hidden sm:flex items-center gap-2">
                <span className="font-serif font-semibold text-[19px] tracking-[-0.015em] text-ink">{SITE.name}</span>
                <span className="hidden md:inline-flex items-center gap-1 text-[10.5px] font-mono uppercase tracking-[0.08em] text-stone-600 bg-cream-200 border border-ink/15 px-1.5 py-0.5 rounded-full">
                  <span className="w-1 h-1 rounded-full bg-accent-forest" />
                  open source
                </span>
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <nav className="flex items-center">
                <NavMenu />
              </nav>
              <a
                href={SITE.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                title="Star Perfect Greet on GitHub"
                aria-label="Star on GitHub"
                className="ml-1 inline-flex items-center justify-center gap-1.5 h-9 px-3 sm:px-3.5 text-[13px] font-semibold text-ink bg-white border-2 border-ink rounded-full hover:bg-cream-50 hover:shadow-ink hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                <Github className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Star</span>
                <Star className="w-3 h-3 text-accent-warm" fill="currentColor" />
              </a>
              <a
                href={SITE.socials.buyMeACoffee}
                target="_blank"
                rel="noopener noreferrer"
                title="Buy me a coffee"
                aria-label="Buy me a coffee"
                className="hidden md:inline-flex items-center justify-center h-9 w-9 text-ink bg-accent-warm border-2 border-ink rounded-full hover:shadow-ink hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                <Coffee className="w-3.5 h-3.5" strokeWidth={2.2} />
              </a>
            </div>
          </div>
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
                <h3 className="text-base font-semibold mb-4">{SITE.name}</h3>
                <p className="text-sm text-gray-500 mb-3">Create professional voicemail greetings for free, no credit card required.</p>
                <p className="text-xs text-gray-500 mb-4">
                  Open source under <a href={`${SITE.socials.github}/blob/main/LICENSE`} target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-900">{SITE.openSource.license}</a>.
                  Built and maintained in the open.
                </p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={SITE.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50 hover:border-gray-400 transition-colors">
                    <Github className="w-3.5 h-3.5" />
                    Star on GitHub
                    <Star className="w-3 h-3 text-amber-500" fill="currentColor" />
                  </a>
                  <a
                    href={SITE.socials.buyMeACoffee}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50 hover:border-gray-400 transition-colors">
                    <Coffee className="w-3.5 h-3.5" />
                    Buy me a coffee
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
              <p className="text-xs text-gray-500">© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}

export default BaseLayout
