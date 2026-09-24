"use client"
import { VoicemailGreetingComponent } from "../voicemailGreetingComponent"
import { useQuery } from "@tanstack/react-query"
import _ from "lodash"
import { Voice, VoiceResponse } from "@/types"

export enum PageTarget {
  HOLD = "hold",
  MAIN = "main",
}
export const MainForm = ({ target = PageTarget.MAIN }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["voices"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/voices")
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`)
        }

        const data: { voices?: unknown[] } = await response.json()
        return data?.voices || [] // Changed to handle the direct voices array from Cartesia API
      } catch (err) {
        console.error("Error fetching voices:", err)
        return [] // Return empty array on error
      }
    },
  })

  // Make sure we have data before rendering
  const voices = data || []

  if (isLoading) return <div className="p-8 text-center">Loading voices...</div>

  if (error) return <div className="p-8 text-center text-red-500">Error loading voices. Please try again later.</div>

  if (!voices.length) return <div className="p-8 text-center">No voices available. Please check your configuration.</div>

  // Group voices by accent for dropdown organization
  const voicesGroupedByAccent = _.groupBy(voices, (voice: VoiceResponse) => voice.labels?.accent || "Unknown") as Voice

  return <VoicemailGreetingComponent target={target} voices={voicesGroupedByAccent} allVoices={voices as VoiceResponse[]} />
}

export default MainForm
