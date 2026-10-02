import Link from "next/link"
import BaseLayout from "@/components/baseLayout"
import CONSTANTS from "@/app/config/constants"
import { FAQJsonLd } from "@/components/JsonLd"
import { ArrowRight } from "lucide-react"
import type { SeoPage as Page } from "@/content/pages"

export default function SeoPage({ page }: { page: Page }) {
  const templates = CONSTANTS.GREETING_TEMPLATES.filter((t) => !page.templateCategories || page.templateCategories.includes(t.category))
  return (
    <BaseLayout>
      <FAQJsonLd questions={page.faq} />
      <article className="w-full max-w-[760px] mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-16">
        <h1 className="font-serif text-[clamp(34px,5vw,52px)] leading-[1.05] tracking-[-0.03em] font-semibold text-ink text-balance mb-4">{page.h1}</h1>
        <p className="text-[18px] leading-relaxed text-stone-600 mb-6">{page.answer}</p>
        <Link
          href="/#workspace"
          className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3.5 rounded-full text-[15px] font-semibold border-2 border-ink shadow-ink hover:shadow-ink-lg transition-all mb-10">
          Open the free generator <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
        </Link>

        {page.sections.map((s) => (
          <section key={s.id} id={s.id} className="mb-10">
            <h2 className="font-serif text-[26px] font-semibold tracking-[-0.02em] text-ink mb-3">{s.h2}</h2>
            {s.body.map((p) => (
              <p key={p} className="text-[16px] leading-relaxed text-stone-600 mb-3">
                {p}
              </p>
            ))}
          </section>
        ))}

        {page.templatesId && (
          <section id={page.templatesId} className="mb-10">
            <h2 className="font-serif text-[26px] font-semibold tracking-[-0.02em] text-ink mb-4">{page.templatesH2}</h2>
            <div className="space-y-3">
              {templates.map((t) => (
                <div key={t.title} className="bg-white border-2 border-ink rounded-2xl p-5">
                  <h3 className="font-serif text-[18px] font-semibold mb-1.5">{t.title}</h3>
                  <p className="text-[15px] leading-relaxed text-stone-600">{t.text}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section id="faq" className="mb-10">
          <h2 className="font-serif text-[26px] font-semibold tracking-[-0.02em] text-ink mb-4">Questions</h2>
          {page.faq.map((f) => (
            <div key={f.question} className="mb-4">
              <h3 className="font-serif text-[18px] font-semibold text-ink mb-1">{f.question}</h3>
              <p className="text-[15px] leading-relaxed text-stone-600">{f.answer}</p>
            </div>
          ))}
        </section>

        <nav aria-label="More greeting guides" className="text-[15px] text-stone-600">
          More: <Link className="underline" href="/voicemail-greetings">templates</Link>, <Link className="underline" href="/voicemail-greeting-mp3">MP3 download</Link>,{" "}
          <Link className="underline" href="/business-voicemail-greetings">business greetings</Link>, <Link className="underline" href="/faq">FAQ</Link>.
        </nav>
      </article>
    </BaseLayout>
  )
}
