"use client"

import React from "react"
import BaseLayout from "./baseLayout"
import CONSTANTS from "@/app/config/constants"
import { Mic2, Music4, FileText, ArrowRight, Check, Star, Github, Coffee, Heart } from "lucide-react"
import { Metadata } from "next"
import { SITE } from "@/config/site"

export const metadata: Metadata = {
  title: "Perfect Greet",
  description: "Free voicemail and on-hold greetings. Studio voices, royalty-free music, ten battle-tested templates. No signup. No credit card. No catch.",
}

const TRUST_PILLS = ["Free forever", "No signup", "No credit card", "MP3 download"]

const FEATURED_TEMPLATES = ["Professional - Standard", "Professional - Out of Office", "Business - Customer Service", "Medical Office", "Friendly - Personal", "Holiday - Office Closure"] as const

const FAQ = [
  {
    q: "Is this really free?",
    a: "Yes. Forever. You bring a Cartesia API key (free, 1,000 credits to start) and we never touch your wallet. No ads either.",
  },
  {
    q: "Why do I need my own API key?",
    a: "Voice generation costs about $0.20 per minute. Eating that for every visitor would close the site. Cartesia gives you 1,000 free credits — about 20 minutes — which lasts most people years of personal greetings.",
  },
  {
    q: "Where does my key get stored?",
    a: "Only in your browser's localStorage. We never log it, save it, or send it anywhere except Cartesia's API for the moment we're generating your audio.",
  },
  {
    q: "Can I use this for my business phone system?",
    a: "Absolutely. Download the MP3, upload to your PBX or phone system. Works with most major providers.",
  },
  {
    q: "What if I want a voice you don't offer?",
    a: "Any voice in your Cartesia account works — including custom-cloned ones. Paste the voice ID, generate.",
  },
]

function Stamp({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 bg-ink text-cream-100 px-3.5 py-1.5 rounded-full text-xs font-medium -rotate-2 ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-accent-warm" /> {children}
    </span>
  )
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 bg-white border-2 border-ink px-3.5 py-1.5 rounded-full text-[13px] font-medium">
      <Check className="w-3.5 h-3.5 text-accent-forest" strokeWidth={3} />
      {children}
    </span>
  )
}

function loadTemplate(text: string) {
  const ta = document.querySelector("textarea")
  if (ta instanceof HTMLTextAreaElement) {
    const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set
    setter?.call(ta, text)
    ta.dispatchEvent(new Event("input", { bubbles: true }))
    ta.focus()
    document.getElementById("workspace")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }
}

export function Landing({ children, title }: { children: React.ReactElement; title?: string }) {
  return (
    <BaseLayout title={title} hideHero>
      {/* Hero */}
      <section className="w-full max-w-[1200px] mx-auto px-4 md:px-6 pt-12 pb-8 md:pt-20 md:pb-12">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-start">
          <div>
            <Stamp className="mb-7">Made with care · always free</Stamp>
            <h1 className="font-serif text-[clamp(40px,7vw,76px)] leading-[0.98] tracking-[-0.035em] font-semibold mb-6 text-balance">
              A voicemail greeting that{" "}
              <span className="relative inline-block">
                <span className="relative z-10">doesn&apos;t sound</span>
                <span className="absolute left-0 right-0 -bottom-0.5 h-3 bg-accent-warm/50 -z-0 -skew-x-12 translate-y-1 rounded-sm" aria-hidden />
              </span>{" "}
              like a <span className="scribble-underline">robot</span>.
            </h1>
            <p className="text-[19px] leading-relaxed text-stone-600 max-w-[540px] mb-7">
              Real studio voices. Real background music. Real templates for real moments — out of office, after hours, holiday closures, the call you didn&apos;t pick up. Free, forever.
            </p>

            <div className="flex flex-wrap gap-2 mb-10">
              {TRUST_PILLS.map((t) => (
                <Pill key={t}>{t}</Pill>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#workspace"
                className="inline-flex items-center gap-2 bg-accent text-white px-7 py-4 rounded-full text-base font-semibold border-2 border-ink shadow-ink hover:shadow-ink-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
                Make my greeting <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </a>
              <a href="#templates" className="inline-flex items-center gap-2 bg-white text-ink px-6 py-3.5 rounded-full text-[15px] font-medium border-2 border-ink hover:bg-cream-50 transition-colors">
                Browse templates
              </a>
            </div>
            <p className="font-serif italic text-stone-500 text-[15px] mt-4">~60 seconds, swear.</p>
          </div>

          {/* Sticker stack */}
          <div className="relative h-[500px] hidden lg:block" aria-hidden>
            <div className="absolute top-0 right-5 w-[280px] bg-white border-2 border-ink rounded-2xl p-5 shadow-ink-lg rotate-[3deg]">
              <span className="absolute -top-2.5 left-[30%] w-16 h-5 bg-accent/50 -rotate-[4deg] rounded-sm" />
              <div className="flex items-center gap-2.5 mb-3.5">
                <div className="w-8 h-8 rounded-lg bg-accent-warm" />
                <div>
                  <div className="font-serif font-bold text-[17px] leading-none">Sarah · American</div>
                  <div className="text-[11px] text-stone-500 mt-1">studio voice · sonic-3.5</div>
                </div>
              </div>
              <p className="text-[13px] leading-snug">&quot;Thank you for calling. I apologize for missing your call. I&apos;m busy right now…&quot;</p>
              <div className="flex items-end gap-[3px] h-7 mt-3">
                {[30, 60, 80, 45, 90, 50, 70, 40, 65, 55, 80, 35, 75, 60].map((h, i) => (
                  <div key={i} className="flex-1 bg-ink rounded-sm" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
            <div className="absolute top-[150px] left-0 w-[240px] bg-white border-2 border-ink rounded-2xl p-5 shadow-ink-lg -rotate-[4deg]">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-accent" />
                <div>
                  <div className="font-serif font-bold text-[17px] leading-none">Lofi morning</div>
                  <div className="text-[11px] text-stone-500 mt-1">background · 15%</div>
                </div>
              </div>
              <p className="font-serif italic text-[14px]">&quot;Adds warmth without distracting from the message.&quot;</p>
            </div>
            <div className="absolute top-[310px] right-10 w-[300px] bg-white border-2 border-ink rounded-2xl p-5 shadow-ink-lg rotate-[2deg]">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-accent-forest" />
                <div>
                  <div className="font-serif font-bold text-[17px] leading-none">Ready in 47 seconds</div>
                  <div className="text-[11px] text-stone-500 mt-1">no signup · no card</div>
                </div>
              </div>
              <p className="text-[13px] leading-snug">Tap Generate. Listen. Download MP3. Upload to your phone system. You&apos;re done.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Workspace */}
      <section className="w-full max-w-[1200px] mx-auto px-4 md:px-6 py-12" id="workspace">
        <div className="bg-white border-[2.5px] border-ink rounded-3xl shadow-ink-xl overflow-hidden">
          <div className="px-6 sm:px-8 py-4 border-b-2 border-ink bg-cream-200 flex items-center justify-between">
            <span className="font-serif font-semibold text-[20px]">Your greeting</span>
            <span className="bg-ink text-cream-100 px-3 py-1 rounded-full text-xs font-medium">Live workspace</span>
          </div>
          <div className="p-2 sm:p-4">{children}</div>
        </div>
      </section>

      {/* Why-free */}
      <section className="w-full max-w-[1200px] mx-auto px-4 md:px-6 py-16">
        <div className="bg-white border-[2.5px] border-ink rounded-3xl shadow-ink-xl p-8 md:p-12 grid md:grid-cols-[1fr_1.2fr] gap-10 md:gap-12 items-center">
          <div>
            <Stamp className="mb-5">A short note from the maker</Stamp>
            <h2 className="font-serif text-[36px] md:text-[40px] leading-[1.05] tracking-[-0.02em] font-semibold mb-4">It&apos;s free because of a clever trick, not a sustainability sin.</h2>
            <p className="text-stone-600 text-[16px] leading-relaxed">
              Voice generation costs real money. Instead of charging you, we ask each person to bring their own Cartesia API key. Every new account gets 1,000 free credits — about 20 minutes of audio
              — enough for years of personal use.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { n: 1, b: "Sign up at cartesia.ai.", t: "Free, no credit card, takes 30 seconds." },
              { n: 2, b: "Copy your API key", t: "from the dashboard." },
              { n: 3, b: "Paste it once.", t: "Stored only in your browser, never on our servers." },
              { n: 4, b: "Generate.", t: "Yours forever." },
            ].map((s) => (
              <div key={s.n} className="flex items-start gap-4 p-4 bg-cream-100 border-2 border-ink rounded-2xl">
                <span className="font-serif text-[26px] font-bold text-accent leading-none flex-shrink-0 w-7">{s.n}</span>
                <p className="text-[14.5px] leading-snug pt-1">
                  <b className="font-semibold">{s.b}</b> {s.t}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="w-full max-w-[1200px] mx-auto px-4 md:px-6 py-16">
        <div className="text-center mb-12">
          <Stamp className="mb-4">What&apos;s inside</Stamp>
          <h2 className="font-serif text-[clamp(34px,5vw,52px)] leading-[1.05] tracking-[-0.025em] font-semibold mb-3 text-balance">Everything a paid tool gives you. None of the bill.</h2>
          <p className="text-stone-600 text-[17px] max-w-[520px] mx-auto">Built for the moment you need a greeting that doesn&apos;t sound like a 2009 robocall.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { Icon: Mic2, bg: "bg-accent-warm", t: "Studio voices", p: "Cartesia Sonic 3.5 — the engine production apps run on. American, British, Australian, Indian accents." },
            { Icon: Music4, bg: "bg-accent", t: "56 music tracks", p: "Royalty-free, ready to mix. Corporate, lofi, jazz, piano, ukulele. Preview before you pick." },
            { Icon: FileText, bg: "bg-accent-forest", t: "Templates that fit", p: "Out of office. After hours. Medical. Holiday closure. Tweak the [brackets], you've got a script." },
          ].map(({ Icon, bg, t, p }) => (
            <div key={t} className="bg-white border-[2.5px] border-ink rounded-2xl p-7 shadow-ink-lg">
              <div className={`w-12 h-12 rounded-xl ${bg} border-2 border-ink grid place-items-center mb-5`}>
                <Icon className="w-5 h-5 text-ink" strokeWidth={2} />
              </div>
              <h3 className="font-serif text-[22px] font-semibold tracking-[-0.01em] mb-2">{t}</h3>
              <p className="text-stone-600 text-[14.5px] leading-relaxed">{p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Templates */}
      <section className="w-full max-w-[1200px] mx-auto px-4 md:px-6 py-16" id="templates">
        <div className="text-center mb-12">
          <Stamp className="mb-4">Ten to start</Stamp>
          <h2 className="font-serif text-[clamp(34px,5vw,52px)] leading-[1.05] tracking-[-0.025em] font-semibold mb-3 text-balance">Start from a script that already works.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {CONSTANTS.GREETING_TEMPLATES.filter((t) => (FEATURED_TEMPLATES as readonly string[]).includes(t.title)).map((tpl, i) => (
            <button
              key={tpl.title}
              type="button"
              onClick={() => loadTemplate(tpl.text)}
              className={`text-left bg-white border-2 border-ink rounded-2xl p-5 hover:shadow-ink hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer ${i % 2 === 0 ? "-rotate-[0.5deg]" : "rotate-[0.5deg]"} hover:rotate-0`}>
              <span className="inline-block bg-ink text-cream-100 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider mb-2.5">{tpl.category}</span>
              <h4 className="font-serif text-[18px] font-semibold mb-1.5">{tpl.title.replace(/^[A-Za-z]+ - /, "")}</h4>
              <p className="text-[13.5px] text-stone-600 leading-snug line-clamp-3">{tpl.text}</p>
            </button>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full max-w-[1200px] mx-auto px-4 md:px-6 py-16" id="faq">
        <div className="text-center mb-12">
          <Stamp className="mb-4">Questions</Stamp>
          <h2 className="font-serif text-[clamp(34px,5vw,52px)] leading-[1.05] tracking-[-0.025em] font-semibold mb-3">Quick answers.</h2>
        </div>
        <div className="max-w-[760px] mx-auto flex flex-col gap-2.5">
          {FAQ.map((item) => (
            <details key={item.q} className="group bg-white border-2 border-ink rounded-2xl px-6 py-5 open:shadow-ink transition-all">
              <summary className="font-serif font-semibold text-[19px] flex justify-between items-center cursor-pointer list-none">
                {item.q}
                <span className="font-mono text-accent text-xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-stone-600 text-[14.5px] leading-relaxed mt-3">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full max-w-[1200px] mx-auto px-4 md:px-6 py-16" id="contact">
        <div className="bg-ink text-cream-100 rounded-3xl px-8 sm:px-12 py-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(800px_300px_at_50%_-10%,rgba(245,166,35,0.25),transparent_60%)]" aria-hidden />
          <div className="relative">
            <h2 className="font-serif text-[clamp(32px,4.5vw,48px)] leading-[1.05] tracking-[-0.025em] font-semibold mb-3">Make your greeting. It takes about a minute.</h2>
            <p className="text-cream-200/80 text-[17px] mb-7">Real voices. Real music. Real free.</p>
            <a
              href="#workspace"
              className="inline-flex items-center gap-2 bg-accent-warm text-ink px-7 py-4 rounded-full text-base font-semibold hover:-translate-y-0.5 transition-transform shadow-[0_8px_24px_rgba(245,166,35,0.3)]">
              Open workspace <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </a>
          </div>
        </div>
      </section>

      {/* Open source — star + buy me a coffee */}
      <section className="w-full max-w-[1200px] mx-auto px-4 md:px-6 pb-16">
        <div className="bg-white border-[2.5px] border-ink rounded-3xl shadow-ink-xl p-8 md:p-12 grid md:grid-cols-[1fr_auto] gap-8 md:gap-10 items-center">
          <div>
            <span className="inline-flex items-center gap-2 bg-ink text-cream-100 px-3.5 py-1.5 rounded-full text-xs font-medium -rotate-2 mb-4">
              <Heart className="w-3.5 h-3.5 text-accent" fill="currentColor" /> 100% open source · {SITE.openSource.license}
            </span>
            <h2 className="font-serif text-[28px] md:text-[36px] leading-[1.05] tracking-[-0.02em] font-semibold mb-3 text-ink">The whole thing is on GitHub.</h2>
            <p className="text-stone-600 text-[15.5px] leading-relaxed max-w-[520px]">
              Code, design system, audit trail, even the embarrassing dev notes — all public under MIT. If Perfect Greet saved you a SaaS subscription, the best thanks is a GitHub star. A coffee works too.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:flex-col md:gap-3 md:min-w-[220px]">
            <a
              href={SITE.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 bg-ink text-cream-100 px-6 py-3.5 rounded-full text-[15px] font-semibold border-2 border-ink shadow-ink hover:shadow-ink-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
              <Github className="w-4 h-4" />
              Star on GitHub
              <Star className="w-3.5 h-3.5 ml-0.5 text-accent-warm group-hover:fill-accent-warm transition-all" />
            </a>
            <a
              href={SITE.socials.buyMeACoffee}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-accent-warm text-ink px-6 py-3.5 rounded-full text-[15px] font-semibold border-2 border-ink shadow-ink hover:shadow-ink-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
              <Coffee className="w-4 h-4" />
              Buy me a coffee
            </a>
          </div>
        </div>
      </section>
    </BaseLayout>
  )
}
