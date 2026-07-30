/**
 * Config-driven chart schema for solution + presentation sections.
 * Edit numbers / type / series in JSON — the UI renders via shadcn Chart + Recharts.
 */

export type SectionChartType =
  | "bar"
  | "line"
  | "area"
  | "pie"
  | "radar"

export type SectionChartSeries = {
  key: string
  label: string
  /** CSS color or token, e.g. "var(--chart-1)" or "#FF681D" */
  color?: string
}

export type SectionChartConfig = {
  enabled?: boolean
  type: SectionChartType
  title?: string | null
  description?: string | null
  caption?: string | null
  /** Category / X-axis field in each data row */
  xKey: string
  /** For pie: which numeric key to use as values */
  valueKey?: string
  series: SectionChartSeries[]
  data: Record<string, string | number>[]
  stacked?: boolean
  showLegend?: boolean
  showGrid?: boolean
  /** Line / area curve */
  curve?: "natural" | "linear" | "step"
  /** Chart height class — default aspect-video */
  heightClass?: string
}

export function isSectionChart(
  value: unknown
): value is SectionChartConfig {
  if (!value || typeof value !== "object") return false
  const c = value as SectionChartConfig
  return (
    typeof c.type === "string" &&
    typeof c.xKey === "string" &&
    Array.isArray(c.series) &&
    Array.isArray(c.data) &&
    c.enabled !== false
  )
}
