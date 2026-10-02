import { SITE } from "@/config/site"

export const dynamic = "force-static"

// ponytail: short and optional; no AI bot is known to depend on it. Keep facts in sync with the pages.
export function GET() {
  const body = `# ${SITE.name}

> Free, open-source voicemail greeting maker. Write or pick a script, choose an AI voice, add optional background music and download an MP3. It generates speech from text; it does not record your own voice. Uses your own free Cartesia API key, no account on this site.

## Tool
- [Voicemail greeting maker](${SITE.url}/): the generator
- [On-hold message maker](${SITE.url}/hold): the same tool for on-hold messages

## Guides and templates
- [Free voicemail greeting templates](${SITE.url}/voicemail-greetings): personal, phone, answering machine and funny scripts
- [Voicemail greeting MP3](${SITE.url}/voicemail-greeting-mp3): how to turn a script into an MP3
- [Business voicemail greetings](${SITE.url}/business-voicemail-greetings): professional scripts and a greeting formula
- [FAQ](${SITE.url}/faq)

## Source
- [GitHub](${SITE.socials.github}): MIT licensed, by Ahmed Ibrahim (https://ahmed-ibrahim.com)
`
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } })
}
