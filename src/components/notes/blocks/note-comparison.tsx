"use client"

import { useState } from "react"
import { Expand, Minimize2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type {
  NoteComparisonCell,
  NoteComparisonColumn,
  NoteComparisonRow,
} from "@/lib/notes-types"

type NoteComparisonProps = {
  title?: string
  caption?: string
  rowHeader?: string
  columns: NoteComparisonColumn[]
  rows: NoteComparisonRow[]
  className?: string
}

/**
 * Embedded comparison matrix for notes — dark theme + expand dialog.
 */
export function NoteComparison({
  title,
  caption,
  rowHeader = "Capability",
  columns,
  rows,
  className,
}: NoteComparisonProps) {
  const [expanded, setExpanded] = useState(false)

  if (!columns.length || !rows.length) return null

  return (
    <>
      <div
        className={cn(
          "mt-6 border border-white/12 bg-[#0c0c0c] text-white first:mt-0",
          className
        )}
      >
        <div className="flex items-start justify-between gap-3 border-b border-white/10 px-4 py-3 md:px-5">
          <div className="min-w-0">
            {title ? (
              <h3 className="font-pixel-circle text-lg font-medium tracking-tight text-white md:text-xl">
                {title}
              </h3>
            ) : (
              <p className="font-mono text-[10px] tracking-[0.22em] text-white/40 uppercase">
                Comparison
              </p>
            )}
            {caption ? (
              <p className="mt-1 text-sm text-white/45">{caption}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="inline-flex h-8 shrink-0 items-center gap-1.5 border border-white/15 px-2.5 font-mono text-[10px] tracking-[0.14em] uppercase text-white/55 transition hover:border-white/30 hover:text-white"
            aria-label="Expand comparison table"
          >
            <Expand className="size-3.5" />
            Expand
          </button>
        </div>

        <ComparisonTableScroll rowHeader={rowHeader} columns={columns} rows={rows} />
      </div>

      <Dialog open={expanded} onOpenChange={setExpanded}>
        <DialogContent
          showCloseButton={false}
          className="flex h-[min(92vh,960px)] w-[min(96vw,1200px)] max-w-none flex-col gap-0 overflow-hidden rounded-none border border-white/15 bg-[#0a0a0a] p-0 text-white ring-0 sm:max-w-none"
        >
          <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 md:px-5">
            <DialogTitle className="font-mono text-[10px] tracking-[0.22em] uppercase text-accent">
              {title?.trim() || "Comparison"}
            </DialogTitle>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="inline-flex h-8 items-center gap-1.5 border border-white/15 px-2.5 font-mono text-[10px] tracking-[0.14em] uppercase text-white/55 transition hover:border-white/30 hover:text-white"
            >
              <Minimize2 className="size-3.5" />
              Close
            </button>
          </div>
          <div
            data-lenis-prevent
            className="notes-panel-scroll min-h-0 flex-1 overflow-auto overscroll-contain p-4 md:p-6"
          >
            {caption ? (
              <p className="mb-4 text-sm text-white/45">{caption}</p>
            ) : null}
            <div className="border border-white/12 bg-[#0c0c0c]">
              <ComparisonTableScroll
                rowHeader={rowHeader}
                columns={columns}
                rows={rows}
                large
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function ComparisonTableScroll({
  rowHeader,
  columns,
  rows,
  large,
}: {
  rowHeader: string
  columns: NoteComparisonColumn[]
  rows: NoteComparisonRow[]
  large?: boolean
}) {
  return (
    <div
      data-lenis-prevent
      data-lenis-prevent-wheel
      className="notes-panel-scroll overflow-x-auto overscroll-contain"
    >
      <table
        className={cn(
          "w-max min-w-full border-separate border-spacing-0 text-left",
          large && "text-[15px]"
        )}
      >
        <thead>
          <tr>
            <th
              scope="col"
              className={cn(
                "sticky left-0 z-20 border-b border-r border-white/12 bg-[#141414] font-mono text-[10px] font-medium tracking-[0.18em] uppercase text-white/40",
                large
                  ? "min-w-[14rem] px-5 py-4"
                  : "min-w-[10rem] px-3 py-3 md:min-w-[12rem] md:px-4"
              )}
            >
              {rowHeader}
            </th>
            {columns.map((col) => (
              <th
                key={col.id}
                scope="col"
                className={cn(
                  "border-b border-l border-white/12 font-pixel-circle font-medium tracking-tight whitespace-nowrap",
                  large
                    ? "min-w-[11rem] px-5 py-4 text-base"
                    : "min-w-[8rem] px-3 py-3 text-sm md:min-w-[10rem] md:px-4",
                  col.highlight
                    ? "bg-[#1a1a1a] text-white"
                    : "bg-[#141414] text-white/65"
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="group">
              <th
                scope="row"
                className={cn(
                  "sticky left-0 z-10 border-b border-r border-white/8 bg-[#0c0c0c] text-left font-medium text-white/75 group-hover:bg-[#111]",
                  large
                    ? "min-w-[14rem] px-5 py-4 text-[15px]"
                    : "min-w-[10rem] px-3 py-3 text-sm md:px-4"
                )}
              >
                {row.label}
              </th>
              {row.cells.map((cell, ci) => {
                const col = columns[ci]
                return (
                  <td
                    key={`${row.label}-${col?.id ?? ci}`}
                    className={cn(
                      "border-b border-l border-white/8 text-center whitespace-nowrap group-hover:bg-[#111]",
                      large ? "px-5 py-4" : "px-3 py-3 md:px-4",
                      col?.highlight ? "bg-[#121212]" : "bg-[#0c0c0c]"
                    )}
                  >
                    <ComparisonCellView cell={cell} large={large} />
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ComparisonCellView({
  cell,
  large,
}: {
  cell: NoteComparisonCell
  large?: boolean
}) {
  if (cell.type === "check") {
    return (
      <span
        className="inline-flex items-center justify-center leading-none"
        aria-label="Yes"
        title="Yes"
      >
        <PixelCheck size={large ? 22 : 18} />
      </span>
    )
  }

  if (cell.type === "x") {
    return (
      <span
        className="inline-flex items-center justify-center leading-none"
        aria-label="No"
        title="No"
      >
        <PixelX size={large ? 22 : 18} />
      </span>
    )
  }

  if (cell.type === "number") {
    return (
      <span
        className={cn(
          "font-pixel-circle tracking-tight text-white/85",
          large ? "text-lg" : "text-[0.95rem]"
        )}
      >
        {cell.value}
      </span>
    )
  }

  return (
    <span className={cn("text-white/60", large ? "text-[15px]" : "text-sm")}>
      {String(cell.value)}
    </span>
  )
}

function PixelCheck({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      aria-hidden
      className="mx-auto block"
    >
      <rect
        x="1"
        y="1"
        width="16"
        height="16"
        fill="none"
        stroke="#E8E8E0"
        strokeWidth="1.5"
      />
      <path
        d="M4 9h2v2H4V9Zm2 2h2v2H6v-2Zm2-2h2v2H8V9Zm2-2h2v2h-2V7Zm2-2h2v2h-2V5Z"
        fill="#E8E8E0"
      />
    </svg>
  )
}

function PixelX({ size = 18 }: { size?: number }) {
  const cells: Array<[number, number]> = [
    [4, 4],
    [6, 6],
    [8, 8],
    [10, 10],
    [12, 12],
    [12, 4],
    [10, 6],
    [6, 10],
    [4, 12],
  ]

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      aria-hidden
      className="mx-auto block opacity-50"
    >
      <rect
        x="1"
        y="1"
        width="16"
        height="16"
        fill="none"
        stroke="#888"
        strokeWidth="1.5"
      />
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={2} height={2} fill="#888" />
      ))}
    </svg>
  )
}
