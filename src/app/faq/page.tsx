import { Metadata } from "next"
import BaseLayout from "@/components/baseLayout"
import { FAQJsonLd } from "@/components/JsonLd"
import { SITE } from "@/config/site"
import { HelpCircle, Plus } from "lucide-react"

export const metadata: Metadata = {
  title: "Voicemail Greeting FAQs: Free, MP3, Your Own Voice",
  description: "Answers about making, downloading and using Speakeasy voicemail greetings, including whether it records your own voice.",
  alternates: {
    canonical: `${SITE.url}/faq`,
  },
  openGraph: {
    title: "Voicemail Greeting FAQs",
    description: "Answers about making, downloading and using Speakeasy voicemail greetings.",
    url: `${SITE.url}/faq`,
  },
}

const faqData = [
  {
    question: "Is Speakeasy completely free to use?",
    answer: "Yes, Speakeasy is free and open source. There is no account on this site, no credit card, and no personal information needed. Voice generation uses your own free Cartesia API key, which is stored only in your browser.",
  },
  {
    question: "Does Speakeasy record my voice? Is it a voicemail recorder?",
    answer: "No. Speakeasy generates speech from typed text using an AI voice and does not use your microphone. If you need a recording of your own voice, use a voice recorder app, then upload that file to your phone system.",
  },
  {
    question: "How long can my voicemail greeting be?",
    answer: "For optimal voicemail greetings, we recommend keeping your message between 20-30 seconds. This is long enough to provide necessary information without causing callers to lose interest.",
  },
  {
    question: "What voice options are available?",
    answer:
      "Speakeasy offers a variety of AI voices with different accents, tones, and speaking styles. You can choose from professional, friendly, or formal voice options to match your brand or personal preference.",
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

      <section className="w-full max-w-[760px] mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-8">
        <span className="inline-flex items-center gap-2 bg-ink text-cream-100 px-3.5 py-1.5 rounded-full text-xs font-medium -rotate-2 mb-5">
          <HelpCircle className="w-3.5 h-3.5 text-accent-warm" /> {faqData.length} questions
        </span>
        <h1 id="record-your-voice" className="font-serif text-[clamp(34px,5vw,52px)] leading-[1.05] tracking-[-0.03em] font-semibold text-ink text-balance mb-4">Voicemail greeting FAQs.</h1>
        <p className="text-[18px] leading-relaxed text-stone-600">Straight answers about the tool: what it costs, what it sounds like, and how to get the file onto your phone.</p>
      </section>

      <section className="w-full max-w-[760px] mx-auto px-4 md:px-6 pb-16">
        <div className="space-y-3">
          {faqData.map((faq, index) => (
            <details key={index} className="group bg-white border-2 border-ink rounded-2xl shadow-ink-lg overflow-hidden">
              <summary className="flex items-center justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 cursor-pointer list-none select-none">
                <h2 className="font-serif text-[17px] sm:text-[19px] font-semibold tracking-[-0.01em] text-ink leading-snug">{faq.question}</h2>
                <Plus className="w-5 h-5 shrink-0 text-accent transition-transform duration-200 group-open:rotate-45" strokeWidth={2.5} aria-hidden />
              </summary>
              <div className="px-5 sm:px-6 pb-5 sm:pb-6 -mt-1 text-[15px] leading-relaxed text-stone-600">{faq.answer}</div>
            </details>
          ))}
        </div>
      </section>
    </BaseLayout>
  )
}
