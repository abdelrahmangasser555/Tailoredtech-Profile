import type { Tracksheet } from "@/lib/tracksheets/types"
import { tracksheetUid } from "@/lib/tracksheets/types"
import { rekeyItem } from "@/lib/tracksheets/tree"

export function cloneTracksheet(source: Tracksheet): Tracksheet {
  const now = new Date().toISOString()
  const title = source.title.trim() ? `${source.title} (copy)` : "Copy"
  const ref = source.refNumber.trim() ? `${source.refNumber}-copy` : ""

  return {
    ...source,
    id: tracksheetUid("tracksheet"),
    title,
    refNumber: ref,
    numbering: { ...source.numbering },
    columns: { ...source.columns },
    categories: source.categories.map((category) => ({
      ...category,
      id: tracksheetUid("cat"),
      items: category.items.map(rekeyItem),
    })),
    createdAt: now,
    updatedAt: now,
    enabled: true,
  }
}
