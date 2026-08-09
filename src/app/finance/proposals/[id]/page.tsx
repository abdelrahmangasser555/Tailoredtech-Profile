import { notFound } from "next/navigation"
import {
  getFinanceBrands,
  getFinanceFormats,
  getProposalById,
} from "@/lib/finance/content"
import { ProposalEditor } from "@/components/finance/proposal-editor"

export default async function FinanceProposalEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const proposal = getProposalById(id)
  if (!proposal) notFound()

  return (
    <ProposalEditor
      initial={proposal}
      brands={getFinanceBrands()}
      formats={getFinanceFormats()}
    />
  )
}
