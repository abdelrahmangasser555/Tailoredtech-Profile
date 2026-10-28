"use client"

import Link from "next/link"
import { Plus, Sheet } from "lucide-react"
import type { Tracksheet } from "@/lib/tracksheets/types"
import { getPalette } from "@/lib/tracksheets/palettes"
import { CloneTracksheetButton } from "@/components/finance/tracksheet-clone"
import { TracksheetExcelButton, TracksheetPdfButton } from "@/components/finance/tracksheet-export"
import { Button } from "@/components/ui/button"

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

export function TracksheetsList({ sheets }: { sheets: Tracksheet[] }) {
  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 font-mono text-[11px] tracking-[0.2em] uppercase text-foreground/40">Finance</p>
          <h1 className="font-pixel-circle text-3xl tracking-tight md:text-4xl">Tracksheets</h1>
          <p className="mt-2 max-w-lg text-sm text-foreground/55">
            Project tracking sheets for clients. Export a designed Excel file or a PDF.
          </p>
        </div>
        <Button asChild className="rounded-none">
          <Link href="/finance/tracksheets/new">
            <Plus className="size-4" />
            New tracksheet
          </Link>
        </Button>
      </div>

      {sheets.length === 0 ? (
        <div className="border border-dashed border-foreground/15 bg-white px-6 py-16 text-center">
          <Sheet className="mx-auto mb-3 size-8 text-foreground/25" />
          <p className="text-sm text-foreground/55">No tracksheets yet.</p>
          <Button asChild className="mt-4 rounded-none">
            <Link href="/finance/tracksheets/new">Create first tracksheet</Link>
          </Button>
        </div>
      ) : (
        <ul className="divide-y divide-foreground/10 border border-foreground/10 bg-white">
          {sheets.map((sheet) => (
            <li key={sheet.id} className="flex flex-wrap items-center gap-3 px-4 py-4">
              <Link href={`/finance/tracksheets/${sheet.id}`} className="min-w-0 flex-1 hover:opacity-80">
                <p className="truncate font-medium">
                  {sheet.projectName || "Untitled project"}
                  {sheet.title ? <span className="font-normal text-foreground/45"> · {sheet.title}</span> : null}
                </p>
                <p className="mt-0.5 font-mono text-[10px] tracking-wide text-foreground/40 uppercase">
                  {sheet.clientName || "No client"}
                  {sheet.refNumber ? ` · ${sheet.refNumber}` : ""} · {getPalette(sheet.paletteId).name} · {formatDate(sheet.updatedAt)}
                </p>
              </Link>
              <CloneTracksheetButton sheet={sheet} className="h-8" />
              <TracksheetPdfButton sheet={sheet} variant="ghost" className="h-8" />
              <TracksheetExcelButton sheet={sheet} variant="ghost" className="h-8" />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
