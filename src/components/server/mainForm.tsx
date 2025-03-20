"use client"
import React, { Suspense } from "react"
import { VoicemailGreetingComponent } from "../voicemailGreetingComponent"
import { useQuery } from "@tanstack/react-query"
import _ from "lodash"
import { Voice, VoiceResponse } from "@/types"

export enum PageTarget {
  HOLD = "hold",
  MAIN = "main",
}
export const MainForm = ({ target = PageTarget.MAIN }) => {
  const { data: voices = [], isLoading } = useQuery({
    queryKey: ["voices"],
    queryFn: async () => {
      const response = await fetch("/api/voices")
      const data = await response.json()
      return data?.voices || [] // Changed to handle the direct voices array from Cartesia API
    },
  })

  if (isLoading) return <div>Loading...</div>

  // Group voices by accent for dropdown organization
  const voicesGroupedByAccent = _.groupBy(voices, (voice: VoiceResponse) => voice.labels.accent || "Unknown") as Voice

  return <VoicemailGreetingComponent target={target} voices={voicesGroupedByAccent} allVoices={voices as VoiceResponse[]} />
}

export default MainForm
