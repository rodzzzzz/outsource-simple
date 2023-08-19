// import { withContentlayer } from "next-contentlayer"
const { createContentlayerPlugin } = require("next-contentlayer")

// import "./env.mjs"
import("./env.mjs")

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ["@prisma/client"],
  },
  webpack: (config) => {
    config.externals = [...config.externals, "canvas", "jsdom"]
    return config
  },
}

const withContentlayer = createContentlayerPlugin({
  // Additional Contentlayer config options
})

// export default withContentlayer(nextConfig)
module.exports = withContentlayer(nextConfig)
