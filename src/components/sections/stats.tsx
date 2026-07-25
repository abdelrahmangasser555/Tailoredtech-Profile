"use client"

import { Section } from "@/components/layout/section"
import { Stagger, StaggerItem } from "@/components/motion/reveal"
import { site } from "@/lib/content"

/** Secondary stats — quiet companions to the flash $2B section */
export function Stats() {
  const rest = site.company.stats.slice(1)

  return (
    <Section tone="light" className="!py-16 md:!py-20">
      <Stagger className="grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
        {rest.map((stat) => (
          <StaggerItem key={stat.label} className="border-l border-foreground/15 pl-5">
            <p className="font-display text-3xl md:text-4xl font-medium tracking-tight">
              {stat.value}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  )
}
