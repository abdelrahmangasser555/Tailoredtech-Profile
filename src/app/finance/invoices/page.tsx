import { getInvoices } from "@/lib/finance/content"
import { InvoicesList } from "@/components/finance/invoices-list"

export default function FinanceInvoicesPage() {
  return <InvoicesList invoices={getInvoices()} />
}
