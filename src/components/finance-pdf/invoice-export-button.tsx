"use client"

import { useState } from "react"
import { FileDown, Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { FinanceInvoice } from "@/lib/finance/types"
import { registerInvoicePdfFonts } from "@/lib/finance-pdf/invoice-fonts"
import { prepareInvoicePdfAssets } from "@/lib/finance-pdf/prepare-invoice"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type InvoicePdfExportButtonProps = {
  invoices: FinanceInvoice[]
  filename?: string
  label?: string
  className?: string
  variant?: "default" | "outline" | "accent" | "secondary" | "ghost"
}

export function InvoicePdfExportButton({
  invoices,
  filename,
  label = "Download PDF",
  className,
  variant = "default",
}: InvoicePdfExportButtonProps) {
  const [busy, setBusy] = useState(false)

  async function handleExport() {
    if (busy) return
    if (invoices.length === 0) {
      toast.error("Select at least one invoice")
      return
    }

    setBusy(true)
    const toastId = toast.loading("Preparing invoice PDF…")

    try {
      const origin = window.location.origin
      await registerInvoicePdfFonts(origin)

      toast.loading("Preparing assets…", { id: toastId })
      const pages = await prepareInvoicePdfAssets(invoices)

      toast.loading("Building PDF…", { id: toastId })
      const [{ pdf }, { InvoicePdfDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/finance-pdf/invoice-document"),
      ])

      const blob = await pdf(<InvoicePdfDocument pages={pages} />).toBlob()
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement("a")
      anchor.href = url
      const base =
        filename ||
        (invoices.length === 1
          ? `${invoices[0]!.number}-invoice`
          : `invoices-${invoices.length}`)
      anchor.download = `${base}.pdf`
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      URL.revokeObjectURL(url)

      toast.success(
        invoices.length === 1
          ? "PDF downloaded"
          : `${invoices.length} invoices in one PDF`,
        { id: toastId }
      )
    } catch (err) {
      console.error(err)
      toast.error(
        err instanceof Error ? err.message : "PDF export failed",
        { id: toastId }
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      className={cn("rounded-none", className)}
      disabled={busy || invoices.length === 0}
      onClick={() => void handleExport()}
    >
      {busy ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <FileDown className="size-4" />
      )}
      {busy ? "Generating…" : label}
    </Button>
  )
}
