import { notFound } from "next/navigation"
import { getInvoiceById, getInvoiceFormats } from "@/lib/finance/content"
import { InvoiceEditor } from "@/components/finance/invoice-editor"

export default async function FinanceInvoiceEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const invoice = getInvoiceById(id)
  if (!invoice) notFound()

  return (
    <InvoiceEditor initial={invoice} formats={getInvoiceFormats()} />
  )
}
