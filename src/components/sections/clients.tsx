"use client"

import Image from "next/image"
import Link from "next/link"
import { Section } from "@/components/layout/section"
import { TextReveal, Stagger, StaggerItem } from "@/components/motion/reveal"
import { site } from "@/lib/content"
import { cn } from "@/lib/utils"


function ClientLogoCard({
  name,
  logo,
  url,
  sector,
}: {
  name: string
  logo: string
  url: string
  sector: string
}) {
  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${name} — ${sector}`}
      className="group relative inline-flex outline-none"
    >
      <div className="relative flex h-20 items-center md:h-24">
        <Image
          src={logo}
          alt=""
          width={220}
          height={80}
          className="h-full w-auto max-w-[min(100%,14rem)] object-contain object-left grayscale transition-[filter] duration-500 ease-out group-hover:grayscale-0 group-focus-visible:grayscale-0"
        />
      </div>

      <div
        role="tooltip"
        className={cn(
          "pointer-events-none absolute bottom-full left-0 z-20 mb-3 w-[min(16rem,calc(100vw-2.5rem))]",
          "opacity-0 translate-y-1.5 scale-[0.97]",
          "transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100",
          "group-focus-visible:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:scale-100"
        )}
      >
        <div className="border border-foreground/12 bg-white px-4 py-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
          <p className="mb-2 flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase text-foreground/45">
            <span aria-hidden className="size-1.5 bg-accent" />
            {sector}
          </p>
          <p className="font-pixel-circle text-lg font-medium tracking-tight text-foreground">
            {name}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">Visit site</p>
        </div>
        <span
          aria-hidden
          className="absolute -bottom-1.5 left-6 size-2.5 rotate-45 border-r border-b border-foreground/12 bg-white"
        />
      </div>
    </Link>
  )
}

export function Clients() {
  const { clients } = site

  return (
    <Section tone="light" id="clients" className="!py-20 md:!py-24">
      <TextReveal
        text={clients.headline}
        className="font-pixel-circle text-3xl md:text-4xl font-medium tracking-tight max-w-xl"
      />
      <p className="mt-4 max-w-md text-sm text-muted-foreground">
        {clients.subheadline}
      </p>

      <Stagger
        stagger={0.08}
        className="mt-12 flex flex-wrap items-center gap-x-14 gap-y-10 md:mt-14 md:gap-x-20"
      >
        {clients.items.map((client) => (
          <StaggerItem key={client.id}>
            <ClientLogoCard
              name={client.name}
              logo={client.logo}
              url={client.url}
              sector={client.sector}
            />
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  )
}
