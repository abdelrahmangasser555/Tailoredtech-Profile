import type { MetadataRoute } from "next"
import { site } from "@/lib/content"
import { SITE_URL } from "@/lib/seo"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.company.legalName,
    short_name: site.company.name,
    description: site.company.seo.description,
    start_url: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#050505",
    lang: "en",
    categories: ["business", "productivity"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  }
}
