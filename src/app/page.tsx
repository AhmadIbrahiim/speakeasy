"use client"
import { Landing } from "@/components/landing"
import { MainForm } from "@/components/server/mainForm"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

// Create a client
const queryClient = new QueryClient()
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 max-md:p-8">
      <QueryClientProvider client={queryClient}>
        <Landing>
          <MainForm />
        </Landing>
      </QueryClientProvider>
    </main>
  )
}
