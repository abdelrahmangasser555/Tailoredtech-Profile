"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { Globe3D, type GlobeMarker } from "@/components/ui/3d-globe"
import { GlyphMatrix } from "@/components/ui/glyph-matrix"
import { site } from "@/lib/content"

type Phase = 0 | 1 | 2 | 3

const EASE = [0.22, 1, 0.36, 1] as const
const HOLD_MS = 1800
const WORDS = ["tech", "code", "ship"] as const

const HERO_MARKERS: GlobeMarker[] = [
  {
    lat: 51.9225,
    lng: 4.4792,
    src: "https://assets.aceternity.com/avatars/1.webp",
    label: "Rotterdam",
  },
  {
    lat: 1.3521,
    lng: 103.8198,
    src: "https://assets.aceternity.com/avatars/12.webp",
    label: "Singapore",
  },
  {
    lat: 25.2048,
    lng: 55.2708,
    src: "https://assets.aceternity.com/avatars/10.webp",
    label: "Dubai",
  },
  {
    lat: 31.2304,
    lng: 121.4737,
    src: "https://assets.aceternity.com/avatars/9.webp",
    label: "Shanghai",
  },
  {
    lat: 53.5511,
    lng: 9.9937,
    src: "https://assets.aceternity.com/avatars/2.webp",
    label: "Hamburg",
  },
  {
    lat: 33.7405,
    lng: -118.271,
    src: "https://assets.aceternity.com/avatars/4.webp",
    label: "Los Angeles",
  },
  {
    lat: 35.1796,
    lng: 129.0756,
    src: "https://assets.aceternity.com/avatars/13.webp",
    label: "Busan",
  },
  {
    lat: 29.7604,
    lng: -95.3698,
    src: "https://assets.aceternity.com/avatars/5.webp",
    label: "Houston",
  },
  {
    lat: -33.8688,
    lng: 151.2093,
    src: "https://assets.aceternity.com/avatars/4.webp",
    label: "Sydney",
  },
  {
    lat: 40.7128,
    lng: -74.006,
    src: "https://assets.aceternity.com/avatars/1.webp",
    label: "New York",
  },
  {
    lat: -22.9068,
    lng: -43.1729,
    src: "https://assets.aceternity.com/avatars/8.webp",
    label: "Rio de Janeiro",
  },
  {
    lat: 51.5074,
    lng: -0.1278,
    src: "https://assets.aceternity.com/avatars/2.webp",
    label: "London",
  },
]

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
      className="flex min-h-[1.1em] flex-nowrap items-center whitespace-nowrap font-display text-[clamp(2rem,7.2vw,6.25rem)] font-semibold leading-[0.92] tracking-[-0.04em]"
      aria-label="TailoredTech"
    >
      <span className="text-white">Tailored</span>

      <span className="relative ml-[0.02em] inline-flex h-[1em] min-w-[2.1em] shrink-0 items-center text-accent">
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
    <section className="relative min-h-svh overflow-hidden bg-black text-white [--accent:#D4FF00] [--accent-foreground:#0A0A0A]">
      {/* Glyph field — readable on the edges, softens behind the copy */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-90"
        style={{
          maskImage:
            "radial-gradient(ellipse 52% 48% at 36% 44%, transparent 0%, rgba(0,0,0,0.35) 42%, black 72%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 52% 48% at 36% 44%, transparent 0%, rgba(0,0,0,0.35) 42%, black 72%)",
          filter: "brightness(1.35) contrast(1.15)",
        }}
      >
        <GlyphMatrix
          className="h-full w-full"
          color="#D4FF00"
          cellSize={15}
          mutationRate={0.035}
          interval={100}
          fadeBottom={0.25}
          glyphs="01·•<>/=+*"
        />
      </div>

      {/*
        Mobile: brand → globe peek
        Desktop: brand left | oversized globe right
        CTAs: bottom-left of the panel (not flush to the edge)
      */}
      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-7xl flex-col justify-center px-5 pt-20 pb-28 md:px-8 lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-2 lg:overflow-visible lg:pt-16 lg:pb-28 lg:-translate-y-6 xl:gap-6">
        <div className="relative z-20 flex flex-col lg:max-w-xl xl:max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <BrandMorph />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.22, ease: EASE }}
          className="relative z-10 mt-8 -mx-5 h-[34vh] min-h-[200px] w-screen overflow-hidden md:-mx-8 lg:mx-0 lg:mt-0 lg:h-[min(78vh,680px)] lg:min-h-0 lg:w-[min(62vw,760px)] lg:translate-x-[12%] lg:scale-[1.12] lg:justify-self-end lg:overflow-visible"
        >
          <div className="absolute left-1/2 top-0 w-[145%] -translate-x-1/2 lg:relative lg:left-auto lg:top-auto lg:h-full lg:w-full lg:translate-x-0">
            <Globe3D
              markers={HERO_MARKERS}
              className="h-[min(92vw,540px)] w-full lg:h-full"
              config={{
                showAtmosphere: false,
                bumpScale: 5,
                autoRotateSpeed: reduce ? 0 : 0.28,
                ambientIntensity: 0.5,
                pointLightIntensity: 1.6,
                backgroundColor: null,
              }}
            />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
        className="absolute bottom-10 left-5 z-30 flex flex-wrap gap-3 md:bottom-14 md:left-8 lg:bottom-16 lg:left-10"
      >
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
      </motion.div>
    </section>
  )
}
