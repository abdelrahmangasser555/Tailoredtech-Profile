import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { Section } from "@/components/layout/section"
import { ServicesHero } from "@/components/sections/services-hero"
import { Button } from "@/components/ui/button"
import { ServiceVisual } from "@/components/ui/service-visual"
import { LocalEditLink } from "@/components/editor/local-edit-link"
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
      <ServicesHero />

      <Section tone="light">
        <div className="flex flex-col">
          {services.items.map((service, i) => (
            <article
              key={service.id}
              id={service.id}
              className="group relative scroll-mt-28 border-b border-foreground/8 py-12 last:border-b-0 md:py-14"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -left-1 -top-1 font-pixel-circle text-[clamp(3.5rem,8vw,5rem)] font-medium leading-none text-foreground/[0.06] select-none"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="relative flex flex-col gap-6 pl-2 md:flex-row md:items-end md:justify-between md:gap-10 md:pl-8">
                <div className="max-w-2xl">
                  <div className="mb-4">
                    <ServiceVisual
                      icon={service.icon}
                      logo={service.logo}
                      title={service.title}
                      className="size-9 text-accent"
                      iconClassName="size-5"
                    />
                  </div>
                  <h2 className="font-pixel-circle text-2xl font-medium tracking-tight md:text-3xl">
                    <Link
                      href={service.href}
                      className="transition hover:text-accent"
                    >
                      {service.title}
                    </Link>
                  </h2>
                  <p className="mt-4 leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  {localEdit ? (
                    <LocalEditLink
                      href={`/services/edit/${service.id}`}
                      className="h-11 border-foreground/15 bg-transparent text-foreground/70 hover:border-accent hover:text-accent"
                    />
                  ) : null}
                  <Link
                    href={service.href}
                    className="inline-flex h-11 shrink-0 items-center gap-2 border border-foreground/15 px-5 text-sm font-medium transition hover:border-accent hover:text-accent"
                  >
                    View solution
                    <ArrowUpRight className="size-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
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
