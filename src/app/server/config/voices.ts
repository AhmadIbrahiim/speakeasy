import CartesiaService from "../lib/Cartesia"

// Nothing is stored server-side: the MP3 goes straight back to the browser.
async function generateVoices({ text, id = "694f9389-aac1-45b6-b726-9d9369183238", bg = "", cartesiaApiKey }: { text: string; id: string; bg: string; cartesiaApiKey: string }) {
  const audioResponse = await CartesiaService.generate({
    voice: id,
    model_id: "sonic-3.5",
    output_format: "mp3_44100_128",
    text,
    cartesiaApiKey,
  })
  // Client mixes the voice with this background track.
  return { audioBuffer: await audioResponse.arrayBuffer(), backgroundUrl: `/api/background?file=${bg}.mp3` }
}

export default generateVoices
