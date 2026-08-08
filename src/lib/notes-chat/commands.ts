import { findNodePath, notes } from "@/lib/notes"
import {
  isIdInScope,
  loadNotesForContext,
  resolveChatScopeRootId,
} from "@/lib/notes-chat/context"
import { serializeNoteForContext } from "@/lib/notes-chat/serialize"
import type { NoteDocument, NotesTreeNode } from "@/lib/notes-types"

export type NotesChatCommandId = "summarize-today"

export type NotesChatCommand = {
  id: NotesChatCommandId
  /** Shown after `/` in the menu */
  label: string
  /** Slash token without leading slash, e.g. summarize-today */
  slash: string
  description: string
  /** Requires edit mode + local edit */
  editOnly: boolean
}

export const NOTES_CHAT_COMMANDS: NotesChatCommand[] = [
  {
    id: "summarize-today",
    label: "Summarize today",
    slash: "summarize-today",
    description:
      "Rewrite this note as a summary of notes created or updated today",
    editOnly: true,
  },
]

export function notesChatToday(): string {
  return new Date().toISOString().slice(0, 10)
}

export function dateKey(iso: string): string {
  return iso.slice(0, 10)
}

export function parseSlashCommand(
  text: string
): NotesChatCommandId | undefined {
  const trimmed = text.trim()
  const match = trimmed.match(/^\/([a-z0-9-]+)\b/i)
  if (!match) return undefined
  const slash = match[1].toLowerCase()
  return NOTES_CHAT_COMMANDS.find((c) => c.slash === slash)?.id
}

export type TouchedNoteInfo = {
  id: string
  name: string
  title: string
  createdAt: string
  updatedAt: string
  reason: "created" | "updated" | "both"
}

function walkTreeDates(
  nodes: NotesTreeNode[],
  date: string,
  out: Map<string, { created: boolean; updated: boolean }>
) {
  for (const node of nodes) {
    if (node.type === "file") {
      const created = dateKey(node.createdAt) === date
      const updated = dateKey(node.updatedAt) === date
      if (created || updated) {
        const prev = out.get(node.id) ?? { created: false, updated: false }
        out.set(node.id, {
          created: prev.created || created,
          updated: prev.updated || updated,
        })
      }
    } else {
      walkTreeDates(node.children, date, out)
    }
  }
}

/** Notes created or updated on a calendar day (doc + tree dates). */
export function listNotesTouchedOnDate(
  date: string,
  opts?: {
    excludeId?: string
    scopeRootId?: string | null
  }
): TouchedNoteInfo[] {
  const treeHits = new Map<string, { created: boolean; updated: boolean }>()
  walkTreeDates(notes.tree, date, treeHits)

  const byId = new Map<string, TouchedNoteInfo>()

  for (const note of Object.values(notes.notes)) {
    if (!note.enabled) continue
    if (opts?.excludeId && note.id === opts.excludeId) continue
    if (
      opts?.scopeRootId != null &&
      !isIdInScope(note.id, opts.scopeRootId)
    ) {
      continue
    }

    const docCreated = dateKey(note.createdAt) === date
    const docUpdated = dateKey(note.updatedAt) === date
    const tree = treeHits.get(note.id)
    const created = docCreated || Boolean(tree?.created)
    const updated = docUpdated || Boolean(tree?.updated)
    if (!created && !updated) continue

    byId.set(note.id, {
      id: note.id,
      name: note.name,
      title: note.title,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      reason: created && updated ? "both" : created ? "created" : "updated",
    })
  }

  return [...byId.values()].sort((a, b) =>
    a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
  )
}

export function buildSummarizeTodayContext(opts: {
  note: NoteDocument
  pathIds: string[]
  date?: string
}): string {
  const date = opts.date ?? notesChatToday()
  const scopeRootId = resolveChatScopeRootId(opts.note, opts.pathIds)
  const touched = listNotesTouchedOnDate(date, {
    excludeId: opts.note.id,
    scopeRootId,
  })
  const docs = loadNotesForContext(touched.map((t) => t.id))
  const byId = new Map(touched.map((t) => [t.id, t]))

  const index = touched
    .map((t) => {
      const path = findNodePath(t.id)?.join("/") ?? t.id
      return `- [${t.reason}] ${t.title} (${t.id}) · /notes/${path} · created ${dateKey(t.createdAt)} · updated ${dateKey(t.updatedAt)}`
    })
    .join("\n")

  const bodies = docs
    .map((doc) => {
      const info = byId.get(doc.id)
      const tag = info?.reason?.toUpperCase() ?? "TOUCHED"
      return `--- ${tag} TODAY: ${doc.title} (${doc.id}) ---\n${serializeNoteForContext(doc)}`
    })
    .join("\n\n")

  return [
    `SUMMARIZE TODAY COMMAND (${date})`,
    "You MUST rewrite the CURRENT open note into a daily summary using the updateNote tool.",
    "Read every SOURCE note below (created and/or updated today). Do not invent work that is not in the sources.",
    "Keep the note useful as a standing daily log: clear title, short overview, then sections for what was created, what was updated, key progress, and next steps.",
    "Prefer markdown blocks. Mention source note titles. Preserve a stable section id like `summary` when rewriting.",
    touched.length === 0
      ? `No other notes were created or updated on ${date} in scope. Still call updateNote with a short note stating that.`
      : `Found ${touched.length} note(s) touched today:\n${index}`,
    "",
    bodies || "(no source note bodies)",
  ].join("\n")
}
