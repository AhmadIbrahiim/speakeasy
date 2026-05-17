import { Metadata } from "next"
import BaseLayout from "@/components/baseLayout"
import Link from "next/link"
import { SITE } from "@/config/site"
import { Mail, Clock, MessageCircle, ArrowRight, Twitter, Facebook, Github } from "lucide-react"

export const metadata: Metadata = {
  title: `Contact Us | ${SITE.name}`,
  description: "Get in touch with our team for questions, feedback, or support with your voicemail greeting needs.",
  alternates: {
    canonical: `${SITE.url}/contact`,
  },
  openGraph: {
    title: `Contact Us | ${SITE.name}`,
    description: "Get in touch with our team for questions, feedback, or support with your voicemail greeting needs.",
    url: `${SITE.url}/contact`,
  },
}

export default function Contact() {
  return (
    <BaseLayout>
      <section className="w-full max-w-[760px] mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-8">
        <span className="inline-flex items-center gap-2 bg-ink text-cream-100 px-3.5 py-1.5 rounded-full text-xs font-medium -rotate-2 mb-5">
          <MessageCircle className="w-3.5 h-3.5 text-accent-warm" /> Get in touch
        </span>
        <h1 className="font-serif text-[clamp(34px,5vw,52px)] leading-[1.05] tracking-[-0.03em] font-semibold text-ink text-balance mb-4">Say hi.</h1>
        <p className="text-[18px] leading-relaxed text-stone-600">Questions, bug reports, feature ideas, or just want to say the tool worked? All welcome.</p>
      </section>

      <section className="w-full max-w-[760px] mx-auto px-4 md:px-6 pb-10">
        <div className="bg-white border-2 border-ink rounded-2xl shadow-ink-lg p-6 sm:p-8">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <span className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-xl bg-cream-200 border-2 border-ink">
                <Mail className="w-4 h-4 text-ink" strokeWidth={2.2} />
              </span>
              <div>
                <h2 className="font-serif text-[18px] font-semibold tracking-[-0.01em] text-ink mb-1">Email</h2>
                <a
                  href={`mailto:${SITE.supportEmail}`}
                  className="text-[15px] text-accent border-b border-accent/30 hover:border-accent transition-colors">
                  {SITE.supportEmail}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-xl bg-cream-200 border-2 border-ink">
                <Clock className="w-4 h-4 text-ink" strokeWidth={2.2} />
              </span>
              <div>
                <h2 className="font-serif text-[18px] font-semibold tracking-[-0.01em] text-ink mb-1">Reply window</h2>
                <p className="text-[15px] leading-relaxed text-stone-600">Usually within a business day. This is a side project, so weekends may slip.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-xl bg-cream-200 border-2 border-ink">
                <Github className="w-4 h-4 text-ink" strokeWidth={2.2} />
              </span>
              <div>
                <h2 className="font-serif text-[18px] font-semibold tracking-[-0.01em] text-ink mb-2">Social</h2>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={SITE.socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-white text-ink border-2 border-ink rounded-full px-3 py-1.5 text-[12px] font-semibold hover:shadow-ink hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
                    <Github className="w-3.5 h-3.5" /> GitHub
                  </a>
                  <a
                    href={SITE.socials.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-white text-ink border-2 border-ink rounded-full px-3 py-1.5 text-[12px] font-semibold hover:shadow-ink hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
                    <Twitter className="w-3.5 h-3.5" /> Twitter
                  </a>
                  <a
                    href={SITE.socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-white text-ink border-2 border-ink rounded-full px-3 py-1.5 text-[12px] font-semibold hover:shadow-ink hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
                    <Facebook className="w-3.5 h-3.5" /> Facebook
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full max-w-[760px] mx-auto px-4 md:px-6 pb-16">
        <div className="bg-cream-200 border-2 border-ink rounded-2xl px-6 sm:px-8 py-6 sm:py-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="font-serif text-[20px] sm:text-[22px] font-semibold tracking-[-0.015em] text-ink mb-1">Looking for quick answers?</h2>
            <p className="text-[14px] text-stone-600">The FAQ covers the common stuff: pricing, voice options, file format.</p>
          </div>
          <Link
            href="/faq"
            className="inline-flex items-center justify-center gap-2 bg-white text-ink px-5 py-2.5 rounded-full text-[14px] font-semibold border-2 border-ink shadow-ink hover:shadow-ink-lg hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all whitespace-nowrap">
            Read the FAQ <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
          </Link>
        </div>
      </section>
    </BaseLayout>
  )
}
