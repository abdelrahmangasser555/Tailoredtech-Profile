import type { PresentationItem } from "@/lib/content"
import type { PresentationPdfBrand } from "@/lib/presentation-pdf/brand"
import type { PresentationPdfOptions } from "@/lib/presentation-pdf/options"

export type PreparedPdfImage = {
  src: string
  label: string
}

export type PreparedPdfSection = {
  id: string
  title: string
  body: string
  bullets: readonly string[]
  images: PreparedPdfImage[]
  mermaidPng: string | null
  mermaidTitle: string | null
  mermaidCaption: string | null
}

export type PreparedPresentationPdf = {
  presentation: PresentationItem
  brand: PresentationPdfBrand
  clientLogoDataUrl: string | null
  sections: PreparedPdfSection[]
  generatedAt: string
  options: PresentationPdfOptions
}

let mermaidQueue: Promise<unknown> = Promise.resolve()

function enqueueMermaid<T>(task: () => Promise<T>): Promise<T> {
  const next = mermaidQueue.then(task, task)
  mermaidQueue = next.then(
    () => undefined,
    () => undefined
  )
  return next
}

async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

function loadHtmlImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const el = new Image()
    el.decoding = "async"
    el.onload = () => resolve(el)
    el.onerror = () => reject(new Error(`Failed to load image: ${src.slice(0, 80)}`))
    el.src = src
  })
}

/** Force a react-pdf-safe PNG (RGB), optionally downscaled. */
async function normalizeToPngDataUrl(
  src: string,
  maxEdge = 1600
): Promise<string | null> {
  try {
    const img = await loadHtmlImage(src)
    const w = img.naturalWidth || img.width
    const h = img.naturalHeight || img.height
    if (!w || !h) return null

    const scale = Math.min(1, maxEdge / Math.max(w, h))
    const width = Math.max(1, Math.round(w * scale))
    const height = Math.max(1, Math.round(h * scale))

    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")
    if (!ctx) return null
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(0, 0, width, height)
    ctx.drawImage(img, 0, 0, width, height)
    return canvas.toDataURL("image/png")
  } catch (err) {
    console.warn("Image normalize failed", err)
    return null
  }
}

async function fetchAsDataUrl(url: string): Promise<string | null> {
  try {
    if (url.startsWith("data:")) return normalizeToPngDataUrl(url)

    const absolute =
      url.startsWith("http://") || url.startsWith("https://")
        ? url
        : `${window.location.origin}${url.startsWith("/") ? "" : "/"}${url}`

    const res = await fetch(absolute, { cache: "force-cache" })
    if (!res.ok) {
      console.warn("Image fetch failed", absolute, res.status)
      return null
    }
    const blob = await res.blob()
    const dataUrl = await blobToDataUrl(blob)
    return normalizeToPngDataUrl(dataUrl)
  } catch (err) {
    console.warn("Image fetch error", url, err)
    return null
  }
}

function buildLightMermaidTheme(brand: PresentationPdfBrand) {
  return {
    theme: "base" as const,
    themeVariables: {
      darkMode: false,
      background: "#FFFFFF",
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
      fontSize: "13px",
      primaryColor: brand.accent,
      primaryTextColor: brand.accentForeground,
      primaryBorderColor: brand.accent,
      secondaryColor: brand.soft,
      secondaryTextColor: brand.ink,
      secondaryBorderColor: brand.primary,
      tertiaryColor: "#FFFFFF",
      tertiaryTextColor: brand.ink,
      tertiaryBorderColor: brand.muted,
      lineColor: brand.primary,
      textColor: brand.ink,
      mainBkg: brand.soft,
      nodeBkg: brand.soft,
      nodeTextColor: brand.ink,
      nodeBorder: brand.primary,
      clusterBkg: "#F8FAFC",
      clusterBorder: brand.muted,
      titleColor: brand.primary,
      edgeLabelBackground: "#FFFFFF",
      actorBkg: brand.accent,
      actorBorder: brand.accent,
      actorTextColor: brand.accentForeground,
      actorLineColor: brand.primary,
      signalColor: brand.primary,
      signalTextColor: brand.ink,
      labelBoxBkgColor: brand.soft,
      labelBoxBorderColor: brand.primary,
      labelTextColor: brand.primary,
      loopTextColor: brand.ink,
      noteBkgColor: brand.soft,
      noteTextColor: brand.ink,
      noteBorderColor: brand.accent,
    },
  }
}

function parseSvgSize(svg: string): { width: number; height: number } {
  const viewBox = svg.match(/viewBox=["']([^"']+)["']/i)?.[1]
  if (viewBox) {
    const parts = viewBox.trim().split(/[\s,]+/).map(Number)
    if (parts.length === 4 && parts[2]! > 0 && parts[3]! > 0) {
      return { width: parts[2]!, height: parts[3]! }
    }
  }
  const width = Number(svg.match(/\bwidth=["']([\d.]+)/i)?.[1])
  const height = Number(svg.match(/\bheight=["']([\d.]+)/i)?.[1])
  return {
    width: width > 0 ? width : 800,
    height: height > 0 ? height : 450,
  }
}

async function svgStringToPngDataUrl(svg: string, scale = 2): Promise<string> {
  let cleaned = svg.includes("xmlns=")
    ? svg
    : svg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"')

  // Strip foreignObject / HTML labels — canvas cannot paint them
  cleaned = cleaned
    .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")

  const { width: vbW, height: vbH } = parseSvgSize(cleaned)
  if (!/viewBox=/i.test(cleaned)) {
    cleaned = cleaned.replace(
      "<svg",
      `<svg viewBox="0 0 ${vbW} ${vbH}" width="${vbW}" height="${vbH}"`
    )
  }

  const blob = new Blob([cleaned], { type: "image/svg+xml;charset=utf-8" })
  const url = URL.createObjectURL(blob)

  try {
    const img = await loadHtmlImage(url)
    const width = Math.max(img.naturalWidth || vbW, 320)
    const height = Math.max(img.naturalHeight || vbH, 180)
    const canvas = document.createElement("canvas")
    canvas.width = Math.round(width * scale)
    canvas.height = Math.round(height * scale)
    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("Canvas unavailable")
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL("image/png")
  } finally {
    URL.revokeObjectURL(url)
  }
}

async function renderMermaidToPng(
  chart: string,
  uid: string
): Promise<string | null> {
  return enqueueMermaid(async () => {
    try {
      const mermaid = (await import("mermaid")).default
      const renderId = `pdf-mmd-${uid}`.replace(/[^a-zA-Z0-9-_]/g, "-")
      const { svg } = await mermaid.render(renderId, chart.trim())
      // Clean temp nodes mermaid may leave on body
      document.getElementById(renderId)?.remove()
      document.getElementById(`d${renderId}`)?.remove()
      return await svgStringToPngDataUrl(svg)
    } catch (err) {
      console.warn("Mermaid PDF render failed", uid, err)
      return null
    }
  })
}

export async function preparePresentationPdfAssets(
  presentation: PresentationItem,
  brand: PresentationPdfBrand,
  options: PresentationPdfOptions
): Promise<PreparedPresentationPdf> {
  const clientLogoDataUrl = presentation.clientLogo
    ? await fetchAsDataUrl(presentation.clientLogo)
    : null

  const selectedIds = new Set(
    options.sectionIds.length
      ? options.sectionIds
      : presentation.page.sections.map((s) => s.id)
  )

  const needMermaid =
    options.includeDiagrams &&
    presentation.page.sections.some(
      (s) => selectedIds.has(s.id) && Boolean(s.mermaid)
    )

  if (needMermaid) {
    const mermaid = (await import("mermaid")).default
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "loose",
      suppressErrorRendering: true,
      ...buildLightMermaidTheme(brand),
      flowchart: {
        htmlLabels: false,
        curve: "basis",
        useMaxWidth: true,
        padding: 12,
        nodeSpacing: 28,
        rankSpacing: 32,
      },
      sequence: {
        useMaxWidth: true,
      },
      gantt: {
        useMaxWidth: true,
      },
    })
  }

  const sections: PreparedPdfSection[] = []

  for (let i = 0; i < presentation.page.sections.length; i++) {
    const section = presentation.page.sections[i]!
    if (!selectedIds.has(section.id)) continue

    const images: PreparedPdfImage[] = []
    if (options.includeImages) {
      for (const image of section.images ?? []) {
        const dataUrl = await fetchAsDataUrl(image.src)
        if (dataUrl) {
          images.push({ src: dataUrl, label: image.label })
        } else {
          console.warn("Skipped PDF image (failed to load)", image.src)
        }
      }
    }

    let mermaidPng: string | null = null
    if (options.includeDiagrams && section.mermaid) {
      mermaidPng = await renderMermaidToPng(
        section.mermaid,
        `${presentation.id}-${section.id}-${i}-${Date.now()}`
      )
    }

    sections.push({
      id: section.id,
      title: section.title,
      body: section.body ?? "",
      bullets: options.includeBullets ? (section.bullets ?? []) : [],
      images,
      mermaidPng,
      mermaidTitle: section.mermaidTitle ?? null,
      mermaidCaption: section.mermaidCaption ?? null,
    })
  }

  return {
    presentation,
    brand,
    clientLogoDataUrl,
    sections,
    generatedAt: new Date().toISOString().slice(0, 10),
    options,
  }
}
