import { useMutation } from "@tanstack/react-query"
const request = async (text: string, id: string, bgId: string) => {
  return await fetch("/api", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, id, bgId }),
  })
}
// Define the function to call the mutation
export const useCreateAudioBuffer = (text: string, id: string, bg: string) => {
  const mutation = useMutation({
    mutationFn: () => request(text, id, bg),
  })

  return { mutation }
}
