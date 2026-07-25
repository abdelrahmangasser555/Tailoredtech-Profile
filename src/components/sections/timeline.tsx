"use client"

import { useRef, useState } from "react"
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion"
import { site } from "@/lib/content"
import { cn } from "@/lib/utils"

/**
 * Horizontal path — years enter from the right.
 * Active year: thick dark type + lime mark. Incoming stays dimmer until focused.
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

  const x = useTransform(scrollYProgress, (p) => {
    if (reduce) return "0px"
    const i = p * (count - 1)
    return `calc(${-i} * (min(82vw, 28rem) + 12vw))`
  })

  return (
    <section
      ref={track}
      id="about"
      className="relative bg-[var(--section-light)]"
      style={{ height: `${Math.max(220, count * 95)}vh` }}
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
          <p className="mb-3 font-mono text-[11px] tracking-[0.22em] uppercase text-foreground/45">
            Company
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-semibold tracking-tight">
            {timeline.headline}
          </h2>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            {timeline.subheadline}
          </p>
        </div>

        <div className="relative mt-14 md:mt-20">
          <motion.div
            style={{ x }}
            className="flex w-max items-start gap-[12vw] pl-5 md:pl-[max(2rem,calc((100vw-72rem)/2+2rem))] will-change-transform"
          >
            {items.map((item, i) => {
              const isActive = i === active
              const isIncoming = i === active + 1
              const isPast = i < active

              return (
                <article
                  key={item.year}
                  className={cn(
                    "w-[min(82vw,28rem)] shrink-0 transition-opacity duration-500 ease-out",
                    isActive && "opacity-100",
                    isIncoming && "opacity-50",
                    isPast && "opacity-20",
                    !isActive && !isIncoming && !isPast && "opacity-25"
                  )}
                >
                  <p
                    className={cn(
                      "font-display text-6xl md:text-8xl font-semibold tracking-[-0.04em] leading-none transition-colors duration-500",
                      isActive ? "text-[#141414]" : "text-[#C4C4C4]"
                    )}
                  >
                    {item.year}
                  </p>

                  <span
                    aria-hidden
                    className={cn(
                      "mt-6 block h-1 origin-left bg-accent transition-all duration-500 ease-out",
                      isActive
                        ? "w-14 opacity-100 scale-x-100"
                        : "w-14 opacity-0 scale-x-50"
                    )}
                  />

                  <h3
                    className={cn(
                      "mt-6 font-heading text-xl md:text-2xl font-medium tracking-tight transition-colors duration-500",
                      isActive ? "text-foreground" : "text-foreground/35"
                    )}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={cn(
                      "mt-3 max-w-sm text-sm md:text-base leading-relaxed transition-colors duration-500",
                      isActive
                        ? "text-muted-foreground"
                        : "text-muted-foreground/40"
                    )}
                  >
                    {item.description}
                  </p>
                </article>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
