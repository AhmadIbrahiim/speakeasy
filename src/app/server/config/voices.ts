import { createHash } from "crypto"
import CartesiaService from "../lib/Cartesia"
import { createWriteStream, promises as fs } from "fs"
import _ from "lodash"
const FFmpeg = require("fluent-ffmpeg")

async function generateVoices({ text, id = "694f9389-aac1-45b6-b726-9d9369183238", bg = "" }: { text: string; id: string; bg: string }) {
  return new Promise<{
    fileName: string
    fileId: string
    preProcess?: boolean
  }>(async (resolve, reject) => {
    try {
      // Create a slug for the file name from the text and the voice id
      const fileId = createHash("md5")
        .update(`${_.kebabCase(text)}-${id}-${bg}`)
        .digest("hex")

      // Check if the file already exists
      if (await fs.stat(`output/${fileId}-bg.mp3`).catch(() => false)) {
        console.log("File already exists")
        return resolve({
          fileName: `output/${fileId}.mp3`,
          fileId: fileId,
          preProcess: false,
        })
      }

      console.log({ voice: id, model_id: "sonic-2", output_format: "mp3_44100_128", text })

      // Passing voice ID directly to Cartesia
      const audio = await CartesiaService.generate({
        voice: id, // This is now the voice_id
        model_id: "sonic-2",
        output_format: "mp3_44100_128",
        text,
      })

      const fileName = `output/${fileId}.mp3`

      // Write the audio buffer to a file
      await fs.writeFile(fileName, new Uint8Array(audio))

      resolve({
        fileName,
        fileId: fileId,
        preProcess: true,
      })
    } catch (error) {
      console.info(error)
      reject(error)
    }
  })
}

export const addMusic = async (fileName: string, fileId: string, bg: string) => {
  return new Promise<void>(async (resolve, reject) => {
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
      // Add background music to the audio with a 0.5 volume and let the audio volume be 1
      .complexFilter(compressLogic)
      .audioCodec("libmp3lame")
      .output(mp3)
      .outputOptions("-c:v", "copy")

    const ffmpegWav = FFmpeg()
      .input(sourceMp3)
      .inputFormat("mp3")
      .input(backgroundMusic)
      .inputFormat("mp3")
      // Add background music to the audio with a 0.5 volume and let the audio volume be 1
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
        resolve()
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
        resolve()
      }
    })

    ffmpegMp3.run()
    ffmpegWav.run()
  })
}
export default generateVoices
