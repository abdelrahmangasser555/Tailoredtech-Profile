"use client"

import { useId, useMemo, useState } from "react"
import {
  Eye,
  Layers,
  Route,
  Users,
  BarChart3,
  Shield,
  type LucideIcon,
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"

const EASE = [0.22, 1, 0.36, 1] as const
const ACCENT = "#D4FF00"

const SECTION_ICONS: Record<string, LucideIcon> = {
  overview: Eye,
  capabilities: Layers,
  roles: Users,
  platform: Layers,
  workflows: Route,
  workflow: Route,
  observations: Eye,
  analytics: BarChart3,
  exclusive: Shield,
  flow: Route,
  settlement: BarChart3,
  fit: Users,
  delivery: Route,
}

type LayerSection = {
  id: string
  title: string
  /** Optional mark printed on the plate face (overrides icon) */
  image?: string | null
}

type SectionLayerNavProps = {
  sections: readonly LayerSection[]
  activeId: string
  reduce?: boolean
  onSelect: (id: string) => void
  className?: string
}

/**
 * Tall vertical isometric section deck (desktop).
 * Brand lime plates + pixel callout for the focused section.
 */
export function SectionLayerNav({
  sections,
  activeId,
  reduce = false,
  onSelect,
  className,
}: SectionLayerNavProps) {
  const [spread, setSpread] = useState(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const focusId = hoveredId ?? activeId
  const focusIndex = Math.max(
    0,
    sections.findIndex((s) => s.id === focusId)
  )
  const focusSection = sections[focusIndex]

  const stride = spread ? 96 : 86
  const openExtra = spread ? 32 : 20
  const slideX = 36
  const plateH = 120

  const slots = sections.map((_, i) => {
    let y = i * stride
    if (i > focusIndex) y += openExtra
    const focused = i === focusIndex
    return {
      y,
      x: focused ? slideX : 0,
      focused,
    }
  })

  const totalH = (sections.length - 1) * stride + openExtra + plateH + 8
  const focusSlot = slots[focusIndex]
  // Mid-right of the plate (not the top tip)
  const calloutTop = (focusSlot?.y ?? 0) + 54
  const calloutLeft = 10.85 + (focusSlot?.x ?? 0) / 16

  return (
    <nav
      aria-label="Solution sections"
      className={cn("relative w-[17.5rem] select-none", className)}
      onMouseEnter={() => setSpread(true)}
      onMouseLeave={() => {
        setSpread(false)
        setHoveredId(null)
      }}
    >
      <div className="relative" style={{ height: totalH, width: "17.5rem" }}>
        {sections.map((section, i) => {
          const slot = slots[i]!
          const Icon = SECTION_ICONS[section.id] ?? Layers
          const hovered = hoveredId === section.id

          return (
            <motion.button
              key={section.id}
              type="button"
              aria-current={section.id === activeId ? "true" : undefined}
              aria-label={section.title}
              onClick={() => onSelect(section.id)}
              onMouseEnter={() => setHoveredId(section.id)}
              onFocus={() => {
                setSpread(true)
                setHoveredId(section.id)
              }}
              onBlur={() => setHoveredId(null)}
              className="absolute left-0 top-0 h-[7.5rem] w-[11.5rem] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              style={{ zIndex: slot.focused ? 50 : 10 + i }}
              initial={false}
              animate={{
                x: reduce && slot.focused ? 22 : slot.x,
                y: slot.y,
                scale: hovered ? 1.05 : slot.focused ? 1.03 : 1,
                filter: hovered
                  ? "brightness(1.1)"
                  : slot.focused
                    ? "brightness(1.04)"
                    : "brightness(1)",
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 26,
                mass: 0.85,
              }}
              whileTap={reduce ? undefined : { scale: 0.98 }}
            >
              <motion.div
                className="h-full w-full will-change-transform"
                animate={
                  reduce || !slot.focused
                    ? { y: 0 }
                    : { y: [0, -6, 0, 4, 0] }
                }
                transition={
                  reduce || !slot.focused
                    ? { type: "spring", stiffness: 320, damping: 28 }
                    : {
                        duration: 5.4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }
                }
              >
                <IsoPlate
                  focused={slot.focused}
                  depth={Math.min(i, 3)}
                  Icon={Icon}
                  image={section.image}
                />
              </motion.div>
            </motion.button>
          )
        })}

        <AnimatePresence mode="wait">
          {focusSection && focusSlot && (
            <motion.div
              key={focusSection.id}
              className="pointer-events-none absolute z-60"
              style={{
                top: calloutTop,
                left: `${calloutLeft}rem`,
              }}
              initial={reduce ? false : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
            >
              <PixelCallout reduce={reduce} label={focusSection.title} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

/** Chunky pixel L — text always under the horizontal run */
function PixelCallout({
  label,
  reduce,
}: {
  label: string
  reduce: boolean
}) {
  const hDashes = useMemo(() => {
    const items: { x: number; delay: number }[] = []
    for (let i = 0, x = 8; x <= 52; x += 7, i++) {
      items.push({ x, delay: 0.04 + i * 0.035 })
    }
    return items
  }, [])

  const vDashes = useMemo(() => {
    const items: { y: number; delay: number }[] = []
    for (let i = 0, y = 8; y <= 22; y += 7, i++) {
      items.push({ y, delay: 0.28 + i * 0.045 })
    }
    return items
  }, [])

  return (
    <div className="flex w-40 flex-col items-start">
      <svg
        width="64"
        height="28"
        viewBox="0 0 64 28"
        className="overflow-visible"
        aria-hidden
      >
        {/* Square origin tick */}
        <motion.rect
          x="0"
          y="1"
          width="3"
          height="3"
          fill={ACCENT}
          initial={reduce ? false : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.18, ease: EASE }}
        />

        {hDashes.map((d) => (
          <motion.rect
            key={`h-${d.x}`}
            x={d.x}
            y="1.5"
            width="4"
            height="2"
            fill={ACCENT}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 0.85 }}
            transition={{ duration: 0.15, delay: d.delay, ease: EASE }}
          />
        ))}

        {vDashes.map((d) => (
          <motion.rect
            key={`v-${d.y}`}
            x="53"
            y={d.y}
            width="2"
            height="4"
            fill={ACCENT}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 0.75 }}
            transition={{ duration: 0.15, delay: d.delay, ease: EASE }}
          />
        ))}
      </svg>

      <motion.p
        initial={reduce ? false : { opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.38, ease: EASE }}
        className="mt-1.5 max-w-[8.5rem] pl-0.5 font-pixel-circle text-[0.9rem] leading-tight tracking-tight text-white/85"
      >
        {label}
      </motion.p>
    </div>
  )
}

function IsoPlate({
  focused,
  depth,
  Icon,
  image,
}: {
  focused: boolean
  depth: number
  Icon: LucideIcon
  image?: string | null
}) {
  const uid = useId().replace(/:/g, "")
  const shadowId = `iso-shadow-${uid}`
  const printId = `iso-print-${uid}`
  const hatchId = `iso-hatch-${uid}`

  const face = focused
    ? "#C8EF00"
    : depth === 0
      ? "#D4FF00"
      : depth === 1
        ? "#C8F200"
        : depth === 2
          ? "#B8E000"
          : "#A8C800"

  const rimDeep = focused ? "#3F4A00" : "#2A3200"
  const rimMid = focused ? "#5C6A00" : "#4A5600"
  const iso = "translate(118, 68) matrix(1, 0.5, -1, 0.5, 0, 0)"

  return (
    <div className="relative h-full w-full">
      <svg
        viewBox="0 0 240 180"
        className="relative h-full w-full overflow-visible"
        aria-hidden
      >
        <defs>
          <filter
            id={shadowId}
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
          >
            <feDropShadow
              dx="0"
              dy="14"
              stdDeviation="10"
              floodColor="#000"
              floodOpacity="0.5"
            />
          </filter>
          <filter id={printId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0.6"
              dy="0.8"
              stdDeviation="0.35"
              floodColor="#000"
              floodOpacity="0.28"
            />
          </filter>
          {/* Subtle glyph-like hatch — brand texture */}
          <pattern
            id={hatchId}
            width="14"
            height="14"
            patternUnits="userSpaceOnUse"
          >
            <text
              x="1"
              y="10"
              fontSize="7"
              fontFamily="ui-monospace, monospace"
              fill="#0A0A0A"
              opacity="0.12"
            >
              ·
            </text>
          </pattern>
        </defs>

        <g filter={`url(#${shadowId})`}>
          <g transform="translate(118, 92) matrix(1, 0.5, -1, 0.5, 0, 0)">
            <rect x={-56} y={-56} width={112} height={112} rx={14} fill={rimDeep} />
          </g>
          <g transform="translate(118, 84) matrix(1, 0.5, -1, 0.5, 0, 0)">
            <rect x={-56} y={-56} width={112} height={112} rx={14} fill={rimMid} />
          </g>

          <g transform={iso}>
            <rect
              x={-56}
              y={-56}
              width={112}
              height={112}
              rx={14}
              fill={face}
              stroke="#0A0A0A"
              strokeWidth={3.5}
            />
            {/* Printed brand texture */}
            <rect
              x={-52}
              y={-52}
              width={104}
              height={104}
              rx={12}
              fill={`url(#${hatchId})`}
              opacity={0.9}
            />
            {/* Pixel corner ticks */}
            <g fill="#0A0A0A" opacity="0.35">
              <rect x={-48} y={-48} width="5" height="2" />
              <rect x={-48} y={-48} width="2" height="5" />
              <rect x={43} y={-48} width="5" height="2" />
              <rect x={46} y={-48} width="2" height="5" />
              <rect x={-48} y={46} width="5" height="2" />
              <rect x={-48} y={43} width="2" height="5" />
              <rect x={43} y={46} width="5" height="2" />
              <rect x={46} y={43} width="2" height="5" />
            </g>

            <g
              transform="translate(-17, -17)"
              opacity={0.86}
              filter={`url(#${printId})`}
              style={{ mixBlendMode: "multiply" }}
            >
              {image ? (
                <image
                  href={image}
                  x={0}
                  y={0}
                  width={34}
                  height={34}
                  preserveAspectRatio="xMidYMid meet"
                />
              ) : (
                <Icon
                  width={34}
                  height={34}
                  color="#0A0A0A"
                  strokeWidth={2.35}
                />
              )}
            </g>
          </g>
        </g>
      </svg>
    </div>
  )
}
