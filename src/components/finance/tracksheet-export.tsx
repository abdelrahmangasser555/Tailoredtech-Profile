"use client"

import { useState } from "react"
import { FileDown, FileSpreadsheet, Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { Tracksheet } from "@/lib/tracksheets/types"
import { collectImagePaths } from "@/lib/tracksheets/tree"
import { rasterizePaths } from "@/lib/tracksheets/images"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ExportProps = {
  sheet: Tracksheet
  label?: string
  variant?: "default" | "outline" | "ghost"
  className?: string
}

export function TracksheetPdfButton({
  sheet,
  label = "PDF",
  variant = "outline",
  className,
}: ExportProps) {
  const [busy, setBusy] = useState(false)

  async function exportPdf() {
    if (busy) return
    setBusy(true)
    const toastId = toast.loading("Preparing tracksheet PDF…")
    try {
      const images = await rasterizePaths(collectImagePaths(sheet))
      const [{ pdf }, { TracksheetPdfDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/tracksheet-pdf/document"),
      ])
      const blob = await pdf(<TracksheetPdfDocument sheet={sheet} images={images} />).toBlob()
      const filename = `${(sheet.refNumber || sheet.title || "tracksheet").replace(/[^a-zA-Z0-9-_]+/g, "-")}.pdf`
      downloadBlob(blob, filename)
      toast.success("PDF downloaded", { id: toastId })
    } catch (err) {
      console.error(err)
      toast.error(err instanceof Error ? err.message : "PDF export failed", { id: toastId })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Button type="button" variant={variant} className={cn("rounded-none", className)} disabled={busy} onClick={() => void exportPdf()}>
      {busy ? <Loader2 className="size-4 animate-spin" /> : <FileDown className="size-4" />}
      {label}
    </Button>
  )
}

export function TracksheetExcelButton({
  sheet,
  label = "Excel",
  variant = "outline",
  className,
}: ExportProps) {
  const [busy, setBusy] = useState(false)

  async function exportExcel() {
    if (busy) return
    setBusy(true)
    const toastId = toast.loading("Preparing tracksheet Excel…")
    try {
      const images = await rasterizePaths(collectImagePaths(sheet))
      const res = await fetch("/api/finance/tracksheets/excel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tracksheet: sheet, images }),
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null
        throw new Error(data?.error || "Excel export failed")
      }
      const blob = await res.blob()
      const filename = `${(sheet.refNumber || sheet.title || "tracksheet").replace(/[^a-zA-Z0-9-_]+/g, "-")}.xlsx`
      downloadBlob(blob, filename)
      toast.success("Excel downloaded", { id: toastId })
    } catch (err) {
      console.error(err)
      toast.error(err instanceof Error ? err.message : "Excel export failed", { id: toastId })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Button type="button" variant={variant} className={cn("rounded-none", className)} disabled={busy} onClick={() => void exportExcel()}>
      {busy ? <Loader2 className="size-4 animate-spin" /> : <FileSpreadsheet className="size-4" />}
      {label}
    </Button>
  )
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}
