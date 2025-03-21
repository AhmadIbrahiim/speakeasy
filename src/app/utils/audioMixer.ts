/**
 * Client-side audio mixing utility using Crunker
 */
import Crunker from "crunker"

/**
 * Mixes voice and background audio with volume control
 * @param voiceBuffer - ArrayBuffer of the voice audio
 * @param backgroundUrl - URL of the background music
 * @param voiceVolume - Volume level for voice (0-1)
 * @param bgVolume - Volume level for background music (0-1)
 * @param outputFormat - Output format ('wav' or 'mp3')
 * @returns A Promise that resolves to a Blob containing the mixed audio
 */
export async function mixAudioClientSide(voiceBuffer: ArrayBuffer, backgroundUrl: string, voiceVolume: number = 1.0, bgVolume: number = 0.3, outputFormat: "wav" | "mp3" = "wav"): Promise<Blob> {
  return new Promise(async (resolve, reject) => {
    try {
      // Create a new Crunker instance
      const crunker = new Crunker()

      // Create audio context for buffer manipulations
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      // Decode the voice buffer
      const voiceAudioBuffer = await audioContext.decodeAudioData(voiceBuffer.slice(0))

      // Fetch and decode the background audio from URL
      const backgroundResponse = await fetch(backgroundUrl)
      const backgroundBuffer = await backgroundResponse.arrayBuffer()
      const backgroundAudioBuffer = await audioContext.decodeAudioData(backgroundBuffer.slice(0))

      // Create a new buffer with the same characteristics as the voice buffer
      const outputBuffer = audioContext.createBuffer(voiceAudioBuffer.numberOfChannels, voiceAudioBuffer.length, voiceAudioBuffer.sampleRate)

      // Mix the audio samples with volume control
      for (let channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
        const voiceData = voiceAudioBuffer.getChannelData(channel)
        const bgData = backgroundAudioBuffer.getChannelData(channel)
        const outputData = outputBuffer.getChannelData(channel)

        // Mix the audio samples channel by channel
        for (let i = 0; i < outputBuffer.length; i++) {
          // Add voice data with volume control
          outputData[i] = voiceData[i] * voiceVolume

          // Add background music if available at this position
          if (i < backgroundAudioBuffer.length) {
            outputData[i] += bgData[i] * bgVolume
          }
        }

        // Apply a fade-out effect to the background music
        const fadeOutDuration = 0.5 // 0.5 seconds fade-out
        const fadeOutSamples = voiceAudioBuffer.sampleRate * fadeOutDuration
        if (voiceAudioBuffer.length > fadeOutSamples) {
          const fadeStartIndex = voiceAudioBuffer.length - fadeOutSamples
          for (let i = fadeStartIndex; i < voiceAudioBuffer.length; i++) {
            const fadeRatio = 1 - (i - fadeStartIndex) / fadeOutSamples

            // Recalculate the sample with the fade effect
            if (i < backgroundAudioBuffer.length) {
              outputData[i] = voiceData[i] * voiceVolume + bgData[i] * bgVolume * fadeRatio
            }
          }
        }
      }

      // Convert the mixed buffer to a blob using Crunker's export method
      const result = await crunker.export(outputBuffer, outputFormat === "mp3" ? "audio/mp3" : "audio/wav")

      // Crunker export returns an object with a blob property
      resolve(result.blob)
    } catch (error) {
      console.error("Error mixing audio:", error)
      reject(error)
    }
  })
}
