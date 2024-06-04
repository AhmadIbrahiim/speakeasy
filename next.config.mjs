/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      "/api": ["*"],
    },
  },
}

export default nextConfig
