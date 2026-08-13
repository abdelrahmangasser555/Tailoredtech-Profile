import { promises as fs } from "fs"
import path from "path"
import notesConfig from "@/config/notes.json"
import { gradRoadmapNotes } from "@/config/grad-roadmap"
import type { NoteDocument } from "@/lib/notes-types"
import { isLocalEditEnabled } from "@/lib/local-edit"

type OverridesMap = Record<string, Partial<NoteDocument>>

export function isGradRoadmapNoteId(id: string): boolean {
  return id in gradRoadmapNotes
}

function baseNoteFor(id: string): NoteDocument | undefined {
  return (
    gradRoadmapNotes[id] ??
    (notesConfig.notes as Record<string, NoteDocument>)[id]
  )
}

const overridesFilePath = () =>
  path.join(process.cwd(), "src", "config", "note-overrides.json")

export async function readOverridesFromDisk(): Promise<OverridesMap> {
  try {
    const raw = await fs.readFile(overridesFilePath(), "utf8")
    return JSON.parse(raw) as OverridesMap
  } catch {
    return {}
  }
}

export async function writeOverridesToDisk(
  data: OverridesMap
): Promise<void> {
  await fs.writeFile(
    overridesFilePath(),
    `${JSON.stringify(data, null, 2)}\n`,
    "utf8"
  )
}

/**
 * Merge a base note with a stored override patch + an incoming update.
 * Mirrors the original `applyNoteEdit` semantics exactly so behavior is
 * unchanged — only the source of the "existing" state differs (disk, not a
 * one-shot in-memory cache).
 */
function mergeNoteEdit(
  base: NoteDocument,
  existing: Partial<NoteDocument> | undefined,
  update: Partial<NoteDocument>
): NoteDocument {
  return {
    ...base,
    ...(existing ?? {}),
    ...update,
    id: base.id,
    updatedAt: new Date().toISOString().slice(0, 10),
    sections: update.sections ?? existing?.sections ?? base.sections,
    explains: update.explains ?? existing?.explains ?? base.explains,
    questionnaires:
      update.questionnaires ?? existing?.questionnaires ?? base.questionnaires,
    checklist:
      update.checklist !== undefined
        ? update.checklist
        : existing?.checklist !== undefined
          ? existing.checklist
          : base.checklist,
    variants: {
      ...base.variants,
      ...(existing?.variants ?? {}),
      ...(update.variants ?? {}),
    },
    chat: {
      ...base.chat,
      ...(existing?.chat ?? {}),
      ...(update.chat ?? {}),
    },
  }
}

function overridePatchFromMerged(merged: NoteDocument): Partial<NoteDocument> {
  return {
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
}

/**
 * Read the CURRENT note state from disk (base + latest overrides).
 *
 * This is the fix for the data-loss bug: the chatbot edit tools previously
 * read a stale in-memory copy (`getNoteById`, built once at module load from a
 * static JSON import). Each new edit appended to that stale copy and then
 * overwrote the overrides file, destroying any prior multi-section update from
 * the same chat session. Reading fresh from disk every mutation closes that
 * race.
 */
export async function readFreshNote(
  noteId: string
): Promise<NoteDocument | undefined> {
  const base = baseNoteFor(noteId)
  if (!base || !base.enabled) return undefined
  if (!isLocalEditEnabled()) return base
  const overrides = await readOverridesFromDisk()
  const existing = overrides[noteId]
  if (!existing) return base
  return mergeNoteEdit(base, existing, {})
}

const noteLocks = new Map<string, Promise<unknown>>()

/**
 * Serialize read-modify-write for a note. Chatbot tools often fire in
 * parallel; without a lock the second write overwrites the first (and can
 * even restore an older in-prompt snapshot).
 */
export async function withNoteLock<T>(
  noteId: string,
  fn: () => Promise<T>
): Promise<T> {
  const previous = noteLocks.get(noteId) ?? Promise.resolve()
  let release!: () => void
  const gate = new Promise<void>((resolve) => {
    release = resolve
  })
  const queued = previous.then(() => gate)
  noteLocks.set(noteId, queued)
  await previous.catch(() => undefined)
  try {
    return await fn()
  } finally {
    release()
    if (noteLocks.get(noteId) === queued) noteLocks.delete(noteId)
  }
}

/**
 * Disk write without locking. Callers that already hold `withNoteLock`
 * (mutateNote / applyNoteEdit) must use this so we do not deadlock.
 */
export async function applyNoteEditUnlocked(
  noteId: string,
  update: Partial<NoteDocument>
): Promise<NoteDocument> {
  const base = baseNoteFor(noteId)
  if (!base) {
    throw new Error(`Note not found: ${noteId}`)
  }

  const data = await readOverridesFromDisk()
  const existing = data[noteId] ?? {}
  const merged = mergeNoteEdit(base, existing, update)

  data[noteId] = overridePatchFromMerged(merged)
  await writeOverridesToDisk(data)

  return merged
}

export { mergeNoteEdit }
