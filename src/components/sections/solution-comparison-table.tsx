"use client"

import { Star } from "lucide-react"
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
  /** Show a primary-colored star tag beside the row label */
  star?: boolean
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
  /** Skip top padding when a dashed separator sits above */
  tightTop?: boolean
}

/**
 * Light-theme comparison matrix — grey / black only (no accent lime).
 * Full-height table; column heads stick to the viewport on page scroll.
 */
export function SolutionComparisonTable({
  data,
  className,
  tightTop = false,
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
      <div
        className={cn(
          "mx-auto w-full max-w-6xl px-5 pb-20 md:px-8 md:pb-28",
          tightTop ? "pt-10 md:pt-12" : "pt-20 md:pt-28"
        )}
      >
        <p className="mb-3 font-mono text-[11px] tracking-[0.22em] uppercase text-foreground/40">
          {data.eyebrow}
        </p>
        <h2 className="max-w-xl font-pixel-circle text-3xl font-medium tracking-tight md:text-4xl">
          {data.title}
        </h2>

        {/*
          No max-height — table grows with rows. Column heads stick on page scroll.
          overflow-x only on small screens so sticky top works on desktop
          (overflow-x:auto creates a scrollport that breaks viewport sticky).
          border-collapse:collapse also breaks sticky — use separate.
        */}
        <div className="mt-10 -mx-5 border border-foreground/12 bg-white px-5 max-md:overflow-x-auto md:mx-0 md:px-0">
          <table className="w-full min-w-[42rem] border-separate border-spacing-0 text-left">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="sticky left-0 top-0 z-40 min-w-[11rem] border-b border-r border-foreground/12 bg-[#F4F4F1] px-4 py-3.5 font-mono text-[10px] font-medium tracking-[0.18em] uppercase text-foreground/45 shadow-[0_1px_0_0_rgba(0,0,0,0.08)] max-md:static max-md:left-auto max-md:shadow-none md:min-w-[14rem] md:px-5"
                >
                  Capability
                </th>
                {data.columns.map((col) => (
                  <th
                    key={col.id}
                    scope="col"
                    className={cn(
                      "sticky top-0 z-30 min-w-[8.5rem] border-b border-l border-foreground/12 px-4 py-3.5 font-pixel-circle text-sm font-medium tracking-tight shadow-[0_1px_0_0_rgba(0,0,0,0.08)] max-md:static max-md:shadow-none md:min-w-[10rem] md:px-5 md:text-[0.95rem]",
                      col.highlight
                        ? "bg-[#EBEBE6] text-foreground"
                        : "bg-[#F4F4F1] text-foreground/70"
                    )}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row) => (
                <tr key={row.label} className="group">
                  <th
                    scope="row"
                    className={cn(
                      "sticky left-0 z-20 border-b border-r border-foreground/8 bg-white px-4 py-3.5 text-left text-sm font-medium text-foreground/80 shadow-[1px_0_0_0_rgba(0,0,0,0.04)] max-md:static max-md:left-auto max-md:shadow-none md:px-5",
                      "group-hover:bg-[#FAFAF8]"
                    )}
                  >
                    <ComparisonRowLabel label={row.label} star={row.star} />
                  </th>
                  {row.cells.map((cell, ci) => {
                    const col = data.columns[ci]
                    return (
                      <td
                        key={`${row.label}-${col?.id ?? ci}`}
                        className={cn(
                          "border-b border-l border-foreground/8 px-4 py-3.5 text-center md:px-5",
                          col?.highlight ? "bg-[#F6F6F2]" : "bg-white",
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

function ComparisonRowLabel({
  label,
  star,
}: {
  label: string
  star?: boolean
}) {
  if (!star) return <>{label}</>

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <span>{label}</span>
      <span
        className="inline-flex items-center gap-1 bg-primary px-1.5 py-0.5 font-mono text-[9px] font-medium tracking-[0.14em] uppercase text-primary-foreground"
        title="Highlighted capability"
      >
        <Star className="size-2.5 shrink-0 fill-current" aria-hidden />
        Star
      </span>
    </span>
  )
}

function ComparisonCellView({ cell }: { cell: ComparisonCell }) {
  if (cell.type === "check") {
    return (
      <span
        className="inline-flex items-center justify-center leading-none"
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
        className="inline-flex items-center justify-center leading-none"
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


/** Blocky pixel check — uses --comparison-check when set, else charcoal */
function PixelCheck() {
  return (
    <span className="inline-flex text-[var(--comparison-check,#1A1A1A)]">
      <svg
        width="18"
        height="18"
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
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M4 9h2v2H4V9Zm2 2h2v2H6v-2Zm2-2h2v2H8V9Zm2-2h2v2h-2V7Zm2-2h2v2h-2V5Z"
          fill="currentColor"
        />
      </svg>
    </span>
  )
}

/** Pixel X — uses --comparison-x-mark when set, else grey */
function PixelX() {
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
    <span className="inline-flex text-[var(--comparison-x-mark,#6B6B6B)] opacity-90">
      <svg
        width="18"
        height="18"
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
          stroke="currentColor"
          strokeWidth="1.5"
        />
        {cells.map(([x, y]) => (
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width={2}
            height={2}
            fill="currentColor"
          />
        ))}
      </svg>
    </span>
  )
}

/** Modern dashed rule between outcomes and comparison — only render when table exists */
export function ComparisonSectionDivider() {
  return (
    <div
      aria-hidden
      className="relative bg-[var(--section-light)] px-5 md:px-8"
    >
      <div className="mx-auto flex max-w-6xl items-center gap-4 py-1">
        <span className="size-1.5 shrink-0 bg-foreground/25" />
        <div
          className="h-px flex-1"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(10,10,10,0.22) 0 7px, transparent 7px 14px)",
          }}
        />
        <span className="size-1.5 shrink-0 bg-foreground/25" />
      </div>
    </div>
  )
}
