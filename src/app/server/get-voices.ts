import elabs from "./lib/ElevenLabs"

/**
 * Dormant ElevenLabs voice catalog fetch. Gated behind ELEVENLABS_ENABLED via
 * `./lib/ElevenLabs.ts`. Today this is unreferenced by the live API surface —
 * `/api/voices/route.ts` talks to Cartesia directly. Kept here so the future
 * ElevenLabs UI tab has an obvious adapter to plug into. See .env.example.
 */
const getAllVoices = async () => {
  if (process.env.ELEVENLABS_ENABLED !== "true") {
    throw new Error("ElevenLabs is not enabled in this deployment. Set ELEVENLABS_ENABLED=true to opt in.")
  }
  const voices = await elabs.voices.getAll()
  return voices
}

export default getAllVoices
