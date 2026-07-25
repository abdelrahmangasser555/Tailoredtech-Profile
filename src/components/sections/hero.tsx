"use client"

import { useRef } from "react"
import Link from "next/link"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ArrowRight, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { site } from "@/lib/content"

gsap.registerPlugin(useGSAP)

function BrandMark({ className }: { className?: string }) {
  const name = site.company.name
  const techIndex = name.toLowerCase().lastIndexOf("tech")
  const head = techIndex > 0 ? name.slice(0, techIndex) : name
  const tech = techIndex > 0 ? name.slice(techIndex) : ""

  return (
    <h1 data-hero="brand" className={className}>
      <span className="text-white">{head}</span>
      {tech ? <span className="text-accent">{tech}</span> : null}
    </h1>
  )
}

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const { company } = site

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } })
      tl.from("[data-hero=eyebrow]", { y: 16, opacity: 0, duration: 0.7 })
        .from("[data-hero=brand]", { y: 48, opacity: 0, duration: 1 }, "-=0.35")
        .from("[data-hero=rule]", { scaleX: 0, duration: 0.8 }, "-=0.55")
        .from(
          "[data-hero=copy]",
          { y: 24, opacity: 0, duration: 0.75, stagger: 0.08 },
          "-=0.45"
        )
        .from("[data-hero=cta]", { y: 16, opacity: 0, duration: 0.65 }, "-=0.35")
    },
    { scope: root }
  )

  return (
    <section
      ref={root}
      className="relative min-h-[100svh] overflow-hidden bg-black text-white [--accent:oklch(0.93_0.21_115)] [--accent-foreground:oklch(0.14_0.02_115)]"
    >
      {/* Subtle grid — portfolio feel */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-1/4 top-1/4 size-[42rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--accent)_18%,transparent),transparent_70%)] blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-1/4 bottom-0 size-[36rem] rounded-full bg-[radial-gradient(circle,rgba(80,120,180,0.12),transparent_70%)] blur-2xl"
      />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-center px-5 pb-20 pt-28 md:px-8 md:pb-24 md:pt-32">
        <p
          data-hero="eyebrow"
          className="mb-6 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.14em] uppercase text-white/80"
        >
          <MapPin className="size-3.5 text-accent" strokeWidth={2} />
          {company.contact.city} — Maritime Software Studio
        </p>

        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16">
          <div>
            <BrandMark className="font-display text-[clamp(2.75rem,9vw,5.75rem)] font-semibold leading-[0.95] tracking-tight" />
            <div
              data-hero="rule"
              className="mt-6 h-px w-[min(100%,22rem)] origin-left bg-white/35"
            />
            <p
              data-hero="copy"
              className="mt-6 max-w-md font-heading text-xl md:text-2xl font-medium tracking-tight text-white/90"
            >
              {company.tagline}
            </p>
          </div>

          <div className="lg:pb-1">
            <p
              data-hero="copy"
              className="max-w-sm text-sm md:text-[15px] leading-relaxed text-white/55"
            >
              {company.description}
            </p>
            <div data-hero="cta" className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="h-11 rounded-none bg-accent px-5 text-accent-foreground hover:bg-accent/90"
              >
                <Link href="/#contact">
                  {company.contact.cta}
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-11 rounded-none border-white/30 bg-transparent px-5 text-white hover:bg-white/5 hover:text-white"
              >
                <Link href="/services">
                  Solutions
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <p className="absolute bottom-8 left-5 md:left-8 font-mono text-[10px] tracking-[0.22em] uppercase text-white/35">
          Scroll ↓
        </p>
      </div>
    </section>
  )
}
