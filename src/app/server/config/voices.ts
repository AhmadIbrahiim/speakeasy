import { randomUUID } from "crypto"
import ElevenLabs from "../lib/ElevenLabs"
import { createWriteStream } from "fs"
const FFmpeg = require("fluent-ffmpeg")

async function generateVoices({ text, id = "Rachel" }: { text: string; id: string }) {
  return new Promise<{
    fileName: string
    fileId: string
  }>(async (resolve, reject) => {
    try {
      const fileId = randomUUID()
      const audio = await ElevenLabs.generate({
        voice: id,
        model_id: "eleven_turbo_v2",
        output_format: "mp3_44100_128",
        text,
      })
      const fileName = `output/${fileId}.mp3`

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
        console.error("Elabs error " + JSON.stringify(er, null, 10))
        reject(er)
      })
    } catch (error) {
      console.info("Elabs error " + JSON.stringify(error, null, 10))
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
