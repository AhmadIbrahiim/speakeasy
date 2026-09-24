import fs from "fs"
import path from "path"
import { describe, it, expect, beforeAll } from "vitest"
import { NextRequest } from "next/server"
import { GET } from "@/app/api/background/route"

const ALLOWED_FIXTURE = "lofi-morning.mp3"
const ALLOWED_FIXTURE_PATH = path.resolve(
  process.cwd(),
  "public/assets",
  ALLOWED_FIXTURE,
)

describe("GET /api/background path-traversal allowlist", () => {
  beforeAll(() => {
    // Guard against silently passing tests if the fixture goes missing.
    if (!fs.existsSync(ALLOWED_FIXTURE_PATH)) {
      throw new Error(
        `Expected fixture missing: ${ALLOWED_FIXTURE_PATH}. ` +
          "The success-path test depends on this file existing.",
      )
    }
  })

  it("rejects absolute path file param", async () => {
    const request = new NextRequest(
      "http://localhost/api/background?file=/etc/passwd",
    )
    const response = await GET(request)
    expect(response.status).toBe(400)
    const body: any = await response.json()
    expect(body).toEqual({ error: "Invalid file parameter" })
  })

  it("rejects traversal sequences", async () => {
    const request = new NextRequest(
      "http://localhost/api/background?file=../../etc/passwd",
    )
    const response = await GET(request)
    expect(response.status).toBe(400)
    const body: any = await response.json()
    expect(body).toEqual({ error: "Invalid file parameter" })
  })

  it("rejects non-mp3 extension", async () => {
    const request = new NextRequest(
      "http://localhost/api/background?file=malicious.exe",
    )
    const response = await GET(request)
    expect(response.status).toBe(400)
    const body: any = await response.json()
    expect(body).toEqual({ error: "Invalid file parameter" })
  })

  it("redirects allowed mp3 to the GitHub-hosted asset", async () => {
    const request = new NextRequest(
      `http://localhost/api/background?file=${ALLOWED_FIXTURE}`,
    )
    const response = await GET(request)
    expect(response.status).toBe(308)
    expect(response.headers.get("location")).toBe(`https://raw.githubusercontent.com/AhmadIbrahiim/speakeasy/main/public/assets/${ALLOWED_FIXTURE}`)
  })
})
