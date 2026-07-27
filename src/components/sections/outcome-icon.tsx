"use client"

import type { Icon } from "@phosphor-icons/react"
import {
  ArrowsLeftRight,
  Binoculars,
  Boat,
  Broadcast,
  ChartLine,
  Compass,
  Eye,
  FileX,
  Gauge,
  GlobeHemisphereWest,
  Layout,
  Path,
  Pulse,
  ShareNetwork,
  Table,
} from "@phosphor-icons/react"

/**
 * Curated Phosphor icons for outcome watermarks.
 * Use PascalCase names in services.json → outcomes[].icon
 */
const OUTCOME_ICONS: Record<string, Icon> = {
  ArrowsLeftRight,
  Binoculars,
  Boat,
  Broadcast,
  ChartLine,
  Compass,
  Eye,
  FileX,
  Gauge,
  GlobeHemisphereWest,
  Layout,
  Path,
  Pulse,
  ShareNetwork,
  Ship: Boat,
  Table,
}

export function getOutcomeIcon(name: string | null | undefined): Icon | null {
  if (!name) return null
  return OUTCOME_ICONS[name] ?? null
}

export function OutcomeIconBackdrop({
  name,
}: {
  name: string | null | undefined
}) {
  const IconComp = getOutcomeIcon(name)
  if (!IconComp) return null

  return (
    <span
      aria-hidden
      className="pointer-events-none absolute -right-1 top-1/2 -translate-y-1/2 select-none sm:right-2"
    >
      <IconComp
        weight="bold"
        aria-hidden
        className="size-[5.5rem] text-foreground/[0.07] md:size-[6.75rem]"
      />
    </span>
  )
}

export const OUTCOME_ICON_NAMES = Object.keys(OUTCOME_ICONS)
