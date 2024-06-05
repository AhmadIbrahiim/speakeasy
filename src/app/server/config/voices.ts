import { randomUUID } from "crypto"
import ElevenLabs from "../lib/ElevenLabs"
import { createWriteStream } from "fs"
const FFmpeg = require("fluent-ffmpeg")
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path
FFmpeg.setFfmpegPath(ffmpegPath)
async function generateVoices({ text }: { text: string }) {
  return new Promise<{
    fileName: string
    fileId: string
  }>(async (resolve, reject) => {
    try {
      const fileId = randomUUID()
      const audio = await ElevenLabs.generate({
        voice: "Rachel",
        model_id: "eleven_turbo_v2",
        output_format: "mp3_44100_128",

        text,
      })
      const fileName = `/tmp/${fileId}.mp3`

      const fileStream = createWriteStream(fileName)

      // waveFile.fromMuLaw(audio)
      audio.pipe(fileStream)
      fileStream.on("finish", () =>
        resolve({
          fileName,
          fileId: fileId,
        }),
      ) // Resolve with the fileName
      fileStream.on("error", (er) => {
        console.error(er)
        reject(er)
      })
    } catch (error) {
      console.info(JSON.stringify(error, null, 10))
      reject(error)
    }
  })
}

export const addMusic = async (fileName: string, fileId: string) => {
  return new Promise<void>(async (resolve, reject) => {
    const sourceMp3 = `/tmp/${fileId}.mp3`
    const mp3 = `/tmp/${fileId}-bg.mp3`
    const wav = `/tmp/${fileId}-bg.wav`
    const backgroundMusic = process.cwd() + "/src/app/assets/background.mp3"
    console.log(backgroundMusic)
    const ffmpegMp3 = FFmpeg()
      .input(sourceMp3)
      .inputFormat("mp3")
      .input(backgroundMusic)
      .inputFormat("mp3")
      // Add background music to the audio with a 0.5 volume and let the audio volume be 1
      .complexFilter(["[0:a]volume=1[a0]", "[1:a]volume=0.3[a1]", "[a0][a1]amix=inputs=2:duration=first"])
      .audioCodec("libmp3lame")
      .output(mp3)
      .outputOptions("-c:v", "copy")

    const ffmpegWav = FFmpeg()
      .input(sourceMp3)
      .inputFormat("mp3")
      .input(backgroundMusic)
      .inputFormat("mp3")
      // Add background music to the audio with a 0.5 volume and let the audio volume be 1
      .complexFilter(["[0:a]volume=1[a0]", "[1:a]volume=0.5[a1]", "[a0][a1]amix=inputs=2:duration=first"])
      .audioCodec("pcm_s16le")
      .outputOptions("-c:v", "copy")
      .outputOptions("-f", "wav")
      .output(wav)

    let ffmpegMp3Ended = false
    let ffmpegWavEnded = false
    ffmpegMp3.on("error", (err: any) => {
      console.error("An error occurred during mp3 conversion: " + err.message)
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
      console.error("An error occurred during wav conversion: " + err.message)
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
