import { VoicemailIcon, Github, Coffee, Star } from "lucide-react"
import Link from "next/link"
import React from "react"
import NavMenu from "./ui/NavigationMenu"
import { SITE } from "@/config/site"

export function BaseLayout({ children }: { children: React.ReactElement | React.ReactElement[] }) {
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
                title="Star Speakeasy on GitHub"
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

        {children}

        <footer className="w-full border-t-2 border-ink/10 mt-auto">
          <div className="mx-auto max-w-[1200px] px-4 md:px-6 py-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div>
                <h3 className="font-serif text-[18px] font-semibold tracking-[-0.015em] text-ink mb-3">{SITE.name}</h3>
                <p className="text-[13.5px] leading-relaxed text-stone-600 mb-3">Create professional voicemail greetings for free, no credit card required.</p>
                <p className="text-[12px] leading-relaxed text-stone-500 mb-4">
                  Open source under{" "}
                  <a
                    href={`${SITE.socials.github}/blob/main/LICENSE`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink border-b border-ink/30 hover:border-accent hover:text-accent transition-colors">
                    {SITE.openSource.license}
                  </a>
                  . Built and maintained in the open.
                </p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={SITE.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-white text-ink border-2 border-ink rounded-full px-3 py-1.5 text-[12px] font-semibold hover:shadow-ink hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
                    <Github className="w-3.5 h-3.5" />
                    Star on GitHub
                    <Star className="w-3 h-3 text-accent-warm" fill="currentColor" />
                  </a>
                  <a
                    href={SITE.socials.buyMeACoffee}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-accent-warm text-ink border-2 border-ink rounded-full px-3 py-1.5 text-[12px] font-semibold hover:shadow-ink hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
                    <Coffee className="w-3.5 h-3.5" strokeWidth={2.2} />
                    Buy me a coffee
                  </a>
                </div>
              </div>
              <div>
                <h3 className="font-serif text-[18px] font-semibold tracking-[-0.015em] text-ink mb-3">Useful links</h3>
                <ul className="space-y-2 text-[14px]">
                  <li>
                    <Link href="/" className="text-stone-600 hover:text-accent transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/hold" className="text-stone-600 hover:text-accent transition-colors">
                      On-hold messages
                    </Link>
                  </li>
                  <li>
                    <Link href="/voicemail-greetings" className="text-stone-600 hover:text-accent transition-colors">
                      Greeting templates
                    </Link>
                  </li>
                  <li>
                    <Link href="/voicemail-greeting-mp3" className="text-stone-600 hover:text-accent transition-colors">
                      Voicemail greeting MP3
                    </Link>
                  </li>
                  <li>
                    <Link href="/business-voicemail-greetings" className="text-stone-600 hover:text-accent transition-colors">
                      Business greetings
                    </Link>
                  </li>
                  <li>
                    <Link href="/posts" className="text-stone-600 hover:text-accent transition-colors">
                      Notes & guides
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="text-stone-600 hover:text-accent transition-colors">
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-serif text-[18px] font-semibold tracking-[-0.015em] text-ink mb-3">Legal</h3>
                <ul className="space-y-2 text-[14px]">
                  <li>
                    <Link href="/privacy-policy" className="text-stone-600 hover:text-accent transition-colors">
                      Privacy policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-stone-600 hover:text-accent transition-colors">
                      Terms of service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-ink/10">
              <p className="text-[11.5px] font-mono text-stone-500">© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}

export default BaseLayout
