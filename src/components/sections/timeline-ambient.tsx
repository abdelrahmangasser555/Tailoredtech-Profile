"use client"

import * as React from "react"
import { ColorPanels, Dithering, Heatmap } from "@paper-design/shaders-react"
import { useMemo } from "react"
import {
  motion,
  AnimatePresence,
  type MotionValue,
  useTransform,
} from "framer-motion"
import type { Timeline } from "@/lib/content"

type TimelineItem = Timeline["items"][number]

const EASE = [0.22, 1, 0.36, 1] as const
const INK = "#141414"

const MemoColorPanels = React.memo(ColorPanels)
const MemoDithering = React.memo(Dithering)
const MemoHeatmap = React.memo(Heatmap)

/** Grey engine ramp — no lime on light surfaces */
const ENGINE_GREY = ["#0A0A0A", "#2A2A2A", "#4A4A4A", "#7A7A7A"] as const
const HEATMAP_GREY = [
  "#F0F0F0",
  "#D4D4D4",
  "#A8A8A8",
  "#7A7A7A",
  "#4A4A4A",
  "#2A2A2A",
  "#141414",
] as const

const draw = (visible: boolean, delay = 0, duration = 1.1) => ({
  initial: { pathLength: 0, opacity: 0 },
  animate: visible
    ? { pathLength: 1, opacity: 1 }
    : { pathLength: 0, opacity: 0 },
  transition: { duration, delay, ease: EASE },
})

function ShaderPlate({
  visible,
  className,
  mask,
  children,
}: {
  visible: boolean
  className?: string
  mask?: string
  children: React.ReactNode
}) {
  return (
    <motion.div
      className={className}
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.85, ease: EASE }}
      style={{
        WebkitMaskImage: mask,
        maskImage: mask,
      }}
    >
      {children}
    </motion.div>
  )
}

/* ─── Time tunnel — scroll-driven depth corridor ─── */

export function TimeTunnel({
  progress,
  reduce,
  introEnd = 0.14,
}: {
  progress: MotionValue<number>
  reduce: boolean | null
  introEnd?: number
}) {
  const rings = [0, 1, 2, 3, 4, 5, 6, 7]
  const tunnelOpacity = useTransform(progress, [0, introEnd, introEnd + 0.08], [0, 0, 1])
  const horizonOpacity = useTransform(progress, [introEnd, introEnd + 0.1], [0, 1])

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
      style={{ opacity: reduce ? 0.4 : tunnelOpacity, perspective: "1100px" }}
    >
      {rings.map((i) => (
        <TunnelRing key={i} index={i} progress={progress} reduce={!!reduce} introEnd={introEnd} />
      ))}

      {[0, 1, 2, 3].map((i) => (
        <TunnelStreak key={i} index={i} progress={progress} reduce={!!reduce} introEnd={introEnd} />
      ))}

      <motion.div
        className="absolute left-1/2 top-[46%] h-px w-[min(94vw,52rem)] -translate-x-1/2"
        style={{
          backgroundImage:
            "linear-gradient(90deg, transparent, rgba(20,20,20,0.28) 18%, rgba(20,20,20,0.28) 82%, transparent)",
          opacity: reduce ? 0.2 : horizonOpacity,
        }}
      />
    </motion.div>
  )
}

function TunnelRing({
  index,
  progress,
  reduce,
  introEnd,
}: {
  index: number
  progress: MotionValue<number>
  reduce: boolean
  introEnd: number
}) {
  const scale = useTransform(progress, (p) => {
    if (reduce) return 0.35 + index * 0.28
    const travel = Math.max(0, (p - introEnd) / (1 - introEnd))
    const t = (travel * 4 + index * 0.18) % 1
    return 0.08 + t * 3.2
  })
  const opacity = useTransform(progress, (p) => {
    if (reduce) return 0.08
    const travel = Math.max(0, (p - introEnd) / (1 - introEnd))
    const t = (travel * 4 + index * 0.18) % 1
    const fadeIn = t < 0.06 ? t / 0.06 : 1
    return Math.max(0, 0.38 * (1 - t) * fadeIn)
  })

  return (
    <motion.div
      className="absolute left-1/2 top-[44%] aspect-[16/9] w-[min(96vw,56rem)] -translate-x-1/2 -translate-y-1/2 border border-[#141414]/80"
      style={{ scale, opacity }}
    />
  )
}

function TunnelStreak({
  index,
  progress,
  reduce,
  introEnd,
}: {
  index: number
  progress: MotionValue<number>
  reduce: boolean
  introEnd: number
}) {
  const y = useTransform(progress, (p) => {
    if (reduce) return 0
    const travel = Math.max(0, (p - introEnd) / (1 - introEnd))
    const t = (travel * 3 + index * 0.25) % 1
    return -120 + t * 280
  })
  const opacity = useTransform(progress, (p) => {
    if (reduce) return 0.05
    const travel = Math.max(0, (p - introEnd) / (1 - introEnd))
    const t = (travel * 3 + index * 0.25) % 1
    return 0.18 * (1 - Math.abs(t - 0.5) * 2)
  })

  const left = 22 + index * 18

  return (
    <motion.div
      className="absolute top-1/2 h-24 w-px bg-foreground/30"
      style={{ left: `${left}%`, y, opacity }}
    />
  )
}

/* ─── Animated engine orb (circular — no left wedge) ─── */

function EngineOrbVisual({
  reduce,
  speed = 2.4,
}: {
  reduce: boolean
  speed?: number
}) {
  return (
    <div className="relative h-full w-full">
      <motion.svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 200 200"
        fill="none"
        aria-hidden
        animate={!reduce ? { rotate: -360 } : { rotate: 0 }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
      >
        <circle cx="100" cy="100" r="96" stroke={INK} strokeOpacity="0.12" strokeWidth="0.8" />
        <circle
          cx="100"
          cy="100"
          r="96"
          stroke={INK}
          strokeOpacity="0.22"
          strokeWidth="1.2"
          strokeDasharray="8 14"
          strokeLinecap="square"
        />
      </motion.svg>

      <motion.svg
        className="absolute inset-[6%]"
        viewBox="0 0 200 200"
        fill="none"
        aria-hidden
        animate={!reduce ? { rotate: 360 } : { rotate: 0 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        <circle
          cx="100"
          cy="100"
          r="88"
          stroke={INK}
          strokeOpacity="0.18"
          strokeWidth="1"
          strokeDasharray="3 9"
        />
        {[0, 90, 180, 270].map((deg) => (
          <rect
            key={deg}
            x="98"
            y="6"
            width="4"
            height="4"
            fill={INK}
            opacity="0.35"
            transform={`rotate(${deg} 100 100)`}
          />
        ))}
      </motion.svg>

      <motion.div
        className="absolute inset-[14%] overflow-hidden rounded-full border border-foreground/12 bg-white/40 shadow-[0_16px_64px_rgba(0,0,0,0.06)]"
        animate={
          !reduce
            ? { scale: [1, 1.04, 1], rotate: [0, 2, 0, -2, 0] }
            : { scale: 1, rotate: 0 }
        }
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <MemoColorPanels
          width={280}
          height={280}
          colors={[...ENGINE_GREY]}
          colorBack="#ffffff00"
          density={4.8}
          angle1={0.62}
          angle2={0.28}
          length={1.1}
          edges
          blur={0.3}
          fadeIn={0.75}
          fadeOut={0.4}
          gradient={0.52}
          speed={reduce ? 0 : speed}
          scale={0.94}
          rotation={180}
          style={{ width: "100%", height: "100%", opacity: 0.72 }}
        />
        <div
          aria-hidden
          className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,transparent_38%,rgba(255,255,255,0.55)_72%,rgba(255,255,255,0.92)_100%)]"
        />
      </motion.div>

      <motion.div
        aria-hidden
        className="absolute inset-[14%] rounded-full border border-foreground/20"
        animate={
          !reduce
            ? { scale: [1, 1.12, 1], opacity: [0.35, 0, 0.35] }
            : { opacity: 0 }
        }
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut" }}
      />
    </div>
  )
}

/** Single engine instance — scroll morphs position from intro to founding year */
export function TimelineEngineOrb({
  progress,
  reduce,
  introEnd,
  visible,
  speed,
}: {
  progress: MotionValue<number>
  reduce: boolean
  introEnd: number
  visible: boolean
  speed: number
}) {
  const top = useTransform(progress, [0, introEnd], ["12%", "6%"])
  const right = useTransform(progress, [0, introEnd], ["4%", "6%"])
  const size = useTransform(
    progress,
    [0, introEnd],
    ["min(38vw,300px)", "min(24vw,280px)"]
  )

  return (
    <motion.div
      className="pointer-events-none absolute z-[2] hidden md:block"
      aria-hidden
      style={{
        top,
        right,
        width: size,
        height: size,
        opacity: visible ? 1 : 0,
      }}
      transition={{ opacity: { duration: 0.55, ease: EASE } }}
    >
      <EngineOrbVisual reduce={reduce} speed={speed} />
    </motion.div>
  )
}

/* ─── Per-scene shader backdrops (grey / dark only) ─── */

function FleetShader({ visible, reduce }: { visible: boolean; reduce: boolean }) {
  return (
    <ShaderPlate
      visible={visible}
      className="absolute inset-x-0 bottom-0 h-[min(58vh,480px)]"
      mask="linear-gradient(to top, black 0%, black 35%, transparent 88%)"
    >
      <MemoDithering
        width="100%"
        height="100%"
        colorBack="#ffffff00"
        colorFront="#3A3A3A"
        shape="swirl"
        type="4x4"
        size={2}
        speed={reduce ? 0 : 0.75}
        scale={0.68}
        style={{ width: "100%", height: "100%", opacity: 0.5 }}
      />
    </ShaderPlate>
  )
}

function ProductsDiamond({ visible, reduce }: { visible: boolean; reduce: boolean }) {
  return (
    <motion.div
      className="pointer-events-none absolute left-1/2 top-[30%] z-0 h-[min(26vh,200px)] w-[min(26vh,200px)] -translate-x-1/2 -translate-y-1/2 md:top-[42%] md:h-[min(38vh,340px)] md:w-[min(38vh,340px)]"
      aria-hidden
      initial={false}
      animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.94 }}
      transition={{ duration: 0.65, ease: EASE }}
    >
      <div
        className="absolute inset-[10%]"
        style={{
          clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
          WebkitClipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        }}
      >
        <MemoHeatmap
          width={320}
          height={320}
          image="https://shaders.paper.design/images/logos/diamond.svg"
          colors={[...HEATMAP_GREY]}
          colorBack="#ffffff00"
          contour={0.48}
          angle={0}
          noise={0.03}
          innerGlow={0.42}
          outerGlow={0.38}
          speed={reduce ? 0 : 0.55}
          scale={0.82}
          style={{ width: "100%", height: "100%", opacity: 0.65 }}
        />
      </div>

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 200" fill="none">
        <motion.polygon
          points="100,8 192,100 100,192 8,100"
          stroke={INK}
          strokeWidth="1.4"
          strokeOpacity="0.4"
          fill="none"
          {...draw(visible, 0.1, 0.9)}
        />
        <motion.polygon
          points="100,20 180,100 100,180 20,100"
          stroke={INK}
          strokeWidth="0.8"
          strokeOpacity="0.18"
          strokeDasharray="4 6"
          fill="none"
          {...draw(visible, 0.35, 0.8)}
        />
      </svg>
    </motion.div>
  )
}

/* ─── 2024 — foundation builds ─── */

function FoundingScene({ visible }: { visible: boolean }) {
  const pixels = useMemo(
    () =>
      [
        [0, 0], [1, 0], [2, 0], [3, 0], [4, 0],
        [2, 1], [2, 2], [2, 3], [2, 4],
        [6, 1], [7, 1], [8, 1], [7, 2], [7, 3], [7, 4],
        [10, 3], [11, 3], [10, 4], [11, 4],
      ] as const,
    []
  )

  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.55, ease: EASE }}
    >
      {/* Subtle full-grid — very light, no left frame */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.05]" aria-hidden>
        <defs>
          <pattern id="tt-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke={INK} strokeWidth="0.4" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#tt-grid)" />
      </svg>

      {/* Tt. mark assembling */}
      <div className="absolute right-[6%] top-[62%] hidden md:block">
        <svg viewBox="0 0 13 6" className="h-14 w-auto" aria-hidden>
          {pixels.map(([x, y], i) => (
            <motion.rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width={0.92}
              height={0.92}
              fill={INK}
              initial={{ opacity: 0, scale: 0 }}
              animate={visible ? { opacity: 0.45 + (i % 3) * 0.12, scale: 1 } : { opacity: 0, scale: 0 }}
              transition={{ duration: 0.35, delay: visible ? 0.3 + i * 0.04 : 0, ease: EASE }}
            />
          ))}
        </svg>
        <motion.p
          className="mt-3 font-mono text-[10px] tracking-[0.22em] uppercase text-foreground/45"
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ delay: 1.1, duration: 0.45 }}
        >
          Established
        </motion.p>
      </div>
    </motion.div>
  )
}

const VESSEL_SRCS = [
  "/vessels/vessel 1 illustration.svg",
  "/vessels/vessel 2 illustration.svg",
  "/vessels/vessel 3 illusration.svg",
] as const

/** Fleet convoy — both flanks, bow-left, sailing right → left */
function FleetVessel({
  src,
  side,
  row,
  visible,
  reduce,
  delay,
  duration,
}: {
  src: string
  side: "left" | "right"
  row: number
  visible: boolean
  reduce: boolean
  delay: number
  duration: number
}) {
  const isLeft = side === "left"
  const enterX = isLeft ? 420 : 520
  const exitX = isLeft ? -720 : -820

  return (
    <motion.div
      className="absolute will-change-transform"
      style={{
        top: `${14 + row * 13}%`,
        left: isLeft ? "0" : undefined,
        right: isLeft ? undefined : "0",
        width: "46%",
      }}
      animate={
        visible && !reduce
          ? { x: [enterX, exitX], opacity: [0, 0.92, 0.92, 0] }
          : { opacity: 0, x: enterX }
      }
      transition={{
        duration,
        delay,
        repeat: visible && !reduce ? Infinity : 0,
        ease: "linear",
        times: [0, 0.05, 0.9, 1],
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={encodeURI(src)}
        alt=""
        className="h-[min(10vh,56px)] w-auto min-w-[min(42vw,180px)] max-w-none object-contain opacity-90 md:h-[min(16vh,104px)] md:min-w-[min(52vw,280px)] lg:h-[min(18vh,120px)]"
        style={{
          transform: "scaleX(-1)",
          filter: "grayscale(1) contrast(1.05)",
        }}
      />
    </motion.div>
  )
}

function FleetScene({ visible, highlights, reduce }: { visible: boolean; highlights?: TimelineItem["highlights"]; reduce: boolean }) {
  const convoy = useMemo(() => {
    const lanes: Array<{
      side: "left" | "right"
      row: number
      delay: number
      duration: number
      src: string
    }> = []

    for (let i = 0; i < 6; i++) {
      lanes.push({
        side: "left",
        row: i,
        delay: i * 1.1,
        duration: 9 + (i % 3) * 1.2,
        src: VESSEL_SRCS[i % VESSEL_SRCS.length],
      })
      lanes.push({
        side: "right",
        row: i,
        delay: 0.55 + i * 1.1,
        duration: 10 + (i % 3) * 1.1,
        src: VESSEL_SRCS[(i + 1) % VESSEL_SRCS.length],
      })
    }
    return lanes
  }, [])

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      {/* Horizon */}
      <svg className="absolute inset-x-0 top-[22%] h-24 w-full" viewBox="0 0 400 60" preserveAspectRatio="none" aria-hidden>
        <motion.path d="M0 40 H400" stroke={INK} strokeWidth="0.6" strokeOpacity="0.14" {...draw(visible, 0, 1)} />
        <motion.path d="M0 48 H400" stroke={INK} strokeWidth="0.4" strokeOpacity="0.08" {...draw(visible, 0.1, 1)} />
      </svg>

      {/* Flank lane guides */}
      <div aria-hidden className="absolute left-0 top-[12%] h-[76%] w-[42%] border-r border-dashed border-foreground/8" />
      <div aria-hidden className="absolute right-0 top-[12%] h-[76%] w-[42%] border-l border-dashed border-foreground/8" />

      {convoy.map((lane, i) => (
        <FleetVessel
          key={`${lane.side}-${lane.row}-${i}`}
          src={lane.src}
          side={lane.side}
          row={lane.row}
          visible={visible}
          reduce={reduce}
          delay={lane.delay}
          duration={lane.duration}
        />
      ))}

      <AnimatePresence>
        {visible &&
          highlights?.map((h, i) => (
            <motion.div
              key={h.label}
              initial={{ opacity: 0, scale: 0.88, y: 28 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.6, delay: 1 + i * 0.14, ease: EASE }}
              className="absolute max-md:hidden border border-foreground/15 bg-white/95 px-5 py-4 shadow-[0_12px_48px_rgba(0,0,0,0.08)]"
              style={{
                top: i === 0 ? "12%" : "54%",
                left: i === 0 ? "5%" : undefined,
                right: i === 1 ? "5%" : undefined,
              }}
            >
              <p className="font-pixel-circle text-4xl md:text-5xl font-medium tracking-tight text-[#141414]">
                {h.value}
              </p>
              <p className="mt-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-foreground/50">
                {h.label}
              </p>
            </motion.div>
          ))}
      </AnimatePresence>
    </motion.div>
  )
}

function ProductCard({
  index,
  name,
  visible,
  delay,
}: {
  index: number
  name: string
  visible: boolean
  delay: number
}) {
  const num = String(index + 1).padStart(2, "0")

  return (
    <motion.div
      className="relative border border-foreground/15 bg-white/95 px-5 py-4 md:px-6 md:py-5"
      initial={{ opacity: 0, x: 32 }}
      animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
      transition={{ duration: 0.55, delay, ease: EASE }}
    >
      <div className="flex items-start gap-4">
        <span className="font-pixel-circle text-2xl md:text-3xl font-medium tracking-tight text-foreground/25">
          {num}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-foreground/45">
            Product
          </p>
          <p className="mt-1 font-heading text-sm md:text-base font-medium tracking-tight text-foreground">
            {name}
          </p>
        </div>
        <motion.span
          aria-hidden
          className="mt-1 size-2 shrink-0 bg-foreground"
          initial={{ scale: 0 }}
          animate={visible ? { scale: 1 } : { scale: 0 }}
          transition={{ delay: delay + 0.35, duration: 0.3 }}
        />
      </div>
    </motion.div>
  )
}

function ProductsScene({ visible, products, reduce }: { visible: boolean; products?: TimelineItem["products"]; reduce: boolean }) {
  const slots = products ?? []

  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <ProductsDiamond visible={visible} reduce={reduce} />

      {/* Product stack — right column */}
      <div className="absolute right-[4%] top-[12%] flex w-[min(44vw,18rem)] flex-col gap-3 max-md:hidden md:right-[6%] md:w-[min(36vw,20rem)] md:gap-3.5">
        <motion.div
          className="mb-1 border border-foreground/12 bg-white/95 px-4 py-3"
          initial={{ opacity: 0, y: 8 }}
          animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ delay: 0.1, duration: 0.45, ease: EASE }}
        >
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-foreground/50">
            In market
          </p>
          <p className="mt-1 font-pixel-circle text-2xl font-medium tracking-tight text-[#141414]">
            4 live
          </p>
        </motion.div>

        {slots.map((name, i) => (
          <ProductCard key={name} index={i} name={name} visible={visible} delay={0.18 + i * 0.12} />
        ))}
      </div>
    </motion.div>
  )
}

export function TimelineAmbient({
  item,
  visible,
  reduce,
  pastIntro,
}: {
  item: TimelineItem
  visible: boolean
  reduce: boolean
  pastIntro: boolean
}) {
  const scene = item.scene ?? "founding"

  return (
    <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden>
      {pastIntro && (
        <>
          <FleetShader visible={visible && scene === "fleet"} reduce={reduce} />

          <FoundingScene visible={visible && scene === "founding"} />
          <FleetScene visible={visible && scene === "fleet"} highlights={item.highlights} reduce={reduce} />
          <ProductsScene visible={visible && scene === "products"} products={item.products} reduce={reduce} />
        </>
      )}
    </div>
  )
}
