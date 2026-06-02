import { createHash } from "crypto"
import CartesiaService from "../lib/Cartesia"
import BlobStorageService from "../lib/BlobStorage"
import { promises as fs } from "fs"
import _ from "lodash"

async function generateVoices({ text, id = "694f9389-aac1-45b6-b726-9d9369183238", bg = "", cartesiaApiKey }: { text: string; id: string; bg: string; cartesiaApiKey: string }) {
  return new Promise<{
    fileName: string
    fileId: string
    preProcess?: boolean
    fileUrl?: string
    audioBuffer?: Buffer
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
          // Return paths to both voice and background files for client-side mixing
          const bgMusicPath = `/api/background?file=${bg}.mp3`

          return resolve({
            fileName: `output/${fileId}.mp3`,
            fileId: fileId,
            preProcess: false,
            backgroundUrl: bgMusicPath,
          })
        }
      } else if (BlobStorageService.isConfigured()) {
        // Production mode - check Vercel Blob cache. Only when a Blob store is
        // linked; otherwise we skip straight to generation.
        try {
          const files = await BlobStorageService.listAudioFiles()
          const existingFile = files.find((url) => url.includes(`${fileId}.mp3`))

          if (existingFile) {
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
          console.warn("[voices] blob storage lookup failed, generating new file", error)
        }
      }

      // Passing voice ID directly to Cartesia
      const audioResponse = await CartesiaService.generate({
        voice: id, // This is now the voice_id
        model_id: "sonic-3.5",
        output_format: "mp3_44100_128",
        text,
        cartesiaApiKey,
      })

      if (isDevelopment) {
        // Development mode - write to local file
        const fileName = `output/${fileId}.mp3`
        // Convert buffer to Uint8Array for fs.writeFile
        await fs.writeFile(fileName, new Uint8Array(await audioResponse.arrayBuffer()))

        // Return paths to both voice and background files
        const bgMusicPath = `/api/background?file=${bg}.mp3`

        resolve({
          fileName,
          fileId: fileId,
          preProcess: false,
          backgroundUrl: bgMusicPath,
        })
      } else {
        // Production mode - return the freshly generated buffer directly. The
        // Blob upload is a best-effort cross-user cache: if no Blob store is
        // linked we skip it, and a failed upload never blocks the response.
        const audioBuffer = Buffer.from(await audioResponse.arrayBuffer())

        let fileUrl: string | undefined
        if (BlobStorageService.isConfigured()) {
          try {
            fileUrl = await BlobStorageService.uploadAudio(fileId, audioBuffer)
          } catch (error) {
            console.warn("[voices] blob upload skipped, serving generated audio directly:", error instanceof Error ? error.message : error)
          }
        }

        // Background music URL
        const bgMusicUrl = `/api/background?file=${bg}.mp3`

        resolve({
          fileName: fileId,
          fileId: fileId,
          preProcess: false,
          fileUrl,
          audioBuffer,
          backgroundUrl: bgMusicUrl,
        })
      }
    } catch (error) {
      console.error("[voices] generate failed:", error)
      reject(error)
    }
  })
}

export default generateVoices
