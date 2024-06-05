/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      "/api": ["*"],
    },
  },
  output: "standalone",
}

export default nextConfig
