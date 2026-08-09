"use client"

import { useState } from "react"
import { FileDown, Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { FinanceProposal } from "@/lib/finance/types"
import { registerPresentationPdfFonts } from "@/lib/presentation-pdf/fonts"
import { prepareProposalPdfAssets } from "@/lib/finance-pdf/prepare"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ProposalPdfExportButtonProps = {
  proposals: FinanceProposal[]
  filename?: string
  label?: string
  className?: string
  variant?: "default" | "outline" | "accent" | "secondary" | "ghost"
}

export function ProposalPdfExportButton({
  proposals,
  filename,
  label = "Download PDF",
  className,
  variant = "default",
}: ProposalPdfExportButtonProps) {
  const [busy, setBusy] = useState(false)

  async function handleExport() {
    if (busy) return
    if (proposals.length === 0) {
      toast.error("Select at least one proposal")
      return
    }

    setBusy(true)
    const toastId = toast.loading("Preparing proposal PDF…")

    try {
      const origin = window.location.origin
      await registerPresentationPdfFonts(origin)

      toast.loading("Preparing assets…", { id: toastId })
      const pages = await prepareProposalPdfAssets(proposals)

      toast.loading("Building PDF…", { id: toastId })
      const [{ pdf }, { ProposalPdfDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/finance-pdf/document"),
      ])

      const blob = await pdf(<ProposalPdfDocument pages={pages} />).toBlob()
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement("a")
      anchor.href = url
      const base =
        filename ||
        (proposals.length === 1
          ? `${proposals[0]!.id}-proposal`
          : `proposals-${proposals.length}`)
      anchor.download = `${base}.pdf`
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      URL.revokeObjectURL(url)

      toast.success(
        proposals.length === 1
          ? "PDF downloaded"
          : `${proposals.length} proposals in one PDF`,
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
      disabled={busy || proposals.length === 0}
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
