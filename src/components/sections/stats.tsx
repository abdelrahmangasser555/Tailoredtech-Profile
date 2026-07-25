"use client"

import { Section } from "@/components/layout/section"
import { Stagger, StaggerItem } from "@/components/motion/reveal"
import { site } from "@/lib/content"

/** Quiet stats strip — dashed rules, vertically centered */
export function Stats() {
  const rest = site.company.stats.slice(1)

  return (
    <Section
      tone="light"
      className="!py-0"
      container={false}
    >
      <div className="mx-auto flex min-h-[42vh] w-full max-w-6xl items-center px-5 py-20 md:min-h-[48vh] md:px-8 md:py-28">
        <Stagger className="grid w-full grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-10">
          {rest.map((stat) => (
            <StaggerItem key={stat.label} className="relative pl-6">
              <span
                aria-hidden
                className="absolute bottom-1 left-0 top-1 w-px"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, rgba(10,10,10,0.28) 0 5px, transparent 5px 10px)",
                }}
              />
              <p className="font-display text-3xl md:text-4xl font-medium tracking-tight">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  )
}
