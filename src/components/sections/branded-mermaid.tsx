"use client"

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react"
import { Expand, Minimize2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

function readCssVar(el: Element, name: string, fallback: string) {
  const value = getComputedStyle(el).getPropertyValue(name).trim()
  return value || fallback
}

function isVerticalFlowchart(source: string) {
  return /^\s*flowchart\s+(TD|TB|BT)\b/im.test(source.trim())
}

/** Resolve mermaid theme from cascading CSS tokens (supports .brand-* classes). */
function buildMermaidTheme(el: Element, fontSize: string) {
  const accent = readCssVar(el, "--diagram-accent", readCssVar(el, "--accent", "#D4FF00"))
  const accentFg = readCssVar(el, "--accent-foreground", "#0A0A0A")
  const dark = readCssVar(el, "--section-dark", "#0A0A0A")
  const darkFg = readCssVar(el, "--section-dark-fg", "#F5F5F0")
  const accentSoft = readCssVar(el, "--accent-soft", accent)
  const line = readCssVar(el, "--diagram-line", accent)

  return {
    theme: "base" as const,
    themeVariables: {
      darkMode: true,
      background: dark,
      fontFamily:
        "var(--font-geist-mono), ui-monospace, SFMono-Regular, monospace",
      fontSize,
      primaryColor: accent,
      primaryTextColor: accentFg,
      primaryBorderColor: accentSoft,
      secondaryColor: "#161616",
      secondaryTextColor: darkFg,
      secondaryBorderColor: line,
      tertiaryColor: "#1C1C1C",
      tertiaryTextColor: darkFg,
      tertiaryBorderColor: accentSoft,
      lineColor: line,
      textColor: darkFg,
      mainBkg: "#161616",
      nodeBkg: "#161616",
      nodeTextColor: darkFg,
      nodeBorder: accent,
      clusterBkg: dark,
      clusterBorder: line,
      titleColor: accent,
      edgeLabelBackground: dark,
      actorBkg: accent,
      actorBorder: accentSoft,
      actorTextColor: accentFg,
      actorLineColor: line,
      signalColor: line,
      signalTextColor: darkFg,
      labelBoxBkgColor: dark,
      labelBoxBorderColor: accent,
      labelTextColor: accent,
      loopTextColor: darkFg,
      noteBkgColor: "#1A1A1A",
      noteTextColor: darkFg,
      noteBorderColor: accent,
      activationBkgColor: accentSoft,
      activationBorderColor: accent,
      sequenceNumberColor: accentFg,
    },
  }
}

type RenderOpts = {
  host: HTMLElement
  target: HTMLElement
  chart: string
  uid: string
  vertical: boolean
  expanded: boolean
}

async function renderMermaidInto({
  host,
  target,
  chart,
  uid,
  vertical,
  expanded,
}: RenderOpts) {
  const accent = readCssVar(
    host,
    "--diagram-accent",
    readCssVar(host, "--accent", "#D4FF00")
  )
  const line = readCssVar(host, "--diagram-line", accent)
  const darkFg = readCssVar(host, "--section-dark-fg", "#F5F5F0")
  const fontSize = expanded ? (vertical ? "15px" : "16px") : vertical ? "12px" : "13px"
  const mermaidTheme = buildMermaidTheme(host, fontSize)

  const mermaid = (await import("mermaid")).default
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    flowchart: {
      curve: "basis",
      padding: expanded ? (vertical ? 16 : 20) : vertical ? 10 : 14,
      htmlLabels: true,
      nodeSpacing: expanded ? (vertical ? 40 : 48) : vertical ? 26 : 34,
      rankSpacing: expanded ? (vertical ? 44 : 52) : vertical ? 30 : 40,
      useMaxWidth: true,
    },
    sequence: {
      actorMargin: expanded ? 64 : 48,
      messageMargin: expanded ? 48 : 36,
      boxMargin: 10,
      bottomMarginAdj: expanded ? 48 : 40,
      mirrorActors: false,
      useMaxWidth: true,
    },
    ...mermaidTheme,
  })

  const id = `mermaid-${uid}-${expanded ? "xl" : "sm"}-${Date.now()}`
  const { svg } = await mermaid.render(id, chart.trim())
  target.innerHTML = svg

  const el = target.querySelector("svg")
  if (el) {
    const vb = el.getAttribute("viewBox")?.split(/[\s,]+/).map(Number)
    if (vb && vb.length === 4 && vb.every((n) => Number.isFinite(n))) {
      const [x, y, w, h] = vb
      // Small bottom pad only — large pads caused empty scroll traps with Lenis
      const padBottom = expanded ? 24 : 16
      el.setAttribute("viewBox", `${x} ${y} ${w} ${h + padBottom}`)
    }
    el.setAttribute("width", "100%")
    el.removeAttribute("height")
    el.style.width = "100%"
    el.style.height = "auto"
    el.style.display = "block"
    el.style.overflow = "visible"
    el.style.maxWidth = expanded
      ? "100%"
      : vertical
        ? "28rem"
        : "100%"
    if (!expanded && vertical) {
      el.style.maxHeight = "min(380px, 48vh)"
    } else {
      el.style.maxHeight = expanded ? "min(78vh, 900px)" : ""
    }
  }

  target
    .querySelectorAll(
      ".nodeLabel, .nodeLabel span, .label, foreignObject div, foreignObject span"
    )
    .forEach((node) => {
      const html = node as HTMLElement
      html.style.color = darkFg
      html.style.fill = darkFg
      html.style.fontSize = fontSize
    })
  target.querySelectorAll(".edgeLabel, .edgeLabel span").forEach((node) => {
    const html = node as HTMLElement
    html.style.color = accent
    html.style.fill = accent
  })
  target.querySelectorAll("path.flowchart-link").forEach((path) => {
    path.setAttribute("stroke", line)
    path.setAttribute("stroke-dasharray", "5 4")
    path.setAttribute("stroke-width", expanded ? "1.75" : "1.5")
  })
  target.querySelectorAll(".messageLine0, .messageLine1").forEach((path) => {
    path.setAttribute("stroke", line)
    path.setAttribute("stroke-dasharray", "5 4")
  })
  target.querySelectorAll(".node rect, .node polygon").forEach((node) => {
    const shape = node as SVGElement
    shape.setAttribute("stroke", accent)
    shape.setAttribute("stroke-width", expanded ? "1.75" : "1.5")
  })
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
  const shellRef = useRef<HTMLDivElement>(null)
  const inlineRef = useRef<HTMLDivElement>(null)
  const expandedRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)
  const vertical = useMemo(() => isVerticalFlowchart(chart), [chart])

  const paint = useCallback(
    async (target: HTMLDivElement | null, isExpanded: boolean) => {
      const host = shellRef.current
      if (!host || !target || !chart.trim()) return
      try {
        await renderMermaidInto({
          host,
          target,
          chart,
          uid,
          vertical,
          expanded: isExpanded,
        })
        // Soft Lenis resize only — avoid start()/scroll resets that hitch mid-scroll
        requestAnimationFrame(() => {
          window.__lenis?.resize()
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Diagram failed")
        target.innerHTML = ""
      }
    },
    [chart, uid, vertical]
  )

  useEffect(() => {
    let cancelled = false
    setError(null)
    void (async () => {
      if (cancelled) return
      await paint(inlineRef.current, false)
    })()
    return () => {
      cancelled = true
    }
  }, [paint])

  useEffect(() => {
    if (!expanded) return
    let cancelled = false
    const t = window.setTimeout(() => {
      if (!cancelled) void paint(expandedRef.current, true)
    }, 40)
    return () => {
      cancelled = true
      window.clearTimeout(t)
    }
  }, [expanded, paint])

  // Pause Lenis while maximized so dialog scroll doesn't fight smooth scroll
  useEffect(() => {
    const lenis = window.__lenis
    if (!lenis) return
    if (expanded) {
      lenis.stop()
    } else {
      lenis.start()
      requestAnimationFrame(() => lenis.resize())
    }
  }, [expanded])

  const heading = title?.trim() || "Diagram"

  return (
    <figure className={cn("mt-10", className)}>
      <div
        ref={shellRef}
        className={cn(
          // No data-lenis-prevent-* — that trapped the wheel and glitched at the box edge
          "border border-white/10 bg-[#0A0A0A] p-4 md:p-5",
          vertical ? "pb-5 md:pb-6" : "pb-5 md:pb-6"
        )}
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-accent">
            {heading}
          </p>
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="inline-flex h-8 items-center gap-1.5 border border-white/15 px-2.5 font-mono text-[10px] tracking-[0.14em] uppercase text-white/55 transition hover:border-white/30 hover:text-white"
            aria-label="Maximize diagram"
          >
            <Expand className="size-3.5" />
            Expand
          </button>
        </div>

        {error ? (
          <p className="font-mono text-sm text-red-400">{error}</p>
        ) : (
          <div
            ref={inlineRef}
            className={cn(
              "mermaid-brand flex items-center justify-center overflow-visible",
              vertical ? "min-h-24 pb-1" : "min-h-28 pb-1",
              "[&_svg]:mx-auto",
              vertical && "[&_svg]:max-h-[min(380px,48vh)] [&_svg]:max-w-md"
            )}
          />
        )}
      </div>

      {caption && (
        <figcaption className="mt-3 font-mono text-[11px] tracking-wide text-white/35">
          {caption}
        </figcaption>
      )}

      <Dialog open={expanded} onOpenChange={setExpanded}>
        <DialogContent
          showCloseButton={false}
          className="flex h-[min(92vh,960px)] w-[min(96vw,1100px)] max-w-none flex-col gap-0 overflow-hidden rounded-none border border-white/15 bg-[#0A0A0A] p-0 text-white ring-0 sm:max-w-none"
        >
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 md:px-5">
            <DialogTitle className="font-mono text-[11px] tracking-[0.2em] uppercase text-accent">
              {heading}
            </DialogTitle>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="inline-flex h-8 items-center gap-1.5 border border-white/15 px-2.5 font-mono text-[10px] tracking-[0.14em] uppercase text-white/55 transition hover:border-white/30 hover:text-white"
            >
              <Minimize2 className="size-3.5" />
              Close
            </button>
          </div>
          <div className="mermaid-expand-scroll min-h-0 flex-1 overflow-auto overscroll-contain p-4 md:p-6">
            <div
              ref={expandedRef}
              className="mermaid-brand flex min-h-full items-center justify-center [&_svg]:mx-auto [&_svg]:max-h-[min(78vh,860px)]"
            />
          </div>
          {caption && (
            <p className="border-t border-white/10 px-4 py-3 font-mono text-[11px] tracking-wide text-white/40 md:px-5">
              {caption}
            </p>
          )}
        </DialogContent>
      </Dialog>
    </figure>
  )
}
