/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-contained server bundle (.next/standalone) for Docker / Render.
  output: "standalone",
  experimental: {
    instrumentationHook: true,
  },
  serverRuntimeConfig: {
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
  },
}

export default nextConfig
