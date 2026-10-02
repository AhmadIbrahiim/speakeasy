"use client"
import { Landing } from "@/components/landing"
import { MainForm, PageTarget } from "@/components/server/mainForm"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

// Create a client
const queryClient = new QueryClient()
export default function HoldClient() {
  return (
    <QueryClientProvider client={queryClient}>
      <Landing>
        <MainForm target={PageTarget.HOLD} />
      </Landing>
    </QueryClientProvider>
  )
}
