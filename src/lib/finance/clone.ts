import type { FinanceInvoice, FinanceProposal } from "@/lib/finance/types"

function financeUid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

export function cloneProposal(source: FinanceProposal): FinanceProposal {
  const now = new Date().toISOString()
  const title = source.title.trim() ? `${source.title} (copy)` : "Copy"

  return {
    ...source,
    id: financeUid("proposal"),
    title,
    features: source.features.map((feature) => ({
      ...feature,
      id: financeUid("feat"),
    })),
    solutions: source.solutions.map((solution) => ({
      ...solution,
      id: financeUid("sol"),
      lineItems: solution.lineItems.map((line) => ({
        ...line,
        id: financeUid("line"),
      })),
      prices: solution.prices.map((price) => ({
        ...price,
        id: financeUid("price"),
      })),
      discounts: solution.discounts.map((discount) => ({
        ...discount,
        id: financeUid("disc"),
      })),
    })),
    comparison: {
      ...source.comparison,
      columns: source.comparison.columns.map((column) => ({
        ...column,
        id: financeUid("col"),
      })),
      rows: source.comparison.rows.map((row) => ({
        ...row,
        cells: row.cells.map((cell) => ({ ...cell })),
      })),
    },
    issuer: { ...source.issuer },
    customer: { ...source.customer },
    display: {
      ...source.display,
      footer: { ...source.display.footer },
    },
    createdAt: now,
    updatedAt: now,
    enabled: true,
  }
}

export function cloneInvoice(source: FinanceInvoice): FinanceInvoice {
  const now = new Date().toISOString()
  const date = now.slice(0, 10)
  const number = source.number.trim()
    ? `${source.number}-copy`
    : `QUO-${String(Date.now()).slice(-6)}`

  return {
    ...source,
    id: financeUid("invoice"),
    number,
    status: "draft",
    date,
    issuer: { ...source.issuer },
    customer: { ...source.customer },
    lineItems: source.lineItems.map((line) => ({
      ...line,
      id: financeUid("line"),
    })),
    discounts: source.discounts.map((discount) => ({
      ...discount,
      id: financeUid("disc"),
    })),
    display: {
      ...source.display,
      customMoneyLines: source.display.customMoneyLines.map((line) => ({
        ...line,
        id: financeUid("money"),
      })),
    },
    createdAt: now,
    updatedAt: now,
    enabled: true,
  }
}
