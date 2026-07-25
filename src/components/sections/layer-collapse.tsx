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
    detail: "Fleet · port · commercial reality",
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
 * Isometric 3D mechanism — whole deck is angled.
 * Scroll ejects friction plates; Operations + IT settle into a clear path.
 */
export function LayerCollapse() {
  const track = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start start", "end end"],
  })

  const smooth = useSpring(scrollYProgress, {
    stiffness: 55,
    damping: 22,
    mass: 0.4,
  })

  // Deck tilts from steep isometric → flatter as layers clear
  const deckRotateX = useTransform(
    smooth,
    [0, 0.55, 0.9],
    reduce ? [52, 52, 52] : [56, 48, 18]
  )
  const deckRotateZ = useTransform(
    smooth,
    [0, 0.55, 0.9],
    reduce ? [-32, -32, -32] : [-34, -28, -8]
  )
  const deckRotateY = useTransform(
    smooth,
    [0, 0.9],
    reduce ? [12, 12] : [14, 4]
  )

  const titleOpacity = useTransform(smooth, [0.65, 0.85], reduce ? [1, 1] : [0, 1])
  const titleY = useTransform(smooth, [0.65, 0.85], reduce ? [0, 0] : [28, 0])
  const bridgeOpacity = useTransform(smooth, [0.52, 0.75], reduce ? [1, 1] : [0, 1])
  const bridgeScale = useSpring(
    useTransform(smooth, [0.55, 0.88], reduce ? [1, 1] : [0.15, 1]),
    { stiffness: 170, damping: 12 }
  )

  const friction = PLATES.filter((p) => p.kind === "friction")

  return (
    <section
      ref={track}
      className="relative bg-black text-white [--accent:oklch(0.93_0.21_115)] [--accent-foreground:oklch(0.14_0.02_115)]"
      style={{ height: "250vh" }}
      aria-label="Mechanism between operations and IT"
    >
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden">
        <div className="mx-auto flex w-full max-w-6xl shrink-0 items-end justify-between gap-6 px-5 pt-24 md:px-8 md:pt-28">
          <div>
            <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-accent">
              How we work
            </p>
            <h2 className="mt-3 max-w-lg font-heading text-3xl md:text-4xl font-semibold tracking-tight text-balance">
              A complex stack — then we take it apart.
            </h2>
          </div>
          <p className="hidden max-w-[13rem] text-right text-xs text-white/40 md:block leading-relaxed">
            Scroll to eject the friction between Operations and IT.
          </p>
        </div>

        {/* Stage with deep perspective */}
        <div
          className="relative mx-auto flex min-h-0 flex-1 w-full max-w-6xl items-center justify-center px-4 pb-32 pt-4 md:px-8"
          style={{ perspective: "1400px", perspectiveOrigin: "50% 45%" }}
        >
          {/* Soft ground shadow under the deck */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-[18%] left-1/2 h-16 w-[min(70%,28rem)] -translate-x-1/2 rounded-[100%] bg-accent/15 blur-2xl"
          />

          <motion.div
            style={{
              rotateX: deckRotateX,
              rotateY: deckRotateY,
              rotateZ: deckRotateZ,
              transformStyle: "preserve-3d",
            }}
            className="relative h-[22rem] w-[min(92vw,34rem)] md:h-[26rem] md:w-[38rem] will-change-transform"
          >
            {/* Chassis rails */}
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-full border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent"
              style={{ transform: "translateZ(-80px)", transformStyle: "preserve-3d" }}
            />
            <div
              aria-hidden
              className="absolute -left-3 top-0 h-full w-1.5 bg-white/15"
              style={{ transform: "translateZ(-40px) rotateY(-8deg)" }}
            />
            <div
              aria-hidden
              className="absolute -right-3 top-0 h-full w-1.5 bg-white/15"
              style={{ transform: "translateZ(-40px) rotateY(8deg)" }}
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

            {/* Direct path beam */}
            <motion.div
              style={{
                opacity: bridgeOpacity,
                scaleX: bridgeScale,
                transform: "translateZ(90px)",
              }}
              className="absolute left-[8%] right-[8%] top-1/2 z-[60] h-1.5 -translate-y-1/2 bg-accent origin-center shadow-[0_0_24px_color-mix(in_oklch,var(--accent)_70%,transparent)]"
            />
            <motion.p
              style={{
                opacity: bridgeOpacity,
                transform: "translateZ(100px)",
              }}
              className="absolute left-1/2 top-[calc(50%+1.1rem)] z-[60] -translate-x-1/2 font-mono text-[10px] tracking-[0.22em] uppercase text-accent"
            >
              TailoredTech
            </motion.p>
          </motion.div>
        </div>

        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="pointer-events-none absolute inset-x-0 bottom-10 mx-auto max-w-lg px-5 text-center md:bottom-12"
        >
          <p className="font-heading text-xl md:text-2xl font-semibold tracking-tight">
            Operations ↔ IT. No middle noise.
          </p>
          <p className="mt-2 text-sm text-white/40">
            We remove the layers that slow maritime delivery.
          </p>
        </motion.div>
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

  // Stack along Z inside the tilted deck (like a deck of cards)
  const baseZ = (total - 1 - index) * 36
  const baseY = index * 8
  const baseX = index * 4

  let start = 0.12
  let end = 0.35
  if (plate.kind === "friction") {
    start = 0.1 + (frictionIndex / Math.max(1, frictionCount)) * 0.42
    end = start + 0.24
  } else {
    start = 0.5
    end = 0.8
  }

  const rawZ = useTransform(progress, (p) => {
    if (reduce) return baseZ
    if (plate.kind === "friction") {
      const t = clamp01((p - start) / (end - start))
      return baseZ + bounceOut(t) * (220 + frictionIndex * 40)
    }
    // Anchors pull toward mid depth
    const t = clamp01((p - start) / (end - start))
    const mid = ((total - 1) / 2) * 36
    return baseZ + (mid - baseZ) * easeOutCubic(t) * 0.55
  })

  const rawY = useTransform(progress, (p) => {
    if (reduce) return baseY
    if (plate.kind === "friction") {
      const t = clamp01((p - start) / (end - start))
      const dir = frictionIndex % 2 === 0 ? -1 : 1
      return baseY + bounceOut(t) * dir * (40 + frictionIndex * 12)
    }
    const t = clamp01((p - start) / (end - start))
    return baseY * (1 - easeOutCubic(t) * 0.7)
  })

  const rawX = useTransform(progress, (p) => {
    if (reduce) return baseX
    if (plate.kind === "friction") {
      const t = clamp01((p - start) / (end - start))
      const dir = frictionIndex % 2 === 0 ? -1 : 1
      return baseX + bounceOut(t) * dir * (280 + frictionIndex * 50)
    }
    const t = clamp01((p - start) / (end - start))
    return baseX * (1 - easeOutCubic(t))
  })

  const rawRotZ = useTransform(progress, (p) => {
    if (reduce || plate.kind !== "friction") return 0
    const t = clamp01((p - start) / (end - start))
    const dir = frictionIndex % 2 === 0 ? -1 : 1
    return bounceOut(t) * dir * 36
  })

  const opacity = useTransform(progress, (p) => {
    if (reduce || plate.kind !== "friction") return 1
    const t = clamp01((p - start) / (end - start))
    return 1 - Math.pow(t, 1.15)
  })

  const z = useSpring(rawZ, { stiffness: 100, damping: 16, mass: 0.45 })
  const y = useSpring(rawY, { stiffness: 110, damping: 15, mass: 0.45 })
  const x = useSpring(rawX, { stiffness: 95, damping: 14, mass: 0.45 })
  const rotateZ = useSpring(rawRotZ, { stiffness: 90, damping: 12 })

  const bg = isAnchor
    ? isOps
      ? "color-mix(in oklch, var(--accent) 92%, black)"
      : "color-mix(in oklch, var(--accent) 48%, white)"
    : index % 2 === 0
      ? "rgba(28,28,28,0.95)"
      : "rgba(38,38,38,0.95)"
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
      className="absolute left-1/2 top-[12%] w-[88%] -translate-x-1/2 will-change-transform"
    >
      {/* Extruded edge for thickness */}
      <div
        aria-hidden
        className="absolute inset-x-1 top-full h-3 origin-top"
        style={{
          background: isAnchor
            ? "color-mix(in oklch, var(--accent) 40%, black)"
            : "rgba(0,0,0,0.55)",
          transform: "rotateX(-90deg) translateZ(0px)",
          transformOrigin: "top center",
        }}
      />

      <div
        className="relative flex h-14 items-center justify-between gap-4 border border-white/10 px-4 md:h-16 md:px-6"
        style={{
          background: bg,
          color,
          boxShadow:
            "0 25px 50px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        {/* Bolt details */}
        <span
          aria-hidden
          className={`absolute left-2 top-2 size-1.5 rounded-full ${
            isAnchor ? "bg-black/35" : "bg-white/20"
          }`}
        />
        <span
          aria-hidden
          className={`absolute right-2 top-2 size-1.5 rounded-full ${
            isAnchor ? "bg-black/35" : "bg-white/20"
          }`}
        />

        <div className="min-w-0 pl-2">
          <p className="font-heading text-sm md:text-base font-semibold tracking-tight truncate">
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

function bounceOut(t: number) {
  const n1 = 7.5625
  const d1 = 2.75
  if (t < 1 / d1) return n1 * t * t
  if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75
  if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375
  return n1 * (t -= 2.625 / d1) * t + 0.984375
}
