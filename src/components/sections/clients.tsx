"use client"

import Link from "next/link"
import { Section } from "@/components/layout/section"
import { TextReveal, Stagger, StaggerItem } from "@/components/motion/reveal"
import { site } from "@/lib/content"

export function Clients() {
  const { clients } = site

  return (
    <Section tone="light" id="clients" className="!py-20 md:!py-24">
      <TextReveal
        text={clients.headline}
        className="font-heading text-3xl md:text-4xl font-semibold tracking-tight max-w-xl"
      />
      <p className="mt-4 max-w-md text-sm text-muted-foreground">
        {clients.subheadline}
      </p>

      <Stagger
        stagger={0.06}
        className="mt-12 flex flex-wrap items-baseline gap-x-10 gap-y-5 md:mt-14 md:gap-x-14"
      >
        {clients.items.map((client) => (
          <StaggerItem key={client.id}>
            <Link
              href={client.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-heading text-lg md:text-xl font-medium tracking-tight text-foreground/55 transition-colors hover:text-foreground"
            >
              {client.name}
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  )
}
