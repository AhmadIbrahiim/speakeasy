export type Section = { id: string; h2: string; body: string[] }
export type SeoPage = {
  path: string
  title: string
  description: string
  h1: string
  answer: string
  sections: Section[]
  templateCategories?: string[]
  templatesId?: string
  templatesH2?: string
  faq: { question: string; answer: string }[]
}

// What the tool can honestly do; every page repeats these limits.
const LIMIT =
  "Speakeasy turns typed text into speech with an AI voice. It does not record your own voice through a microphone."

export const PAGES: SeoPage[] = [
  {
    path: "/voicemail-greetings",
    title: "Free Voicemail Greeting Templates & Phone Greetings",
    description: "Copy free personal, phone, answering-machine and funny voicemail greeting scripts, then turn a script into a downloadable MP3 with Speakeasy.",
    h1: "Free Voicemail Greeting Templates",
    answer:
      "Use a free voicemail greeting template as a starting point for your own message: copy the script, fill in the [brackets], and read it out loud or turn it into an MP3 with the Speakeasy generator. " + LIMIT,
    templatesId: "templates",
    templatesH2: "Ten greeting scripts you can copy",
    sections: [
      {
        id: "phone-greetings",
        h2: "What a good phone greeting says",
        body: [
          "A phone greeting tells callers who they reached and what to do when you cannot answer. Keep it to roughly 15 to 30 seconds, which is about 40 to 75 words at a natural speaking pace.",
          "Say who you are, say why you are unavailable only if it helps, ask for a name, number and short message, and promise a callback time you can keep.",
        ],
      },
      {
        id: "answering-machine-message",
        h2: "Answering machine messages",
        body: [
          "Speakeasy makes the audio greeting; it is not an answering machine and it does not answer calls for you. If your answering machine, phone system or voicemail app accepts an imported audio file, you can generate the greeting here and upload the MP3.",
          "Many home machines and carrier voicemail systems only record live, in which case play the downloaded MP3 from a speaker into the device or read the script yourself.",
        ],
      },
      {
        id: "funny-voicemail-messages",
        h2: "Funny voicemail greetings",
        body: [
          "For a joke, you can write a clearly fictional or funny greeting and generate its audio. Keep the humour obvious and harmless, and do not use a generated message to impersonate a real person, mislead callers, or pose as a voicemail someone actually received.",
        ],
      },
    ],
    faq: [
      { question: "Are these voicemail greeting templates free?", answer: "Yes. Copy and edit any script on this page for free, and use the generator to turn it into an MP3 with a free Cartesia API key." },
      { question: "How long should a voicemail greeting be?", answer: "About 15 to 30 seconds, roughly 40 to 75 words, is long enough to be useful and short enough that callers stay on the line." },
    ],
  },
  {
    path: "/voicemail-greeting-mp3",
    title: "Free Voicemail Greeting MP3 Download",
    description: "Turn a written phone or voicemail greeting into an MP3 with an AI voice. Free to make and download, with no account on this site.",
    h1: "Make and Download a Voicemail Greeting MP3",
    answer:
      "You can turn a written voicemail greeting into a downloadable MP3 with Speakeasy: choose a voice, enter or pick a script, optionally add background music, and download the generated audio. " + LIMIT,
    sections: [
      {
        id: "how-it-works",
        h2: "How to make a voicemail greeting MP3",
        body: [
          "1. Open the generator and write your script or load a template. 2. Pick an AI voice and optional music. 3. Generate, listen, then download the MP3.",
          "Speakeasy is free and open source. Voice generation uses your own free Cartesia API key, which is stored only in your browser, so there is no account on this site and no credit card.",
        ],
      },
      {
        id: "phone-greeting-recordings",
        h2: "Phone greeting recordings",
        body: [
          "The phone greeting recording you get is synthesised speech from your text, saved as an MP3. If you need your own voice, record it with a voice recorder app instead and upload that file to your phone system.",
        ],
      },
      {
        id: "use-on-your-phone",
        h2: "Using the MP3 on your phone or phone system",
        body: [
          "Most business phone systems (PBX, VoIP and cloud phone services) accept an MP3 or WAV upload in their greeting settings. Consumer carriers often only let you record live, so check your provider's voicemail settings first.",
        ],
      },
    ],
    faq: [
      { question: "Can I download my voicemail greeting as an MP3?", answer: "Yes. Every greeting you generate downloads as an MP3 file." },
      { question: "Does it record my voice?", answer: "No. It generates speech from text using an AI voice. It does not use your microphone." },
    ],
  },
  {
    path: "/business-voicemail-greetings",
    title: "Free Business Voicemail Greetings & MP3 Download",
    description: "Use professional business voicemail scripts, choose an AI voice and download your finished greeting as an MP3 for free.",
    h1: "Free Business Voicemail Greetings",
    answer:
      "Start with a free business voicemail script, edit in your business name, hours and callback promise, and generate an MP3 in an AI voice with Speakeasy. " + LIMIT,
    templatesId: "business-mp3",
    templatesH2: "Business and professional voicemail scripts",
    templateCategories: ["Professional", "Business", "Specialized"],
    sections: [
      {
        id: "professional-mp3",
        h2: "Download a professional voicemail greeting",
        body: [
          "Edit the script so names, hours and callback promises are accurate, then generate and download the MP3 for free. A professional greeting is calm, specific and short.",
        ],
      },
      {
        id: "formula",
        h2: "A business greeting formula",
        body: [
          "1. Name the business so callers know they reached the right place. 2. Say you are unavailable and, if useful, when you are open. 3. Tell callers exactly what to leave: name, number and reason. 4. Promise a reply time you can meet.",
        ],
      },
    ],
    faq: [
      { question: "Can I use these for my business phone system?", answer: "Yes. Download the MP3 and upload it in your phone system's greeting settings if it accepts audio files." },
      { question: "Is a business voicemail greeting really free here?", answer: "Yes. Speakeasy is free and open source; you only need a free Cartesia API key for the voice, with no credit card." },
    ],
  },
]
