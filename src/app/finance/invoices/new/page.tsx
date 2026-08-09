import { getInvoiceFormats } from "@/lib/finance/content"
import {
  InvoiceEditor,
  createBlankInvoice,
} from "@/components/finance/invoice-editor"

export default function FinanceInvoiceNewPage() {
  return (
    <InvoiceEditor
      initial={createBlankInvoice()}
      formats={getInvoiceFormats()}
      isNew
    />
  )
}
