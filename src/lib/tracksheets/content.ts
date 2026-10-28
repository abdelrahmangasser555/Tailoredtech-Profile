import tracksheets from "@/config/tracksheets.json"
import type { Tracksheet, TracksheetConfig } from "@/lib/tracksheets/types"
import { normalizeTracksheet } from "@/lib/tracksheets/types"

export function getTracksheetConfig(): TracksheetConfig {
  return tracksheets as TracksheetConfig
}

export function getTracksheets(): Tracksheet[] {
  return getTracksheetConfig()
    .tracksheets.filter((sheet) => sheet.enabled)
    .map((sheet) => normalizeTracksheet(sheet))
}

export function getTracksheetById(id: string): Tracksheet | undefined {
  const sheet = getTracksheetConfig().tracksheets.find((item) => item.id === id && item.enabled)
  return sheet ? normalizeTracksheet(sheet) : undefined
}
