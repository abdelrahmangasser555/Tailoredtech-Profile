"use client"

import { useEffect } from "react"
import Lenis from "lenis"

/**
 * Lenis smooth scroll — RAF-driven (no GSAP pin coupling) so long sticky
 * sections don't stall the page scroll.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
      autoRaf: false,
    })

    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    document.documentElement.classList.add("lenis", "lenis-smooth")

    const onResize = () => lenis.resize()
    window.addEventListener("resize", onResize)

    // Recalc after fonts/images settle
    const t = window.setTimeout(() => lenis.resize(), 400)

    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(t)
      window.removeEventListener("resize", onResize)
      lenis.destroy()
      document.documentElement.classList.remove("lenis", "lenis-smooth")
    }
  }, [])

  return <>{children}</>
}
