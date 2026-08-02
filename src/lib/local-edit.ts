/**
 * Local content editor — only active when LOCAL_EDIT / NEXT_PUBLIC_LOCAL_EDIT is "true".
 * Keep these unset (or false) in production.
 */
export function isLocalEditEnabled(): boolean {
  return (
    process.env.NEXT_PUBLIC_LOCAL_EDIT === "true" ||
    process.env.LOCAL_EDIT === "true"
  )
}

/** Server-side gate for write APIs */
export function assertLocalEditEnabled(): void {
  if (!isLocalEditEnabled()) {
    throw new Error("Local edit is disabled")
  }
}

export const BRAND_CLASS_OPTIONS = [
  { value: "", label: "TailoredTech (default)" },
  { value: "brand-bahri", label: "Bahri" },
] as const

export const HERO_VISUAL_LABELS: Record<string, string> = {
  engine: "Engine (ColorPanels)",
  ocean: "Ocean dither swirl",
  "heatmap-diamond": "Heatmap · diamond",
  "heatmap-eyes": "Heatmap · eyes",
  glyph: "Glyph backdrop only",
}
