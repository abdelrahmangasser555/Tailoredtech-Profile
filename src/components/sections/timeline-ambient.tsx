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

function EngineOrb({
  visible,
  reduce,
  className,
  speed = 2.4,
}: {
  visible: boolean
  reduce: boolean
  className?: string
  speed?: number
}) {
  return (
    <motion.div
      className={className}
      initial={false}
      animate={{
        opacity: visible ? 1 : 0,
        scale: visible ? 1 : 0.88,
        y: visible ? 0 : 24,
      }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      {/* Outer orbit — counter-rotate */}
      <motion.svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 200 200"
        fill="none"
        aria-hidden
        animate={visible && !reduce ? { rotate: -360 } : { rotate: 0 }}
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

      {/* Inner orbit — clockwise */}
      <motion.svg
        className="absolute inset-[6%]"
        viewBox="0 0 200 200"
        fill="none"
        aria-hidden
        animate={visible && !reduce ? { rotate: 360 } : { rotate: 0 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        <motion.circle
          cx="100"
          cy="100"
          r="88"
          stroke={INK}
          strokeOpacity="0.18"
          strokeWidth="1"
          strokeDasharray="3 9"
          initial={{ pathLength: 0 }}
          animate={visible ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 1.4, ease: EASE }}
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

      {/* Engine core */}
      <motion.div
        className="absolute inset-[14%] overflow-hidden rounded-full border border-foreground/12 bg-white/40 shadow-[0_16px_64px_rgba(0,0,0,0.06)]"
        animate={
          visible && !reduce
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

      {/* Scan pulse */}
      <motion.div
        aria-hidden
        className="absolute inset-[14%] rounded-full border border-foreground/20"
        animate={
          visible && !reduce
            ? { scale: [1, 1.12, 1], opacity: [0.35, 0, 0.35] }
            : { opacity: 0 }
        }
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut" }}
      />
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

function ProductsShader({ visible, reduce }: { visible: boolean; reduce: boolean }) {
  return (
    <ShaderPlate
      visible={visible}
      className="absolute -right-[6%] top-[6%] h-[min(58vh,440px)] w-[min(54vw,500px)]"
      mask="radial-gradient(ellipse 70% 65% at 58% 48%, black 0%, transparent 74%)"
    >
      <MemoHeatmap
        width={500}
        height={440}
        image="https://shaders.paper.design/images/logos/diamond.svg"
        colors={[...HEATMAP_GREY]}
        colorBack="#ffffff00"
        contour={0.52}
        angle={12}
        noise={0.04}
        innerGlow={0.45}
        outerGlow={0.38}
        speed={reduce ? 0 : 0.65}
        scale={0.78}
        style={{ width: "100%", height: "100%", opacity: 0.48 }}
      />
    </ShaderPlate>
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

function VesselSvg({ visible, delay, className }: { visible: boolean; delay: number; className?: string }) {
  return (
    <svg viewBox="0 0 80 28" className={className} fill="none" aria-hidden>
      <motion.path d="M8 18 L18 22 H62 L72 16 H48 L44 10 H36 L32 16 H8 Z" stroke={INK} strokeWidth="1.3" {...draw(visible, delay, 0.85)} />
      <motion.path d="M8 18 L18 22 H62 L72 16 H48 L44 10 H36 L32 16 H8 Z" fill={INK} initial={{ opacity: 0 }} animate={{ opacity: visible ? 0.18 : 0 }} transition={{ delay: delay + 0.65, duration: 0.4 }} />
      <motion.rect x="38" y="6" width="8" height="6" stroke={INK} strokeWidth="1" {...draw(visible, delay + 0.3, 0.45)} />
      <motion.path d="M4 20 H12 M2 22 H10 M0 24 H8" stroke={INK} strokeWidth="1" strokeOpacity="0.4" {...draw(visible, delay + 0.5, 0.35)} />
    </svg>
  )
}

function FleetScene({ visible, highlights }: { visible: boolean; highlights?: TimelineItem["highlights"] }) {
  const lanes = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        side: (i % 2 === 0 ? "left" : "right") as "left" | "right",
        top: 8 + ((i * 7) % 72),
        delay: 0.1 + i * 0.08,
        scale: 0.65 + (i % 4) * 0.12,
        drift: i % 2 === 0 ? 14 : -14,
      })),
    []
  )

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <svg className="absolute inset-x-0 top-[48%] h-32 w-full" viewBox="0 0 400 80" preserveAspectRatio="none" aria-hidden>
        <motion.path d="M0 36 Q80 20 200 36 T400 36" stroke={INK} strokeWidth="1" strokeOpacity="0.28" fill="none" {...draw(visible, 0, 1.5)} />
        <motion.path d="M0 48 Q100 32 220 48 T400 46" stroke={INK} strokeWidth="0.7" strokeOpacity="0.16" fill="none" {...draw(visible, 0.15, 1.5)} />
        <motion.path d="M0 58 Q120 44 260 58 T400 56" stroke={INK} strokeWidth="0.5" strokeOpacity="0.1" fill="none" {...draw(visible, 0.3, 1.5)} />
      </svg>

      {lanes.map((lane, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: `${lane.top}%`,
            left: lane.side === "left" ? "2%" : undefined,
            right: lane.side === "right" ? "2%" : undefined,
            scale: lane.scale,
          }}
          initial={{ x: lane.side === "left" ? -120 : 120, opacity: 0 }}
          animate={
            visible
              ? { x: [lane.side === "left" ? -60 : 60, 0, lane.drift], opacity: [0, 0.85, 0.65] }
              : { x: lane.side === "left" ? -120 : 120, opacity: 0 }
          }
          transition={{ duration: 2, delay: lane.delay, ease: EASE, opacity: { duration: 0.9, delay: lane.delay } }}
        >
          <VesselSvg visible={visible} delay={lane.delay} className="h-8 w-auto md:h-10" />
        </motion.div>
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
              className="absolute border border-foreground/15 bg-white/95 px-5 py-4 shadow-[0_12px_48px_rgba(0,0,0,0.08)]"
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

function ProductFrame({ name, visible, delay, side, top }: { name: string; visible: boolean; delay: number; side: "left" | "right"; top: string }) {
  return (
    <motion.div
      className="absolute w-[min(44vw,12rem)]"
      style={{ top, left: side === "left" ? "3%" : undefined, right: side === "right" ? "3%" : undefined }}
      initial={{ opacity: 0, x: side === "left" ? -30 : 30 }}
      animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: side === "left" ? -24 : 24 }}
      transition={{ duration: 0.65, delay, ease: EASE }}
    >
      <svg viewBox="0 0 160 56" className="h-auto w-full" fill="none" aria-hidden>
        <motion.rect x="1" y="1" width="158" height="54" stroke={INK} strokeWidth="1.3" {...draw(visible, delay, 0.75)} />
        <motion.path d="M1 14 V1 H14 M146 1 H159 V14 M159 42 V55 H146 M14 55 H1 V42" stroke={INK} strokeWidth="1.8" {...draw(visible, delay + 0.2, 0.5)} />
        <motion.rect x="12" y="24" width="6" height="6" fill={INK} initial={{ opacity: 0, scale: 0 }} animate={visible ? { opacity: 0.75, scale: 1 } : { opacity: 0, scale: 0 }} transition={{ delay: delay + 0.65, duration: 0.35 }} />
      </svg>
      <p className="absolute inset-x-0 top-1/2 -translate-y-1/2 pl-8 font-mono text-[10px] tracking-[0.14em] uppercase text-foreground/60">
        {name}
      </p>
    </motion.div>
  )
}

function ProductsScene({ visible, products }: { visible: boolean; products?: TimelineItem["products"] }) {
  const slots = products ?? []

  return (
    <motion.div className="pointer-events-none absolute inset-0" initial={false} animate={{ opacity: visible ? 1 : 0 }} transition={{ duration: 0.5, ease: EASE }}>
      <svg className="absolute inset-0 hidden h-full w-full md:block" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        <motion.path d="M18 26 L50 46 L82 26 M18 54 L50 46 L82 54 M18 26 L18 54 M82 26 L82 54" stroke={INK} strokeWidth="0.12" strokeOpacity="0.3" fill="none" vectorEffect="non-scaling-stroke" {...draw(visible, 0.8, 1.1)} />
        <motion.circle cx="50" cy="46" r="1.5" fill={INK} initial={{ opacity: 0, scale: 0 }} animate={visible ? { opacity: 0.45, scale: 1 } : { opacity: 0, scale: 0 }} transition={{ delay: 1.5, duration: 0.4 }} />
      </svg>

      {slots.map((name, i) => (
        <ProductFrame key={name} name={name} visible={visible} delay={0.12 + i * 0.13} side={i % 2 === 0 ? "left" : "right"} top={`${14 + Math.floor(i / 2) * 24}%`} />
      ))}

      <motion.p
        aria-hidden
        className="absolute bottom-[10%] left-1/2 -translate-x-1/2 font-pixel-circle text-7xl md:text-8xl font-medium tracking-tight text-foreground/[0.09]"
        animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.88 }}
        transition={{ delay: 1.1, duration: 0.65, ease: EASE }}
      >
        4
      </motion.p>
    </motion.div>
  )
}

export function TimelineIntroEngine({
  visible,
  reduce,
  opacity,
}: {
  visible: boolean
  reduce: boolean
  opacity: number
}) {
  if (!visible && opacity < 0.01) return null

  return (
    <motion.div
      className="pointer-events-none absolute right-[4%] top-[14%] z-[2] hidden h-[min(38vw,300px)] w-[min(38vw,300px)] md:block lg:right-[8%] lg:top-[12%] lg:h-[min(32vw,340px)] lg:w-[min(32vw,340px)]"
      aria-hidden
      style={{ opacity }}
    >
      <EngineOrb visible={visible} reduce={reduce} speed={2.8} className="relative h-full w-full" />
    </motion.div>
  )
}

export function TimelineAmbient({
  item,
  visible,
  reduce,
  pastIntro,
  travelProgress = 0,
}: {
  item: TimelineItem
  visible: boolean
  reduce: boolean
  pastIntro: boolean
  travelProgress?: number
}) {
  const scene = item.scene ?? "founding"
  const engineSpeed = 2 + travelProgress * 2.5

  return (
    <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden>
      {pastIntro && scene === "founding" && (
        <EngineOrb
          visible={visible}
          reduce={reduce}
          speed={engineSpeed}
          className="absolute right-[3%] top-[8%] hidden h-[min(28vw,260px)] w-[min(28vw,260px)] md:block lg:right-[6%] lg:top-[6%] lg:h-[min(24vw,280px)] lg:w-[min(24vw,280px)]"
        />
      )}

      {pastIntro && (
        <>
          <FleetShader visible={visible && scene === "fleet"} reduce={reduce} />
          <ProductsShader visible={visible && scene === "products"} reduce={reduce} />

          <FoundingScene visible={visible && scene === "founding"} />
          <FleetScene visible={visible && scene === "fleet"} highlights={item.highlights} />
          <ProductsScene visible={visible && scene === "products"} products={item.products} />
        </>
      )}
    </div>
  )
}
