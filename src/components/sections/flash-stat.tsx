"use client"

import { useRef } from "react"
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion"
import { site } from "@/lib/content"

/**
 * Light sticky $2B statement.
 * Tall scroll track + sticky viewport — scale/opacity via scroll progress.
 */
export function FlashStat() {
  const track = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const value = site.company.stats[0]

  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start start", "end end"],
  })

  const scale = useTransform(
    scrollYProgress,
    [0, 0.35, 0.7, 1],
    reduce ? [1, 1, 1, 1] : [0.72, 1, 1, 0.96]
  )
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.75, 1],
    reduce ? [1, 1, 1, 1] : [0.35, 1, 1, 0.85]
  )
  const labelY = useTransform(
    scrollYProgress,
    [0.15, 0.4],
    reduce ? [0, 0] : [28, 0]
  )
  const labelOpacity = useTransform(
    scrollYProgress,
    [0.15, 0.4],
    reduce ? [1, 1] : [0, 1]
  )
  const accentWidth = useTransform(
    scrollYProgress,
    [0.25, 0.55],
    reduce ? ["100%", "100%"] : ["0%", "100%"]
  )

  return (
    <section
      ref={track}
      className="relative bg-[var(--section-light)]"
      style={{ height: "180vh" }}
      aria-label={`${value.value} ${value.label}`}
    >
      <div className="sticky top-0 flex h-svh w-full items-center justify-center overflow-x-clip px-5">
        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center text-center overflow-x-clip">
          <motion.p
            style={{ scale, opacity }}
            className="font-serif text-[clamp(4rem,16vw,12rem)] leading-[0.9] tracking-tight text-foreground will-change-transform origin-center max-w-full"
          >
            <span className="text-accent">{value.value}</span>
          </motion.p>

          <motion.div
            style={{ width: accentWidth }}
            className="mt-6 h-px max-w-xs bg-accent origin-center"
          />

          <motion.div style={{ y: labelY, opacity: labelOpacity }} className="mt-6">
            <p className="font-display text-base md:text-xl tracking-tight text-foreground">
              {value.label}
            </p>
            <p className="mt-2 max-w-sm mx-auto text-sm text-muted-foreground">
              Across shipping, ports, and offshore operators we serve.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
