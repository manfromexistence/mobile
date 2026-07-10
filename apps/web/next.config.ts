import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@dx/ai-core", "@dx/db", "@dx/validators"],
};

export default config;
