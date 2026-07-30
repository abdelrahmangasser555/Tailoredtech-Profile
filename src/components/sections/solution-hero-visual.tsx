"use client"

import { ColorPanels, Dithering, Heatmap } from "@paper-design/shaders-react"

const ENGINE_COLORS = ["#D4FF00", "#A8E600", "#3F4A00", "#F0FF99"] as const

/** Brand-aligned heatmap ramp — cool sea → lime heat (no purple) */
const HEATMAP_COLORS = [
  "#0B1A2A",
  "#12304A",
  "#1F4A3A",
  "#3F6B20",
  "#A8E600",
  "#D4FF00",
  "#F5FFB0",
] as const

/** Bahri-oriented ramp — deep navy → orange heat */
export const BAHRI_HEATMAP_COLORS = [
  "#001024",
  "#001F3D",
  "#003C71",
  "#1A5A8A",
  "#A85A30",
  "#E07040",
  "#F0B090",
] as const

export const BAHRI_ENGINE_COLORS = [
  "#E07040",
  "#C9784A",
  "#003C71",
  "#F0C4A8",
] as const

const HEATMAP_IMAGES = {
  diamond: "https://shaders.paper.design/images/logos/diamond.svg",
  eyes: "/assets/heatmap-eyes.svg",
} as const

export type HeroVisualKind =
  | "engine"
  | "ocean"
  | "heatmap"
  | "heatmap-diamond"
  | "heatmap-eyes"
  | "glyph"

export type HeroVisualPalette = {
  engine?: string[]
  heatmap?: string[]
  oceanFront?: string
  oceanBack?: string
}

type SolutionHeroVisualProps = {
  kind: string
  reduce?: boolean
  className?: string
  /** Optional brand override — defaults keep TailoredTech lime */
  palette?: HeroVisualPalette
}

/**
 * Right-side solution hero visual — switch via services.json → page.heroVisual
 */
export function SolutionHeroVisual({
  kind,
  reduce = false,
  className,
  palette,
}: SolutionHeroVisualProps) {
  const visual = normalizeHeroVisual(kind)
  if (visual === "glyph") return null

  const shell =
    className ??
    "relative mx-auto aspect-square w-full max-w-md lg:max-w-none"

  const engineColors = palette?.engine ?? [...ENGINE_COLORS]
  const heatmapColors = palette?.heatmap ?? [...HEATMAP_COLORS]
  const oceanFront = palette?.oceanFront ?? "#D4FF00"
  const oceanBack = palette?.oceanBack ?? "#000000"

  if (visual === "engine") {
    return (
      <div className={shell}>
        <ColorPanels
          colors={engineColors}
          colorBack="#ffffff00"
          density={5.03}
          angle1={0.68}
          angle2={0.28}
          length={1.13}
          edges
          blur={0.25}
          fadeIn={0.85}
          fadeOut={0.3}
          gradient={0.56}
          speed={reduce ? 0 : 2.4}
          scale={0.96}
          rotation={180}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    )
  }

  if (visual === "ocean") {
    return (
      <div className={shell}>
        <Dithering
          width="100%"
          height="100%"
          colorBack={oceanBack}
          colorFront={oceanFront}
          shape="swirl"
          type="4x4"
          size={2}
          speed={reduce ? 0 : 1}
          scale={0.62}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    )
  }

  const image =
    visual === "heatmap-eyes" ? HEATMAP_IMAGES.eyes : HEATMAP_IMAGES.diamond

  return (
    <div className={shell}>
      <Heatmap
        width="100%"
        height="100%"
        image={image}
        colors={heatmapColors}
        colorBack="#00000000"
        contour={0.55}
        angle={visual === "heatmap-eyes" ? 25 : 0}
        noise={0.05}
        innerGlow={0.55}
        outerGlow={0.45}
        speed={reduce ? 0 : 1}
        scale={0.72}
        style={{ width: "100%", height: "100%", background: "transparent" }}
      />
    </div>
  )
}

export function normalizeHeroVisual(
  kind: string | null | undefined
): HeroVisualKind {
  switch (kind) {
    case "ocean":
      return "ocean"
    case "heatmap":
    case "heatmap-diamond":
      return "heatmap-diamond"
    case "heatmap-eyes":
      return "heatmap-eyes"
    case "glyph":
    case "none":
      return "glyph"
    case "engine":
    default:
      return "engine"
  }
}

/** Known values for AGENTS / config authors */
export const HERO_VISUAL_OPTIONS = [
  "engine",
  "ocean",
  "heatmap-diamond",
  "heatmap-eyes",
  "glyph",
] as const

/** Resolve palette presets from brandClass */
export function paletteForBrand(
  brandClass: string | null | undefined
): HeroVisualPalette | undefined {
  if (brandClass === "brand-bahri") {
    return {
      engine: [...BAHRI_ENGINE_COLORS],
      heatmap: [...BAHRI_HEATMAP_COLORS],
      oceanFront: "#E07040",
      oceanBack: "#001F3D",
    }
  }
  return undefined
}
