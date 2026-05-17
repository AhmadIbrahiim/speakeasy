import { Metadata } from "next"
import BaseLayout from "@/components/baseLayout"
import { SITE } from "@/config/site"
import { ShieldCheck } from "lucide-react"

export const metadata: Metadata = {
  title: `Privacy Policy | ${SITE.name}`,
  description: "Read our privacy policy to understand how we collect, use, and protect your data when you use our free voicemail greeting service.",
  alternates: {
    canonical: `${SITE.url}/privacy-policy`,
  },
  openGraph: {
    title: `Privacy Policy | ${SITE.name}`,
    description: "Read our privacy policy to understand how we collect, use, and protect your data when you use our free voicemail greeting service.",
    url: `${SITE.url}/privacy-policy`,
  },
}

export default function PrivacyPolicy() {
  return (
    <BaseLayout>
      <section className="w-full max-w-[760px] mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-8">
        <span className="inline-flex items-center gap-2 bg-ink text-cream-100 px-3.5 py-1.5 rounded-full text-xs font-medium -rotate-2 mb-5">
          <ShieldCheck className="w-3.5 h-3.5 text-accent-warm" /> Legal
        </span>
        <h1 className="font-serif text-[clamp(34px,5vw,52px)] leading-[1.05] tracking-[-0.03em] font-semibold text-ink text-balance mb-4">Privacy policy.</h1>
        <p className="text-[18px] leading-relaxed text-stone-600">The short version: we collect as little as possible. The long version is below.</p>
      </section>

      <article className="w-full max-w-[760px] mx-auto px-4 md:px-6 pb-16">
        <div className="bg-white border-2 border-ink rounded-2xl shadow-ink-lg p-6 sm:p-8 space-y-8 text-[15px] leading-relaxed text-stone-600">
          <section>
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold tracking-[-0.015em] text-ink mb-3">Introduction</h2>
            <p className="mb-3">
              At {SITE.name}, we respect your privacy and are committed to protecting your personal data. This Privacy Policy will inform you about how we look after your personal data when you visit
              our website and tell you about your privacy rights and how the law protects you.
            </p>
            <p>Our voicemail greeting generator service is designed to operate with minimal data collection. We prioritize your privacy while providing you with a high-quality service.</p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold tracking-[-0.015em] text-ink mb-3">Information we collect</h2>
            <p className="mb-3"><strong className="text-ink font-semibold">When you use our service:</strong></p>
            <ul className="list-disc pl-6 mb-3 space-y-1.5 marker:text-accent">
              <li>Text content that you input for your voicemail greeting</li>
              <li>Voice selection preferences</li>
              <li>Background music preferences</li>
              <li>Basic usage analytics to improve our service</li>
            </ul>
            <p>We do not require you to create an account or provide personal details such as name, email, or payment information to use our core service.</p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold tracking-[-0.015em] text-ink mb-3">How we use your information</h2>
            <p className="mb-3">The information you provide is used solely for:</p>
            <ul className="list-disc pl-6 mb-3 space-y-1.5 marker:text-accent">
              <li>Generating your voicemail greeting audio file</li>
              <li>Improving the quality and functionality of our service</li>
              <li>Diagnosing technical issues and optimizing performance</li>
            </ul>
            <p>We do not sell, rent, or share your information with third parties for marketing purposes.</p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold tracking-[-0.015em] text-ink mb-3">Cookies and analytics</h2>
            <p className="mb-3">
              Our website uses cookies to enhance your experience and collect anonymous usage data. This helps us understand how visitors interact with our site and identify areas for improvement.
            </p>
            <p>You can control cookie settings through your browser preferences. Disabling cookies may impact the functionality of certain features on our site.</p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold tracking-[-0.015em] text-ink mb-3">Data security</h2>
            <p>
              We implement appropriate security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. Your text inputs are processed and then discarded
              after the audio file generation is complete, unless you explicitly choose to save your templates.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold tracking-[-0.015em] text-ink mb-3">Changes to this policy</h2>
            <p>
              We may update our Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this Privacy Policy periodically to
              stay informed about how we are protecting your information.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-[22px] sm:text-[24px] font-semibold tracking-[-0.015em] text-ink mb-3">Contact us</h2>
            <p>
              If you have any questions about this Privacy Policy or our data practices, please contact us at{" "}
              <a
                href={`mailto:${SITE.supportEmail}`}
                className="text-accent border-b border-accent/30 hover:border-accent transition-colors">
                {SITE.supportEmail}
              </a>
              .
            </p>
          </section>

          <p className="text-[12px] font-mono text-stone-500 pt-2">Last updated: May 20, 2023</p>
        </div>
      </article>
    </BaseLayout>
  )
}
