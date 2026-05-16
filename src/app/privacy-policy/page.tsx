import { Metadata } from "next"
import BaseLayout from "@/components/baseLayout"
import { SITE } from "@/config/site"

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
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">Introduction</h2>
            <p className="mb-4">
              At Perfect Greet, we respect your privacy and are committed to protecting your personal data. This Privacy Policy will inform you about how we look after your personal data when you
              visit our website and tell you about your privacy rights and how the law protects you.
            </p>
            <p>Our voicemail greeting generator service is designed to operate with minimal data collection. We prioritize your privacy while providing you with a high-quality service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Information We Collect</h2>
            <p className="mb-4">
              <strong>When you use our service:</strong>
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Text content that you input for your voicemail greeting</li>
              <li>Voice selection preferences</li>
              <li>Background music preferences</li>
              <li>Basic usage analytics to improve our service</li>
            </ul>
            <p>We do not require you to create an account or provide personal details such as name, email, or payment information to use our core service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">How We Use Your Information</h2>
            <p className="mb-4">The information you provide is used solely for:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Generating your voicemail greeting audio file</li>
              <li>Improving the quality and functionality of our service</li>
              <li>Diagnosing technical issues and optimizing performance</li>
            </ul>
            <p>We do not sell, rent, or share your information with third parties for marketing purposes.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Cookies and Analytics</h2>
            <p className="mb-4">
              Our website uses cookies to enhance your experience and collect anonymous usage data. This helps us understand how visitors interact with our site and identify areas for improvement.
            </p>
            <p>You can control cookie settings through your browser preferences. Disabling cookies may impact the functionality of certain features on our site.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Data Security</h2>
            <p>
              We implement appropriate security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. Your text inputs are processed and then discarded
              after the audio file generation is complete, unless you explicitly choose to save your templates.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this Privacy Policy periodically to
              stay informed about how we are protecting your information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
            <p>If you have any questions about this Privacy Policy or our data practices, please contact us at {SITE.supportEmail}.</p>
          </section>

          <p className="text-sm text-gray-600 mt-8">Last updated: May 20, 2023</p>
        </div>
      </div>
    </BaseLayout>
  )
}
