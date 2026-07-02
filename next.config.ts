import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  typedRoutes: true,
  transpilePackages: ["next-mdx-remote"],
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
  // redirects and rewrites removed for static export
}

export default nextConfig
