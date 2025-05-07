import { createHash } from "crypto"
import CartesiaService from "../lib/Cartesia"
import BlobStorageService from "../lib/BlobStorage"
import { promises as fs } from "fs"
import _ from "lodash"
import path from "path"

async function generateVoices({ text, id = "694f9389-aac1-45b6-b726-9d9369183238", bg = "", cartesiaApiKey }: { text: string; id: string; bg: string; cartesiaApiKey: string }) {
  return new Promise<{
    fileName: string
    fileId: string
    preProcess?: boolean
    fileUrl?: string
    backgroundUrl?: string
  }>(async (resolve, reject) => {
    try {
      // Create a slug for the file name from the text and the voice id
      const fileId = createHash("md5")
        .update(`${_.kebabCase(text)}-${id}-${bg}`)
        .digest("hex")

      // Check if in development environment to determine storage approach
      const isDevelopment = process.env.NODE_ENV === "development"

      if (isDevelopment) {
        // Development mode - use local files
        // Check if the file already exists
        if (await fs.stat(`output/${fileId}.mp3`).catch(() => false)) {
          console.log("File already exists in local storage")

          // Return paths to both voice and background files for client-side mixing
          const bgMusicPath = `/api/background?file=${bg}.mp3`

          return resolve({
            fileName: `output/${fileId}.mp3`,
            fileId: fileId,
            preProcess: false,
            backgroundUrl: bgMusicPath,
          })
        }
      } else {
        // Production mode - check Vercel Blob
        try {
          const files = await BlobStorageService.listAudioFiles()
          const existingFile = files.find((url) => url.includes(`${fileId}.mp3`))

          if (existingFile) {
            console.log("File already exists in Blob storage")

            // Get background music URL
            const bgMusicUrl = `/api/background?file=${bg}.mp3`

            return resolve({
              fileName: `${fileId}.mp3`,
              fileId: fileId,
              preProcess: false,
              fileUrl: existingFile,
              backgroundUrl: bgMusicUrl,
            })
          }
        } catch (error) {
          console.log("Error checking Blob storage, will generate new file", error)
        }
      }

      console.log({ voice: id, model_id: "sonic-2", output_format: "mp3_44100_128", text })

      // Passing voice ID directly to Cartesia
      const audio = await CartesiaService.generate({
        voice: id, // This is now the voice_id
        model_id: "sonic-2",
        output_format: "mp3_44100_128",
        text,
        cartesiaApiKey,
      })

      const audioBuffer = Buffer.from(audio)

      if (isDevelopment) {
        // Development mode - write to local file
        const fileName = `output/${fileId}.mp3`
        // Convert buffer to Uint8Array for fs.writeFile
        await fs.writeFile(fileName, new Uint8Array(audioBuffer))

        // Return paths to both voice and background files
        const bgMusicPath = `/api/background?file=${bg}.mp3`

        resolve({
          fileName,
          fileId: fileId,
          preProcess: false,
          backgroundUrl: bgMusicPath,
        })
      } else {
        // Production mode - upload to Vercel Blob
        const fileUrl = await BlobStorageService.uploadAudio(fileId, audioBuffer)

        // Background music URL
        const bgMusicUrl = `/api/background?file=${bg}.mp3`

        resolve({
          fileName: fileId,
          fileId: fileId,
          preProcess: false,
          fileUrl,
          backgroundUrl: bgMusicUrl,
        })
      }
    } catch (error) {
      console.info(error)
      reject(error)
    }
  })
}

export default generateVoices
