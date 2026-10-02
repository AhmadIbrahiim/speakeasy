"use client"
import { Landing } from "@/components/landing"
import { MainForm } from "@/components/server/mainForm"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

// Create a client
const queryClient = new QueryClient()

export default function HomeClient() {
  return (
    <QueryClientProvider client={queryClient}>
      <Landing>
        <MainForm />
      </Landing>
    </QueryClientProvider>
  )
}
