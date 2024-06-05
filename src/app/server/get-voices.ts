import elabs from "./lib/ElevenLabs"

const getAllVoices = async () => {
  // Delay 10 s
  const voices = await elabs.voices.getAll()
  return voices
}

export default getAllVoices
