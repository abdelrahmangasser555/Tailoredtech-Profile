import type { Tracksheet, TracksheetItem } from "@/lib/tracksheets/types"
import { emptyTracksheetItem, tracksheetUid } from "@/lib/tracksheets/types"

export function mapItemById(
  items: TracksheetItem[],
  id: string,
  fn: (item: TracksheetItem) => TracksheetItem
): TracksheetItem[] {
  return items.map((item) => {
    if (item.id === id) return fn(item)
    return { ...item, children: mapItemById(item.children, id, fn) }
  })
}

export function updateItem(
  items: TracksheetItem[],
  id: string,
  patch: Partial<TracksheetItem>
): TracksheetItem[] {
  return items.map((item) => {
    if (item.id === id) return { ...item, ...patch, id: item.id }
    return { ...item, children: updateItem(item.children, id, patch) }
  })
}

export function removeItem(items: TracksheetItem[], id: string): TracksheetItem[] {
  return items
    .filter((item) => item.id !== id)
    .map((item) => ({ ...item, children: removeItem(item.children, id) }))
}

export function addChild(
  items: TracksheetItem[],
  parentId: string,
  child: TracksheetItem = emptyTracksheetItem()
): TracksheetItem[] {
  return items.map((item) => {
    if (item.id === parentId) {
      return { ...item, children: [...item.children, child] }
    }
    return { ...item, children: addChild(item.children, parentId, child) }
  })
}

export function moveItem(
  items: TracksheetItem[],
  id: string,
  direction: -1 | 1
): TracksheetItem[] {
  const index = items.findIndex((item) => item.id === id)
  if (index >= 0) {
    const nextIndex = index + direction
    if (nextIndex < 0 || nextIndex >= items.length) return items
    const next = items.slice()
    const [row] = next.splice(index, 1)
    next.splice(nextIndex, 0, row!)
    return next
  }
  return items.map((item) => ({
    ...item,
    children: moveItem(item.children, id, direction),
  }))
}

export function itemDepth(
  items: TracksheetItem[],
  id: string,
  depth = 1
): number | null {
  for (const item of items) {
    if (item.id === id) return depth
    const nested = itemDepth(item.children, id, depth + 1)
    if (nested != null) return nested
  }
  return null
}

export function collectImagePaths(sheet: Tracksheet): string[] {
  const paths = [sheet.vendorLogo, sheet.clientLogo].filter((path): path is string => !!path)
  const walk = (items: TracksheetItem[]) => {
    for (const item of items) {
      paths.push(...item.images)
      walk(item.children)
    }
  }
  for (const category of sheet.categories) walk(category.items)
  return [...new Set(paths)]
}

export function rekeyItem(item: TracksheetItem): TracksheetItem {
  return {
    ...item,
    id: tracksheetUid("item"),
    targetDate: item.targetDate,
    images: [...item.images],
    children: item.children.map(rekeyItem),
  }
}
