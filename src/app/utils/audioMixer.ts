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

      // Add 100ms of padding at the start to ensure background starts immediately
      // This helps with any potential delay in processing or browser audio handling
      const paddingMs = 100
      const paddingSamples = Math.floor((paddingMs / 1000) * voiceAudioBuffer.sampleRate)
      const totalLength = voiceAudioBuffer.length + paddingSamples

      // Create a new buffer with the padding included
      const outputBuffer = audioContext.createBuffer(voiceAudioBuffer.numberOfChannels, totalLength, voiceAudioBuffer.sampleRate)

      // Mix the audio samples with volume control
      for (let channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
        const voiceData = voiceAudioBuffer.getChannelData(channel)
        const bgData = backgroundAudioBuffer.getChannelData(channel)
        const outputData = outputBuffer.getChannelData(channel)

        // For the padding section, only include background music
        for (let i = 0; i < paddingSamples; i++) {
          if (i < backgroundAudioBuffer.length) {
            outputData[i] = bgData[i] * bgVolume
          }
        }

        // Mix the audio samples channel by channel with the voice starting after the padding
        for (let i = 0; i < voiceAudioBuffer.length; i++) {
          const outputIndex = i + paddingSamples

          // Add voice data with volume control
          outputData[outputIndex] = voiceData[i] * voiceVolume

          // Add background music if available at this position
          const bgIndex = outputIndex
          if (bgIndex < backgroundAudioBuffer.length) {
            outputData[outputIndex] += bgData[bgIndex] * bgVolume
          }
        }

        // Apply a fade-out effect to the background music
        const fadeOutDuration = 0.5 // 0.5 seconds fade-out
        const fadeOutSamples = voiceAudioBuffer.sampleRate * fadeOutDuration
        if (totalLength > fadeOutSamples) {
          const fadeStartIndex = totalLength - fadeOutSamples
          for (let i = fadeStartIndex; i < totalLength; i++) {
            const fadeRatio = 1 - (i - fadeStartIndex) / fadeOutSamples

            // Only apply fade to the background portion of the mix
            if (i < backgroundAudioBuffer.length) {
              // Get the voice component if it exists at this position
              const voiceIndex = i - paddingSamples
              const voiceComponent = voiceIndex >= 0 && voiceIndex < voiceAudioBuffer.length ? voiceData[voiceIndex] * voiceVolume : 0

              // Apply the fade only to the background component
              outputData[i] = voiceComponent + bgData[i] * bgVolume * fadeRatio
            }
          }
        }
      }

      // Add a fade-in at the very beginning for a smoother start
      const fadeInDuration = 0.05 // 50ms fade-in
      const fadeInSamples = Math.floor(voiceAudioBuffer.sampleRate * fadeInDuration)
      for (let channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
        const outputData = outputBuffer.getChannelData(channel)
        for (let i = 0; i < fadeInSamples && i < outputBuffer.length; i++) {
          const fadeRatio = i / fadeInSamples
          outputData[i] *= fadeRatio
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
