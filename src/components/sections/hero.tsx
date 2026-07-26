"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { site } from "@/lib/content"

type Phase = 0 | 1 | 2 | 3

const EASE = [0.22, 1, 0.36, 1] as const
const HOLD_MS = 1800
const WORDS = ["tech", "code", "ship"] as const

/**
 * Tailored stays fixed.
 * Tech side (yoyo): <tech /> → <code /> → <ship /> → vessel art → reverse
 * Tags are always on for word phases.
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

  const showVessel = phase === 3
  const word = WORDS[Math.min(phase, 2)]

  return (
    <h1
      className="flex min-h-[1.1em] flex-wrap items-center font-display text-[clamp(3rem,11vw,7rem)] font-semibold leading-[0.92] tracking-[-0.04em]"
      aria-label="TailoredTech"
    >
      <span className="text-white">Tailored</span>

      <span className="relative ml-[0.02em] inline-flex h-[1em] min-w-[2.1em] items-center text-accent">
        <AnimatePresence mode="wait" initial={false}>
          {showVessel ? (
            <motion.span
              key="vessel"
              initial={{ opacity: 0, x: -80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 36 }}
              transition={{ duration: 0.75, ease: EASE }}
              className="absolute inset-y-0 left-0 inline-flex items-center"
            >
              <VesselMark />
            </motion.span>
          ) : (
            <motion.span
              key={word}
              className="inline-flex items-baseline"
              initial={{ opacity: 0, x: -32, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 22, filter: "blur(6px)" }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <span className="mr-[0.06em] font-mono text-[0.85em] font-medium text-accent/75">
                {"<"}
              </span>
              <span className="inline-block">{word}</span>
              <span className="ml-[0.06em] font-mono text-[0.85em] font-medium text-accent/75">
                {" />"}
              </span>
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </h1>
  )
}

/** Detailed vessel — sails with roll, bob, and wake */
function VesselMark() {
  return (
    <motion.svg
      viewBox="0 0 140 56"
      className="h-[0.78em] w-auto overflow-visible"
      fill="currentColor"
      aria-hidden
      animate={{
        x: [0, 16, 0],
        y: [0, -3, 0, 2, 0],
        rotate: [0, -2.8, 1.2, -1.8, 0],
      }}
      transition={{
        duration: 4,
        ease: "easeInOut",
        repeat: Infinity,
      }}
    >
      {/* Water line */}
      <motion.path
        d="M4 44c8 2 16-2 24 0s16 2 24 0 16-2 24 0 16 2 24 0 16-2 20 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.2"
        animate={{ x: [0, -10, 0] }}
        transition={{ duration: 2.8, ease: "easeInOut", repeat: Infinity }}
      />

      {/* Wake */}
      <motion.g
        animate={{ opacity: [0.12, 0.38, 0.12], x: [0, -10, 0] }}
        transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity }}
      >
        <path
          d="M2 40h16"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.55"
          fill="none"
        />
        <path
          d="M4 44h12"
          stroke="currentColor"
          strokeWidth="1.25"
          opacity="0.35"
          fill="none"
        />
        <path
          d="M6 48h10"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.2"
          fill="none"
        />
      </motion.g>

      {/* Hull shadow / keel depth */}
      <path d="M22 36h88l-10 12H34L22 36Z" opacity="0.35" />

      {/* Main hull */}
      <path d="M20 28h86l-6 10H30L20 28Z" />

      {/* Bulwark / railing */}
      <path
        d="M28 28h70"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.35"
      />

      {/* Bridge / superstructure */}
      <rect x="48" y="14" width="34" height="14" />
      <rect x="52" y="8" width="18" height="6" />
      {/* Bridge windows */}
      <g opacity="0.28" fill="#0A0A0A">
        <rect x="54" y="17" width="5" height="4" />
        <rect x="62" y="17" width="5" height="4" />
        <rect x="70" y="17" width="5" height="4" />
      </g>

      {/* Funnel */}
      <rect x="72" y="2" width="8" height="12" />
      <rect x="72" y="2" width="8" height="2.5" opacity="0.55" />
      {/* Smoke puffs */}
      <motion.g
        animate={{ y: [0, -6, -10], opacity: [0.35, 0.2, 0] }}
        transition={{ duration: 2.2, ease: "easeOut", repeat: Infinity }}
      >
        <circle cx="76" cy="0" r="2.2" opacity="0.4" />
        <circle cx="79" cy="-3" r="1.6" opacity="0.25" />
      </motion.g>

      {/* Crane / mast aft */}
      <rect x="92" y="10" width="1.5" height="18" opacity="0.75" />
      <path
        d="M93 12h14"
        stroke="currentColor"
        strokeWidth="1.25"
        fill="none"
        opacity="0.55"
      />
      <path
        d="M107 12v6"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.4"
      />

      {/* Bow flare */}
      <path d="M106 28h16l-8 10h-14l6-10Z" />
      {/* Anchor mark on bow */}
      <circle cx="114" cy="33" r="1.4" opacity="0.35" fill="#0A0A0A" />

      {/* Deck cargo blocks */}
      <rect x="34" y="22" width="10" height="6" opacity="0.55" />
      <rect x="86" y="22" width="8" height="6" opacity="0.45" />
    </motion.svg>
  )
}

export function Hero() {
  const { company } = site
  const reduce = useReducedMotion()

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-black text-white [--accent:#D4FF00] [--accent-foreground:#0A0A0A]">
      {!reduce && (
        <video
          aria-hidden
          autoPlay
          muted
          loop
          playsInline
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.48]"
        >
          <source src="/assets/hero_section.mp4" type="video/mp4" />
        </video>
      )}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/65 via-black/55 to-black/75"
      />
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

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col justify-center px-5 pb-10 pt-28 md:px-8 md:pb-12 md:pt-32">
        <div className="flex flex-col gap-8 md:gap-10">
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
      </div>
    </section>
  )
}
