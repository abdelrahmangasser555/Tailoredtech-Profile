"use client"

import { useEffect, useId, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { refreshSmoothScroll } from "@/components/motion/smooth-scroll"

const BRAND_THEME = {
  theme: "base" as const,
  themeVariables: {
    darkMode: true,
    background: "#0A0A0A",
    fontFamily:
      "var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace",
    fontSize: "15px",
    primaryColor: "#D4FF00",
    primaryTextColor: "#0A0A0A",
    primaryBorderColor: "#A8E600",
    secondaryColor: "#161616",
    secondaryTextColor: "#F5F5F0",
    secondaryBorderColor: "#D4FF00",
    tertiaryColor: "#1C1C1C",
    tertiaryTextColor: "#F5F5F0",
    tertiaryBorderColor: "#A8E600",
    lineColor: "#D4FF00",
    textColor: "#F5F5F0",
    mainBkg: "#161616",
    nodeBkg: "#161616",
    nodeTextColor: "#F5F5F0",
    nodeBorder: "#D4FF00",
    clusterBkg: "#0A0A0A",
    clusterBorder: "#3F4A00",
    titleColor: "#D4FF00",
    edgeLabelBackground: "#0A0A0A",
    actorBkg: "#D4FF00",
    actorBorder: "#A8E600",
    actorTextColor: "#0A0A0A",
    actorLineColor: "#D4FF00",
    signalColor: "#D4FF00",
    signalTextColor: "#F5F5F0",
    labelBoxBkgColor: "#0A0A0A",
    labelBoxBorderColor: "#D4FF00",
    labelTextColor: "#D4FF00",
    loopTextColor: "#F5F5F0",
    noteBkgColor: "#1A1A1A",
    noteTextColor: "#F5F5F0",
    noteBorderColor: "#D4FF00",
    activationBkgColor: "#3F4A00",
    activationBorderColor: "#D4FF00",
    sequenceNumberColor: "#0A0A0A",
  },
}

type BrandedMermaidProps = {
  chart: string
  className?: string
  /** Shown as the block title (not the generic “Diagram”) */
  title?: string
  caption?: string
}

export function BrandedMermaid({
  chart,
  className,
  title,
  caption,
}: BrandedMermaidProps) {
  const uid = useId().replace(/:/g, "")
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function render() {
      if (!containerRef.current || !chart.trim()) return
      setError(null)

      try {
        const mermaid = (await import("mermaid")).default
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          flowchart: {
            curve: "basis",
            padding: 18,
            htmlLabels: true,
            nodeSpacing: 44,
            rankSpacing: 52,
          },
          sequence: {
            actorMargin: 56,
            messageMargin: 42,
            boxMargin: 12,
            bottomMarginAdj: 48,
            mirrorActors: false,
            useMaxWidth: true,
          },
          ...BRAND_THEME,
        })

        const id = `mermaid-${uid}-${Date.now()}`
        const { svg } = await mermaid.render(id, chart.trim())
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg
          const el = containerRef.current.querySelector("svg")
          if (el) {
            // Pad viewBox so lifelines / last arrows aren't clipped
            const vb = el.getAttribute("viewBox")?.split(/[\s,]+/).map(Number)
            if (vb && vb.length === 4 && vb.every((n) => Number.isFinite(n))) {
              const [x, y, w, h] = vb
              const padBottom = 56
              el.setAttribute(
                "viewBox",
                `${x} ${y} ${w} ${h + padBottom}`
              )
            }
            el.setAttribute("width", "100%")
            el.removeAttribute("height")
            el.style.maxWidth = "100%"
            el.style.height = "auto"
            el.style.display = "block"
            el.style.overflow = "visible"
          }

          containerRef.current
            .querySelectorAll(
              ".nodeLabel, .nodeLabel span, .label, foreignObject div, foreignObject span"
            )
            .forEach((node) => {
              const html = node as HTMLElement
              html.style.color = "#F5F5F0"
              html.style.fill = "#F5F5F0"
            })
          containerRef.current
            .querySelectorAll(".edgeLabel, .edgeLabel span")
            .forEach((node) => {
              const html = node as HTMLElement
              html.style.color = "#D4FF00"
              html.style.fill = "#D4FF00"
            })
          containerRef.current
            .querySelectorAll("path.flowchart-link")
            .forEach((path) => {
              path.setAttribute("stroke-dasharray", "6 5")
              path.setAttribute("stroke-width", "1.75")
            })
          containerRef.current
            .querySelectorAll(".messageLine0, .messageLine1")
            .forEach((path) => {
              path.setAttribute("stroke-dasharray", "6 5")
            })

          // Lenis scroll height can go stale after SVG inject
          requestAnimationFrame(() => refreshSmoothScroll())
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Diagram failed")
          if (containerRef.current) containerRef.current.innerHTML = ""
        }
      }
    }

    void render()
    return () => {
      cancelled = true
    }
  }, [chart, uid])

  return (
    <figure className={cn("mt-10", className)}>
      <div
        data-lenis-prevent-wheel
        className="overflow-x-auto overscroll-x-contain border border-white/10 bg-[#0A0A0A] p-4 pb-8 md:p-6 md:pb-10"
      >
        <p className="mb-4 font-mono text-[10px] tracking-[0.22em] uppercase text-accent">
          {title?.trim() || "Diagram"}
        </p>
        {error ? (
          <p className="font-mono text-sm text-red-400">{error}</p>
        ) : (
          <div
            ref={containerRef}
            className={cn(
              "mermaid-brand flex min-h-[8rem] items-center justify-center overflow-visible pb-4 [&_svg]:mx-auto",
              "[&_.nodeLabel]:!text-[#F5F5F0] [&_.nodeLabel_span]:!text-[#F5F5F0]",
              "[&_.edgeLabel]:!text-accent [&_.edgePath_path]:stroke-accent"
            )}
          />
        )}
      </div>
      {caption && (
        <figcaption className="mt-3 font-mono text-[11px] tracking-wide text-white/35">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
