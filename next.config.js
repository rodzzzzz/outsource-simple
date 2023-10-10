// import { withContentlayer } from "next-contentlayer"
const { createContentlayerPlugin } = require("next-contentlayer")

// import "./env.mjs"
import("./env.mjs")

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "uploadthing-prod.s3.us-west-2.amazonaws.com",
        port: "",
        pathname: "**",
      },
    ],
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
