import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date("2026-09-05"),
      changeFrequency: "monthly",
      priority: 1,
      images: [`${site.url}/case-files/sablebook-overview.webp`],
    },
  ];
}
