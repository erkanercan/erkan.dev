import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.erkan.dev" }],
        destination: "https://erkan.dev/:path*",
        permanent: true,
      },
      {
        source: "/Erkan_Ercan_CV.pdf",
        destination: "/erkan-ercan-resume.pdf",
        permanent: true,
      },
    ];
  },
  headers() {
    const production = process.env.NODE_ENV === "production";
    const characterCacheControl =
      production
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
