import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Section } from "@/components/layout/section"
import { Button } from "@/components/ui/button"
import { site } from "@/lib/content"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Maritime Software Solutions",
  description:
    "Custom maritime software solutions for fleet operations, port systems, chartering, compliance, and data platforms. Built by TailoredTech.",
  keywords: [
    "maritime software solutions",
    "maritime custom software solutions",
    "fleet management software",
    "port operations software",
    "shipping software development",
  ],
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Maritime Software Solutions | TailoredTech",
    description:
      "Custom platforms for fleets, ports, and commercial maritime desks.",
  },
}

export default function ServicesPage() {
  const { services, company } = site

  return (
    <>
      <Section
        tone="dark"
        container={false}
        className="pt-36 pb-24 md:pt-44 md:pb-32"
      >
        <div className="relative mx-auto max-w-6xl px-5 md:px-8">
          <p className="mb-4 font-mono text-[11px] tracking-[0.22em] uppercase text-accent">
            Services
          </p>
          <h1 className="font-display max-w-3xl text-4xl md:text-6xl font-medium tracking-tight leading-[1.05] text-balance">
            Maritime custom software solutions
          </h1>
          <p className="mt-6 max-w-md text-base text-white/45 leading-relaxed">
            {services.subheadline}
          </p>
          <Button
            asChild
            className="mt-10 rounded-sm bg-accent text-accent-foreground hover:bg-accent/90 h-11 px-6"
          >
            <Link href="/#contact">
              {company.contact.cta}
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </Section>

      <Section tone="light">
        <div className="flex flex-col">
          {services.items.map((service, i) => (
            <article
              key={service.id}
              id={service.id}
              className={cn(
                "scroll-mt-28 grid gap-4 border-t border-border py-12 md:grid-cols-[5rem_1fr] md:gap-12"
              )}
            >
              <span className="font-mono text-xs text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="font-heading text-2xl md:text-3xl font-semibold tracking-tight">
                  {service.title}
                </h2>
                <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="dark">
        <div className="grid gap-12 md:grid-cols-3">
          {["Discovery", "Build", "Operate"].map((step, i) => (
            <div key={step}>
              <p className="font-mono text-[11px] text-accent tracking-wider">
                0{i + 1}
              </p>
              <h3 className="mt-3 font-heading text-2xl font-medium tracking-tight">
                {step}
              </h3>
              <p className="mt-3 text-sm text-white/40 leading-relaxed">
                {i === 0 && "Map operations, systems, and constraints."}
                {i === 1 && "Design and ship in focused delivery cycles."}
                {i === 2 && "Handover, training, and support when needed."}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-20 flex flex-col sm:flex-row sm:items-end gap-6 justify-between border-t border-white/10 pt-10">
          <div>
            <p className="font-heading text-2xl md:text-3xl font-medium tracking-tight">
              Ready to scope a system?
            </p>
            <p className="mt-2 text-sm text-white/40">
              We reply within one business day.
            </p>
          </div>
          <Button
            asChild
            className="rounded-sm bg-accent text-accent-foreground hover:bg-accent/90 w-fit h-11 px-6"
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
