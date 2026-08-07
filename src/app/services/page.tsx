import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Section } from "@/components/layout/section"
import { ServicesHero } from "@/components/sections/services-hero"
import { Button } from "@/components/ui/button"
import { ServicesIndexList } from "@/components/analytics/services-index-list"
import { TrackServicesIndex } from "@/components/analytics/track-services-index"
import { JsonLd } from "@/components/seo/json-ld"
import { site } from "@/lib/content"
import { isLocalEditEnabled } from "@/lib/local-edit"
import { buildItemListJsonLd, buildPageMetadata } from "@/lib/seo"

const description =
  "Maritime software solutions: digital risk assessments, MOC & PCR, behaviour-based safety, and stevedore damage reporting. Tailored maritime software by TailoredTech."

export const metadata: Metadata = buildPageMetadata({
  title: "Maritime Software Solutions | TailoredTech",
  description,
  path: "/services",
  keywords: [
    "maritime software solutions",
    "maritime risk assessment software",
    "custom maritime software",
    "tailored maritime software",
    "shipping software solutions",
  ],
})

export default function ServicesPage() {
  const { services } = site
  const localEdit = isLocalEditEnabled()

  return (
    <>
      <JsonLd data={buildItemListJsonLd(services.items)} />
      <TrackServicesIndex
        services={services.items.map((s) => ({
          id: s.id,
          title: s.title,
        }))}
      />
      <ServicesHero />

      <Section tone="light">
        <ServicesIndexList services={services.items} localEdit={localEdit} />
      </Section>

      <Section tone="dark">
        <div className="grid gap-12 md:grid-cols-3">
          {["Discovery", "Build", "Operate"].map((step, i) => (
            <div key={step}>
              <p className="font-pixel-circle text-[11px] tracking-wider text-accent">
                0{i + 1}
              </p>
              <h3 className="mt-3 font-pixel-circle text-2xl font-medium tracking-tight">
                {step}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/40">
                {i === 0 && "Map operations, systems, and constraints."}
                {i === 1 && "Design and ship in focused delivery cycles."}
                {i === 2 && "Handover, training, and support when needed."}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-20 flex flex-col justify-between gap-6 border-t border-white/10 pt-10 sm:flex-row sm:items-end">
          <div>
            <p className="font-pixel-circle text-2xl font-medium tracking-tight md:text-3xl">
              Ready to scope a system?
            </p>
            <p className="mt-2 text-sm text-white/40">
              We reply within one business day.
            </p>
          </div>
          <Button
            asChild
            variant="accent"
            className="h-11 w-fit rounded-none px-6"
          >
            <Link href="/#contact">
              Reach out
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </Section>
    </>
  )
}
