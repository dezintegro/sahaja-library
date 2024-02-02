/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
   images: {
    domains: ["randomuser.me"],
  },
  output: 'standalone'
}

module.exports = nextConfig
