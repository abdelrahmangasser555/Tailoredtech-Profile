"use client"

import { useEffect, useMemo, useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { EditorStage } from "@/components/editor/editor-stage"
import {
  CompactCheck,
  CompactInput,
  CompactSelect,
  FieldGrid,
} from "@/components/editor/fields"
import { SectionChart } from "@/components/sections/section-chart"
import { Button } from "@/components/ui/button"
import type { SectionChartConfig, SectionChartType } from "@/lib/section-chart"
import { isSectionChart } from "@/lib/section-chart"

const TYPE_OPTIONS = [
  { value: "bar", label: "Bar" },
  { value: "line", label: "Line" },
  { value: "area", label: "Area" },
  { value: "pie", label: "Pie" },
  { value: "radar", label: "Radar" },
] as const

const CURVE_OPTIONS = [
  { value: "natural", label: "Natural" },
  { value: "linear", label: "Linear" },
  { value: "step", label: "Step" },
] as const

const COLOR_OPTIONS = [
  { value: "var(--chart-1)", label: "Accent 1" },
  { value: "var(--chart-2)", label: "Accent 2" },
  { value: "var(--chart-3)", label: "Accent 3" },
  { value: "var(--chart-4)", label: "Accent 4" },
  { value: "var(--chart-5)", label: "Accent 5" },
]

function emptyChart(): SectionChartConfig {
  return {
    enabled: true,
    type: "line",
    title: "Chart title",
    description: "",
    caption: "",
    xKey: "month",
    series: [
      { key: "value", label: "Value", color: "var(--chart-1)" },
    ],
    data: [
      { month: "Jan", value: 120 },
      { month: "Feb", value: 160 },
      { month: "Mar", value: 140 },
      { month: "Apr", value: 190 },
    ],
    showLegend: true,
    showGrid: true,
    curve: "natural",
    stacked: false,
  }
}

function normalizeCharts(
  chart: unknown,
  charts: unknown
): SectionChartConfig[] {
  if (Array.isArray(charts) && charts.length) {
    return charts.filter(isSectionChart).map((c) => ({ ...c }))
  }
  if (isSectionChart(chart)) return [{ ...chart }]
  return []
}

type ChartVisualEditorProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  chart: unknown
  charts: unknown
  onSave: (next: { chart: unknown; charts: unknown }) => void
}

export function ChartVisualEditor({
  open,
  onOpenChange,
  chart,
  charts,
  onSave,
}: ChartVisualEditorProps) {
  const [list, setList] = useState<SectionChartConfig[]>(() =>
    normalizeCharts(chart, charts)
  )
  const [active, setActive] = useState(0)

  // Seed when the stage opens only — not when parent live-preview refreshes
  // chart/charts refs (avoids reset loops while editing).
  useEffect(() => {
    if (!open) return
    const next = normalizeCharts(chart, charts)
    setList(next.length ? next : [emptyChart()])
    setActive(0)
    // intentionally omit chart/charts while open
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const current = list[active] ?? list[0]

  function updateCurrent(patch: Partial<SectionChartConfig>) {
    setList((prev) =>
      prev.map((c, i) => (i === active ? { ...c, ...patch } : c))
    )
  }

  function updateSeries(
    si: number,
    patch: Partial<SectionChartConfig["series"][number]>
  ) {
    if (!current) return
    const series = current.series.map((s, i) =>
      i === si ? { ...s, ...patch } : s
    )
    updateCurrent({ series })
  }

  function updateCell(rowIndex: number, key: string, raw: string) {
    if (!current) return
    const data = current.data.map((row, i) => {
      if (i !== rowIndex) return row
      const num = Number(raw)
      return {
        ...row,
        [key]: raw === "" || Number.isNaN(num) ? raw : num,
      }
    })
    updateCurrent({ data })
  }

  function commit() {
    const enabled = list.filter((c) => c.enabled !== false)
    if (enabled.length === 0) {
      onSave({ chart: null, charts: null })
    } else if (enabled.length === 1) {
      onSave({ chart: enabled[0], charts: null })
    } else {
      onSave({ chart: null, charts: enabled })
    }
    onOpenChange(false)
  }

  if (!current) return null

  const keys = [
    current.xKey,
    ...current.series.map((s) => s.key),
  ]

  return (
    <EditorStage
      open={open}
      onOpenChange={onOpenChange}
      title="Configure charts"
      description="Visual setup with live preview. No schema required."
      size="xl"
      footer={
        <div className="flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="ghost"
            className="h-9 rounded-none text-white/50"
            onClick={() => {
              setList((prev) => [...prev, emptyChart()])
              setActive(list.length)
            }}
          >
            <Plus data-icon="inline-start" />
            Add chart
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              className="h-9 rounded-none text-white/55"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="accent"
              className="h-9 rounded-none px-4"
              onClick={commit}
            >
              Apply charts
            </Button>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          {list.length > 1 ? (
            <div className="flex flex-wrap gap-1.5">
              {list.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  className={
                    i === active
                      ? "h-7 border border-[#D4FF00] bg-[#D4FF00] px-2 font-mono text-[10px] uppercase tracking-wider text-[#0A0A0A]"
                      : "h-7 border border-white/15 px-2 font-mono text-[10px] uppercase tracking-wider text-white/50 hover:border-white/30"
                  }
                >
                  {c.title || `Chart ${i + 1}`}
                </button>
              ))}
            </div>
          ) : null}

          <FieldGrid>
            <CompactSelect
              label="Type"
              value={current.type}
              options={TYPE_OPTIONS.map((o) => ({ ...o }))}
              onValueChange={(v) =>
                updateCurrent({ type: v as SectionChartType })
              }
            />
            <CompactInput
              label="Title"
              value={current.title ?? ""}
              onChange={(e) => updateCurrent({ title: e.target.value })}
            />
          </FieldGrid>
          <CompactInput
            label="Description"
            value={current.description ?? ""}
            onChange={(e) => updateCurrent({ description: e.target.value })}
          />
          <FieldGrid>
            <CompactInput
              label="X / category key"
              value={current.xKey}
              onChange={(e) => updateCurrent({ xKey: e.target.value })}
            />
            <CompactInput
              label="Caption"
              value={current.caption ?? ""}
              onChange={(e) => updateCurrent({ caption: e.target.value })}
            />
          </FieldGrid>

          <div className="flex flex-wrap gap-2">
            <CompactCheck
              label="Legend"
              checked={current.showLegend !== false}
              onCheckedChange={(showLegend) => updateCurrent({ showLegend })}
            />
            <CompactCheck
              label="Grid"
              checked={current.showGrid !== false}
              onCheckedChange={(showGrid) => updateCurrent({ showGrid })}
            />
            <CompactCheck
              label="Stacked"
              checked={Boolean(current.stacked)}
              onCheckedChange={(stacked) => updateCurrent({ stacked })}
            />
            {(current.type === "line" || current.type === "area") && (
              <CompactSelect
                label="Curve"
                className="w-36"
                value={current.curve ?? "natural"}
                options={CURVE_OPTIONS.map((o) => ({ ...o }))}
                onValueChange={(curve) =>
                  updateCurrent({
                    curve: curve as SectionChartConfig["curve"],
                  })
                }
              />
            )}
          </div>

          <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/35">
            Series
          </p>
          <div className="flex flex-col gap-2">
            {current.series.map((s, si) => (
              <div
                key={si}
                className="grid grid-cols-[1fr_1fr_7rem_auto] items-end gap-2 border border-white/10 p-2"
              >
                <CompactInput
                  label="Key"
                  value={s.key}
                  onChange={(e) => updateSeries(si, { key: e.target.value })}
                />
                <CompactInput
                  label="Label"
                  value={s.label}
                  onChange={(e) => updateSeries(si, { label: e.target.value })}
                />
                <CompactSelect
                  label="Color"
                  value={s.color ?? "var(--chart-1)"}
                  options={COLOR_OPTIONS}
                  onValueChange={(color) => updateSeries(si, { color })}
                />
                <button
                  type="button"
                  className="mb-0.5 inline-flex size-9 items-center justify-center text-white/35 hover:text-red-400"
                  onClick={() =>
                    updateCurrent({
                      series: current.series.filter((_, i) => i !== si),
                    })
                  }
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="inline-flex h-8 w-fit items-center gap-1.5 border border-dashed border-white/20 px-2 font-mono text-[10px] uppercase tracking-wider text-white/45 hover:border-[#D4FF00] hover:text-[#D4FF00]"
              onClick={() =>
                updateCurrent({
                  series: [
                    ...current.series,
                    {
                      key: `s${current.series.length + 1}`,
                      label: `Series ${current.series.length + 1}`,
                      color: `var(--chart-${(current.series.length % 5) + 1})`,
                    },
                  ],
                })
              }
            >
              <Plus className="size-3" />
              Series
            </button>
          </div>

          <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/35">
            Data rows
          </p>
          <div className="overflow-x-auto border border-white/10">
            <table className="w-full min-w-[28rem] border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.03]">
                  {keys.map((k) => (
                    <th
                      key={k}
                      className="px-2 py-1.5 font-mono text-[9px] tracking-wider uppercase text-white/40"
                    >
                      {k}
                    </th>
                  ))}
                  <th className="w-8" />
                </tr>
              </thead>
              <tbody>
                {current.data.map((row, ri) => (
                  <tr key={ri} className="border-b border-white/5">
                    {keys.map((k) => (
                      <td key={k} className="p-1">
                        <input
                          className="h-7 w-full border border-transparent bg-transparent px-1.5 text-white outline-none focus:border-white/20"
                          value={String(row[k] ?? "")}
                          onChange={(e) => updateCell(ri, k, e.target.value)}
                        />
                      </td>
                    ))}
                    <td className="p-1">
                      <button
                        type="button"
                        className="text-white/30 hover:text-red-400"
                        onClick={() =>
                          updateCurrent({
                            data: current.data.filter((_, i) => i !== ri),
                          })
                        }
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            className="inline-flex h-8 w-fit items-center gap-1.5 border border-dashed border-white/20 px-2 font-mono text-[10px] uppercase tracking-wider text-white/45 hover:border-[#D4FF00] hover:text-[#D4FF00]"
            onClick={() => {
              const blank: Record<string, string | number> = {}
              blank[current.xKey] = `Row ${current.data.length + 1}`
              current.series.forEach((s) => {
                blank[s.key] = 0
              })
              updateCurrent({ data: [...current.data, blank] })
            }}
          >
            <Plus className="size-3" />
            Row
          </button>

          {list.length > 1 ? (
            <button
              type="button"
              className="inline-flex h-8 w-fit items-center gap-1.5 border border-white/15 px-2 font-mono text-[10px] uppercase tracking-wider text-red-400/80 hover:border-red-400"
              onClick={() => {
                setList((prev) => prev.filter((_, i) => i !== active))
                setActive(0)
              }}
            >
              <Trash2 className="size-3" />
              Remove this chart
            </button>
          ) : null}
        </div>

        <div className="w-full shrink-0 lg:w-[22rem]">
          <p className="mb-2 font-mono text-[10px] tracking-[0.14em] uppercase text-white/35">
            Preview
          </p>
          <SectionChart
            config={current}
            tone="dark"
            className="mt-0 border-white/10"
          />
        </div>
      </div>
    </EditorStage>
  )
}
