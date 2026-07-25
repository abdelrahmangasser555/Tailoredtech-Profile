import { Hero } from "@/components/sections/hero"
import { FlashStat } from "@/components/sections/flash-stat"
import { Clients } from "@/components/sections/clients"
import { SolutionsBento } from "@/components/sections/solutions-bento"
import { Stats } from "@/components/sections/stats"
import { Work } from "@/components/sections/work"
import { Timeline } from "@/components/sections/timeline"
import { Contact } from "@/components/sections/contact"
import { site } from "@/lib/content"

const softwareLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.company.legalName,
  description: site.company.seo.description,
  areaServed: "Worldwide",
  serviceType: [
    "Maritime software solutions",
    "Maritime custom software solutions",
    "Fleet operations software",
    "Port systems development",
  ],
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareLd) }}
      />
      <Hero />
      <FlashStat />
      <Clients />
      <SolutionsBento />
      <Stats />
      <Work />
      <Timeline />
      <Contact />
    </>
  )
}
