import { createHash } from "crypto"
import ElevenLabs from "../lib/ElevenLabs"
import { createWriteStream, promises as fs } from "fs"
import _ from "lodash"

const FFmpeg = require("fluent-ffmpeg")

async function generateVoices({ text, id = "Rachel", bg = "" }: { text: string; id: string; bg: string }) {
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
      const fileName = `output/${fileId}.wav`

      // Define the API endpoint, headers, and payload
      const apiEndpoint = "https://api.cartesia.ai/tts/bytes"
      const headers: Record<string, string> = {
        "X-API-Key": process.env.ELEVENLABS_API_KEY || "",
        "Cartesia-Version": "2024-06-10",
        "Content-Type": "application/json",
      }
      const payload = {
        model_id: "sonic-english",
        transcript: text,
        voice: {
          mode: "id",
          id: id, // Replace with the voice id you want to use
        },
        output_format: {
          container: "wav",
          sample_rate: 8000,
          encoding: "pcm_s16le",
        },
      }

      // Make an HTTP POST request to the Cartesia TTS API using fetch
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Decode the audio data
      const audioChunk = Buffer.from(await response.arrayBuffer())

      // Save the audio to a file
      await fs.writeFile(fileName, audioChunk)

      resolve({
        fileName: fileName,
        fileId: fileId,
        preProcess: true,
      })
      // return
    } catch (error) {
      console.log(error)
      console.info("Elabs error " + JSON.stringify(error, null, 10))
      reject(error)
    }
  })
}

const runFFmpeg = (ffmpegCommand: any) => {
  return new Promise<void>((resolve, reject) => {
    ffmpegCommand
      .on("error", (err: any) => {
        console.log(err)
        console.error("An error occurred: " + JSON.stringify(err, null, 10))
        reject(err)
      })
      .on("end", () => {
        console.log("FFmpeg process completed")
        resolve()
      })
      .run()
  })
}

export const addMusic = async (fileName: string, fileId: string, bg: string) => {
  const sourceMp3 = process.cwd() + `/output/${fileId}.wav`
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
    .inputFormat("wav")
    .input(backgroundMusic)
    .inputFormat("mp3")
    .complexFilter(compressLogic)
    .audioCodec("libmp3lame")
    .output(mp3)
    .outputOptions("-c:v", "copy")

  const ffmpegWav = FFmpeg()
    .input(sourceMp3)
    .inputFormat("wav")
    .input(backgroundMusic)
    .inputFormat("mp3")
    .complexFilter(compressLogic)
    .audioCodec("pcm_s16le")
    .outputOptions("-c:v", "copy")
    .outputOptions("-f", "wav")
    .output(wav)

  await runFFmpeg(ffmpegMp3)

  await runFFmpeg(ffmpegWav)
}

export default generateVoices
