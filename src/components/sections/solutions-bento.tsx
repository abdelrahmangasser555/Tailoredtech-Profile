"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"
import { Section } from "@/components/layout/section"
import { TextReveal, Stagger, StaggerItem } from "@/components/motion/reveal"
import { getIcon } from "@/lib/icons"
import { site } from "@/lib/content"
import { cn } from "@/lib/utils"
import Image from "next/image"

export function SolutionsBento() {
  const { services } = site

  return (
    <Section tone="dark" id="solutions">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.35fr] lg:gap-20">
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

        <Stagger className="flex flex-col" stagger={0.07}>
          {services.items.map((service, i) => (
            <StaggerItem key={service.id}>
              <ServiceRow service={service} index={i} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  )
}

function ServiceRow({
  service,
  index,
}: {
  service: (typeof site.services.items)[number]
  index: number
}) {
  const Icon = getIcon(service.icon)
  const num = String(index + 1).padStart(2, "0")

  return (
    <Link
      href={service.href}
      className="group relative block py-8 md:py-10 first:pt-2"
    >
      {/* Large low-opacity watermark number, nested into the text */}
      <span
        aria-hidden
        className="pointer-events-none absolute -left-1 -top-1 font-display text-[clamp(3.5rem,8vw,5.5rem)] font-semibold leading-none text-white/[0.06] select-none md:-left-2 md:-top-3"
      >
        {num}
      </span>

      <div className="relative flex items-start gap-4 md:gap-6 pl-2 md:pl-10">
        {/* Icon / logo — pops in on hover, no box */}
        <span className="relative mt-1 flex size-6 shrink-0 items-center justify-center">
          {service.logo ? (
            <motion.span
              initial={false}
              className="absolute inset-0 flex items-center justify-center opacity-0 scale-75 translate-y-1 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0"
            >
              <Image
                src={service.logo}
                alt=""
                width={24}
                height={24}
                className="object-contain"
              />
            </motion.span>
          ) : (
            <Icon
              className={cn(
                "size-5 text-accent opacity-0 scale-75 translate-y-1.5",
                "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                "group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0"
              )}
              strokeWidth={1.75}
              aria-hidden
            />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-heading text-xl md:text-2xl font-medium tracking-tight text-white transition-colors duration-300 group-hover:text-accent">
              {service.title}
            </h3>
            <ArrowUpRight className="size-4 shrink-0 text-white/20 transition-all duration-300 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
          <p className="mt-2 max-w-md text-sm text-white/40 leading-relaxed">
            {service.short}
          </p>
        </div>
      </div>
    </Link>
  )
}
