"use client"

import { Section } from "@/components/layout/section"
import { TextReveal, Stagger, StaggerItem } from "@/components/motion/reveal"
import { site } from "@/lib/content"

/** Year stack — no center spine / timeline line */
export function Timeline() {
  const { timeline } = site

  return (
    <Section tone="light" id="about">
      <TextReveal
        text={timeline.headline}
        className="font-heading text-4xl md:text-5xl font-semibold tracking-tight"
      />
      <p className="mt-4 max-w-sm text-sm text-muted-foreground">
        {timeline.subheadline}
      </p>

      <Stagger className="mt-16 grid gap-12 md:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
        {timeline.items.map((item) => (
          <StaggerItem key={item.year} className="flex flex-col gap-3">
            <span className="font-serif text-4xl md:text-5xl text-accent leading-none">
              {item.year}
            </span>
            <h3 className="font-heading text-lg font-medium tracking-tight">
              {item.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.description}
            </p>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  )
}
