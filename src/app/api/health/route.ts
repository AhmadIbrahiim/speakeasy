import { NextResponse } from "next/server"

// Render's health check pings this on the configured `healthCheckPath`.
// Keep it cheap — no DB calls, no upstream HTTP, just a liveness signal.
export const dynamic = "force-dynamic"

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      ts: new Date().toISOString(),
      service: "voicemail-greeting",
    },
    { headers: { "Cache-Control": "no-store" } },
  )
}
