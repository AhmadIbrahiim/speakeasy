import { Metadata } from "next"
import BaseLayout from "@/components/baseLayout"
import { SITE } from "@/config/site"
import { FileText } from "lucide-react"

export const metadata: Metadata = {
  title: `Terms of Service | ${SITE.name}`,
  description: "Read our terms of service to understand the rules and guidelines for using our free voicemail greeting service.",
  alternates: {
    canonical: `${SITE.url}/terms`,
  },
  openGraph: {
    title: `Terms of Service | ${SITE.name}`,
    description: "Read our terms of service to understand the rules and guidelines for using our free voicemail greeting service.",
    url: `${SITE.url}/terms`,
  },
}

export default function TermsOfService() {
  return (
    <BaseLayout>
      <section className="w-full max-w-[760px] mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-8">
        <span className="inline-flex items-center gap-2 bg-ink text-cream-100 px-3.5 py-1.5 rounded-full text-xs font-medium -rotate-2 mb-5">
          <FileText className="w-3.5 h-3.5 text-accent-warm" /> Legal
        </span>
        <h1 className="font-serif text-[clamp(34px,5vw,52px)] leading-[1.05] tracking-[-0.03em] font-semibold text-ink text-balance mb-4">Terms of service.</h1>
        <p className="text-[18px] leading-relaxed text-stone-600">The rules of the road for using {SITE.name}. Plain language where we can manage it.</p>
      </section>

      <article className="w-full max-w-[760px] mx-auto px-4 md:px-6 pb-16">
        <div className="bg-white border-2 border-ink rounded-2xl shadow-ink-lg p-6 sm:p-8 space-y-8 text-[15px] leading-relaxed text-stone-600">
          <section>
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold tracking-[-0.015em] text-ink mb-3">Welcome to {SITE.name}</h2>
            <p>
              By accessing or using our website and services, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold tracking-[-0.015em] text-ink mb-3">Service description</h2>
            <p>
              {SITE.name} provides a free online service that allows users to create customized voicemail greetings and on-hold messages using AI-generated voices and background music. The service
              is provided without requiring user registration or payment information.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold tracking-[-0.015em] text-ink mb-3">User responsibilities</h2>
            <p className="mb-3">Users of {SITE.name} agree to:</p>
            <ul className="list-disc pl-6 space-y-1.5 marker:text-accent">
              <li>Use the service in compliance with all applicable laws and regulations</li>
              <li>Not create content that is illegal, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable</li>
              <li>Not attempt to circumvent, disable, or interfere with the proper functioning of the service</li>
              <li>Not use the service for any commercial purpose without explicit permission</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold tracking-[-0.015em] text-ink mb-3">Intellectual property</h2>
            <p className="mb-3">
              The content generated through our service is licensed to users for personal use. Users retain ownership of the text content they provide, but {SITE.name} retains ownership of the
              underlying technology, voice synthesis, and music samples used in the service.
            </p>
            <p>
              Users may use the generated audio files for their personal or business voicemail systems, but may not resell, redistribute, or claim ownership of the voice synthesis or music components.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold tracking-[-0.015em] text-ink mb-3">Limitation of liability</h2>
            <p className="mb-3">
              {SITE.name} provides this service on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. We make no warranties, expressed or implied, regarding the reliability, availability,
              or suitability of the service.
            </p>
            <p>We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.</p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold tracking-[-0.015em] text-ink mb-3">Service modifications</h2>
            <p>
              We reserve the right to modify or discontinue the service at any time without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance
              of the service.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold tracking-[-0.015em] text-ink mb-3">Governing law</h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.</p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold tracking-[-0.015em] text-ink mb-3">Changes to terms</h2>
            <p>We reserve the right to update or change these Terms at any time. Continued use of the service after such changes constitutes your acceptance of the new Terms.</p>
          </section>

          <p className="text-[12px] font-mono text-stone-500 pt-2">Last updated: May 20, 2023</p>
        </div>
      </article>
    </BaseLayout>
  )
}
