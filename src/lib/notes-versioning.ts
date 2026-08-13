import { promises as fs } from "fs"
import path from "path"
import crypto from "crypto"
import type { NoteDocument } from "@/lib/notes-types"
import {
  applyNoteEditUnlocked,
  readOverridesFromDisk,
  writeOverridesToDisk,
  mergeNoteEdit,
  withNoteLock,
  readFreshNote,
} from "@/lib/notes-overrides-server"
import notesConfig from "@/config/notes.json"
import { gradRoadmapNotes } from "@/config/grad-roadmap"
import { isLocalEditEnabled } from "@/lib/local-edit"

/** Max hourly buckets kept per note. */
export const MAX_VERSIONS_PER_NOTE = 24
/** Edits inside this window fold into the latest version instead of a new file. */
export const VERSION_COALESCE_MS = 60 * 60 * 1000

const versionsDir = () =>
  path.join(process.cwd(), "src", "config", "note-versions")

const noteVersionsDir = (noteId: string) =>
  path.join(versionsDir(), safeNoteId(noteId))

function safeNoteId(noteId: string): string {
  return noteId.replace(/[^A-Za-z0-9._-]+/g, "_")
}

export type NoteVersionMeta = {
  id: string
  noteId: string
  createdAt: string
  /** Last fold into this hourly bucket */
  updatedAt?: string
  source: string
  /** Short human label, e.g. "Added mermaid" */
  name: string
  /** One-line description of what changed */
  note: string
  summary: string
  sectionCount: number
}

export type NoteVersion = NoteVersionMeta & {
  document: NoteDocument
}

export type NoteEditMeta = {
  source?: string
  name?: string
  note?: string
}

function summarize(doc: NoteDocument): string {
  const titles = doc.sections.map((s) => s.title).filter(Boolean)
  const head = titles.slice(0, 3).join(" · ")
  const more = titles.length > 3 ? ` +${titles.length - 3}` : ""
  return `${head || doc.title}${more}`
}

function defaultName(source: string): string {
  if (source === "manual") return "Manual snapshot"
  if (source === "pre-restore") return "Before restore"
  if (source === "restore") return "Restored"
  return "Edit"
}

async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true })
}

function asMeta(raw: Partial<NoteVersionMeta> & { id: string; noteId: string }): NoteVersionMeta {
  return {
    id: raw.id,
    noteId: raw.noteId,
    createdAt: raw.createdAt ?? "",
    updatedAt: raw.updatedAt,
    source: raw.source ?? "edit",
    name: raw.name || defaultName(raw.source ?? "edit"),
    note: raw.note || raw.summary || "",
    summary: raw.summary ?? "",
    sectionCount: raw.sectionCount ?? 0,
  }
}

function shouldForceNewVersion(source: string): boolean {
  return source === "manual" || source === "pre-restore" || source === "restore"
}

/** Write a version snapshot of the note document. Called after every edit. */
export async function snapshotNoteVersion(
  noteId: string,
  document: NoteDocument,
  meta: NoteEditMeta | string = "edit"
): Promise<NoteVersionMeta> {
  const dir = noteVersionsDir(noteId)
  await ensureDir(dir)

  const source = typeof meta === "string" ? meta : meta.source || "edit"
  const name =
    (typeof meta === "string" ? undefined : meta.name)?.trim() ||
    defaultName(source)
  const noteText =
    (typeof meta === "string" ? undefined : meta.note)?.trim() ||
    summarize(document)

  if (!shouldForceNewVersion(source)) {
    const existing = await listNoteVersions(noteId)
    const latest = existing[0]
    const latestTime = latest ? new Date(latest.createdAt).getTime() : NaN
    if (
      latest &&
      Number.isFinite(latestTime) &&
      Date.now() - latestTime < VERSION_COALESCE_MS
    ) {
      const version: NoteVersionMeta = {
        ...latest,
        source,
        name,
        note: noteText,
        summary: summarize(document),
        sectionCount: document.sections.length,
        updatedAt: new Date().toISOString(),
      }
      const file = path.join(dir, `${latest.id}.json`)
      await fs.writeFile(
        file,
        `${JSON.stringify({ ...version, document }, null, 2)}\n`,
        "utf8"
      )
      return version
    }
  }

  const createdAt = new Date().toISOString()
  const rand = crypto.randomBytes(4).toString("hex")
  const id = `${createdAt.replace(/[:.]/g, "-")}-${rand}`
  const version: NoteVersionMeta = {
    id,
    noteId,
    createdAt,
    source,
    name,
    note: noteText,
    summary: summarize(document),
    sectionCount: document.sections.length,
  }

  const file = path.join(dir, `${id}.json`)
  await fs.writeFile(
    file,
    `${JSON.stringify({ ...version, document }, null, 2)}\n`,
    "utf8"
  )

  await pruneNoteVersions(noteId)
  return version
}

async function pruneNoteVersions(noteId: string): Promise<void> {
  const dir = noteVersionsDir(noteId)
  let files: string[] = []
  try {
    files = await fs.readdir(dir)
  } catch {
    return
  }
  const versions = files.filter((f) => f.endsWith(".json"))
  if (versions.length <= MAX_VERSIONS_PER_NOTE) return

  versions.sort()
  const toRemove = versions.slice(0, versions.length - MAX_VERSIONS_PER_NOTE)
  await Promise.all(
    toRemove.map((f) =>
      fs.unlink(path.join(dir, f)).catch(() => undefined)
    )
  )
}

export async function listNoteVersions(
  noteId: string
): Promise<NoteVersionMeta[]> {
  const dir = noteVersionsDir(noteId)
  let files: string[] = []
  try {
    files = await fs.readdir(dir)
  } catch {
    return []
  }
  const out: NoteVersionMeta[] = []
  for (const f of files) {
    if (!f.endsWith(".json")) continue
    try {
      const raw = await fs.readFile(path.join(dir, f), "utf8")
      const v = JSON.parse(raw) as NoteVersionMeta
      out.push(asMeta(v))
    } catch {
      // skip corrupt file
    }
  }
  out.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
  return out
}

export async function getNoteVersion(
  noteId: string,
  versionId: string
): Promise<NoteVersion | null> {
  const file = path.join(noteVersionsDir(noteId), `${versionId}.json`)
  try {
    const raw = await fs.readFile(file, "utf8")
    const parsed = JSON.parse(raw) as NoteVersion
    return { ...parsed, ...asMeta(parsed), document: parsed.document }
  } catch {
    return null
  }
}

export async function restoreNoteVersion(
  noteId: string,
  versionId: string
): Promise<NoteDocument | null> {
  const version = await getNoteVersion(noteId, versionId)
  if (!version) return null

  const base =
    gradRoadmapNotes[noteId] ??
    (notesConfig.notes as Record<string, NoteDocument>)[noteId]
  if (!base) return null

  return withNoteLock(noteId, async () => {
    const overrides = await readOverridesFromDisk()
    const current = mergeNoteEdit(base, overrides[noteId], {})
    await snapshotNoteVersion(noteId, current, {
      source: "pre-restore",
      name: "Before restore",
      note: `Snapshot before restoring ${version.name}`,
    })

    const restored = mergeNoteEdit(base, overrides[noteId], {
      sections: version.document.sections,
      title: version.document.title,
      name: version.document.name,
      description: version.document.description,
      explains: version.document.explains,
      questionnaires: version.document.questionnaires,
      checklist: version.document.checklist,
      variants: version.document.variants,
      chat: version.document.chat,
    })
    overrides[noteId] = {
      sections: restored.sections,
      title: restored.title,
      name: restored.name,
      description: restored.description,
      explains: restored.explains,
      questionnaires: restored.questionnaires,
      checklist: restored.checklist,
      variants: restored.variants,
      updatedAt: restored.updatedAt,
    }
    await writeOverridesToDisk(overrides)

    await snapshotNoteVersion(noteId, restored, {
      source: "restore",
      name: `Restored: ${version.name}`,
      note: `Restored version ${version.id}`,
    })
    return restored
  })
}

async function commitNoteEdit(
  noteId: string,
  update: Partial<NoteDocument>,
  meta?: NoteEditMeta
): Promise<NoteDocument> {
  const merged = await applyNoteEditUnlocked(noteId, update)
  if (isLocalEditEnabled()) {
    try {
      await snapshotNoteVersion(noteId, merged, {
        source: meta?.source || "edit",
        name: meta?.name,
        note: meta?.note,
      })
    } catch {
      // versioning never fails an edit
    }
  }
  return merged
}

export async function applyNoteEdit(
  noteId: string,
  update: Partial<NoteDocument>,
  meta?: NoteEditMeta
): Promise<NoteDocument> {
  return withNoteLock(noteId, () => commitNoteEdit(noteId, update, meta))
}

/**
 * Atomic read → transform → write. Use this for append/patch so parallel
 * chatbot tools cannot clobber each other.
 */
export async function mutateNote(
  noteId: string,
  mutator: (
    note: NoteDocument
  ) => Partial<NoteDocument> | Promise<Partial<NoteDocument>>,
  meta?: NoteEditMeta
): Promise<NoteDocument> {
  return withNoteLock(noteId, async () => {
    const fresh = await readFreshNote(noteId)
    if (!fresh) throw new Error(`Note not found: ${noteId}`)
    const update = await mutator(fresh)
    return commitNoteEdit(noteId, update, meta)
  })
}

export { readFreshNote } from "@/lib/notes-overrides-server"
