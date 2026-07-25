"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { site } from "@/lib/content"

type Phase = 0 | 1 | 2 | 3

const EASE = [0.22, 1, 0.36, 1] as const
const HOLD_MS = 1800

/**
 * Tailored stays fixed (same display font).
 * Tech side morphs (yoyo): tech → <tech /> → <code /> → vessel from left → reverse
 */
function BrandMorph() {
  const reduce = useReducedMotion()
  const [phase, setPhase] = useState<Phase>(0)
  const dirRef = useRef<1 | -1>(1)

  useEffect(() => {
    if (reduce) return

    const id = window.setInterval(() => {
      setPhase((prev) => {
        const dir = dirRef.current
        const next = prev + dir
        if (next > 3) {
          dirRef.current = -1
          return 2
        }
        if (next < 0) {
          dirRef.current = 1
          return 1
        }
        return next as Phase
      })
    }, HOLD_MS)

    return () => window.clearInterval(id)
  }, [reduce])

  const showTags = phase === 1 || phase === 2
  const inner = phase === 2 ? "code" : "tech"
  const showVessel = phase === 3

  return (
    <h1
      className="flex min-h-[1.1em] flex-wrap items-baseline font-display text-[clamp(3rem,11vw,7rem)] font-semibold leading-[0.92] tracking-[-0.04em]"
      aria-label="TailoredTech"
    >
      <span className="text-white">Tailored</span>

      <span className="relative ml-[0.02em] inline-flex min-w-[1.7em] items-center text-accent">
        <AnimatePresence mode="wait" initial={false}>
          {showVessel ? (
            <motion.span
              key="vessel"
              initial={{ opacity: 0, x: -72 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="inline-flex"
            >
              <VesselMark />
            </motion.span>
          ) : (
            <motion.span
              key={`word-${inner}-${showTags}`}
              className="inline-flex items-baseline"
              initial={{ opacity: 0, x: -28, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 20, filter: "blur(6px)" }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              {showTags && (
                <span className="mr-[0.06em] font-mono text-[0.85em] font-medium text-accent/75">
                  {"<"}
                </span>
              )}
              <span className="inline-block">{inner}</span>
              {showTags && (
                <span className="ml-[0.06em] font-mono text-[0.85em] font-medium text-accent/75">
                  {" />"}
                </span>
              )}
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </h1>
  )
}

/** Custom vessel SVG — hull rocks & sails as one moving craft */
function VesselMark() {
  return (
    <motion.svg
      viewBox="0 0 96 40"
      className="h-[0.78em] w-auto overflow-visible"
      fill="currentColor"
      aria-hidden
      initial={false}
      animate={{
        x: [0, 14, 0],
        y: [0, -2.5, 0, 1.5, 0],
        rotate: [0, -3, 1.5, -2, 0],
      }}
      transition={{
        duration: 3.6,
        ease: "easeInOut",
        repeat: Infinity,
      }}
    >
      <motion.g
        animate={{ opacity: [0.15, 0.4, 0.15], x: [0, -8, 0] }}
        transition={{ duration: 2.2, ease: "easeInOut", repeat: Infinity }}
      >
        <rect x="2" y="28" width="12" height="1.25" opacity="0.55" />
        <rect x="4" y="32" width="9" height="1.25" opacity="0.35" />
        <rect x="3" y="36" width="11" height="1.25" opacity="0.2" />
      </motion.g>

      <path d="M14 24h62l-7 10H24L14 24Z" />
      <rect x="36" y="12" width="22" height="12" />
      <rect x="42" y="6" width="10" height="6" />
      <path d="M76 24h10l-5 10H69l7-10Z" opacity="0.9" />
      <rect x="54" y="2" width="1.5" height="10" opacity="0.7" />
    </motion.svg>
  )
}

export function Hero() {
  const { company } = site

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-black text-white [--accent:#D4FF00] [--accent-foreground:#0A0A0A]">
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
        <div className="flex flex-1 flex-col justify-center gap-8 md:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <BrandMorph />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            className="flex max-w-xl flex-col gap-6"
          >
            <p className="font-heading text-lg md:text-xl font-medium tracking-tight text-white/80 leading-snug">
              {company.tagline}
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

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="font-mono text-[10px] tracking-[0.24em] uppercase text-white/30"
        >
          Scroll
        </motion.p>
      </div>
    </section>
  )
}
