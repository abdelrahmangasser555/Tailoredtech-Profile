"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Section } from "@/components/layout/section"
import { TextReveal, Stagger, StaggerItem } from "@/components/motion/reveal"
import { site } from "@/lib/content"

/** Editorial solutions list — no icon cards */
export function SolutionsBento() {
  const { services } = site

  return (
    <Section tone="dark" id="solutions">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="mb-4 font-mono text-[11px] tracking-[0.22em] uppercase text-accent">
            Solutions
          </p>
          <TextReveal
            text={services.headline}
            className="font-heading text-4xl md:text-5xl font-semibold tracking-tight leading-[1.05]"
          />
          <p className="mt-5 max-w-xs text-sm text-white/45 leading-relaxed">
            {services.subheadline}
          </p>
          <Link
            href="/services"
            className="mt-8 inline-flex items-center gap-2 text-sm text-white/70 hover:text-accent transition-colors"
          >
            All solutions
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>

        <Stagger className="flex flex-col" stagger={0.08}>
          {services.items.map((service, i) => (
            <StaggerItem key={service.id}>
              <Link
                href={service.href}
                className="group grid grid-cols-[3rem_1fr_auto] items-baseline gap-4 border-t border-white/10 py-7 transition-colors hover:border-accent/40 md:grid-cols-[4rem_1fr_auto] md:gap-8"
              >
                <span className="font-mono text-xs text-white/30 group-hover:text-accent transition-colors">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-heading text-xl md:text-2xl font-medium tracking-tight text-white group-hover:text-accent transition-colors">
                    {service.title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm text-white/40 leading-relaxed">
                    {service.short}
                  </p>
                </div>
                <ArrowUpRight className="size-4 text-white/20 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  )
}
