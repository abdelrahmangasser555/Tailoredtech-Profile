import type {
  TracksheetItemType,
  TracksheetPaletteId,
  TracksheetStatus,
} from "@/lib/tracksheets/types"
import { TRACKSHEET_STATUSES, TRACKSHEET_TYPES } from "@/lib/tracksheets/types"

export type Swatch = { bg: string; fg: string }

export type TracksheetPalette = {
  id: TracksheetPaletteId
  name: string
  paper: string
  ink: string
  muted: string
  line: string
  soft: string
  primary: string
  primaryText: string
  accent: string
  accentText: string
  status: Record<TracksheetStatus, Swatch>
  types: Record<Exclude<TracksheetItemType, "custom">, Swatch>
}

/**
 * Document palettes. Accent fills always pair with a dark or light ink
 * that stays readable. Lime is never used as small text on white.
 * Bahri values match the brand sheet: navy #003C71, white #FFFFFF,
 * gray #A8A8AA, orange #FF681D.
 */
export const TRACKSHEET_PALETTES: TracksheetPalette[] = [
  {
    id: "tailoredtech",
    name: "TailoredTech",
    paper: "#FFFFFF",
    ink: "#0A0A0A",
    muted: "#5C5C5C",
    line: "#E4E4DF",
    soft: "#F4F4F1",
    primary: "#0A0A0A",
    primaryText: "#FFFFFF",
    accent: "#D4FF00",
    accentText: "#0A0A0A",
    status: {
      enrolled: { bg: "#F4F4F1", fg: "#0A0A0A" },
      "under-development": { bg: "#D4FF00", fg: "#0A0A0A" },
      "under-vendor-testing": { bg: "#0A0A0A", fg: "#FFFFFF" },
      uat: { bg: "#1F1F1F", fg: "#D4FF00" },
      removed: { bg: "#ECECE8", fg: "#6A6A6A" },
      declined: { bg: "#2A2A2A", fg: "#FFFFFF" },
    },
    types: {
      "additional-module": { bg: "#0A0A0A", fg: "#FFFFFF" },
      feature: { bg: "#D4FF00", fg: "#0A0A0A" },
      "remove-feature": { bg: "#E7E7E2", fg: "#0A0A0A" },
      "workflow-change": { bg: "#2C2C2C", fg: "#FFFFFF" },
      bug: { bg: "#0A0A0A", fg: "#D4FF00" },
    },
  },
  {
    id: "bahri",
    name: "Bahri",
    paper: "#FFFFFF",
    ink: "#102033",
    muted: "#5E6872",
    line: "#E3E6EA",
    soft: "#F4F6F8",
    primary: "#003C71",
    primaryText: "#FFFFFF",
    accent: "#FF681D",
    accentText: "#1A1208",
    status: {
      enrolled: { bg: "#E7EEF5", fg: "#003C71" },
      "under-development": { bg: "#FF681D", fg: "#1A1208" },
      "under-vendor-testing": { bg: "#003C71", fg: "#FFFFFF" },
      uat: { bg: "#FFE4D6", fg: "#003C71" },
      removed: { bg: "#EEEEF0", fg: "#5C6168" },
      declined: { bg: "#F8EBE6", fg: "#8A3412" },
    },
    types: {
      "additional-module": { bg: "#003C71", fg: "#FFFFFF" },
      feature: { bg: "#FFE4D6", fg: "#003C71" },
      "remove-feature": { bg: "#A8A8AA", fg: "#102033" },
      "workflow-change": { bg: "#001F3D", fg: "#FFFFFF" },
      bug: { bg: "#FF681D", fg: "#1A1208" },
    },
  },
  {
    id: "graphite",
    name: "Graphite",
    paper: "#FFFFFF",
    ink: "#1C1C1C",
    muted: "#5F5F5F",
    line: "#E6E6E6",
    soft: "#F6F6F6",
    primary: "#2B2B2B",
    primaryText: "#FFFFFF",
    accent: "#4A4A4A",
    accentText: "#FFFFFF",
    status: {
      enrolled: { bg: "#F3F3F3", fg: "#1C1C1C" },
      "under-development": { bg: "#2B2B2B", fg: "#FFFFFF" },
      "under-vendor-testing": { bg: "#4A4A4A", fg: "#FFFFFF" },
      uat: { bg: "#E4E4E4", fg: "#1C1C1C" },
      removed: { bg: "#F7F7F7", fg: "#8A8A8A" },
      declined: { bg: "#1C1C1C", fg: "#FFFFFF" },
    },
    types: {
      "additional-module": { bg: "#1C1C1C", fg: "#FFFFFF" },
      feature: { bg: "#E8E8E8", fg: "#1C1C1C" },
      "remove-feature": { bg: "#F3F3F3", fg: "#5F5F5F" },
      "workflow-change": { bg: "#4A4A4A", fg: "#FFFFFF" },
      bug: { bg: "#2B2B2B", fg: "#FFFFFF" },
    },
  },
]

export function getPalette(id: TracksheetPaletteId): TracksheetPalette {
  return TRACKSHEET_PALETTES.find((palette) => palette.id === id) ?? TRACKSHEET_PALETTES[0]!
}

export function statusLabel(id: TracksheetStatus): string {
  return TRACKSHEET_STATUSES.find((status) => status.id === id)?.label ?? id
}

export function typeLabel(
  id: TracksheetItemType,
  customLabel?: string
): string {
  if (id === "custom") return customLabel?.trim() || "Custom"
  return TRACKSHEET_TYPES.find((type) => type.id === id)?.label ?? id
}

export function statusSwatch(
  palette: TracksheetPalette,
  id: TracksheetStatus
): Swatch {
  return palette.status[id]
}

export function typeSwatch(
  palette: TracksheetPalette,
  id: TracksheetItemType,
  customColor?: string
): Swatch {
  if (id === "custom") {
    const bg = customColor?.trim() || palette.primary
    return { bg, fg: readableInk(bg) }
  }
  return palette.types[id]
}

/** Pick black or white text for a hex fill. */
export function readableInk(hex: string): string {
  const h = hex.replace("#", "").trim()
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return "#0A0A0A"
  const channel = (start: number) => parseInt(h.slice(start, start + 2), 16) / 255
  const lin = (c: number) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  const luminance =
    0.2126 * lin(channel(0)) + 0.7152 * lin(channel(2)) + 0.0722 * lin(channel(4))
  return luminance > 0.42 ? "#0A0A0A" : "#FFFFFF"
}
