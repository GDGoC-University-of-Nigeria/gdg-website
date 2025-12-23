import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "placehold.co",
        protocol: "https",
      },
      {
        hostname: "www.google.com",
        protocol: "https",
      },
    ],
  }
};

export default nextConfig;
