import { getInvoiceFormats } from "@/lib/finance/content"
import { emptyInvoice } from "@/lib/finance/types"
import { InvoiceEditor } from "@/components/finance/invoice-editor"

export default function FinanceInvoiceNewPage() {
  return (
    <InvoiceEditor
      initial={emptyInvoice()}
      formats={getInvoiceFormats()}
      isNew
    />
  )
}
