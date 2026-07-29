"use client"

import { useRef, useState } from "react"
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion"
import { site } from "@/lib/content"
import { cn } from "@/lib/utils"
import {
  TimelineAmbient,
  TimeTunnel,
  TimelineEngineOrb,
} from "@/components/sections/timeline-ambient"

const INTRO_END = 0.16
const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Intro headline → fades into time tunnel. Years travel through depth on scroll.
 * Light surface: black / grey only.
 */
export function Timeline() {
  const track = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { timeline } = site
  const items = timeline.items
  const count = items.length
  const [active, setActive] = useState(0)
  const [dir, setDir] = useState<1 | -1>(1)
  const [pastIntro, setPastIntro] = useState(false)
  const [travelP, setTravelP] = useState(0)

  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start start", "end end"],
  })

  const travelProgress = useTransform(scrollYProgress, [INTRO_END, 1], [0, 1])

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setPastIntro(p >= INTRO_END * 0.9)
  })

  useMotionValueEvent(travelProgress, "change", (p) => {
    setTravelP(p)
    const next = Math.min(count - 1, Math.max(0, Math.round(p * (count - 1))))
    setActive((prev) => {
      if (prev === next) return prev
      setDir(next > prev ? 1 : -1)
      return next
    })
  })

  const introOpacity = useTransform(scrollYProgress, [0, INTRO_END * 0.55, INTRO_END], [1, 0.35, 0])
  const introY = useTransform(scrollYProgress, [0, INTRO_END], [0, -100])
  const introScale = useTransform(scrollYProgress, [0, INTRO_END], [1, 0.88])
  const introBlur = useTransform(scrollYProgress, [0, INTRO_END], [0, 10])
  const introZ = useTransform(scrollYProgress, [0, INTRO_END], [0, 280])
  const introFilter = useTransform(introBlur, (b) => `blur(${b}px)`)
  const introTranslate = useTransform(introZ, (z) => `0 0 ${z}px`)

  const yearsLift = useTransform(scrollYProgress, [0, INTRO_END, INTRO_END + 0.08], [80, 40, 0])
  const yearsOpacity = useTransform(scrollYProgress, [INTRO_END * 0.4, INTRO_END + 0.06], [0, 1])

  const activeItem = items[active]
  const engineVisible = !pastIntro || activeItem.scene === "founding"
  const engineSpeed = 2.2 + travelP * 2.5
  const introVh = 70
  const travelVh = count * 115

  return (
    <section
      ref={track}
      id="about"
      className="relative bg-[var(--section-light)]"
      style={{ height: `${introVh + travelVh}vh` }}
    >
      <div
        className="sticky top-0 h-svh overflow-hidden"
        style={{ perspective: "1400px", perspectiveOrigin: "50% 42%" }}
      >
        <TimeTunnel progress={scrollYProgress} reduce={reduce} introEnd={INTRO_END} />
        <TimelineEngineOrb
          progress={scrollYProgress}
          reduce={!!reduce}
          introEnd={INTRO_END}
          visible={!reduce && engineVisible}
          speed={engineSpeed}
        />
        <TimelineAmbient
          item={activeItem}
          visible={!reduce}
          reduce={!!reduce}
          pastIntro={pastIntro}
        />

        {/* Intro — visible at start, flies past camera into the tunnel */}
        <motion.div
          className="absolute inset-x-0 top-[14%] z-20 mx-auto w-full max-w-6xl px-5 md:top-[20%] md:px-8"
          style={
            reduce
              ? undefined
              : {
                  opacity: introOpacity,
                  y: introY,
                  scale: introScale,
                  filter: introFilter,
                  translate: introTranslate,
                  transformStyle: "preserve-3d",
                }
          }
        >
          <p className="mb-3 font-mono text-[11px] tracking-[0.22em] uppercase text-foreground/45">
            Company
          </p>
          <h2 className="font-pixel-circle text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-[#141414]">
            {timeline.headline}
          </h2>
          <p className="mt-4 max-w-md text-sm md:text-base text-muted-foreground">
            {timeline.subheadline}
          </p>
        </motion.div>

        {/* Year stack — rises into view after intro exits */}
        <motion.div
          className="absolute inset-x-0 bottom-[8%] z-20 mx-auto w-full max-w-6xl px-5 md:bottom-[12%] md:px-8"
          style={{
            y: reduce ? 0 : yearsLift,
            opacity: reduce ? 1 : yearsOpacity,
          }}
        >
          <div
            className="relative h-[min(38vh,17rem)] md:h-[min(48vh,22rem)]"
            style={{ transformStyle: "preserve-3d" }}
          >
            {items.map((item, i) => {
              const offset = i - active
              const isActive = offset === 0
              const scale = isActive
                ? 1
                : offset > 0
                  ? Math.max(0.5, 0.75 - offset * 0.12)
                  : 1.22 + Math.abs(offset) * 0.08
              const blur = isActive ? 0 : Math.min(12, Math.abs(offset) * 4)
              const opacity = isActive ? 1 : Math.abs(offset) === 1 ? 0.28 : 0
              const translateZ = isActive
                ? 0
                : offset > 0
                  ? -280 * offset
                  : 200 * Math.abs(offset)

              return (
                <div
                  key={item.year}
                  className="absolute inset-x-0 top-0"
                  style={{
                    transform: reduce ? undefined : `translateZ(${translateZ}px)`,
                    transformStyle: "preserve-3d",
                    zIndex: isActive ? 30 : 15 - Math.abs(offset),
                    pointerEvents: isActive ? "auto" : "none",
                    transition: "transform 0.85s cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  <motion.article
                    className="will-change-transform"
                    initial={false}
                    animate={
                      reduce
                        ? { opacity: isActive ? 1 : 0, x: 0, y: 0, scale: 1, filter: "blur(0px)", rotateX: 0 }
                        : {
                            opacity,
                            scale,
                            filter: `blur(${blur}px)`,
                            y: offset > 0 ? 44 * offset : offset < 0 ? -28 : 0,
                            x: offset !== 0 ? dir * offset * 14 : 0,
                            rotateX: offset > 0 ? 10 * offset : offset < 0 ? -6 : 0,
                          }
                    }
                    transition={{ duration: 0.85, ease: EASE }}
                    style={{ transformOrigin: "50% 35%" }}
                  >
                    <YearCard item={item} isActive={isActive} />
                  </motion.article>
                </div>
              )
            })}
          </div>

          <motion.div
            className="mt-6 flex items-center gap-3 md:mt-8"
            style={{ opacity: reduce ? 1 : yearsOpacity }}
          >
            {items.map((item, i) => {
              const isActive = i === active
              const isPast = i < active
              return (
                <div key={item.year} className="flex items-center gap-3">
                  {i > 0 && (
                    <span
                      aria-hidden
                      className={cn(
                        "h-px w-8 md:w-12 transition-colors duration-500",
                        isPast || isActive ? "bg-foreground/40" : "bg-foreground/12"
                      )}
                    />
                  )}
                  <span
                    className={cn(
                      "font-mono text-[10px] tracking-[0.18em] uppercase transition-colors duration-500",
                      isActive ? "text-foreground" : isPast ? "text-foreground/45" : "text-foreground/22"
                    )}
                  >
                    {item.year}
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="year-tick"
                      aria-hidden
                      className="size-1.5 bg-foreground"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </div>
              )
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function YearCard({
  item,
  isActive,
}: {
  item: (typeof site.timeline.items)[number]
  isActive: boolean
}) {
  return (
    <div className="max-w-xl">
      <AnimatePresence mode="wait">
        {isActive && (
          <motion.div
            key={item.year}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24, scale: 0.96 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <p
              className="font-pixel-circle text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-medium tracking-[-0.04em] leading-none text-[#0A0A0A]"
              style={{ WebkitTextStroke: "1px #0A0A0A", paintOrder: "stroke fill" }}
            >
              {item.year}
            </p>

            <motion.span
              aria-hidden
              className="mt-6 block h-1 origin-left bg-[#0A0A0A]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
              style={{ width: "4rem" }}
            />

            <h3 className="mt-6 font-heading text-xl md:text-2xl font-medium tracking-tight text-[#141414]">
              {item.title}
            </h3>
            <p className="mt-3 max-w-md text-sm md:text-base leading-relaxed text-[#141414]/80">
              {item.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {!isActive && (
        <div aria-hidden className="opacity-40">
          <p className="font-pixel-circle text-5xl sm:text-6xl md:text-8xl font-medium tracking-[-0.04em] leading-none text-[#141414]">
            {item.year}
          </p>
          <h3 className="mt-6 font-heading text-xl md:text-2xl font-medium tracking-tight">
            {item.title}
          </h3>
        </div>
      )}
    </div>
  )
}
