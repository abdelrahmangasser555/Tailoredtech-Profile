"use client"

import { useEngagement } from "@/lib/analytics/use-engagement"
import { useSectionFunnel } from "@/lib/analytics/use-section-funnel"

type TrackNoteProps = {
  noteId: string
  noteTitle: string
  path: string
  sections: { id: string; title: string }[]
}

export function TrackNote({
  noteId,
  noteTitle,
  path,
  sections,
}: TrackNoteProps) {
  const base = {
    note_id: noteId,
    note_title: noteTitle,
    note_path: path,
    page: "note_detail",
    sections_total: sections.length,
  }

  useEngagement("note_opened", "note_engagement_ended", base)
  useSectionFunnel("note", sections, base)

  return null
}
