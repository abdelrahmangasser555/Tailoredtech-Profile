import {
  DEFAULT_INVOICE_ISSUER,
  DEFAULT_PROPOSAL_DISPLAY,
  emptyProposal,
  type FinanceProposal,
} from "@/lib/finance/types"

/** Fill legacy proposals with issuer, customer, and display defaults. */
export function normalizeProposal(proposal: FinanceProposal): FinanceProposal {
  const base = emptyProposal({ id: proposal.id })
  const customer = proposal.customer ?? {
    name: proposal.clientName ?? "",
    address: "",
    otherId: "",
  }

  return {
    ...base,
    ...proposal,
    clientName: proposal.clientName || customer.name,
    customer: {
      ...base.customer,
      ...customer,
      name: customer.name || proposal.clientName || "",
    },
    issuer: { ...DEFAULT_INVOICE_ISSUER, ...proposal.issuer },
    language: proposal.language ?? "en",
    number: proposal.number ?? base.number,
    date: proposal.date ?? proposal.createdAt?.slice(0, 10) ?? base.date,
    numberLabelEn: proposal.numberLabelEn ?? base.numberLabelEn,
    numberLabelAr: proposal.numberLabelAr ?? base.numberLabelAr,
    display: {
      ...DEFAULT_PROPOSAL_DISPLAY,
      ...proposal.display,
      footer: {
        ...DEFAULT_PROPOSAL_DISPLAY.footer,
        ...proposal.display?.footer,
      },
    },
  }
}
