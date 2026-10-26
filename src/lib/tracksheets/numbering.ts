import type { Tracksheet, TracksheetCategory, TracksheetItem } from "@/lib/tracksheets/types"

export type TracksheetRow =
  | {
      kind: "category"
      number: string
      depth: 0
      category: TracksheetCategory
    }
  | {
      kind: "item"
      number: string
      depth: number
      item: TracksheetItem
    }

export function flattenTracksheet(sheet: Tracksheet): TracksheetRow[] {
  const rows: TracksheetRow[] = []
  const numbered = sheet.numbering.enabled

  sheet.categories.forEach((category, index) => {
    const section = String(index + 1)
    rows.push({
      kind: "category",
      number: numbered ? section : "",
      depth: 0,
      category,
    })
    walk(category.items, numbered ? section : "", 1, numbered, rows)
  })

  return rows
}

function walk(
  items: TracksheetItem[],
  parent: string,
  depth: number,
  numbered: boolean,
  rows: TracksheetRow[]
) {
  items.forEach((item, index) => {
    const number = numbered ? (parent ? `${parent}.${index + 1}` : String(index + 1)) : ""
    rows.push({ kind: "item", number, depth, item })
    if (item.children.length) walk(item.children, number, depth + 1, numbered, rows)
  })
}

export function columnCount(sheet: Tracksheet): number {
  return (
    (sheet.numbering.enabled ? 1 : 0) +
    1 +
    (sheet.columns.status ? 1 : 0) +
    (sheet.columns.type ? 1 : 0)
  )
}
