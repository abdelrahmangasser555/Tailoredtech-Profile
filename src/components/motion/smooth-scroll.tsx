"use client"

import { useEffect } from "react"
import Lenis from "lenis"

declare global {
  interface Window {
    __lenis?: Lenis
  }
}

/**
 * Lenis smooth scroll — RAF-driven.
 * Exposes `window.__lenis` for programmatic scroll + resize after dynamic content.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
      autoRaf: false,
      // Don't fight nested horizontal scroll / lightbox regions
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

    const onResize = () => lenis.resize()
    window.addEventListener("resize", onResize)

    // Recalc after fonts / late layout (mermaid, images)
    const t1 = window.setTimeout(() => lenis.resize(), 400)
    const t2 = window.setTimeout(() => lenis.resize(), 1200)

    const ro = new ResizeObserver(() => lenis.resize())
    ro.observe(document.documentElement)

    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.removeEventListener("resize", onResize)
      ro.disconnect()
      lenis.destroy()
      if (window.__lenis === lenis) delete window.__lenis
      document.documentElement.classList.remove("lenis", "lenis-smooth")
    }
  }, [])

  return <>{children}</>
}

/** Scroll to a hash/id using Lenis when available (avoids stuck native scrollIntoView). */
export function scrollToId(id: string, offset = -112) {
  const el = document.getElementById(id)
  if (!el) return

  const lenis = window.__lenis
  if (lenis) {
    lenis.scrollTo(el, { offset, duration: 1.1 })
    return
  }

  el.scrollIntoView({ behavior: "smooth", block: "start" })
}

export function refreshSmoothScroll() {
  window.__lenis?.resize()
}
