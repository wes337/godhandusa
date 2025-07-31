import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    largePageDataBytes: 512000,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.shopify.com",
      },
    ],
  },
};

export default nextConfig;
