import { Inter, Montserrat } from "next/font/google"

export const bahriBody = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-bahri-body",
})

export const bahriDisplay = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  variable: "--font-bahri-display",
})

export const SLIDE_W = 1440
export const SLIDE_H = 810

export const displayFace =
  "font-[family-name:var(--font-bahri-display)] font-semibold tracking-tight"

export const NAVY = "#003C71"
export const NAVY_DEEP = "#001F3D"
export const ORANGE = "#FF681D"
export const MIST = "#F4F6F8"
export const INK = "#003C71"
export const MUTED = "#5C6B7A"
export const LINE = "rgba(0,60,113,0.12)"
