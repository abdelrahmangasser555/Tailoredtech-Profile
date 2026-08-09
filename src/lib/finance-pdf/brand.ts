import type { FinanceBrand } from "@/lib/finance/types"

export type ProposalPdfBrand = {
  id: string
  name: string
  primary: string
  accent: string
  muted: string
  border: string
  soft: string
  ink: string
  paper: string
  logo: string | null
}

export function brandForProposalPdf(brand: FinanceBrand): ProposalPdfBrand {
  return {
    id: brand.id,
    name: brand.name,
    primary: brand.colors.primary,
    accent: brand.colors.accent,
    muted: brand.colors.muted,
    border: brand.colors.border,
    soft: brand.colors.soft,
    ink: brand.colors.ink,
    paper: brand.colors.paper,
    logo: brand.logo,
  }
}
