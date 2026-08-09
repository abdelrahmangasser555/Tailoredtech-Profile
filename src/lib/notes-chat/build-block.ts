import type {
  NoteBlock,
  NoteComparisonCell,
  NoteComparisonColumn,
  NoteComparisonRow,
  NoteStackEdge,
  NoteStackItem,
  NoteStackLayer,
  NoteTaskItem,
} from "@/lib/notes-types"
import { newBlockId } from "@/lib/notes-chat/section-blocks"

function asString(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined
}

function normalizeCell(raw: unknown): NoteComparisonCell | null {
  if (!raw || typeof raw !== "object") return null
  const cell = raw as Record<string, unknown>
  const type = cell.type
  if (type !== "check" && type !== "x" && type !== "number" && type !== "text") {
    return null
  }
  const value = cell.value
  if (
    typeof value !== "boolean" &&
    typeof value !== "number" &&
    typeof value !== "string"
  ) {
    return null
  }
  return { type, value }
}

function normalizeComparison(
  data: Record<string, unknown>
): Omit<Extract<NoteBlock, { type: "comparison" }>, "id" | "type"> | null {
  const columnsRaw = data.columns
  const rowsRaw = data.rows
  if (!Array.isArray(columnsRaw) || !Array.isArray(rowsRaw)) return null
  if (columnsRaw.length === 0 || rowsRaw.length === 0) return null

  const columns: NoteComparisonColumn[] = []
  for (const col of columnsRaw) {
    if (!col || typeof col !== "object") continue
    const c = col as Record<string, unknown>
    const id = asString(c.id)
    const label = asString(c.label)
    if (!id || !label) continue
    columns.push({
      id,
      label,
      highlight: Boolean(c.highlight),
    })
  }
  if (!columns.length) return null

  const rows: NoteComparisonRow[] = []
  for (const row of rowsRaw) {
    if (!row || typeof row !== "object") continue
    const r = row as Record<string, unknown>
    const label = asString(r.label)
    if (!label || !Array.isArray(r.cells)) continue
    const cells = r.cells
      .map(normalizeCell)
      .filter((c): c is NoteComparisonCell => Boolean(c))
    if (cells.length !== columns.length) continue
    rows.push({ label, cells })
  }
  if (!rows.length) return null

  return {
    title: asString(data.title),
    caption: asString(data.caption),
    rowHeader: asString(data.rowHeader),
    columns,
    rows,
  }
}

/** Build a typed note block from loose tool / API payloads */
export function buildNoteBlock(
  type: NoteBlock["type"],
  data: Record<string, unknown> = {},
  id = newBlockId(type)
): NoteBlock | null {
  switch (type) {
    case "markdown": {
      const content = asString(data.content)
      if (!content?.trim()) return null
      return { type: "markdown", id, content }
    }
    case "youtube": {
      const url = asString(data.url)
      if (!url?.trim()) return null
      return {
        type: "youtube",
        id,
        url: url.trim(),
        title: asString(data.title),
        caption: asString(data.caption),
      }
    }
    case "stack":
      return {
        type: "stack",
        id,
        title: asString(data.title),
        caption: asString(data.caption),
        layers: data.layers as NoteStackLayer[] | undefined,
        items: data.items as NoteStackItem[] | undefined,
        edges: data.edges as NoteStackEdge[] | undefined,
        direction:
          data.direction === "horizontal" ? "horizontal" : "vertical",
      }
    case "mermaid": {
      const diagram = asString(data.diagram)
      if (!diagram?.trim()) return null
      return {
        type: "mermaid",
        id,
        title: asString(data.title),
        caption: asString(data.caption),
        diagram: diagram
          .replace(/^```(?:mermaid)?\s*/i, "")
          .replace(/```\s*$/i, "")
          .trim(),
      }
    }
    case "illustration": {
      const component = asString(data.component)
      if (!component?.trim()) return null
      return {
        type: "illustration",
        id,
        component: component.trim(),
        title: asString(data.title),
        caption: asString(data.caption),
        props:
          data.props && typeof data.props === "object"
            ? (data.props as Record<string, unknown>)
            : undefined,
      }
    }
    case "html": {
      const html = asString(data.html)
      if (!html?.trim()) return null
      return {
        type: "html",
        id,
        html,
        title: asString(data.title),
        caption: asString(data.caption),
      }
    }
    case "link": {
      const href = asString(data.href)
      if (!href?.trim()) return null
      return {
        type: "link",
        id,
        href: href.trim(),
        label: asString(data.label)?.trim() || href.trim(),
        description: asString(data.description),
      }
    }
    case "callout": {
      const body = asString(data.body)
      if (!body?.trim()) return null
      const tone = data.tone
      return {
        type: "callout",
        id,
        tone:
          tone === "tip" || tone === "warn" || tone === "info"
            ? tone
            : "info",
        title: asString(data.title),
        body,
      }
    }
    case "gallery": {
      const images = data.images as { src: string; label: string }[] | undefined
      if (!images?.length) return null
      return {
        type: "gallery",
        id,
        title: asString(data.title),
        caption: asString(data.caption),
        images,
      }
    }
    case "terminal": {
      const scenario = asString(data.scenario)
      if (!scenario?.trim()) return null
      return {
        type: "terminal",
        id,
        scenario: scenario.trim(),
        title: asString(data.title),
        caption: asString(data.caption),
      }
    }
    case "playground": {
      const initialCode = asString(data.initialCode)
      if (!initialCode) return null
      return {
        type: "playground",
        id,
        language: asString(data.language),
        initialCode,
        title: asString(data.title),
        caption: asString(data.caption),
        expectIncludes: asString(data.expectIncludes),
        hint: asString(data.hint),
      }
    }
    case "tasks":
      return {
        type: "tasks",
        id,
        title: asString(data.title) || "Checklist",
        items: (data.items as NoteTaskItem[]) ?? [
          { id: "task-1", label: "New task", children: [] },
        ],
      }
    case "comparison": {
      const normalized = normalizeComparison(data)
      if (!normalized) return null
      return { type: "comparison", id, ...normalized }
    }
    default:
      return null
  }
}

export const NOTE_BLOCK_TYPES: NoteBlock["type"][] = [
  "markdown",
  "youtube",
  "stack",
  "mermaid",
  "illustration",
  "html",
  "link",
  "callout",
  "gallery",
  "terminal",
  "playground",
  "tasks",
  "comparison",
]
