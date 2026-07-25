"use client"

import { useRef } from "react"
import Link from "next/link"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { site } from "@/lib/content"

gsap.registerPlugin(useGSAP)

/** Split brand so "Tech" uses accent color */
function BrandMark({ className }: { className?: string }) {
  const name = site.company.name
  const techIndex = name.toLowerCase().lastIndexOf("tech")
  const head = techIndex > 0 ? name.slice(0, techIndex) : name
  const tech = techIndex > 0 ? name.slice(techIndex) : ""

  return (
    <p data-hero="brand" className={className}>
      <span>{head}</span>
      {tech ? <span className="text-accent">{tech}</span> : null}
    </p>
  )
}

const HERO_VIDEO = site.company.heroVideo

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const { company } = site

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } })
      tl.from("[data-hero=brand]", { y: 72, opacity: 0, duration: 1.15 }).from(
        "[data-hero=copy]",
        { y: 32, opacity: 0, duration: 0.85, stagger: 0.1 },
        "-=0.55"
      ).from("[data-hero=cta]", { y: 20, opacity: 0, duration: 0.75 }, "-=0.45")
    },
    { scope: root }
  )

  return (
    <section
      ref={root}
      className="relative min-h-[100svh] flex items-end overflow-hidden bg-[var(--section-dark)] text-white"
    >
      <video
        className="absolute inset-0 size-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
      >
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>

      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_top,oklch(0.08_0.02_260/_92%)_0%,oklch(0.08_0.02_260/_55%)_42%,oklch(0.08_0.02_260/_38%)_100%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 md:px-8 pb-16 pt-36 md:pb-24 md:pt-44">
        <BrandMark className="font-display text-[clamp(2.5rem,8.5vw,7rem)] font-medium leading-[0.92] tracking-tight text-white break-words" />

        <p
          data-hero="copy"
          className="mt-8 max-w-lg font-heading text-xl md:text-2xl font-medium tracking-tight text-white/85 leading-snug"
        >
          {company.tagline}
        </p>

        <p
          data-hero="copy"
          className="mt-4 max-w-md text-sm md:text-base text-white/50 leading-relaxed"
        >
          Software for fleets, ports, and commercial desks.
        </p>

        <div data-hero="cta" className="mt-12 flex flex-wrap gap-3">
          <Button
            asChild
            size="lg"
            className="h-12 rounded-sm px-6 bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Link href="/#contact">
              {company.contact.cta}
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="ghost"
            className="h-12 rounded-sm px-6 text-white/80 hover:text-white hover:bg-white/10"
          >
            <Link href="/services">Solutions</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
