import type {
  FinanceProposal,
  ProposalDiscount,
  ProposalPriceLine,
  ProposalSolution,
} from "@/lib/finance/types"

export function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    }).format(amount)
  } catch {
    return `${currency} ${amount.toLocaleString("en-US")}`
  }
}

export function lineItemTotal(line: ProposalPriceLine): number {
  const qty = line.quantity ?? 1
  return line.amount * qty
}

export function solutionSubtotal(solution: ProposalSolution): number {
  if (solution.lineItems.length > 0) {
    return solution.lineItems.reduce((sum, line) => sum + lineItemTotal(line), 0)
  }
  return solution.prices.reduce((sum, p) => sum + p.amount, 0)
}

export function discountAmount(
  discount: ProposalDiscount,
  subtotal: number
): number {
  if (typeof discount.percent === "number" && discount.percent > 0) {
    return (subtotal * discount.percent) / 100
  }
  return discount.amount ?? 0
}

export function solutionTotal(solution: ProposalSolution): number {
  const sub = solutionSubtotal(solution)
  const off = solution.discounts.reduce(
    (sum, d) => sum + discountAmount(d, sub),
    0
  )
  return Math.max(0, sub - off)
}

export function proposalGrandTotal(proposal: FinanceProposal): number {
  return proposal.solutions.reduce((sum, s) => sum + solutionTotal(s), 0)
}
