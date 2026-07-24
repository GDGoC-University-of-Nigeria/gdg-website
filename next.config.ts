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
      {
        hostname: "res.cloudinary.com",
        protocol: "https",
      },
      {
        hostname: "lh3.googleusercontent.com",
        protocol: "https",
      },
      {
        hostname: "api.dicebear.com",
        protocol: "https",
      },
    ],
  },
  async rewrites() {
    // Accept NEXT_PUBLIC_API_URL with or without the /api/v1 prefix, matching
    // the normalisation in src/lib/api/client.ts.
    const apiOrigin = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000')
      .trim()
      .replace(/\/+$/, '')
      .replace(/\/api\/v1$/, '');

    return [
      {
        source: '/api-proxy/:path*',
        destination: `${apiOrigin}/api/v1/:path*`
      }
    ];
  }
};

export default nextConfig;
