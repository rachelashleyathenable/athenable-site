import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["sanity", "next-sanity", "@sanity/vision"],
  devIndicators: false,
};

export default nextConfig;
