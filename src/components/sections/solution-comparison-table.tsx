"use client"

import { cn } from "@/lib/utils"

export type ComparisonColumn = {
  id: string
  label: string
  /** Emphasize this column (usually the solution itself) */
  highlight?: boolean
}

export type ComparisonCell = {
  type: string
  value: string | number | boolean
}

export type ComparisonRow = {
  label: string
  cells: readonly ComparisonCell[]
}

export type ComparisonTableData = {
  enabled: boolean
  eyebrow: string
  title: string
  columns: readonly ComparisonColumn[]
  rows: readonly ComparisonRow[]
}

type SolutionComparisonTableProps = {
  data: ComparisonTableData
  className?: string
}

/**
 * Light-theme comparison matrix — grey / black only (no accent lime).
 * Sticky header + sticky feature column; horizontal scroll on narrow screens.
 */
export function SolutionComparisonTable({
  data,
  className,
}: SolutionComparisonTableProps) {
  if (!data.enabled || data.columns.length === 0 || data.rows.length === 0) {
    return null
  }

  return (
    <section
      className={cn(
        "relative bg-[var(--section-light)] text-foreground",
        className
      )}
    >
      <div className="mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <p className="mb-3 font-mono text-[11px] tracking-[0.22em] uppercase text-foreground/40">
          {data.eyebrow}
        </p>
        <h2 className="max-w-xl font-pixel-circle text-3xl font-medium tracking-tight md:text-4xl">
          {data.title}
        </h2>

        <div
          data-lenis-prevent
          className="mt-10 max-h-[min(70vh,40rem)] overflow-auto overscroll-contain border border-foreground/12 bg-white"
        >
          <table className="w-full min-w-[40rem] border-collapse text-left">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="sticky left-0 top-0 z-30 min-w-[11rem] border-b border-foreground/12 bg-[#F7F7F5] px-4 py-3.5 font-mono text-[10px] font-medium tracking-[0.18em] uppercase text-foreground/45 md:min-w-[14rem] md:px-5"
                >
                  Capability
                </th>
                {data.columns.map((col) => (
                  <th
                    key={col.id}
                    scope="col"
                    className={cn(
                      "sticky top-0 z-20 min-w-[8.5rem] border-b border-l border-foreground/12 px-4 py-3.5 font-pixel-circle text-sm font-medium tracking-tight md:min-w-[10rem] md:px-5 md:text-[0.95rem]",
                      col.highlight
                        ? "bg-[#EFEFEA] text-foreground"
                        : "bg-[#F7F7F5] text-foreground/70"
                    )}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, ri) => (
                <tr key={row.label} className="group">
                  <th
                    scope="row"
                    className={cn(
                      "sticky left-0 z-10 border-b border-foreground/8 bg-white px-4 py-3.5 text-left text-sm font-medium text-foreground/80 md:px-5",
                      "group-hover:bg-[#FAFAF8]"
                    )}
                  >
                    {row.label}
                  </th>
                  {row.cells.map((cell, ci) => {
                    const col = data.columns[ci]
                    return (
                      <td
                        key={`${row.label}-${col?.id ?? ci}`}
                        className={cn(
                          "border-b border-l border-foreground/8 px-4 py-3.5 text-center md:px-5",
                          col?.highlight ? "bg-[#F4F4F0]/55" : "bg-white",
                          "group-hover:bg-[#FAFAF8]"
                        )}
                      >
                        <ComparisonCellView cell={cell} />
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

function ComparisonCellView({ cell }: { cell: ComparisonCell }) {
  if (cell.type === "check") {
    return (
      <span
        className="inline-flex items-center justify-center font-pixel-circle text-base leading-none text-foreground"
        aria-label="Yes"
        title="Yes"
      >
        <PixelCheck />
      </span>
    )
  }

  if (cell.type === "x") {
    return (
      <span
        className="inline-flex items-center justify-center font-pixel-circle text-base leading-none text-foreground/35"
        aria-label="No"
        title="No"
      >
        <PixelX />
      </span>
    )
  }

  if (cell.type === "number") {
    return (
      <span className="font-pixel-circle text-[0.95rem] tracking-tight text-foreground/85">
        {cell.value}
      </span>
    )
  }

  return (
    <span className="text-sm text-foreground/65">{String(cell.value)}</span>
  )
}

/** Blocky pixel check — charcoal, no brand lime */
function PixelCheck() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      aria-hidden
      className="mx-auto"
    >
      <rect x="1" y="1" width="16" height="16" fill="none" stroke="#1A1A1A" strokeWidth="1.5" />
      <path
        d="M4 9h2v2H4V9Zm2 2h2v2H6v-2Zm2-2h2v2H8V9Zm2-2h2v2h-2V7Zm2-2h2v2h-2V5Z"
        fill="#1A1A1A"
      />
    </svg>
  )
}

function PixelX() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      aria-hidden
      className="mx-auto opacity-50"
    >
      <rect x="1" y="1" width="16" height="16" fill="none" stroke="#6B6B6B" strokeWidth="1.5" />
      <path
        d="M5 5h2v2H5V5Zm2 2h2v2H7V7Zm2 2h2v2H9V9Zm2 2h2v2h-2v-2Zm2 2h2v2h-2v-2ZM5 13h2v2H5v-2Zm2-2h2v2H7v-2Zm6-6h2v2h-2V5Zm-2 2h2v2h-2V7Z"
        fill="#6B6B6B"
      />
    </svg>
  )
}
