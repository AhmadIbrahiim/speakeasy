import { VoicemailGreetingComponent } from "@/components/voicemailGreetingComponent"
import { Landing } from "@/components/landing"
import Image from "next/image"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Landing>
        <VoicemailGreetingComponent />
      </Landing>
    </main>
  )
}
