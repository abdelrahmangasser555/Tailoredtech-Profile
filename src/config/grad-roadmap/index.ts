import { gradRoadmapTree } from "@/config/grad-roadmap/tree"
import { gradEntryNotes } from "@/config/grad-roadmap/notes/entry"
import { gradGitNotes } from "@/config/grad-roadmap/notes/git"
import { gradWebNotes } from "@/config/grad-roadmap/notes/web"
import { gradReactNotes } from "@/config/grad-roadmap/notes/react"
import { gradNextNotes } from "@/config/grad-roadmap/notes/nextjs"
import { gradMongoNotes } from "@/config/grad-roadmap/notes/mongodb"
import { gradStructureNotes } from "@/config/grad-roadmap/notes/structure"
import type { NoteDocument } from "@/lib/notes-types"

export { gradRoadmapTree }

export const gradRoadmapNotes: Record<string, NoteDocument> = {
  ...gradEntryNotes,
  ...gradGitNotes,
  ...gradWebNotes,
  ...gradReactNotes,
  ...gradNextNotes,
  ...gradMongoNotes,
  ...gradStructureNotes,
}
