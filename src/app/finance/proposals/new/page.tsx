import {
  getFinanceBrands,
  getFinanceFormats,
} from "@/lib/finance/content"
import { emptyProposal } from "@/lib/finance/types"
import { ProposalEditor } from "@/components/finance/proposal-editor"

export default function FinanceProposalNewPage() {
  return (
    <ProposalEditor
      initial={emptyProposal()}
      brands={getFinanceBrands()}
      formats={getFinanceFormats()}
      isNew
    />
  )
}
