import { Metadata } from "next"
import BaseLayout from "@/components/baseLayout"

export const metadata: Metadata = {
  title: "Terms of Service | Perfect Greet",
  description: "Read our terms of service to understand the rules and guidelines for using our free voicemail greeting service.",
  alternates: {
    canonical: "https://www.perfectgreet.site/terms",
  },
  openGraph: {
    title: "Terms of Service | Perfect Greet",
    description: "Read our terms of service to understand the rules and guidelines for using our free voicemail greeting service.",
    url: "https://www.perfectgreet.site/terms",
  },
}

export default function TermsOfService() {
  return (
    <BaseLayout>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-3">Welcome to Perfect Greet</h2>
            <p className="mb-4">
              By accessing or using our website and services, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Service Description</h2>
            <p className="mb-4">
              Perfect Greet provides a free online service that allows users to create customized voicemail greetings and on-hold messages using AI-generated voices and background music. The service
              is provided without requiring user registration or payment information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">User Responsibilities</h2>
            <p className="mb-4">Users of Perfect Greet agree to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Use the service in compliance with all applicable laws and regulations</li>
              <li>Not create content that is illegal, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable</li>
              <li>Not attempt to circumvent, disable, or interfere with the proper functioning of the service</li>
              <li>Not use the service for any commercial purpose without explicit permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Intellectual Property</h2>
            <p className="mb-4">
              The content generated through our service is licensed to users for personal use. Users retain ownership of the text content they provide, but Perfect Greet retains ownership of the
              underlying technology, voice synthesis, and music samples used in the service.
            </p>
            <p>
              Users may use the generated audio files for their personal or business voicemail systems, but may not resell, redistribute, or claim ownership of the voice synthesis or music components.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Limitation of Liability</h2>
            <p className="mb-4">
              Perfect Greet provides this service on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. We make no warranties, expressed or implied, regarding the reliability, availability,
              or suitability of the service.
            </p>
            <p>We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Service Modifications</h2>
            <p>
              We reserve the right to modify or discontinue the service at any time without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance
              of the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Governing Law</h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Changes to Terms</h2>
            <p>We reserve the right to update or change these Terms at any time. Continued use of the service after such changes constitutes your acceptance of the new Terms.</p>
          </section>

          <p className="text-sm text-gray-600 mt-8">Last updated: May 20, 2023</p>
        </div>
      </div>
    </BaseLayout>
  )
}
