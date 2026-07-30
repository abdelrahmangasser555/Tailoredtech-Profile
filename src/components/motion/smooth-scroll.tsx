"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
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

/** Clear scroll locks and refresh Lenis dimensions (e.g. after route change or lightbox). */
export function resetScrollState() {
  document.documentElement.style.removeProperty("overflow")
  document.body.style.removeProperty("overflow")

  const lenis = window.__lenis
  if (!lenis) return

  lenis.start()
  lenis.resize()
}

/**
 * Soft Lenis dimension refresh (e.g. after media inject).
 * Prefer this over resetScrollState mid-scroll — start()/overflow churn causes hitches.
 */
let refreshTimer = 0
export function refreshSmoothScroll() {
  window.clearTimeout(refreshTimer)
  refreshTimer = window.setTimeout(() => {
    window.__lenis?.resize()
  }, 280)
}

/**
 * Lenis smooth scroll — recalculates on route changes so tall home sections
 * (layer-collapse, timeline) stay scrollable after client navigation.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.85,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.35,
      autoRaf: false,
      stopInertiaOnNavigate: true,
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

    const main = document.querySelector("main")
    const contentObserver =
      main &&
      new ResizeObserver(() => {
        resize()
      })
    if (main && contentObserver) {
      contentObserver.observe(main)
    }

    const t1 = window.setTimeout(() => lenis.resize(), 500)

    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(t1)
      window.removeEventListener("resize", resize)
      contentObserver?.disconnect()
      lenis.destroy()
      if (window.__lenis === lenis) delete window.__lenis
      document.documentElement.classList.remove("lenis", "lenis-smooth")
      document.documentElement.style.removeProperty("overflow")
      document.body.style.removeProperty("overflow")
    }
  }, [])

  // Home ↔ inner pages swap very different scroll heights; Lenis must refresh.
  useEffect(() => {
    resetScrollState()
    const t1 = window.setTimeout(resetScrollState, 80)
    const t2 = window.setTimeout(resetScrollState, 280)
    const t3 = window.setTimeout(resetScrollState, 700)

    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.clearTimeout(t3)
    }
  }, [pathname])

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
