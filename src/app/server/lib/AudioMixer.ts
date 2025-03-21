/**
 * A lightweight audio concatenation utility for serverless environments
 * Provides a simple, reliable alternative to FFmpeg for Vercel deployments
 */

/**
 * Audio mixer implementation using node-web-audio-api
 * This implementation provides true audio mixing with volume control
 */

import { promises as fs } from "fs"
import path from "path"
import { AudioContext, AudioBuffer, GainNode, AudioBufferSourceNode, OfflineAudioContext } from "node-web-audio-api"

/**
 * Mix audio files with volume control
 * @param voiceBuffer Voice audio buffer
 * @param backgroundBuffer Background music buffer
 * @param voiceVolume Volume multiplier for voice (0-2, default: 2.0)
 * @param backgroundVolume Volume multiplier for background (0-1, default: 0.1)
 * @returns Promise resolving to a Buffer containing mixed audio
 */
export async function mixAudio(voiceBuffer: Buffer, backgroundBuffer: Buffer, voiceVolume: number = 2.0, backgroundVolume: number = 0.1): Promise<Buffer> {
  console.log("Starting audio mixing with node-web-audio-api...")

  try {
    // Create an audio context for processing
    const context = new AudioContext()

    // Load audio buffers
    const voiceArrayBuffer = voiceBuffer.buffer.slice(voiceBuffer.byteOffset, voiceBuffer.byteOffset + voiceBuffer.byteLength)

    const bgArrayBuffer = backgroundBuffer.buffer.slice(backgroundBuffer.byteOffset, backgroundBuffer.byteOffset + backgroundBuffer.byteLength)

    // Decode audio data
    const voiceAudioBuffer = await context.decodeAudioData(voiceArrayBuffer)
    const bgAudioBuffer = await context.decodeAudioData(bgArrayBuffer)

    // Get the duration of both audio files
    const voiceDuration = voiceAudioBuffer.duration
    const bgDuration = bgAudioBuffer.duration

    // Use the longer duration for our final mix
    const finalDuration = Math.max(voiceDuration, bgDuration)
    const sampleRate = voiceAudioBuffer.sampleRate

    // Create an offline context for rendering
    const offlineContext = new OfflineAudioContext({
      numberOfChannels: 2,
      length: sampleRate * finalDuration,
      sampleRate: sampleRate,
    })

    // Create source nodes
    const voiceSource = new AudioBufferSourceNode(offlineContext, {
      buffer: voiceAudioBuffer,
    })

    const bgSource = new AudioBufferSourceNode(offlineContext, {
      buffer: bgAudioBuffer,
    })

    // Create gain nodes for volume control
    const voiceGain = new GainNode(offlineContext, { gain: voiceVolume })
    const bgGain = new GainNode(offlineContext, { gain: backgroundVolume })

    // Connect the nodes
    voiceSource.connect(voiceGain)
    bgSource.connect(bgGain)
    voiceGain.connect(offlineContext.destination)
    bgGain.connect(offlineContext.destination)

    // Start the sources
    voiceSource.start(0)
    bgSource.start(0)

    // Render the audio
    const renderedBuffer = await offlineContext.startRendering()

    // Convert the rendered buffer to a regular Node.js buffer
    const numberOfChannels = renderedBuffer.numberOfChannels
    const length = renderedBuffer.length

    // Create a buffer with interleaved audio data
    const audioData = new Float32Array(length * numberOfChannels)

    // Get audio data from each channel
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const channelData = renderedBuffer.getChannelData(channel)
      for (let i = 0; i < length; i++) {
        audioData[i * numberOfChannels + channel] = channelData[i]
      }
    }

    // Convert float audio data to 16-bit PCM
    const pcmData = new Int16Array(audioData.length)
    for (let i = 0; i < audioData.length; i++) {
      const s = Math.max(-1, Math.min(1, audioData[i]))
      pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7fff
    }

    // Create WAV header
    const headerView = createWavHeader(pcmData.length * 2, numberOfChannels, sampleRate)

    // Combine header and data
    const wavBuffer = Buffer.concat([Buffer.from(headerView.buffer), Buffer.from(pcmData.buffer)])

    console.log(`Audio mixing completed, size: ${wavBuffer.length} bytes`)

    // Close the contexts
    await context.close()
    await offlineContext.close()

    return wavBuffer
  } catch (error) {
    console.error("Error in audio mixing:", error)
    // Fall back to simple concatenation if mixing fails
    return Buffer.concat([voiceBuffer, backgroundBuffer])
  }
}

/**
 * Create a WAV file header
 */
function createWavHeader(dataLength: number, numChannels: number, sampleRate: number, bitsPerSample: number = 16): DataView {
  const buffer = new ArrayBuffer(44)
  const view = new DataView(buffer)

  // RIFF identifier
  writeString(view, 0, "RIFF")
  // File length
  view.setUint32(4, 36 + dataLength, true)
  // RIFF type
  writeString(view, 8, "WAVE")
  // Format chunk identifier
  writeString(view, 12, "fmt ")
  // Format chunk length
  view.setUint32(16, 16, true)
  // Sample format (PCM)
  view.setUint16(20, 1, true)
  // Channel count
  view.setUint16(22, numChannels, true)
  // Sample rate
  view.setUint32(24, sampleRate, true)
  // Byte rate (sample rate * block align)
  view.setUint32(28, (sampleRate * numChannels * bitsPerSample) / 8, true)
  // Block align (channel count * bytes per sample)
  view.setUint16(32, (numChannels * bitsPerSample) / 8, true)
  // Bits per sample
  view.setUint16(34, bitsPerSample, true)
  // Data chunk identifier
  writeString(view, 36, "data")
  // Data chunk length
  view.setUint32(40, dataLength, true)

  return view
}

/**
 * Write a string to a DataView
 */
function writeString(view: DataView, offset: number, string: string): void {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i))
  }
}

/**
 * Convert MP3 to WAV format
 * This is a fallback function if the main mixing approach doesn't work
 */
export async function convertToWav(mp3Buffer: Buffer): Promise<Buffer> {
  try {
    const context = new AudioContext()

    const arrayBuffer = mp3Buffer.buffer.slice(mp3Buffer.byteOffset, mp3Buffer.byteOffset + mp3Buffer.byteLength)

    const audioBuffer = await context.decodeAudioData(arrayBuffer)

    const numberOfChannels = audioBuffer.numberOfChannels
    const length = audioBuffer.length
    const sampleRate = audioBuffer.sampleRate

    // Create a buffer with interleaved audio data
    const audioData = new Float32Array(length * numberOfChannels)

    // Get audio data from each channel
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const channelData = audioBuffer.getChannelData(channel)
      for (let i = 0; i < length; i++) {
        audioData[i * numberOfChannels + channel] = channelData[i]
      }
    }

    // Convert float audio data to 16-bit PCM
    const pcmData = new Int16Array(audioData.length)
    for (let i = 0; i < audioData.length; i++) {
      const s = Math.max(-1, Math.min(1, audioData[i]))
      pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7fff
    }

    // Create WAV header
    const dataLength = pcmData.length * 2
    const headerView = createWavHeader(dataLength, numberOfChannels, sampleRate)

    // Combine header and data
    const wavBuffer = Buffer.concat([Buffer.from(headerView.buffer), Buffer.from(pcmData.buffer)])

    await context.close()

    return wavBuffer
  } catch (error) {
    console.error("Error converting MP3 to WAV:", error)
    return mp3Buffer
  }
}

export default {
  mixAudio,
  convertToWav,
}
