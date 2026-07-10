import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: process.env.NODE_ENV === "development" ? undefined : "export",
  reactStrictMode: true,
  typedRoutes: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ["next-mdx-remote"],
  serverExternalPackages: ["@mlc-ai/web-llm"],
  allowedDevOrigins: ["ncdai.localhost", "ncdai.local"],
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.chanhdai.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
      },
    ],
    qualities: [75, 100],
    unoptimized: true,
  },
  compiler:
    process.env.NODE_ENV === "production"
      ? {
          removeConsole: {
            exclude: ["error"],
          },
        }
      : undefined,
  turbopack: {},
}

export default nextConfig
