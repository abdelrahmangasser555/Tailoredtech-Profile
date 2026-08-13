/**
 * Facade for note edit persistence + versioning.
 *
 * `applyNoteEdit` is versioning-aware (snapshots a version after every edit,
 * dev only). `readFreshNote` reads the live note from disk instead of the
 * stale in-memory cache — use it in edit tools/routes so concurrent edits in
 * one chat session don't overwrite each other.
 */
export { applyNoteEdit, mutateNote } from "@/lib/notes-versioning"
export type { NoteEditMeta } from "@/lib/notes-versioning"
export {
  readFreshNote,
  isGradRoadmapNoteId,
} from "@/lib/notes-overrides-server"
export type { NoteDocument } from "@/lib/notes-types"
