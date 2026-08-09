import type { PresentationItem } from "@/lib/content"

export type PresentationPdfBrand = {
  id: string
  name: string
  /** Primary brand (navy for Bahri, near-black for default) */
  primary: string
  /** Accent (orange for Bahri, lime for default — used sparingly on white) */
  accent: string
  accentForeground: string
  muted: string
  border: string
  soft: string
  ink: string
  paper: string
  headerBg: string
  headerHighlightBg: string
  darkSurface: string
}

const DEFAULT_BRAND: PresentationPdfBrand = {
  id: "default",
  name: "TailoredTech",
  primary: "#0A0A0A",
  accent: "#0A0A0A",
  accentForeground: "#FFFFFF",
  muted: "#525252",
  border: "rgba(10,10,10,0.12)",
  soft: "#F4F4F1",
  ink: "#0A0A0A",
  paper: "#FFFFFF",
  headerBg: "#F4F4F1",
  headerHighlightBg: "#EBEBE6",
  darkSurface: "#050505",
}

const BAHRI_BRAND: PresentationPdfBrand = {
  id: "bahri",
  name: "Bahri",
  primary: "#003C71",
  accent: "#E07040",
  accentForeground: "#FFFFFF",
  muted: "#5C6B7A",
  border: "rgba(0,60,113,0.14)",
  soft: "#F4F6F9",
  ink: "#003C71",
  paper: "#FFFFFF",
  headerBg: "#F4F6F9",
  headerHighlightBg: "#E8ECF1",
  darkSurface: "#001F3D",
}

export function brandForPresentation(
  presentation: PresentationItem
): PresentationPdfBrand {
  if (presentation.brandClass === "brand-bahri") return BAHRI_BRAND
  return DEFAULT_BRAND
}
