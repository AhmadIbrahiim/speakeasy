import { useMutation } from "@tanstack/react-query"
const request = async (text: string, id: string) => {
  return await fetch("/api", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, id }),
  })
}
// Define the function to call the mutation
export const useCreateAudioBuffer = (text: string, id: string) => {
  const mutation = useMutation({
    mutationFn: () => request(text, id),
  })

  return { mutation }
}
