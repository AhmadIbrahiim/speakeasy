import elabs from "./lib/ElevenLabs"

const getAllVoices = () => {
  const voices = elabs.voices.getAll()
  return voices
}
