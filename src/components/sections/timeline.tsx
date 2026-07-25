"use client"

import { useMemo, useRef } from "react"
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion"
import { useState } from "react"
import { site } from "@/lib/content"

/**
 * Time-machine timeline.
 * Scroll advances eras one-by-one with a clean crossfade.
 * Year rail underneath — not cards, not overlapping numbers.
 */
export function Timeline() {
  const track = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { timeline } = site
  const items = timeline.items
  const count = items.length
  const [active, setActive] = useState(0)

  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start start", "end end"],
  })

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = Math.min(
      count - 1,
      Math.max(0, Math.round(p * (count - 1)))
    )
    setActive((prev) => (prev === next ? prev : next))
  })

  const fill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  const years = useMemo(() => items.map((i) => i.year), [items])

  return (
    <section
      ref={track}
      id="about"
      className="relative bg-[var(--section-light)]"
      style={{ height: `${count * 85}vh` }}
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-x-clip">
        <div className="mx-auto flex w-full max-w-6xl flex-col px-5 md:px-8">
          <p className="mb-3 font-mono text-[11px] tracking-[0.22em] uppercase text-accent">
            Company
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-semibold tracking-tight">
            {timeline.headline}
          </h2>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            {timeline.subheadline}
          </p>

          {/* Active milestone — time machine crossfade */}
          <div className="relative mt-14 min-h-[14rem] md:mt-16 md:min-h-[16rem]">
            <AnimatePresence mode="wait">
              <motion.div
                key={items[active]?.year ?? active}
                initial={
                  reduce
                    ? false
                    : { opacity: 0, y: 28, filter: "blur(6px)" }
                }
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={
                  reduce
                    ? undefined
                    : { opacity: 0, y: -24, filter: "blur(6px)" }
                }
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-x-0 top-0"
              >
                <p className="font-display text-5xl md:text-7xl font-medium tracking-tight text-accent leading-none">
                  {items[active]?.year}
                </p>
                <h3 className="mt-5 font-heading text-2xl md:text-3xl font-medium tracking-tight text-foreground">
                  {items[active]?.title}
                </h3>
                <p className="mt-3 max-w-lg text-sm md:text-base text-muted-foreground leading-relaxed">
                  {items[active]?.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Timeline rail */}
          <div className="relative mt-10 md:mt-14">
            <div className="relative h-px w-full bg-foreground/12">
              <motion.div
                style={{ width: fill }}
                className="absolute inset-y-0 left-0 bg-accent origin-left"
              />
            </div>

            <div className="mt-5 flex justify-between gap-2">
              {years.map((year, i) => {
                const on = i <= active
                const current = i === active
                return (
                  <button
                    key={year}
                    type="button"
                    aria-label={`Go to ${year}`}
                    aria-current={current ? "step" : undefined}
                    className="group flex flex-col items-center gap-2"
                    onClick={() => {
                      const el = track.current
                      if (!el) return
                      const rect = el.getBoundingClientRect()
                      const top = window.scrollY + rect.top
                      const span = el.offsetHeight - window.innerHeight
                      const target =
                        top + (count === 1 ? 0 : (i / (count - 1)) * span)
                      window.scrollTo({ top: target, behavior: "smooth" })
                    }}
                  >
                    <span
                      className={`size-2.5 rounded-full transition-all duration-300 ${
                        current
                          ? "scale-125 bg-accent"
                          : on
                            ? "bg-accent/70"
                            : "bg-foreground/20"
                      }`}
                    />
                    <span
                      className={`font-mono text-[10px] md:text-[11px] tracking-wide transition-colors duration-300 ${
                        current
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {year}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
