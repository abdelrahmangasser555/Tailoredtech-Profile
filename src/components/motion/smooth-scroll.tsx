"use client"

import { useEffect } from "react"
import Lenis from "lenis"

declare global {
  interface Window {
    __lenis?: Lenis
  }
}

function debounce(fn: () => void, ms: number) {
  let t = 0
  return () => {
    window.clearTimeout(t)
    t = window.setTimeout(fn, ms)
  }
}

/**
 * Lenis smooth scroll — lighter resize handling to avoid scroll glitches.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.85,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.35,
      autoRaf: false,
      prevent: (node) =>
        Boolean(
          node.closest("[data-lenis-prevent]") ||
            node.closest("[data-lenis-prevent-wheel]")
        ),
    })

    window.__lenis = lenis

    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    document.documentElement.classList.add("lenis", "lenis-smooth")

    const resize = debounce(() => lenis.resize(), 120)
    window.addEventListener("resize", resize)

    // One late pass after fonts / heavy media — not on every layout tick
    const t1 = window.setTimeout(() => lenis.resize(), 500)

    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(t1)
      window.removeEventListener("resize", resize)
      lenis.destroy()
      if (window.__lenis === lenis) delete window.__lenis
      document.documentElement.classList.remove("lenis", "lenis-smooth")
    }
  }, [])

  return <>{children}</>
}

export function scrollToId(id: string, offset = -112) {
  const el = document.getElementById(id)
  if (!el) return

  const lenis = window.__lenis
  if (lenis) {
    lenis.scrollTo(el, { offset, duration: 0.95 })
    return
  }

  el.scrollIntoView({ behavior: "smooth", block: "start" })
}

let refreshTimer = 0
export function refreshSmoothScroll() {
  window.clearTimeout(refreshTimer)
  refreshTimer = window.setTimeout(() => {
    window.__lenis?.resize()
  }, 160)
}
