"use client"

import { useMemo, useState } from "react"
import { FileDown, Loader2, Settings2 } from "lucide-react"
import { toast } from "sonner"
import type { PresentationItem } from "@/lib/content"
import { brandForPresentation } from "@/lib/presentation-pdf/brand"
import { registerPresentationPdfFonts } from "@/lib/presentation-pdf/fonts"
import {
  defaultPdfOptions,
  type PresentationPdfOptions,
} from "@/lib/presentation-pdf/options"
import { preparePresentationPdfAssets } from "@/lib/presentation-pdf/prepare-assets"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

type PresentationPdfExportButtonProps = {
  presentation: PresentationItem
  className?: string
}

export function PresentationPdfExportButton({
  presentation,
  className,
}: PresentationPdfExportButtonProps) {
  const allSectionIds = useMemo(
    () => presentation.page.sections.map((s) => s.id),
    [presentation.page.sections]
  )

  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [options, setOptions] = useState<PresentationPdfOptions>(() =>
    defaultPdfOptions(allSectionIds)
  )

  function patchOptions(partial: Partial<PresentationPdfOptions>) {
    setOptions((prev) => ({ ...prev, ...partial }))
  }

  function toggleSection(id: string, checked: boolean) {
    setOptions((prev) => {
      const next = new Set(prev.sectionIds)
      if (checked) next.add(id)
      else next.delete(id)
      return { ...prev, sectionIds: [...next] }
    })
  }

  function selectAllSections(checked: boolean) {
    patchOptions({ sectionIds: checked ? [...allSectionIds] : [] })
  }

  async function handleExport() {
    if (busy) return
    if (options.sectionIds.length === 0 && !options.includeCover && !options.includeComparison) {
      toast.error("Select at least one page or section")
      return
    }

    setBusy(true)
    const toastId = toast.loading("Preparing PDF printout…")

    try {
      const origin = window.location.origin
      toast.loading("Loading fonts…", { id: toastId })
      await registerPresentationPdfFonts(origin)

      const brand = brandForPresentation(presentation)
      toast.loading("Rendering diagrams and images…", { id: toastId })
      const prepared = await preparePresentationPdfAssets(
        presentation,
        brand,
        options
      )

      toast.loading("Building PDF…", { id: toastId })
      const [{ pdf }, { PresentationPdfDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/presentation-pdf/document"),
      ])

      const blob = await pdf(
        <PresentationPdfDocument data={prepared} />
      ).toBlob()

      const url = URL.createObjectURL(blob)
      const anchor = document.createElement("a")
      anchor.href = url
      anchor.download = `${presentation.id}-presentation.pdf`
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      URL.revokeObjectURL(url)

      toast.success("PDF downloaded", { id: toastId })
      setOpen(false)
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

  const allSectionsSelected =
    allSectionIds.length > 0 &&
    allSectionIds.every((id) => options.sectionIds.includes(id))

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <button
        type="button"
        onClick={() => void handleExport()}
        disabled={busy}
        className={cn(
          "inline-flex h-10 cursor-pointer items-center justify-center gap-2 border px-4 font-mono text-[11px] tracking-[0.18em] uppercase transition",
          "border-white/20 bg-black/75 text-white/85 shadow-lg backdrop-blur-md",
          "hover:border-accent hover:text-accent",
          "disabled:cursor-wait disabled:opacity-70"
        )}
        aria-label={busy ? "Generating PDF" : "Download PDF printout"}
      >
        {busy ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <FileDown className="size-4" />
        )}
        <span>{busy ? "Generating…" : "PDF printout"}</span>
      </button>

      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={busy}
        className={cn(
          "inline-flex size-10 cursor-pointer items-center justify-center border transition",
          "border-white/20 bg-black/75 text-white/85 shadow-lg backdrop-blur-md",
          "hover:border-accent hover:text-accent",
          "disabled:cursor-wait disabled:opacity-70"
        )}
        aria-label="PDF printout options"
      >
        <Settings2 className="size-4" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-h-[min(88vh,640px)] overflow-y-auto rounded-none border-foreground/15 bg-[var(--section-light,#f7f7f2)] sm:max-w-md"
          showCloseButton
        >
          <DialogHeader>
            <DialogTitle className="font-pixel-circle text-xl tracking-tight">
              PDF options
            </DialogTitle>
            <DialogDescription className="font-mono text-[11px] tracking-wide text-muted-foreground">
              Choose what appears in the printout.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-1">
            <fieldset className="space-y-2.5">
              <legend className="mb-1 font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                Pages
              </legend>
              <OptionRow
                id="pdf-cover"
                label="Cover page"
                checked={options.includeCover}
                onCheckedChange={(v) => patchOptions({ includeCover: v })}
              />
              <OptionRow
                id="pdf-comparison"
                label="Comparison table"
                checked={options.includeComparison}
                onCheckedChange={(v) => patchOptions({ includeComparison: v })}
                disabled={!presentation.page.comparison?.enabled}
              />
              <OptionRow
                id="pdf-outcomes"
                label="Outcomes on cover"
                checked={options.includeOutcomes}
                onCheckedChange={(v) => patchOptions({ includeOutcomes: v })}
                disabled={!options.includeCover || presentation.page.outcomes.length === 0}
              />
            </fieldset>

            <fieldset className="space-y-2.5">
              <legend className="mb-1 font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                Content
              </legend>
              <OptionRow
                id="pdf-images"
                label="Include images"
                checked={options.includeImages}
                onCheckedChange={(v) => patchOptions({ includeImages: v })}
              />
              <OptionRow
                id="pdf-diagrams"
                label="Include diagrams (Mermaid)"
                checked={options.includeDiagrams}
                onCheckedChange={(v) => patchOptions({ includeDiagrams: v })}
              />
              <OptionRow
                id="pdf-bullets"
                label="Include bullet lists"
                checked={options.includeBullets}
                onCheckedChange={(v) => patchOptions({ includeBullets: v })}
              />
            </fieldset>

            <fieldset className="space-y-2.5">
              <div className="mb-1 flex items-center justify-between gap-3">
                <legend className="font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                  Sections
                </legend>
                <button
                  type="button"
                  className="cursor-pointer font-mono text-[10px] tracking-wider uppercase text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                  onClick={() => selectAllSections(!allSectionsSelected)}
                >
                  {allSectionsSelected ? "Clear all" : "Select all"}
                </button>
              </div>
              <div className="max-h-48 space-y-2 overflow-y-auto border border-foreground/10 bg-white p-3">
                {presentation.page.sections.map((section, index) => (
                  <OptionRow
                    key={section.id}
                    id={`pdf-section-${section.id}`}
                    label={`${String(index + 1).padStart(2, "0")} · ${section.title}`}
                    checked={options.sectionIds.includes(section.id)}
                    onCheckedChange={(v) => toggleSection(section.id, v)}
                  />
                ))}
              </div>
            </fieldset>
          </div>

          <DialogFooter className="gap-2 sm:justify-between">
            <Button
              type="button"
              variant="ghost"
              className="rounded-none"
              onClick={() => setOptions(defaultPdfOptions(allSectionIds))}
              disabled={busy}
            >
              Reset
            </Button>
            <Button
              type="button"
              className="rounded-none"
              onClick={() => void handleExport()}
              disabled={busy}
            >
              {busy ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <FileDown className="size-4" />
                  Generate PDF
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function OptionRow({
  id,
  label,
  checked,
  onCheckedChange,
  disabled,
}: {
  id: string
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
}) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-start gap-2.5 text-sm text-foreground/85",
        disabled && "cursor-not-allowed opacity-45"
      )}
    >
      <Checkbox
        id={id}
        checked={checked}
        disabled={disabled}
        onCheckedChange={(value) => onCheckedChange(value === true)}
        className="mt-0.5 rounded-none"
      />
      <span className="leading-snug">{label}</span>
    </label>
  )
}
