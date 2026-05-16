import { Metadata } from "next"
import BaseLayout from "@/components/baseLayout"
import { FAQJsonLd } from "@/components/JsonLd"
import { SITE } from "@/config/site"

export const metadata: Metadata = {
  title: `Frequently Asked Questions | ${SITE.name}`,
  description: "Find answers to common questions about voicemail greetings, our service, and how to create the perfect greeting for your needs.",
  alternates: {
    canonical: `${SITE.url}/faq`,
  },
  openGraph: {
    title: `FAQ | ${SITE.name}`,
    description: "Find answers to common questions about voicemail greetings, our service, and how to create the perfect greeting for your needs.",
    url: `${SITE.url}/faq`,
  },
}

const faqData = [
  {
    question: "Is Perfect Greet completely free to use?",
    answer: "Yes, Perfect Greet is completely free to use. We don't require a credit card, registration, or any personal information to generate and download your professional voicemail greeting.",
  },
  {
    question: "How long can my voicemail greeting be?",
    answer: "For optimal voicemail greetings, we recommend keeping your message between 20-30 seconds. This is long enough to provide necessary information without causing callers to lose interest.",
  },
  {
    question: "What voice options are available?",
    answer:
      "Perfect Greet offers a variety of AI voices with different accents, tones, and speaking styles. You can choose from professional, friendly, or formal voice options to match your brand or personal preference.",
  },
  {
    question: "Can I add background music to my greeting?",
    answer: "Yes, you can add background music to your greeting. We offer several professional background tracks that can be mixed with your voicemail message at an appropriate volume level.",
  },
  {
    question: "How do I save my voicemail greeting?",
    answer:
      "Once you're satisfied with your voicemail greeting, simply click the 'Generate' button. Your greeting will be processed, and you'll be able to download it as an audio file that can be used with virtually any voicemail system.",
  },
  {
    question: "Can I edit my greeting after generating it?",
    answer:
      "Yes, you can make changes to your text, voice selection, or background music and generate a new greeting at any time. Since no account is required, you can create multiple versions until you find the perfect one.",
  },
  {
    question: "What format is the audio file?",
    answer: "The voicemail greeting is provided as an MP3 file, which is compatible with most phone systems and voicemail services.",
  },
  {
    question: "How do I set the greeting on my phone?",
    answer:
      "After downloading your greeting, you'll need to follow your specific phone system's instructions for setting a custom voicemail greeting. This typically involves accessing your voicemail settings and uploading or recording the new greeting.",
  },
]

export default function FAQPage() {
  return (
    <BaseLayout>
      <FAQJsonLd questions={faqData} />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h1>

        <div className="space-y-6">
          {faqData.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-3">{faq.question}</h2>
              <p className="text-gray-700">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </BaseLayout>
  )
}
