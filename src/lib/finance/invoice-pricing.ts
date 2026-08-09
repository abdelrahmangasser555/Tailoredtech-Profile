import type {
  FinanceInvoice,
  InvoiceDiscount,
  InvoiceLineItem,
} from "@/lib/finance/types"

export function lineVatPercent(
  line: InvoiceLineItem,
  invoiceVatPercent: number
): number {
  return line.vatPercent ?? invoiceVatPercent
}

export function lineTaxable(line: InvoiceLineItem): number {
  return line.quantity * line.unitPrice
}

export function lineVatAmount(
  line: InvoiceLineItem,
  invoiceVatPercent: number
): number {
  return (lineTaxable(line) * lineVatPercent(line, invoiceVatPercent)) / 100
}

export function lineAmount(
  line: InvoiceLineItem,
  invoiceVatPercent: number
): number {
  return lineTaxable(line) + lineVatAmount(line, invoiceVatPercent)
}

export function invoiceSubtotal(invoice: FinanceInvoice): number {
  return invoice.lineItems.reduce((sum, line) => sum + lineTaxable(line), 0)
}

export function invoiceVatTotal(invoice: FinanceInvoice): number {
  return invoice.lineItems.reduce(
    (sum, line) => sum + lineVatAmount(line, invoice.vatPercent),
    0
  )
}

export function discountAmount(
  discount: InvoiceDiscount,
  subtotal: number
): number {
  if (typeof discount.percent === "number" && discount.percent > 0) {
    return (subtotal * discount.percent) / 100
  }
  return discount.amount ?? 0
}

export function invoiceDiscountTotal(invoice: FinanceInvoice): number {
  const sub = invoiceSubtotal(invoice)
  return invoice.discounts.reduce(
    (sum, d) => sum + discountAmount(d, sub),
    0
  )
}

export function invoiceGrandTotal(invoice: FinanceInvoice): number {
  return Math.max(
    0,
    invoiceSubtotal(invoice) +
      invoiceVatTotal(invoice) -
      invoiceDiscountTotal(invoice)
  )
}

export function formatInvoiceMoney(
  amount: number,
  options?: { decimals?: number }
): string {
  const decimals = options?.decimals ?? 2
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}
