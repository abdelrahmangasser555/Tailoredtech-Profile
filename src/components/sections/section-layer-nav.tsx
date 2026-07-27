"use client"

import { useId, useState } from "react"
import {
  Eye,
  Layers,
  Route,
  Users,
  type LucideIcon,
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"

const EASE = [0.22, 1, 0.36, 1] as const

const SECTION_ICONS: Record<string, LucideIcon> = {
  overview: Eye,
  capabilities: Layers,
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
 * Tall vertical isometric section deck.
 * Marks are projected onto the plate face; focus draws a dashed callout.
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

  const stride = spread ? 92 : 72
  const openExtra = spread ? 36 : 24
  const slideX = 40
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
  const calloutTop = (focusSlot?.y ?? 0) + plateH * 0.38

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
              className="absolute left-0 top-0 h-[7.5rem] w-[11.5rem] outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              style={{ zIndex: slot.focused ? 50 : 10 + i }}
              initial={false}
              animate={{
                x: reduce && slot.focused ? 24 : slot.x,
                y: slot.y,
                scale: slot.focused ? 1.03 : 1,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 26,
                mass: 0.85,
              }}
            >
              <IsoPlate
                focused={slot.focused}
                depth={Math.min(i, 3)}
                Icon={Icon}
                image={section.image}
              />
            </motion.button>
          )
        })}

        {/* Dashed breakline + section name from focused plate */}
        <AnimatePresence mode="wait">
          {focusSection && focusSlot && (
            <motion.div
              key={focusSection.id}
              className="pointer-events-none absolute left-[11.75rem] z-[60] flex items-center gap-0"
              style={{ top: calloutTop }}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <DashedCallout reduce={reduce} label={focusSection.title} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

function DashedCallout({
  label,
  reduce,
}: {
  label: string
  reduce: boolean
}) {
  return (
    <div className="flex items-center">
      <svg
        width="56"
        height="28"
        viewBox="0 0 56 28"
        className="shrink-0 overflow-visible"
        aria-hidden
      >
        {/* Anchor tick */}
        <motion.circle
          cx="2"
          cy="14"
          r="2"
          fill="#D4FF00"
          initial={reduce ? false : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25, ease: EASE }}
        />
        {/* Step: out → down → out */}
        <motion.path
          d="M4 14 H22 V22 H52"
          fill="none"
          stroke="rgba(212,255,0,0.55)"
          strokeWidth="1.25"
          strokeLinecap="square"
          strokeDasharray="3.5 5"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.55, ease: EASE, delay: 0.04 }}
        />
        {/* Soft secondary dash for depth */}
        <motion.path
          d="M4 14 H22 V22 H52"
          fill="none"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1.25"
          strokeLinecap="square"
          strokeDasharray="3.5 5"
          strokeDashoffset="4.25"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.55, ease: EASE, delay: 0.04 }}
        />
      </svg>

      <motion.p
        initial={reduce ? false : { opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, delay: 0.28, ease: EASE }}
        className="max-w-[7.5rem] font-pixel-circle text-[0.9rem] leading-tight tracking-tight text-white/80"
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

  const face = focused
    ? "#A8B400"
    : depth === 0
      ? "#D4FF00"
      : depth === 1
        ? "#C8F200"
        : depth === 2
          ? "#B8E000"
          : "#A8C800"

  const rimDeep = focused ? "#4E5600" : "#3F4A00"
  const rimMid = focused ? "#6A7400" : "#5C6A00"

  // Same isometric basis as the plate face — mark is projected with it
  const iso = "translate(118, 68) matrix(1, 0.5, -1, 0.5, 0, 0)"

  return (
    <div className="relative h-full w-full">
      <svg
        viewBox="0 0 240 180"
        className="h-full w-full overflow-visible"
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
          {/* Slight ink / emboss so the mark reads as printed */}
          <filter id={printId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0.6"
              dy="0.8"
              stdDeviation="0.35"
              floodColor="#000"
              floodOpacity="0.28"
            />
          </filter>
        </defs>

        <g filter={`url(#${shadowId})`}>
          <g transform="translate(118, 92) matrix(1, 0.5, -1, 0.5, 0, 0)">
            <rect x={-56} y={-56} width={112} height={112} rx={22} fill={rimDeep} />
          </g>
          <g transform="translate(118, 84) matrix(1, 0.5, -1, 0.5, 0, 0)">
            <rect x={-56} y={-56} width={112} height={112} rx={22} fill={rimMid} />
          </g>

          <g transform={iso}>
            <rect
              x={-56}
              y={-56}
              width={112}
              height={112}
              rx={22}
              fill={face}
              stroke="#111111"
              strokeWidth={3.5}
            />

            {/* Printed mark — lives in the face plane */}
            <g
              transform="translate(-17, -17)"
              opacity={0.82}
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
                  color="#141414"
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
