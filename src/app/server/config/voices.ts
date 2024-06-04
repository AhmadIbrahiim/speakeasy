import { randomUUID } from "crypto"
import ElevenLabs from "../lib/ElevenLabs"
import { createWriteStream } from "fs"

async function generateVoices({ text }: { text: string }) {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const audio = await ElevenLabs.generate({
        voice: "Rachel",
        model_id: "eleven_turbo_v2",
        text,
      })
      const fileName = `${randomUUID()}.mp3`
      const fileStream = createWriteStream(fileName)

      audio.pipe(fileStream)
      fileStream.on("finish", () => resolve(fileName)) // Resolve with the fileName
      fileStream.on("error", reject)
    } catch (error) {
      console.error(error)
      reject(error)
    }
  })
}
export default generateVoices
