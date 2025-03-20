import { createHash } from "crypto"
import CartesiaService from "../lib/Cartesia"
import BlobStorageService from "../lib/BlobStorage"
import { promises as fs } from "fs"
import _ from "lodash"
import path from "path"
const FFmpeg = require("fluent-ffmpeg")

async function generateVoices({ text, id = "694f9389-aac1-45b6-b726-9d9369183238", bg = "" }: { text: string; id: string; bg: string }) {
  return new Promise<{
    fileName: string
    fileId: string
    preProcess?: boolean
    fileUrl?: string
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
        if (await fs.stat(`output/${fileId}-bg.mp3`).catch(() => false)) {
          console.log("File already exists in local storage")
          return resolve({
            fileName: `output/${fileId}.mp3`,
            fileId: fileId,
            preProcess: false,
          })
        }
      } else {
        // Production mode - check Vercel Blob
        try {
          const files = await BlobStorageService.listAudioFiles()
          const existingFile = files.find((url) => url.includes(`${fileId}-bg.mp3`))

          if (existingFile) {
            console.log("File already exists in Blob storage")
            return resolve({
              fileName: `${fileId}.mp3`,
              fileId: fileId,
              preProcess: false,
              fileUrl: existingFile,
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
      })

      const audioBuffer = Buffer.from(audio)

      if (isDevelopment) {
        // Development mode - write to local file
        const fileName = `output/${fileId}.mp3`
        await fs.writeFile(fileName, audioBuffer)

        resolve({
          fileName,
          fileId: fileId,
          preProcess: true,
        })
      } else {
        // Production mode - upload to Vercel Blob
        const fileUrl = await BlobStorageService.uploadAudio(fileId, audioBuffer)

        resolve({
          fileName: fileId,
          fileId: fileId,
          preProcess: true,
          fileUrl,
        })
      }
    } catch (error) {
      console.info(error)
      reject(error)
    }
  })
}

export const addMusic = async (fileName: string, fileId: string, bg: string) => {
  return new Promise<{ originalUrl?: string; bgUrl?: string }>(async (resolve, reject) => {
    // Check if in development environment to determine storage approach
    const isDevelopment = process.env.NODE_ENV === "development"

    if (isDevelopment) {
      // Development mode - use local files for FFmpeg
      const sourceMp3 = process.cwd() + `/output/${fileId}.mp3`
      const mp3 = process.cwd() + `/output/${fileId}-bg.mp3`
      const wav = process.cwd() + `/output/${fileId}-bg.wav`
      const backgroundMusic = process.cwd() + `/src/app/assets/${bg}.mp3`

      console.log({
        sourceMp3,
        mp3,
        wav,
        backgroundMusic,
      })

      const compressLogic = ["[0:a]volume=2[a0]", "[1:a]volume=0.1[a1]", "[a0][a1]amix=inputs=2:duration=first"]
      const ffmpegMp3 = FFmpeg()
        .input(sourceMp3)
        .inputFormat("mp3")
        .input(backgroundMusic)
        .inputFormat("mp3")
        .complexFilter(compressLogic)
        .audioCodec("libmp3lame")
        .output(mp3)
        .outputOptions("-c:v", "copy")

      const ffmpegWav = FFmpeg()
        .input(sourceMp3)
        .inputFormat("mp3")
        .input(backgroundMusic)
        .inputFormat("mp3")
        .complexFilter(compressLogic)
        .audioCodec("pcm_s16le")
        .outputOptions("-c:v", "copy")
        .outputOptions("-f", "wav")
        .output(wav)

      let ffmpegMp3Ended = false
      let ffmpegWavEnded = false

      ffmpegMp3.on("error", (err: any) => {
        console.error("An error occurred during mp3 conversion: " + JSON.stringify(err, null, 10))
        reject()
      })

      ffmpegMp3.on("end", () => {
        console.log("MP3 conversion completed")
        ffmpegMp3Ended = true
        if (ffmpegWavEnded) {
          resolve({})
        }
      })

      ffmpegWav.on("error", (err: any) => {
        console.error("An error occurred during wav conversion: " + JSON.stringify(err, null, 10))
        reject()
      })

      ffmpegWav.on("end", () => {
        console.log("WAV conversion completed")
        ffmpegWavEnded = true
        if (ffmpegMp3Ended) {
          resolve({})
        }
      })

      ffmpegMp3.run()
      ffmpegWav.run()
    } else {
      // Production mode - use Vercel Blob and process in memory
      try {
        // Get the original audio and background music
        const originalUrl = await BlobStorageService.uploadAudio(fileId, Buffer.alloc(0), "original")
        const originalBuffer = await BlobStorageService.downloadAudio(originalUrl)

        // We need to have a local temp directory for FFmpeg to work in serverless environment
        const tempDir = path.join("/tmp", fileId)
        await fs.mkdir(tempDir, { recursive: true })

        const tempSource = path.join(tempDir, `${fileId}.mp3`)
        const tempOutput = path.join(tempDir, `${fileId}-bg.mp3`)
        const tempWav = path.join(tempDir, `${fileId}-bg.wav`)

        // Save background music to temp file
        const bgMusicPath = path.join(process.cwd(), `src/app/assets/${bg}.mp3`)

        // Write the audio buffer to temp files
        await fs.writeFile(tempSource, originalBuffer)

        // Process with FFmpeg
        const compressLogic = ["[0:a]volume=2[a0]", "[1:a]volume=0.1[a1]", "[a0][a1]amix=inputs=2:duration=first"]

        return new Promise<{ originalUrl: string; bgUrl: string }>((resolveFFmpeg, rejectFFmpeg) => {
          const ffmpegMp3 = FFmpeg()
            .input(tempSource)
            .inputFormat("mp3")
            .input(bgMusicPath)
            .inputFormat("mp3")
            .complexFilter(compressLogic)
            .audioCodec("libmp3lame")
            .output(tempOutput)
            .outputOptions("-c:v", "copy")

          ffmpegMp3.on("error", (err: any) => {
            console.error("An error occurred during mp3 conversion: " + JSON.stringify(err, null, 10))
            rejectFFmpeg(err)
          })

          ffmpegMp3.on("end", async () => {
            console.log("MP3 conversion completed")
            try {
              // Read the processed file
              const processedBuffer = await fs.readFile(tempOutput)

              // Upload to Vercel Blob
              const bgUrl = await BlobStorageService.uploadAudio(fileId, processedBuffer, "bg")

              // Clean up temp files
              await fs.rm(tempDir, { recursive: true, force: true })

              resolveFFmpeg({
                originalUrl,
                bgUrl,
              })
            } catch (error) {
              rejectFFmpeg(error)
            }
          })

          ffmpegMp3.run()
        })
          .then(({ originalUrl, bgUrl }) => {
            resolve({ originalUrl, bgUrl })
          })
          .catch(reject)
      } catch (error) {
        console.error("Error processing audio in serverless environment:", error)
        reject(error)
      }
    }
  })
}

export default generateVoices
