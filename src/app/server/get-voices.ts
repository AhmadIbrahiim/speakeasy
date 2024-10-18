import elabs from "./lib/ElevenLabs"

const getAllVoices = async () => {
  // Delay 10 s
  const voices = await elabs.voices.list()
  return voices
}

export default getAllVoices
