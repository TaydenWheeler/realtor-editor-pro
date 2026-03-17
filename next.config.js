/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "500mb",
    },
  },
}

module.exports = nextConfig
