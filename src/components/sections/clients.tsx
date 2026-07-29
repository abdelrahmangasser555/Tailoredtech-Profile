"use client"

import Image from "next/image"
import Link from "next/link"
import { Section } from "@/components/layout/section"
import { TextReveal, Stagger, StaggerItem } from "@/components/motion/reveal"
import {
  NumberTicker,
  type NumberTickerMode,
} from "@/components/ui/number-ticker"
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
      <p className="mt-2 font-mono text-[10px] tracking-[0.18em] uppercase text-foreground/45 md:hidden">
        {sector}
      </p>

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
  const ticker = clients.ticker

  return (
    <Section tone="light" id="clients" container={false}>
      <div className="relative mx-auto w-full max-w-6xl px-5 py-10 md:px-8 md:py-12">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
          <TextReveal
            text={clients.headline}
            className="font-pixel-circle text-3xl md:text-4xl font-medium tracking-tight max-w-xl"
          />

          {ticker?.enabled && (
            <div className="flex shrink-0 items-end gap-3 sm:pb-0.5">
              <NumberTicker
                to={ticker.to}
                mode={ticker.mode as NumberTickerMode}
                prefix={ticker.prefix}
                plus={ticker.plus}
                decimals={ticker.decimals}
                duration={ticker.duration}
                ease="power1.out"
                className="text-[clamp(2.5rem,7vw,3.75rem)] leading-none text-foreground"
              />
              <p className="mb-1 max-w-40 font-mono text-[11px] leading-snug tracking-[0.18em] uppercase text-foreground/45">
                {ticker.label}
              </p>
            </div>
          )}
        </div>

        <Stagger
          stagger={0.08}
          className="mt-8 flex flex-wrap items-center gap-x-14 gap-y-8 md:mt-10 md:gap-x-20"
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
      </div>
    </Section>
  )
}
