import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/section";
import { ServicesHero } from "@/components/sections/services-hero";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/content";

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
};

export default function ServicesPage() {
  const { services } = site;

  return (
    <>
      <ServicesHero />

      <Section tone="light">
        <div className="flex flex-col">
          {services.items.map((service, i) => (
            <article
              key={service.id}
              id={service.id}
              className="group relative scroll-mt-28 py-12 md:py-14"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -left-1 -top-1 font-pixel-circle text-[clamp(3.5rem,8vw,5rem)] font-medium leading-none text-foreground/[0.06] select-none"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="relative pl-2 md:pl-8">
                <h2 className="font-pixel-circle text-2xl font-medium tracking-tight md:text-3xl">
                  {service.title}
                </h2>
                <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
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
            className="h-11 w-fit rounded-none bg-accent px-6 text-accent-foreground hover:brightness-95"
          >
            <Link href="/#contact">
              Reach out
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
