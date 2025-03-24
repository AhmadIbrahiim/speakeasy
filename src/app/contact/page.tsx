import { Metadata } from "next"
import BaseLayout from "@/components/baseLayout"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Contact Us | Perfect Greet",
  description: "Get in touch with our team for questions, feedback, or support with your voicemail greeting needs.",
  alternates: {
    canonical: "https://www.perfectgreet.site/contact",
  },
  openGraph: {
    title: "Contact Us | Perfect Greet",
    description: "Get in touch with our team for questions, feedback, or support with your voicemail greeting needs.",
    url: "https://www.perfectgreet.site/contact",
  },
}

export default function Contact() {
  return (
    <BaseLayout>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>

        <div className="space-y-8">
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
            <p className="mb-6">
              We&apos;d love to hear from you! Whether you have a question about our voicemail greeting service, need help with using our features, or want to provide feedback, our team is here to
              help.
            </p>

            <div className="space-y-4">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-700 mt-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-gray-600">support@perfectgreet.site</p>
                </div>
              </div>

              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-700 mt-1" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h3 className="font-medium">Support Hours</h3>
                  <p className="text-gray-600">Monday-Friday: 9AM-5PM EST</p>
                </div>
              </div>

              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-700 mt-1" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h3 className="font-medium">Social Media</h3>
                  <div className="flex space-x-3 mt-1">
                    <a href="https://twitter.com/perfectgreet" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-600 hover:text-gray-900">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                      </svg>
                    </a>
                    <a href="https://facebook.com/perfectgreet" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-600 hover:text-gray-900">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
            <p className="mb-4">
              Looking for quick answers? Check out our{" "}
              <Link href="/faq" className="text-blue-600 hover:underline">
                FAQ page
              </Link>{" "}
              for common questions about our service.
            </p>
          </section>
        </div>
      </div>
    </BaseLayout>
  )
}
