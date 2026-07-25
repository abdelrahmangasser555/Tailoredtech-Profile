"use client"

import { useRef } from "react"
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useSpring,
  type MotionValue,
} from "framer-motion"

type Plate = {
  id: string
  label: string
  kind: "anchor" | "friction"
  detail: string
}

const PLATES: Plate[] = [
  {
    id: "operations",
    label: "Operations",
    kind: "anchor",
    detail: "Fleet · port · commercial",
  },
  {
    id: "vendor",
    label: "Vendor lock-in",
    kind: "friction",
    detail: "Closed platforms",
  },
  {
    id: "manual",
    label: "Manual handoffs",
    kind: "friction",
    detail: "Email · spreadsheets",
  },
  {
    id: "silos",
    label: "Data silos",
    kind: "friction",
    detail: "Disconnected systems",
  },
  {
    id: "legacy",
    label: "Legacy stacks",
    kind: "friction",
    detail: "Brittle integrations",
  },
  {
    id: "sprawl",
    label: "Tool sprawl",
    kind: "friction",
    detail: "Too many vendors",
  },
  {
    id: "it",
    label: "IT",
    kind: "anchor",
    detail: "Systems · delivery · scale",
  },
]

/**
 * Story beats:
 * 1) Complex stack + problem copy
 * 2) Friction ejects; Ops rises / IT drops
 * 3) Deck flattens to 2D
 * 4) Quiet line draws Ops → IT while how-we-work copy settles
 */
export function LayerCollapse() {
  const track = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start start", "end end"],
  })

  // Soft ease-in story feel (not snappy bounce)
  const smooth = useSpring(scrollYProgress, {
    stiffness: 32,
    damping: 30,
    mass: 0.65,
  })

  // Isometric → flat 2D after the pair settles
  const deckRotateX = useTransform(
    smooth,
    [0, 0.28, 0.42, 0.55, 0.7],
    reduce ? [0, 0, 0, 0, 0] : [54, 48, 26, 8, 0]
  )
  const deckRotateZ = useTransform(
    smooth,
    [0, 0.28, 0.42, 0.55, 0.7],
    reduce ? [0, 0, 0, 0, 0] : [-32, -28, -14, -3, 0]
  )
  const deckRotateY = useTransform(
    smooth,
    [0, 0.42, 0.55, 0.7],
    reduce ? [0, 0, 0, 0] : [12, 6, 1, 0]
  )

  const chassisOpacity = useTransform(
    smooth,
    [0.35, 0.55],
    reduce ? [0, 0] : [1, 0]
  )

  // Left copy — same column, fewer words, nudged right
  const problemOpacity = useTransform(
    smooth,
    [0, 0.22, 0.38],
    reduce ? [0, 0, 0] : [1, 0.55, 0]
  )
  const problemY = useTransform(smooth, [0, 0.38], reduce ? [0, 0] : [0, -20])

  const answerOpacity = useTransform(
    smooth,
    [0.42, 0.55, 0.68],
    reduce ? [1, 1, 1] : [0, 0.65, 1]
  )
  const answerY = useTransform(smooth, [0.42, 0.68], reduce ? [0, 0] : [18, 0])

  // Long draw — most of the remaining scroll so the link is readable
  const linkOpacity = useTransform(
    smooth,
    [0.52, 0.6],
    reduce ? [1, 1] : [0, 1]
  )
  const linkScaleY = useTransform(
    smooth,
    [0.55, 0.88],
    reduce ? [1, 1] : [0, 1]
  )

  const friction = PLATES.filter((p) => p.kind === "friction")

  return (
    <section
      ref={track}
      className="relative bg-black text-white [--accent:#D4FF00] [--accent-foreground:#0A0A0A]"
      style={{ height: "460vh" }}
      aria-label="How TailoredTech connects operations and IT"
    >
      <div className="sticky top-0 flex h-svh overflow-hidden">
        {/* Left copy — shifted right, wider, fewer words; nudged down for Y center */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-30 flex w-full max-w-6xl items-center pl-8 pt-16 md:pl-16 md:pt-20 lg:pl-24 xl:pl-28">
          <div className="relative w-[min(88vw,32rem)] translate-y-6 md:translate-y-10">
            <motion.div
              style={{ opacity: problemOpacity, y: problemY }}
              className="absolute inset-x-0 top-1/2 -translate-y-1/2"
            >
              <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-accent">
                The usual stack
              </p>
              <h2 className="mt-3 font-display text-3xl md:text-[2.75rem] font-semibold tracking-[-0.03em] leading-[1.1] text-balance">
                Agency. Operations. Systems.
              </h2>
              <p className="mt-4 max-w-md text-sm md:text-[15px] leading-relaxed text-white/45">
                Too many layers between the fleet and the build.
              </p>
            </motion.div>

            <motion.div
              style={{ opacity: answerOpacity, y: answerY }}
              className="absolute inset-x-0 top-1/2 -translate-y-1/2"
            >
              <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-accent">
                How we work
              </p>
              <h2 className="mt-3 font-display text-3xl md:text-[2.75rem] font-semibold tracking-[-0.03em] leading-[1.1] text-balance">
                Operations, linked to delivery.
              </h2>
              <p className="mt-4 max-w-md text-sm md:text-[15px] leading-relaxed text-white/45">
                One clear line from decision to production.
              </p>
            </motion.div>

            <div className="invisible" aria-hidden>
              <p className="font-mono text-[11px] tracking-[0.22em] uppercase">
                How we work
              </p>
              <h2 className="mt-3 font-display text-3xl md:text-[2.75rem] font-semibold tracking-[-0.03em] leading-[1.1]">
                Operations, linked to delivery.
              </h2>
              <p className="mt-4 max-w-md text-sm md:text-[15px] leading-relaxed">
                One clear line from decision to production.
              </p>
            </div>
          </div>
        </div>

        <div
          className="relative mx-auto flex h-full w-full max-w-6xl items-center justify-center px-4 pb-10 pt-28 md:justify-end md:px-8 md:pb-12 md:pr-10 md:pt-32 lg:pr-14"
          style={{ perspective: "1400px", perspectiveOrigin: "60% 50%" }}
        >
          <motion.div
            style={{
              rotateX: deckRotateX,
              rotateY: deckRotateY,
              rotateZ: deckRotateZ,
              transformStyle: "preserve-3d",
            }}
            className="relative h-[24rem] w-[min(88vw,30rem)] translate-y-6 will-change-transform md:h-[28rem] md:w-[34rem] md:translate-y-10"
          >
            <motion.div
              aria-hidden
              style={{ opacity: chassisOpacity, transform: "translateZ(-80px)" }}
              className="absolute inset-x-0 top-0 h-full border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent"
            />

            {PLATES.map((plate, i) => (
              <MechanismPlate
                key={plate.id}
                plate={plate}
                index={i}
                total={PLATES.length}
                progress={smooth}
                reduce={!!reduce}
                frictionIndex={
                  plate.kind === "friction"
                    ? friction.findIndex((f) => f.id === plate.id)
                    : -1
                }
                frictionCount={friction.length}
              />
            ))}

            {/* Dashed connector: Ops bottom → IT top */}
            <motion.div
              aria-hidden
              style={{
                opacity: linkOpacity,
                scaleY: linkScaleY,
              }}
              className="pointer-events-none absolute left-1/2 z-20 w-[3px] origin-top -translate-x-1/2 top-[calc(20%-78px+3.5rem-2px)] h-[calc(186px-3.5rem+4px)] md:top-[calc(20%-78px+4rem-2px)] md:h-[calc(186px-4rem+4px)]"
            >
              <div
                className="h-full w-full"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to bottom, #D4FF00 0 7px, transparent 7px 14px)",
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function MechanismPlate({
  plate,
  index,
  total,
  progress,
  reduce,
  frictionIndex,
  frictionCount,
}: {
  plate: Plate
  index: number
  total: number
  progress: MotionValue<number>
  reduce: boolean
  frictionIndex: number
  frictionCount: number
}) {
  const isAnchor = plate.kind === "anchor"
  const isOps = plate.id === "operations"

  const baseZ = (total - 1 - index) * 36
  const baseY = index * 8
  const baseX = index * 4

  let start = 0.12
  let end = 0.35
  if (plate.kind === "friction") {
    start = 0.06 + (frictionIndex / Math.max(1, frictionCount)) * 0.26
    end = start + 0.2
  } else {
    start = 0.28
    end = 0.5
  }

  const rawZ = useTransform(progress, (p) => {
    if (reduce) return 0
    if (plate.kind === "friction") {
      const t = clamp01((p - start) / (end - start))
      return baseZ + easeInCubic(t) * (200 + frictionIndex * 36)
    }
    const t = clamp01((p - start) / (end - start))
    // Flatten depth toward 0 as story ends
    const settle = easeOutCubic(t)
    const flatten = clamp01((p - 0.48) / 0.22)
    return baseZ * (1 - settle * 0.85) * (1 - easeInCubic(flatten))
  })

  const rawY = useTransform(progress, (p) => {
    if (reduce) return isOps ? -78 : 108
    if (plate.kind === "friction") {
      const t = clamp01((p - start) / (end - start))
      const dir = frictionIndex % 2 === 0 ? -1 : 1
      return baseY + easeInCubic(t) * dir * (36 + frictionIndex * 10)
    }
    const t = clamp01((p - start) / (end - start))
    // Must match connector top/height calc below
    const target = isOps ? -78 : 108
    return baseY + (target - baseY) * easeOutCubic(t)
  })

  const rawX = useTransform(progress, (p) => {
    if (reduce) return 0
    if (plate.kind === "friction") {
      const t = clamp01((p - start) / (end - start))
      const dir = frictionIndex % 2 === 0 ? -1 : 1
      return baseX + easeInCubic(t) * dir * (260 + frictionIndex * 44)
    }
    const t = clamp01((p - start) / (end - start))
    return baseX * (1 - easeOutCubic(t))
  })

  const rawRotZ = useTransform(progress, (p) => {
    if (reduce || plate.kind !== "friction") return 0
    const t = clamp01((p - start) / (end - start))
    const dir = frictionIndex % 2 === 0 ? -1 : 1
    return easeInCubic(t) * dir * 28
  })

  const opacity = useTransform(progress, (p) => {
    if (reduce || plate.kind !== "friction") return 1
    const t = clamp01((p - start) / (end - start))
    return 1 - Math.pow(t, 1.2)
  })

  // Soften extrusion when flat
  const edgeOpacity = useTransform(progress, [0.55, 0.8], [1, 0.15])

  const z = useSpring(rawZ, { stiffness: 70, damping: 22, mass: 0.5 })
  const y = useSpring(rawY, { stiffness: 70, damping: 22, mass: 0.5 })
  const x = useSpring(rawX, { stiffness: 65, damping: 20, mass: 0.5 })
  const rotateZ = useSpring(rawRotZ, { stiffness: 60, damping: 18 })

  const bg = isAnchor ? "#D4FF00" : index % 2 === 0 ? "#1c1c1c" : "#262626"
  const color = isAnchor ? "#0a0a0a" : "rgba(255,255,255,0.9)"

  return (
    <motion.div
      style={{
        x,
        y,
        z,
        rotateZ,
        opacity,
        transformStyle: "preserve-3d",
      }}
      className="absolute left-1/2 top-[20%] w-[88%] -translate-x-1/2 will-change-transform"
    >
      <motion.div
        aria-hidden
        style={{
          opacity: edgeOpacity,
          background: isAnchor ? "#9ABB00" : "rgba(0,0,0,0.55)",
          transform: "rotateX(-90deg)",
          transformOrigin: "top center",
        }}
        className="absolute inset-x-1 top-full h-3 origin-top"
      />

      <div
        className="relative flex h-14 items-center justify-between gap-4 border border-white/10 px-4 md:h-16 md:px-6"
        style={{
          background: bg,
          color,
          boxShadow:
            "0 20px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        <div className="min-w-0">
          <p className="font-display text-sm md:text-base font-semibold tracking-tight truncate">
            {plate.label}
          </p>
          <p
            className={`text-[10px] md:text-[11px] truncate ${
              isAnchor ? "text-black/50" : "text-white/40"
            }`}
          >
            {plate.detail}
          </p>
        </div>
        <span
          className={`shrink-0 font-mono text-[10px] tracking-wider ${
            isAnchor ? "text-black/40" : "text-white/25"
          }`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
    </motion.div>
  )
}

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v))
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

function easeInCubic(t: number) {
  return t * t * t
}
