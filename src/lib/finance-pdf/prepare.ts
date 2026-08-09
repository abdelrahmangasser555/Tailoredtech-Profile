import type { FinanceProposal } from "@/lib/finance/types"
import type { ProposalPdfBrand } from "@/lib/finance-pdf/brand"
import { getFinanceBrand } from "@/lib/finance/content"
import { brandForProposalPdf } from "@/lib/finance-pdf/brand"

export type PreparedProposalPdf = {
  proposal: FinanceProposal
  brand: ProposalPdfBrand
  brandLogoDataUrl: string | null
  iconDataUrl: string | null
}

async function normalizeToPngDataUrl(
  src: string,
  maxEdge = 800
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
  } catch {
    return null
  }
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

async function fetchAsDataUrl(url: string | null | undefined): Promise<string | null> {
  if (!url) return null
  try {
    if (url.startsWith("data:")) return normalizeToPngDataUrl(url)

    const absolute =
      url.startsWith("http://") || url.startsWith("https://")
        ? url
        : `${window.location.origin}${url.startsWith("/") ? "" : "/"}${url}`

    const res = await fetch(absolute, { cache: "force-cache" })
    if (!res.ok) return null
    const blob = await res.blob()
    const reader = new FileReader()
    const dataUrl = await new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(String(reader.result))
      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(blob)
    })
    return normalizeToPngDataUrl(dataUrl)
  } catch {
    return null
  }
}

export async function prepareProposalPdfAssets(
  proposals: FinanceProposal[]
): Promise<PreparedProposalPdf[]> {
  return Promise.all(
    proposals.map(async (proposal) => {
      const financeBrand = getFinanceBrand(proposal.brandId)
      const brand = brandForProposalPdf(financeBrand)
      const [brandLogoDataUrl, iconDataUrl] = await Promise.all([
        fetchAsDataUrl(brand.logo),
        fetchAsDataUrl(proposal.icon),
      ])
      return { proposal, brand, brandLogoDataUrl, iconDataUrl }
    })
  )
}
