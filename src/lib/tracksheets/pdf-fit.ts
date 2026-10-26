import type { Tracksheet } from "@/lib/tracksheets/types"
import { footnotePlainLines } from "@/lib/tracksheets/format"
import { flattenTracksheet } from "@/lib/tracksheets/numbering"

/** A4 landscape printable height (pt) minus padding and footer. */
const USABLE_HEIGHT_PT = 535
const BASE_ROW_PT = 16.5

function estimateHeightPt(sheet: Tracksheet): number {
  let units = 0
  units += 3.2
  if (sheet.description.trim()) units += 0.9
  if (sheet.display.footnote.enabled) {
    units += footnotePlainLines(sheet.display.footnote.markdown).length * 0.45
  }
  units += 0.85

  for (const row of flattenTracksheet(sheet)) {
    if (row.kind === "category") {
      units += 1.05
      continue
    }
    units += 0.75
    const desc = row.item.description.trim()
    if (desc) {
      const lines = Math.max(1, Math.ceil(desc.length / 88))
      units += lines * 0.38
    }
    if (sheet.columns.images && row.item.images.length) {
      units += 2.8
    }
  }

  return units * BASE_ROW_PT
}

/** Scale factor so typical sheets fit one landscape A4 page. */
export function tracksheetPdfScale(sheet: Tracksheet): number {
  const needed = estimateHeightPt(sheet)
  const scale = USABLE_HEIGHT_PT / needed
  return Math.min(1, Math.max(0.58, scale))
}

export function scalePt(value: number, scale: number): number {
  return Math.max(4, value * scale)
}
