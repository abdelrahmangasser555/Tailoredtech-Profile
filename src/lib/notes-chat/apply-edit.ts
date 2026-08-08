import { promises as fs } from "fs"
import path from "path"
import notesConfig from "@/config/notes.json"
import { gradRoadmapNotes } from "@/config/grad-roadmap"
import type { NoteDocument } from "@/lib/notes-types"

type OverridesMap = Record<string, Partial<NoteDocument>>

export function isGradRoadmapNoteId(id: string): boolean {
  return id in gradRoadmapNotes
}

async function readOverrides(): Promise<OverridesMap> {
  const filePath = path.join(
    process.cwd(),
    "src",
    "config",
    "note-overrides.json"
  )
  try {
    const raw = await fs.readFile(filePath, "utf8")
    return JSON.parse(raw) as OverridesMap
  } catch {
    return {}
  }
}

/** Server-only: persist note edits to note-overrides.json */
export async function applyNoteEdit(
  noteId: string,
  update: Partial<NoteDocument>
): Promise<NoteDocument> {
  const base =
    gradRoadmapNotes[noteId] ??
    (notesConfig.notes as Record<string, NoteDocument>)[noteId]

  if (!base) {
    throw new Error(`Note not found: ${noteId}`)
  }

  const filePath = path.join(
    process.cwd(),
    "src",
    "config",
    "note-overrides.json"
  )
  const data = await readOverrides()
  const existing = data[noteId] ?? {}

  const merged: NoteDocument = {
    ...base,
    ...existing,
    ...update,
    id: noteId,
    updatedAt: new Date().toISOString().slice(0, 10),
    sections: update.sections ?? existing.sections ?? base.sections,
    explains: update.explains ?? existing.explains ?? base.explains,
    questionnaires:
      update.questionnaires ??
      existing.questionnaires ??
      base.questionnaires,
    checklist:
      update.checklist !== undefined
        ? update.checklist
        : existing.checklist !== undefined
          ? existing.checklist
          : base.checklist,
    variants: {
      ...base.variants,
      ...existing.variants,
      ...update.variants,
    },
    chat: {
      ...base.chat,
      ...existing.chat,
      ...update.chat,
    },
  }

  data[noteId] = {
    sections: merged.sections,
    title: merged.title,
    name: merged.name,
    description: merged.description,
    explains: merged.explains,
    questionnaires: merged.questionnaires,
    checklist: merged.checklist,
    variants: merged.variants,
    updatedAt: merged.updatedAt,
  }
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8")
  return merged
}
