"use client"

import { useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Timeline } from "@/lib/content"

type TimelineItem = Timeline["items"][number]

const EASE = [0.22, 1, 0.36, 1] as const

/** Mini pixel vessel — dot-matrix silhouette */
function PixelVessel({
  className,
  opacity = 0.35,
}: {
  className?: string
  opacity?: number
}) {
  const dots = [
    [2, 8], [3, 8], [4, 8], [5, 8], [6, 8], [7, 8], [8, 8],
    [1, 9], [9, 9],
    [0, 10], [10, 10],
    [1, 11], [2, 11], [3, 11], [4, 11], [5, 11], [6, 11], [7, 11], [8, 11], [9, 11],
    [2, 12], [8, 12],
    [3, 13], [7, 13],
    [4, 14], [5, 14], [6, 14],
  ]

  return (
    <svg
      viewBox="0 0 11 15"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      {dots.map(([cx, cy], i) => (
        <rect
          key={i}
          x={cx}
          y={cy}
          width={1}
          height={1}
          opacity={opacity + (i % 3) * 0.08}
        />
      ))}
    </svg>
  )
}

function FoundingScene({ visible }: { visible: boolean }) {
  const pixels = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        x: 8 + (i % 6) * 14 + (i % 2) * 4,
        y: 12 + Math.floor(i / 6) * 22,
        delay: i * 0.04,
      })),
    []
  )

  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      {pixels.map((p, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="absolute size-1.5 bg-accent"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          animate={
            visible
              ? { opacity: [0.08, 0.35, 0.12], scale: [0.8, 1, 0.9] }
              : { opacity: 0, scale: 0.8 }
          }
          transition={{
            duration: 2.8,
            delay: p.delay,
            repeat: visible ? Infinity : 0,
            ease: "easeInOut",
          }}
        />
      ))}
      <motion.span
        aria-hidden
        className="absolute left-[48%] top-[38%] size-2 bg-accent"
        animate={visible ? { opacity: [0.5, 1, 0.5] } : { opacity: 0 }}
        transition={{ duration: 1.6, repeat: visible ? Infinity : 0 }}
      />
    </motion.div>
  )
}

function FleetScene({
  visible,
  highlights,
}: {
  visible: boolean
  highlights?: TimelineItem["highlights"]
}) {
  const fleetMarks = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        side: i % 2 === 0 ? "left" : "right",
        top: 6 + ((i * 11) % 78),
        offset: 4 + (i % 5) * 3,
        scale: 0.55 + (i % 4) * 0.15,
        delay: i * 0.03,
        drift: i % 2 === 0 ? 6 : -6,
      })),
    []
  )

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.65, ease: EASE }}
    >
      {fleetMarks.map((mark, i) => (
        <motion.div
          key={i}
          className="absolute text-[#141414]/25"
          style={{
            top: `${mark.top}%`,
            left: mark.side === "left" ? `${mark.offset}%` : undefined,
            right: mark.side === "right" ? `${mark.offset}%` : undefined,
            scale: mark.scale,
          }}
          animate={
            visible
              ? {
                  opacity: [0.12, 0.42, 0.18],
                  x: [0, mark.drift, 0],
                  y: [0, -3, 0],
                }
              : { opacity: 0 }
          }
          transition={{
            duration: 3.5 + (i % 3),
            delay: mark.delay,
            repeat: visible ? Infinity : 0,
            ease: "easeInOut",
          }}
        >
          <PixelVessel className="h-5 w-auto md:h-6" />
        </motion.div>
      ))}

      <AnimatePresence>
        {visible &&
          highlights?.map((h, i) => (
            <motion.div
              key={h.label}
              initial={{ opacity: 0, y: 16, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
              className="absolute border border-foreground/10 bg-white/80 px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-sm"
              style={{
                top: i === 0 ? "18%" : "62%",
                left: i === 0 ? "6%" : undefined,
                right: i === 1 ? "6%" : undefined,
              }}
            >
              <p className="font-pixel-circle text-3xl md:text-4xl font-medium tracking-tight text-[#141414]">
                {h.value}
              </p>
              <p className="mt-1 font-mono text-[10px] tracking-[0.2em] uppercase text-foreground/45">
                {h.label}
              </p>
            </motion.div>
          ))}
      </AnimatePresence>
    </motion.div>
  )
}

function ProductsScene({
  visible,
  products,
}: {
  visible: boolean
  products?: TimelineItem["products"]
}) {
  const slots = products ?? []

  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.65, ease: EASE }}
    >
      {slots.map((name, i) => {
        const isLeft = i % 2 === 0
        const row = Math.floor(i / 2)
        return (
          <motion.div
            key={name}
            className="absolute flex items-center gap-2 border border-foreground/12 bg-white/85 px-3 py-2.5 shadow-[0_6px_24px_rgba(0,0,0,0.05)] backdrop-blur-sm"
            style={{
              top: `${18 + row * 22}%`,
              left: isLeft ? "5%" : undefined,
              right: !isLeft ? "5%" : undefined,
            }}
            initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
            animate={
              visible
                ? { opacity: 1, x: 0 }
                : { opacity: 0, x: isLeft ? -16 : 16 }
            }
            transition={{ duration: 0.55, delay: i * 0.1, ease: EASE }}
          >
            <span aria-hidden className="size-1.5 shrink-0 bg-accent" />
            <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-foreground/55">
              {name}
            </span>
          </motion.div>
        )
      })}

      <motion.p
        aria-hidden
        className="absolute bottom-[14%] left-1/2 -translate-x-1/2 font-pixel-circle text-5xl md:text-6xl font-medium tracking-tight text-accent/20"
        animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        4
      </motion.p>
    </motion.div>
  )
}

export function TimelineAmbient({
  item,
  visible,
}: {
  item: TimelineItem
  visible: boolean
}) {
  const scene = item.scene ?? "founding"

  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
      <motion.div
        className="absolute inset-0"
        animate={{
          backgroundColor:
            scene === "fleet"
              ? "rgba(212, 255, 0, 0.04)"
              : scene === "products"
                ? "rgba(10, 10, 10, 0.02)"
                : "rgba(10, 10, 10, 0)",
        }}
        transition={{ duration: 0.7, ease: EASE }}
      />

      <FoundingScene visible={visible && scene === "founding"} />
      <FleetScene
        visible={visible && scene === "fleet"}
        highlights={item.highlights}
      />
      <ProductsScene
        visible={visible && scene === "products"}
        products={item.products}
      />
    </div>
  )
}
