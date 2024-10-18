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
      return data?.voices
    },
  })

  if (isLoading) return <div>Loading...</div>

  const voicesGroupedByAccent = _.groupBy(voices, ({ language }: { language: string }) => language) as unknown as Voice[]

  return <VoicemailGreetingComponent target={target} voices={voicesGroupedByAccent} allVoices={voices as unknown as VoiceResponse[]} />
}

export default MainForm
