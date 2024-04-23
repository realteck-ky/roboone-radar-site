/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  staticPageGenerationTimeout: 1000,
  reactStrictMode: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
