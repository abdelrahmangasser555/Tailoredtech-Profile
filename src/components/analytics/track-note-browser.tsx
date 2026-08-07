"use client"

import { useEngagement } from "@/lib/analytics/use-engagement"

type TrackNoteBrowserProps = {
  folderPath: string
  folderName: string | null
  itemCount: number
}

export function TrackNoteBrowser({
  folderPath,
  folderName,
  itemCount,
}: TrackNoteBrowserProps) {
  useEngagement("notes_browser_opened", "notes_browser_engagement_ended", {
    page: "notes_browser",
    folder_path: folderPath || "/notes",
    folder_name: folderName ?? "Notes",
    item_count: itemCount,
  })
  return null
}
