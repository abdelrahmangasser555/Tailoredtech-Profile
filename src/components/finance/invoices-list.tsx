"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Plus, Receipt } from "lucide-react"
import type { FinanceInvoice } from "@/lib/finance/types"
import { InvoicePdfExportButton } from "@/components/finance-pdf/invoice-export-button"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso.length === 10 ? `${iso}T00:00:00` : iso))
  } catch {
    return iso
  }
}

export function InvoicesList({ invoices }: { invoices: FinanceInvoice[] }) {
  const [selected, setSelected] = useState<string[]>([])

  const selectedInvoices = useMemo(
    () => invoices.filter((i) => selected.includes(i.id)),
    [invoices, selected]
  )

  function toggle(id: string, checked: boolean) {
    setSelected((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id)
    )
  }

  function toggleAll(checked: boolean) {
    setSelected(checked ? invoices.map((i) => i.id) : [])
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 font-mono text-[11px] tracking-[0.2em] uppercase text-foreground/40">
            Finance
          </p>
          <h1 className="font-pixel-circle text-3xl tracking-tight md:text-4xl">
            Invoices
          </h1>
          <p className="mt-2 max-w-lg text-sm text-foreground/55">
            Proforma printouts. Edit fields, currency, VAT, and language, then
            download PDF.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <InvoicePdfExportButton
            invoices={selectedInvoices}
            label={
              selected.length > 1
                ? `PDF · ${selected.length} pages`
                : "PDF selected"
            }
            variant="outline"
          />
          <Button asChild className="rounded-none">
            <Link href="/finance/invoices/new">
              <Plus className="size-4" />
              New invoice
            </Link>
          </Button>
        </div>
      </div>

      {invoices.length === 0 ? (
        <div className="border border-dashed border-foreground/15 bg-white px-6 py-16 text-center">
          <Receipt className="mx-auto mb-3 size-8 text-foreground/25" />
          <p className="text-sm text-foreground/55">No invoices yet.</p>
          <Button asChild className="mt-4 rounded-none">
            <Link href="/finance/invoices/new">Create first invoice</Link>
          </Button>
        </div>
      ) : (
        <div className="border border-foreground/10 bg-white">
          <div className="flex items-center gap-3 border-b border-foreground/10 px-4 py-3">
            <Checkbox
              checked={
                invoices.length > 0 && selected.length === invoices.length
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
            {invoices.map((inv) => {
              const checked = selected.includes(inv.id)
              return (
                <li
                  key={inv.id}
                  className={cn(
                    "flex flex-wrap items-center gap-3 px-4 py-4 transition",
                    checked && "bg-foreground/[0.03]"
                  )}
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(v) => toggle(inv.id, v === true)}
                    className="rounded-none"
                    aria-label={`Select ${inv.number}`}
                  />
                  <Link
                    href={`/finance/invoices/${inv.id}`}
                    className="min-w-0 flex-1 hover:opacity-80"
                  >
                    <p className="truncate font-medium text-foreground">
                      {inv.titleEn}
                      <span className="font-normal text-foreground/45">
                        {" "}
                        · {inv.number}
                      </span>
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] tracking-wide text-foreground/40 uppercase">
                      {inv.customer.name || "No customer"} · {inv.currency} ·{" "}
                      {inv.language === "bilingual" ? "EN/AR" : "EN"} ·{" "}
                      {formatDate(inv.date)} · {inv.status}
                    </p>
                  </Link>
                  <InvoicePdfExportButton
                    invoices={[inv]}
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
