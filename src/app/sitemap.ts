import type { MetadataRoute } from "next"
import { getServiceSlugs } from "@/lib/content"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://tailoredtech.io"
  const servicePages = getServiceSlugs().map((slug) => ({
    url: `${base}/services/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${base}/services`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...servicePages,
  ]
}
