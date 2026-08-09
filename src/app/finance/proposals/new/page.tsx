import {
  getFinanceBrands,
  getFinanceFormats,
} from "@/lib/finance/content"
import {
  ProposalEditor,
  createBlankProposal,
} from "@/components/finance/proposal-editor"

export default function FinanceProposalNewPage() {
  return (
    <ProposalEditor
      initial={createBlankProposal()}
      brands={getFinanceBrands()}
      formats={getFinanceFormats()}
      isNew
    />
  )
}
