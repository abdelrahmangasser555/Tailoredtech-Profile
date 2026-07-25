"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { site } from "@/lib/content"

function BrandMark() {
  const name = site.company.name
  const i = name.toLowerCase().lastIndexOf("tech")
  const head = i > 0 ? name.slice(0, i) : name
  const tech = i > 0 ? name.slice(i) : ""

  return (
    <h1 className="font-display text-[clamp(3rem,11vw,7rem)] font-semibold leading-[0.92] tracking-[-0.04em]">
      <span className="text-white">{head}</span>
      <span className="text-accent">{tech}</span>
    </h1>
  )
}

export function Hero() {
  const { company } = site
  const root = useRef<HTMLElement>(null)

  return (
    <section
      ref={root}
      className="relative min-h-[100svh] overflow-hidden bg-black text-white [--accent:#D4FF00] [--accent-foreground:#0A0A0A]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 40%, black 20%, transparent 75%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-24 size-[28rem] rounded-full bg-[radial-gradient(circle,rgba(212,255,0,0.16),transparent_68%)]"
      />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-between px-5 pb-10 pt-28 md:px-8 md:pb-12 md:pt-32">
        <div className="flex flex-1 flex-col justify-center">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-5 font-mono text-[11px] tracking-[0.18em] uppercase text-white/55"
          >
            {company.contact.city} · Maritime software
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            <BrandMark />
          </motion.div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 h-px w-40 origin-left bg-white/25 md:w-56"
          />

          <div className="mt-8 grid gap-8 md:grid-cols-[1fr_1fr] md:items-end md:gap-16">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-md font-heading text-xl md:text-2xl font-medium tracking-tight text-white/90 leading-snug"
            >
              {company.tagline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-6 md:items-start"
            >
              <p className="max-w-sm text-sm leading-relaxed text-white/45">
                Custom platforms for fleets, ports, and commercial desks —
                built with the same clarity we expect from production systems.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/#contact"
                  className="inline-flex h-11 items-center gap-2 bg-accent px-5 text-sm font-medium text-accent-foreground transition hover:brightness-95"
                >
                  {company.contact.cta}
                  <ArrowUpRight className="size-4" />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex h-11 items-center gap-2 border border-white/25 px-5 text-sm font-medium text-white transition hover:bg-white/5"
                >
                  Solutions
                  <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="font-mono text-[10px] tracking-[0.24em] uppercase text-white/30"
        >
          Scroll
        </motion.p>
      </div>
    </section>
  )
}
