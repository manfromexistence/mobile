import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  typedRoutes: true,
  typescript: {
    ignoreBuildErrors: true,
  },
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
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        module: false,
        perf_hooks: false,
        fs: false,
        path: false,
      };
    }
    return config;
  },
  turbopack: {},
}

export default nextConfig
