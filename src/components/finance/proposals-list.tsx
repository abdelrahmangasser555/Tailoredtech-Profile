"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Plus, FileText } from "lucide-react"
import type { FinanceBrand, FinanceProposal } from "@/lib/finance/types"
import { ProposalPdfExportButton } from "@/components/finance-pdf/export-button"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export function ProposalsList({
  proposals,
  brands,
}: {
  proposals: FinanceProposal[]
  brands: FinanceBrand[]
}) {
  const [selected, setSelected] = useState<string[]>([])

  const brandName = useMemo(() => {
    const map = new Map(brands.map((b) => [b.id, b.name]))
    return (id: string) => map.get(id as FinanceBrand["id"]) ?? id
  }, [brands])

  const selectedProposals = proposals.filter((p) => selected.includes(p.id))

  function toggle(id: string, checked: boolean) {
    setSelected((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id)
    )
  }

  function toggleAll(checked: boolean) {
    setSelected(checked ? proposals.map((p) => p.id) : [])
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 font-mono text-[11px] tracking-[0.2em] uppercase text-foreground/40">
            Finance
          </p>
          <h1 className="font-pixel-circle text-3xl tracking-tight md:text-4xl">
            Proposals
          </h1>
          <p className="mt-2 max-w-lg text-sm text-foreground/55">
            One page per proposal. Select several to download as a single PDF.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ProposalPdfExportButton
            proposals={selectedProposals}
            label={
              selected.length > 1
                ? `PDF · ${selected.length} pages`
                : "PDF selected"
            }
            variant="outline"
          />
          <Button asChild className="rounded-none">
            <Link href="/finance/proposals/new">
              <Plus className="size-4" />
              New proposal
            </Link>
          </Button>
        </div>
      </div>

      {proposals.length === 0 ? (
        <div className="border border-dashed border-foreground/15 bg-white px-6 py-16 text-center">
          <FileText className="mx-auto mb-3 size-8 text-foreground/25" />
          <p className="text-sm text-foreground/55">No proposals yet.</p>
          <Button asChild className="mt-4 rounded-none">
            <Link href="/finance/proposals/new">Create first proposal</Link>
          </Button>
        </div>
      ) : (
        <div className="border border-foreground/10 bg-white">
          <div className="flex items-center gap-3 border-b border-foreground/10 px-4 py-3">
            <Checkbox
              checked={
                proposals.length > 0 && selected.length === proposals.length
              }
              onCheckedChange={(v) => toggleAll(v === true)}
              className="rounded-none"
              aria-label="Select all"
            />
            <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-foreground/40">
              {selected.length} selected
            </span>
          </div>
          <ul className="divide-y divide-foreground/8">
            {proposals.map((p) => {
              const checked = selected.includes(p.id)
              return (
                <li
                  key={p.id}
                  className={cn(
                    "flex flex-wrap items-center gap-3 px-4 py-4 transition",
                    checked && "bg-foreground/[0.03]"
                  )}
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(v) => toggle(p.id, v === true)}
                    className="rounded-none"
                    aria-label={`Select ${p.title}`}
                  />
                  <Link
                    href={`/finance/proposals/${p.id}`}
                    className="min-w-0 flex-1 hover:opacity-80"
                  >
                    <p className="truncate font-medium text-foreground">
                      {p.title}
                      {p.subtitle ? (
                        <span className="font-normal text-foreground/45">
                          {" "}
                          · {p.subtitle}
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] tracking-wide text-foreground/40 uppercase">
                      {p.clientName || "No client"} · {brandName(p.brandId)} ·{" "}
                      {p.format.replace("formal-", "")} ·{" "}
                      {formatDate(p.updatedAt)}
                    </p>
                  </Link>
                  <ProposalPdfExportButton
                    proposals={[p]}
                    label="PDF"
                    variant="ghost"
                    className="h-8"
                  />
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
