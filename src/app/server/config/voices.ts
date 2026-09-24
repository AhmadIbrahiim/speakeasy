import { createHash } from "crypto"
import CartesiaService from "../lib/Cartesia"
import R2Cache from "../lib/R2Cache"
import _ from "lodash"

async function generateVoices({ text, id = "694f9389-aac1-45b6-b726-9d9369183238", bg = "", cartesiaApiKey }: { text: string; id: string; bg: string; cartesiaApiKey: string }) {
  // Create a slug for the file name from the text and the voice id
  const fileId = createHash("md5")
    .update(`${_.kebabCase(text)}-${id}-${bg}`)
    .digest("hex")
  const key = `audio/${fileId}.mp3`
  // Client mixes the voice with this background track.
  const backgroundUrl = `/api/background?file=${bg}.mp3`

  // Cross-user cache: identical text + voice + bg is generated once.
  try {
    const cached = await R2Cache.get(key)
    if (cached) return { fileId, audioBuffer: cached, backgroundUrl }
  } catch (error) {
    console.warn("[voices] cache lookup failed, generating new file", error)
  }

  const audioResponse = await CartesiaService.generate({
    voice: id,
    model_id: "sonic-3.5",
    output_format: "mp3_44100_128",
    text,
    cartesiaApiKey,
  })
  const arrayBuffer = await audioResponse.arrayBuffer()

  // Best-effort: a failed cache write never blocks the response.
  try {
    await R2Cache.put(key, arrayBuffer, "audio/mpeg")
  } catch (error) {
    console.warn("[voices] cache write skipped:", error instanceof Error ? error.message : error)
  }

  return { fileId, audioBuffer: arrayBuffer, backgroundUrl }
}

export default generateVoices
