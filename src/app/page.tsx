import type { Metadata } from "next"
import { Hero } from "@/components/sections/hero"
import { Clients } from "@/components/sections/clients"
import { SolutionsBento } from "@/components/sections/solutions-bento"
import { LayerCollapse } from "@/components/sections/layer-collapse"
import { Stats } from "@/components/sections/stats"
import { Work } from "@/components/sections/work"
import { Timeline } from "@/components/sections/timeline"
import { Contact } from "@/components/sections/contact"
import { TrackHome } from "@/components/analytics/track-home"
import { JsonLd } from "@/components/seo/json-ld"
import { site } from "@/lib/content"
import {
  buildItemListJsonLd,
  buildPageMetadata,
  buildProfessionalServiceJsonLd,
} from "@/lib/seo"

export const metadata: Metadata = buildPageMetadata({
  title: site.company.seo.title,
  description: site.company.seo.description,
  path: "/",
  keywords: site.company.seo.keywords,
})

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={[
          buildProfessionalServiceJsonLd(site.company),
          buildItemListJsonLd(site.services.items),
        ]}
      />
      <TrackHome />
      <Hero />
      <Clients />
      <SolutionsBento />
      <LayerCollapse />
      <Stats />
      <Work />
      <Timeline />
      <Contact />
    </>
  )
}
