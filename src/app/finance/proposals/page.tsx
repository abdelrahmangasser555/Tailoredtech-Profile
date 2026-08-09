import { getFinanceBrands, getProposals } from "@/lib/finance/content"
import { ProposalsList } from "@/components/finance/proposals-list"

export default function FinanceProposalsPage() {
  return (
    <ProposalsList proposals={getProposals()} brands={getFinanceBrands()} />
  )
}
