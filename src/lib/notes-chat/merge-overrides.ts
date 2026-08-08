import noteOverrides from "@/config/note-overrides.json"
import type { NoteDocument } from "@/lib/notes-types"

type OverridesMap = Record<string, Partial<NoteDocument>>

const overrides = noteOverrides as OverridesMap

export function getNoteOverride(id: string): Partial<NoteDocument> | undefined {
  return overrides[id]
}

/** Browser-safe merge of local note overrides onto a document */
export function mergeNoteWithOverride(note: NoteDocument): NoteDocument {
  const patch = overrides[note.id]
  if (!patch) return note
  return {
    ...note,
    ...patch,
    sections: patch.sections ?? note.sections,
    explains: patch.explains ?? note.explains,
    questionnaires: patch.questionnaires ?? note.questionnaires,
    checklist:
      patch.checklist !== undefined ? patch.checklist : note.checklist,
    variants: { ...note.variants, ...patch.variants },
    chat: { ...note.chat, ...patch.chat },
  }
}
