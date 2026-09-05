import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  headers() {
    const characterCacheControl =
      process.env.NODE_ENV === "production"
        ? "public, max-age=31536000, immutable"
        : "public, max-age=0, must-revalidate";

    return [
      {
        source: "/character/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: characterCacheControl,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
