import finance from "@/config/finance.json"
import type {
  FinanceBrand,
  FinanceBrandId,
  FinanceConfig,
  FinanceInvoice,
  FinanceProposal,
  InvoiceFormatId,
  ProposalFormatId,
} from "@/lib/finance/types"

export type { FinanceConfig, FinanceProposal, FinanceBrand, FinanceInvoice }

export function getFinanceConfig(): FinanceConfig {
  return finance as FinanceConfig
}

export function getFinanceBrands(): FinanceBrand[] {
  return getFinanceConfig().brands
}

export function getFinanceBrand(id: FinanceBrandId): FinanceBrand {
  const brand = getFinanceBrands().find((b) => b.id === id)
  if (!brand) return getFinanceBrands()[0]!
  return brand
}

export function getFinanceFormats() {
  return getFinanceConfig().formats
}

export function getFinanceFormat(id: ProposalFormatId) {
  return getFinanceFormats().find((f) => f.id === id) ?? getFinanceFormats()[0]!
}

export function getInvoiceFormats() {
  return getFinanceConfig().invoiceFormats ?? []
}

export function getInvoiceFormat(id: InvoiceFormatId) {
  return (
    getInvoiceFormats().find((f) => f.id === id) ?? getInvoiceFormats()[0]!
  )
}

export function getProposals(): FinanceProposal[] {
  return getFinanceConfig().proposals.filter((p) => p.enabled)
}

export function getProposalById(id: string): FinanceProposal | undefined {
  return getFinanceConfig().proposals.find((p) => p.id === id && p.enabled)
}

export function getInvoices(): FinanceInvoice[] {
  return getFinanceConfig().invoices.filter((i) => i.enabled)
}

export function getInvoiceById(id: string): FinanceInvoice | undefined {
  return getFinanceConfig().invoices.find((i) => i.id === id && i.enabled)
}
