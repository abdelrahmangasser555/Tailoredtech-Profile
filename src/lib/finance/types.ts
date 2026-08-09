export type FinanceBrandId = "tailoredtech" | "bahri" | "marafei"

export type ProposalFormatId =
  | "formal-breakdown"
  | "formal-features"
  | "formal-compact"

export type FinanceBrand = {
  id: FinanceBrandId
  name: string
  logo: string | null
  /** CSS scope class for on-screen preview */
  brandClass: string
  colors: {
    primary: string
    accent: string
    muted: string
    border: string
    soft: string
    ink: string
    paper: string
  }
}

export type ProposalPriceLine = {
  id: string
  label: string
  amount: number
  /** Optional qty for breakdown tables */
  quantity?: number
  note?: string
}

export type ProposalDiscount = {
  id: string
  label: string
  /** Fixed amount off (currency units) */
  amount?: number
  /** Percent off subtotal (0–100) */
  percent?: number
}

export type ProposalSolution = {
  id: string
  name: string
  description: string
  /** Line items for breakdown format */
  lineItems: ProposalPriceLine[]
  /** Named price options (e.g. Annual, One-time) */
  prices: ProposalPriceLine[]
  discounts: ProposalDiscount[]
}

export type ProposalFeature = {
  id: string
  title: string
  description: string
}

export type ProposalComparisonCell = {
  type: "check" | "x" | "number" | "text"
  value: string | number | boolean
}

export type ProposalComparison = {
  enabled: boolean
  eyebrow: string
  title: string
  columns: { id: string; label: string; highlight?: boolean }[]
  rows: { label: string; cells: ProposalComparisonCell[] }[]
}

export type ProposalDisplay = {
  showFeatures: boolean
  showBreakdown: boolean
  showComparison: boolean
  showMarkdown: boolean
  showPrices: boolean
  showPageNumbers: boolean
  /** Compact vs expanded feature treatment */
  featuresStyle: "list" | "grid"
  footer: {
    enabled: boolean
    text: string
  }
}

export type FinanceProposal = {
  id: string
  title: string
  subtitle: string
  clientName: string
  brandId: FinanceBrandId
  format: ProposalFormatId
  currency: string
  /** Optional proposal icon (uploaded or public path) */
  icon: string | null
  markdown: string
  features: ProposalFeature[]
  solutions: ProposalSolution[]
  comparison: ProposalComparison
  display: ProposalDisplay
  createdAt: string
  updatedAt: string
  enabled: boolean
}

/** First invoice format: Marafei-style bilingual proforma. More formats later. */
export type InvoiceFormatId = "proforma-bilingual"

export type InvoiceLanguageMode = "bilingual" | "en"

export type InvoiceIssuer = {
  nameEn: string
  nameAr: string
  addressEn: string
  addressAr: string
  vatNumber: string
  /** Saudi 700 / commercial registration number */
  commercialNumber: string
  logo: string | null
}

export type InvoiceCustomer = {
  name: string
  address: string
  otherId: string
}

export type InvoiceLineItem = {
  id: string
  /** Multi-line description; use newlines and "- " for bullets */
  description: string
  quantity: number
  unitPrice: number
  /** Override invoice-level VAT for this line; null = use invoice default */
  vatPercent: number | null
  /** Optional highlighted note under the description */
  note: string
}

export type InvoiceDiscount = {
  id: string
  labelEn: string
  labelAr: string
  amount?: number
  percent?: number
}

/** Extra money rows in the totals block (beyond subtotal / VAT / discount / total). */
export type InvoiceMoneyLine = {
  id: string
  labelEn: string
  labelAr: string
  amount: number
  visible: boolean
}

export type InvoiceDisplay = {
  showSubtotal: boolean
  showVat: boolean
  showDiscount: boolean
  showTotal: boolean
  showPageNumbers: boolean
  /** Show proforma/invoice number in meta row + footer */
  showInvoiceNumber: boolean
  /** Show date cell in the meta row */
  showDate: boolean
  customMoneyLines: InvoiceMoneyLine[]
}

export type FinanceInvoice = {
  id: string
  format: InvoiceFormatId
  language: InvoiceLanguageMode
  status: "draft" | "sent" | "paid"
  /** Document title, e.g. "Proforma Invoice" */
  titleEn: string
  titleAr: string
  number: string
  date: string
  currency: string
  /** Display symbol next to totals (e.g. ﷼ or SAR) */
  currencySymbol: string
  /** Default VAT % applied to lines when line.vatPercent is null */
  vatPercent: number
  issuer: InvoiceIssuer
  customer: InvoiceCustomer
  lineItems: InvoiceLineItem[]
  discounts: InvoiceDiscount[]
  display: InvoiceDisplay
  createdAt: string
  updatedAt: string
  enabled: boolean
}

export type FinanceConfig = {
  brands: FinanceBrand[]
  formats: { id: ProposalFormatId; label: string; description: string }[]
  invoiceFormats: {
    id: InvoiceFormatId
    label: string
    description: string
  }[]
  proposals: FinanceProposal[]
  invoices: FinanceInvoice[]
}

export const DEFAULT_PROPOSAL_DISPLAY: ProposalDisplay = {
  showFeatures: true,
  showBreakdown: true,
  showComparison: false,
  showMarkdown: true,
  showPrices: true,
  showPageNumbers: true,
  featuresStyle: "list",
  footer: {
    enabled: true,
    text: "Confidential · Prepared for the recipient listed above",
  },
}

export function emptyProposal(partial?: Partial<FinanceProposal>): FinanceProposal {
  const now = new Date().toISOString()
  return {
    id: partial?.id ?? `proposal-${Date.now().toString(36)}`,
    title: partial?.title ?? "New proposal",
    subtitle: partial?.subtitle ?? "",
    clientName: partial?.clientName ?? "",
    brandId: partial?.brandId ?? "tailoredtech",
    format: partial?.format ?? "formal-breakdown",
    currency: partial?.currency ?? "USD",
    icon: partial?.icon ?? null,
    markdown: partial?.markdown ?? "",
    features: partial?.features ?? [],
    solutions: partial?.solutions ?? [
      {
        id: "sol-1",
        name: "Solution",
        description: "",
        lineItems: [],
        prices: [{ id: "price-1", label: "Total", amount: 0 }],
        discounts: [],
      },
    ],
    comparison: partial?.comparison ?? {
      enabled: false,
      eyebrow: "Comparison",
      title: "Options at a glance",
      columns: [],
      rows: [],
    },
    display: { ...DEFAULT_PROPOSAL_DISPLAY, ...partial?.display },
    createdAt: partial?.createdAt ?? now,
    updatedAt: partial?.updatedAt ?? now,
    enabled: partial?.enabled ?? true,
  }
}

export const DEFAULT_INVOICE_DISPLAY: InvoiceDisplay = {
  showSubtotal: true,
  showVat: true,
  showDiscount: false,
  showTotal: true,
  showPageNumbers: true,
  showInvoiceNumber: true,
  showDate: true,
  customMoneyLines: [],
}

export const DEFAULT_INVOICE_ISSUER: InvoiceIssuer = {
  nameEn: "Marafe Almarefa Est For Information",
  nameAr: "مؤسسة مرافق المعرفة للاتصالات وتقنية المعلومات",
  addressEn: "Riyadh, Kingdom of Saudi Arabia",
  addressAr: "الرياض، المملكة العربية السعودية",
  vatNumber: "311953722000003",
  commercialNumber: "7003792888",
  logo: "/assets/uploads/finance/brand-marafei/logo-msma2gww.jpg",
}

export function emptyInvoice(partial?: Partial<FinanceInvoice>): FinanceInvoice {
  const now = new Date().toISOString()
  const date = now.slice(0, 10)
  return {
    id: partial?.id ?? `invoice-${Date.now().toString(36)}`,
    format: partial?.format ?? "proforma-bilingual",
    language: partial?.language ?? "bilingual",
    status: partial?.status ?? "draft",
    titleEn: partial?.titleEn ?? "Proforma Invoice",
    titleAr: partial?.titleAr ?? "فاتورة مبدئية",
    number: partial?.number ?? `QUO-${String(Date.now()).slice(-6)}`,
    date: partial?.date ?? date,
    currency: partial?.currency ?? "SAR",
    currencySymbol: partial?.currencySymbol ?? "SAR",
    vatPercent: partial?.vatPercent ?? 0,
    issuer: { ...DEFAULT_INVOICE_ISSUER, ...partial?.issuer },
    customer: partial?.customer ?? {
      name: "",
      address: "",
      otherId: "",
    },
    lineItems: partial?.lineItems ?? [
      {
        id: "line-1",
        description: "Line item",
        quantity: 1,
        unitPrice: 0,
        vatPercent: null,
        note: "",
      },
    ],
    discounts: partial?.discounts ?? [],
    display: {
      ...DEFAULT_INVOICE_DISPLAY,
      ...partial?.display,
      customMoneyLines:
        partial?.display?.customMoneyLines ??
        DEFAULT_INVOICE_DISPLAY.customMoneyLines,
    },
    createdAt: partial?.createdAt ?? now,
    updatedAt: partial?.updatedAt ?? now,
    enabled: partial?.enabled ?? true,
  }
}
