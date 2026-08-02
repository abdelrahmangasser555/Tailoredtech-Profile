"use client"

import { memo, useEffect, useMemo, useState, type ReactElement } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import type { SectionChartConfig } from "@/lib/section-chart"

const DEFAULT_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const

/** Stable refs — Recharts treats new object/element props as updates and can loop. */
const AXIS_TICK = { fontSize: 11 } as const
const CARTESIAN_MARGIN = { left: 4, right: 8 } as const
const RADAR_MARGIN = { top: 8, right: 24, bottom: 8, left: 24 } as const
const ACTIVE_DOT = { r: 4 } as const
/** Created once — same element identity across renders (Recharts content prop). */
const DEFAULT_TOOLTIP = (<ChartTooltipContent />) as ReactElement
// payload is injected by Recharts via cloneElement; [] satisfies the prop type
const DEFAULT_LEGEND = <ChartLegendContent payload={[]} />
const GRID_HEIGHT_CLASS = "aspect-[4/3] min-h-[220px] w-full"
const DEFAULT_HEIGHT_CLASS = "aspect-video min-h-[240px] w-full"

type SectionChartProps = {
  config: SectionChartConfig
  className?: string
  /** Dark section = muted chrome; light section = black/grey labels */
  tone?: "dark" | "light"
}

function SectionChartInner({
  config,
  className,
  tone = "dark",
}: SectionChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const enabled =
    config.enabled !== false &&
    Boolean(config.data?.length) &&
    Boolean(config.series?.length)

  const chartConfig = useMemo(
    () => (enabled ? buildChartConfig(config) : {}),
    [config, enabled]
  )

  if (!enabled) return null

  const showLegend = config.showLegend !== false
  const showGrid = config.showGrid !== false
  const curve = config.curve ?? "natural"
  const heightClass = config.heightClass ?? DEFAULT_HEIGHT_CLASS

  return (
    <figure
      className={cn(
        "mt-10 overflow-hidden border",
        tone === "dark"
          ? "border-white/10 bg-white/[0.03]"
          : "border-foreground/10 bg-foreground/[0.02]",
        className
      )}
    >
      {(config.title || config.description) && (
        <div
          className={cn(
            "flex flex-col gap-1 border-b px-5 py-4 md:px-6",
            tone === "dark" ? "border-white/10" : "border-foreground/10"
          )}
        >
          {config.title && (
            <figcaption
              className={cn(
                "font-mono text-[11px] tracking-[0.18em] uppercase",
                tone === "dark" ? "text-accent" : "text-foreground/55"
              )}
            >
              {config.title}
            </figcaption>
          )}
          {config.description && (
            <p
              className={cn(
                "text-sm leading-relaxed",
                tone === "dark" ? "text-white/45" : "text-muted-foreground"
              )}
            >
              {config.description}
            </p>
          )}
        </div>
      )}

      <div className="px-3 py-4 md:px-5 md:py-5">
        {mounted ? (
          <ChartContainer
            config={chartConfig}
            className={cn("w-full", heightClass)}
          >
            {renderChart(config, {
              showGrid,
              showLegend,
              curve,
            })}
          </ChartContainer>
        ) : (
          <div
            className={cn(
              heightClass,
              "w-full animate-pulse rounded-none bg-white/5"
            )}
            aria-hidden
          />
        )}
      </div>

      {config.caption && (
        <p
          className={cn(
            "border-t px-5 py-3 font-mono text-[10px] tracking-[0.14em] uppercase md:px-6",
            tone === "dark"
              ? "border-white/10 text-white/35"
              : "border-foreground/10 text-foreground/40"
          )}
        >
          {config.caption}
        </p>
      )}
    </figure>
  )
}

function chartPropsEqual(
  prev: SectionChartProps,
  next: SectionChartProps
): boolean {
  return (
    prev.tone === next.tone &&
    prev.className === next.className &&
    prev.config === next.config
  )
}

/** Memoized so parent live-preview re-renders skip Recharts when config is unchanged. */
export const SectionChart = memo(SectionChartInner, chartPropsEqual)

function buildChartConfig(config: SectionChartConfig): ChartConfig {
  const out: ChartConfig = {}

  if (config.type === "pie") {
    const valueKey = config.valueKey ?? config.series[0]?.key
    config.data.forEach((row, i) => {
      const name = String(row[config.xKey] ?? `item-${i}`)
      const seriesColor =
        config.series[i % config.series.length]?.color ??
        DEFAULT_COLORS[i % DEFAULT_COLORS.length]
      out[name] = {
        label: name,
        color: seriesColor,
      }
    })
    if (valueKey) {
      out[valueKey] = {
        label: config.series[0]?.label ?? valueKey,
        color: config.series[0]?.color ?? DEFAULT_COLORS[0],
      }
    }
    return out
  }

  config.series.forEach((s, i) => {
    out[s.key] = {
      label: s.label,
      color: s.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length],
    }
  })
  return out
}

function renderChart(
  config: SectionChartConfig,
  opts: {
    showGrid: boolean
    showLegend: boolean
    curve: "natural" | "linear" | "step"
  }
) {
  const { showGrid, showLegend, curve } = opts
  // Animations off: avoids layout thrash + smoother production paint
  const anim = false

  switch (config.type) {
    case "bar":
      return (
        <BarChart
          accessibilityLayer
          data={config.data}
          margin={CARTESIAN_MARGIN}
        >
          {showGrid && <CartesianGrid vertical={false} strokeDasharray="3 3" />}
          <XAxis
            dataKey={config.xKey}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tick={AXIS_TICK}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={AXIS_TICK}
            width={40}
          />
          <ChartTooltip content={DEFAULT_TOOLTIP} />
          {showLegend && <ChartLegend content={DEFAULT_LEGEND} />}
          {config.series.map((s) => (
            <Bar
              key={s.key}
              dataKey={s.key}
              fill={`var(--color-${s.key})`}
              radius={0}
              stackId={config.stacked ? "stack" : undefined}
              isAnimationActive={anim}
            />
          ))}
        </BarChart>
      )

    case "line":
      return (
        <LineChart
          accessibilityLayer
          data={config.data}
          margin={CARTESIAN_MARGIN}
        >
          {showGrid && <CartesianGrid vertical={false} strokeDasharray="3 3" />}
          <XAxis
            dataKey={config.xKey}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tick={AXIS_TICK}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={AXIS_TICK}
            width={40}
          />
          <ChartTooltip content={DEFAULT_TOOLTIP} />
          {showLegend && <ChartLegend content={DEFAULT_LEGEND} />}
          {config.series.map((s) => (
            <Line
              key={s.key}
              dataKey={s.key}
              type={curve}
              stroke={`var(--color-${s.key})`}
              strokeWidth={2}
              dot={false}
              activeDot={ACTIVE_DOT}
              isAnimationActive={anim}
            />
          ))}
        </LineChart>
      )

    case "area":
      return (
        <AreaChart
          accessibilityLayer
          data={config.data}
          margin={CARTESIAN_MARGIN}
        >
          {showGrid && <CartesianGrid vertical={false} strokeDasharray="3 3" />}
          <XAxis
            dataKey={config.xKey}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tick={AXIS_TICK}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={AXIS_TICK}
            width={40}
          />
          <ChartTooltip content={DEFAULT_TOOLTIP} />
          {showLegend && <ChartLegend content={DEFAULT_LEGEND} />}
          {config.series.map((s) => (
            <Area
              key={s.key}
              dataKey={s.key}
              type={curve}
              fill={`var(--color-${s.key})`}
              stroke={`var(--color-${s.key})`}
              fillOpacity={0.28}
              strokeWidth={2}
              stackId={config.stacked ? "stack" : undefined}
              isAnimationActive={anim}
            />
          ))}
        </AreaChart>
      )

    case "pie": {
      const valueKey = config.valueKey ?? config.series[0]?.key ?? "value"
      return (
        <PieChart>
          <ChartTooltip
            content={
              (
                <ChartTooltipContent nameKey={config.xKey} hideLabel />
              ) as ReactElement
            }
          />
          {showLegend && (
            <ChartLegend
              content={
                <ChartLegendContent nameKey={config.xKey} payload={[]} />
              }
            />
          )}
          <Pie
            data={config.data}
            dataKey={valueKey}
            nameKey={config.xKey}
            innerRadius="42%"
            outerRadius="72%"
            strokeWidth={2}
            stroke="var(--section-dark, #050505)"
            isAnimationActive={anim}
          >
            {config.data.map((row, i) => {
              const name = String(row[config.xKey] ?? i)
              return <Cell key={name} fill={`var(--color-${name})`} />
            })}
          </Pie>
        </PieChart>
      )
    }

    case "radar":
      return (
        <RadarChart data={config.data} margin={RADAR_MARGIN}>
          <PolarGrid strokeDasharray="3 3" />
          <PolarAngleAxis dataKey={config.xKey} tick={AXIS_TICK} />
          <ChartTooltip content={DEFAULT_TOOLTIP} />
          {showLegend && <ChartLegend content={DEFAULT_LEGEND} />}
          {config.series.map((s) => (
            <Radar
              key={s.key}
              dataKey={s.key}
              fill={`var(--color-${s.key})`}
              stroke={`var(--color-${s.key})`}
              fillOpacity={0.22}
              isAnimationActive={anim}
            />
          ))}
        </RadarChart>
      )

    default:
      return <></>
  }
}

type SectionChartsGridProps = {
  charts: SectionChartConfig[]
  className?: string
  tone?: "dark" | "light"
}

/** Side-by-side chart grid for presentation / solution sections */
export function SectionChartsGrid({
  charts,
  className,
  tone = "dark",
}: SectionChartsGridProps) {
  // Memoize so we don't allocate new config objects every parent render
  // (that defeats SectionChart memo and re-inits Recharts).
  const visible = useMemo(
    () =>
      charts
        .filter(
          (c) => c.enabled !== false && c.data?.length && c.series?.length
        )
        .map((c) =>
          c.heightClass ? c : { ...c, heightClass: GRID_HEIGHT_CLASS }
        ),
    [charts]
  )
  if (visible.length === 0) return null

  return (
    <div
      className={cn(
        "mt-10 grid gap-4 md:grid-cols-2 md:gap-5",
        className
      )}
    >
      {visible.map((config, i) => (
        <SectionChart
          key={`${config.title ?? config.type}-${i}`}
          config={config}
          tone={tone}
          className="mt-0"
        />
      ))}
    </div>
  )
}
