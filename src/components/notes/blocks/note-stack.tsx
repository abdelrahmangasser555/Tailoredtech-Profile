"use client"

import {
  SiCss,
  SiHtml5,
  SiJavascript,
  SiReact,
  SiTypescript,
  SiNodedotjs,
  SiNextdotjs,
  SiGit,
  SiGithub,
  SiDocker,
  SiPython,
  SiGo,
  SiPostgresql,
  SiMongodb,
  SiTailwindcss,
  SiVercel,
} from "@icons-pack/react-simple-icons"
import type { ComponentType } from "react"
import { cn } from "@/lib/utils"
import type {
  NoteStackEdge,
  NoteStackItem,
  NoteStackLayer,
} from "@/lib/notes-types"

type IconComp = ComponentType<{
  size?: number
  color?: string | "default"
  className?: string
}>

/** Curated Simple Icons map — extend here; never hand-roll SVGs. */
const ICONS: Record<string, IconComp> = {
  siHtml5: SiHtml5,
  SiHtml5,
  siCss: SiCss,
  SiCss,
  siJavascript: SiJavascript,
  SiJavascript,
  siTypescript: SiTypescript,
  SiTypescript,
  siReact: SiReact,
  SiReact,
  siNodedotjs: SiNodedotjs,
  SiNodedotjs,
  siNextdotjs: SiNextdotjs,
  SiNextdotjs,
  siGit: SiGit,
  SiGit,
  siGithub: SiGithub,
  SiGithub,
  siDocker: SiDocker,
  SiDocker,
  siPython: SiPython,
  SiPython,
  siGo: SiGo,
  SiGo,
  siPostgresql: SiPostgresql,
  SiPostgresql,
  siMongodb: SiMongodb,
  SiMongodb,
  siTailwindcss: SiTailwindcss,
  SiTailwindcss,
  siVercel: SiVercel,
  SiVercel,
}

type NoteStackProps = {
  title?: string
  caption?: string
  items?: NoteStackItem[]
  layers?: NoteStackLayer[]
  edges?: NoteStackEdge[]
  direction?: "vertical" | "horizontal"
  className?: string
}

function StackIcon({ item }: { item: NoteStackItem }) {
  const Icon = ICONS[item.icon]
  return (
    <li className="flex flex-col items-center gap-2">
      <span className="flex size-10 items-center justify-center border border-white/15 bg-black/30 text-white">
        {Icon ? (
          <Icon size={22} color="default" />
        ) : (
          <span className="font-mono text-[10px] text-white/40">?</span>
        )}
      </span>
      <span className="max-w-[4.5rem] text-center font-mono text-[9px] tracking-[0.12em] text-white/50 uppercase">
        {item.label}
      </span>
    </li>
  )
}

function LayerBox({ layer }: { layer: NoteStackLayer }) {
  return (
    <div className="min-w-[12rem] flex-1 border border-white/15 bg-white/[0.03]">
      <div className="border-b border-white/10 px-3 py-2">
        <p className="font-mono text-[10px] tracking-[0.2em] text-accent uppercase">
          {layer.label}
        </p>
      </div>
      <ul className="flex flex-wrap items-start justify-center gap-4 px-4 py-4">
        {layer.items.map((item) => (
          <StackIcon key={`${layer.id}-${item.icon}-${item.label}`} item={item} />
        ))}
      </ul>
    </div>
  )
}

function EdgeConnector({
  edge,
  horizontal,
}: {
  edge: NoteStackEdge
  horizontal?: boolean
}) {
  if (horizontal) {
    return (
      <div className="flex shrink-0 flex-col items-center justify-center gap-1 px-1 self-center">
        <div className="flex items-center">
          <span className="h-px w-6 border-t border-dashed border-white/35 md:w-10" />
          <span className="size-1.5 rotate-45 border-r border-t border-white/45" />
        </div>
        {edge.label ? (
          <span className="font-mono text-[9px] tracking-[0.12em] text-white/35 uppercase">
            {edge.label}
          </span>
        ) : null}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center py-1">
      <span className="h-5 w-px border-l border-dashed border-white/35" />
      {edge.label ? (
        <span className="my-1 font-mono text-[9px] tracking-[0.12em] text-white/35 uppercase">
          {edge.label}
        </span>
      ) : null}
      <span className="mb-0.5 size-1.5 rotate-45 border-b border-r border-white/45" />
    </div>
  )
}

/**
 * Stack diagram — mermaid-like boxes + dashed connectors, Simple Icons inside.
 * Prefer `layers` + `edges`. Flat `items` still works as a single row.
 */
export function NoteStack({
  title,
  caption,
  items,
  layers,
  edges,
  direction = "vertical",
  className,
}: NoteStackProps) {
  const resolvedLayers: NoteStackLayer[] =
    layers && layers.length > 0
      ? layers
      : items && items.length > 0
        ? [{ id: "stack", label: title || "Stack", items }]
        : []

  const horizontal = direction === "horizontal"
  const edgeByFrom = new Map(
    (edges ?? []).map((e) => [e.from, e] as const)
  )

  /** Sequential edges when none provided (layer[i] → layer[i+1]) */
  const sequenceEdges: NoteStackEdge[] =
    edges && edges.length > 0
      ? edges
      : resolvedLayers.slice(0, -1).map((layer, i) => ({
          from: layer.id,
          to: resolvedLayers[i + 1]!.id,
        }))

  if (resolvedLayers.length === 0) return null

  return (
    <div className={cn("mt-6 first:mt-0", className)}>
      {title && layers && layers.length > 0 ? (
        <p className="mb-4 font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
          {title}
        </p>
      ) : null}

      <div
        className={cn(
          "overflow-x-auto border border-white/10 bg-black/20 p-4 md:p-5",
          horizontal
            ? "flex min-w-max flex-row items-stretch"
            : "flex flex-col items-stretch"
        )}
      >
        {resolvedLayers.map((layer, index) => {
          const edge =
            sequenceEdges.find((e) => e.from === layer.id) ??
            edgeByFrom.get(layer.id)
          const showEdge = index < resolvedLayers.length - 1 && edge

          return (
            <div
              key={layer.id}
              className={cn(
                "flex",
                horizontal ? "flex-row items-stretch" : "flex-col items-stretch"
              )}
            >
              <LayerBox layer={layer} />
              {showEdge ? (
                <EdgeConnector edge={edge} horizontal={horizontal} />
              ) : null}
            </div>
          )
        })}
      </div>

      {caption ? (
        <p className="mt-3 text-sm text-white/35">{caption}</p>
      ) : null}
    </div>
  )
}
