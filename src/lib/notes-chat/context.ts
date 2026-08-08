import {
  findNodePath,
  getNoteById,
  notes,
} from "@/lib/notes"
import { GRAD_ROADMAP_ROOT_ID } from "@/lib/notes-managed"
import type { NoteDocument, NotesTreeNode } from "@/lib/notes-types"
import { serializeNoteForContext } from "@/lib/notes-chat/serialize"

export type NoteMentionItem = {
  id: string
  name: string
  type: "file" | "folder"
  pathLabel: string
  pathIds: string[]
}

function isFolder(
  node: NotesTreeNode
): node is Extract<NotesTreeNode, { type: "folder" }> {
  return node.type === "folder"
}

function subtreeAt(pathIds: string[]): NotesTreeNode[] | null {
  if (pathIds.length === 0) return notes.tree
  let current = notes.tree
  for (const id of pathIds) {
    const node = current.find((n) => n.id === id)
    if (!node || !isFolder(node)) return null
    current = node.children
  }
  return current
}

export function resolveChatScopeRootId(
  note: NoteDocument,
  pathIds: string[]
): string | null {
  if (note.chat?.scopeRootId) return note.chat.scopeRootId
  if (pathIds[0] === GRAD_ROADMAP_ROOT_ID) return GRAD_ROADMAP_ROOT_ID
  return null
}

/** Sibling notes in the same parent folder as the open note */
export function getSiblingNoteIds(pathIds: string[]): string[] {
  const parentPath = pathIds.slice(0, -1)
  const children = subtreeAt(parentPath)
  if (!children) return []

  return children
    .filter((n) => n.type === "file")
    .map((n) => n.id)
    .filter((id) => Boolean(getNoteById(id)))
}

export function listMentionItems(scopeRootId: string | null): NoteMentionItem[] {
  const rootPath = scopeRootId ? findNodePath(scopeRootId) ?? [] : []
  const rootNodes = subtreeAt(rootPath)
  if (!rootNodes) return []

  const items: NoteMentionItem[] = []

  function walk(nodes: NotesTreeNode[], pathIds: string[], labels: string[]) {
    for (const node of nodes) {
      const nextPath = [...pathIds, node.id]
      const nextLabels = [...labels, node.name]
      items.push({
        id: node.id,
        name: node.name,
        type: node.type,
        pathLabel: nextLabels.join(" / "),
        pathIds: nextPath,
      })
      if (isFolder(node)) walk(node.children, nextPath, nextLabels)
    }
  }

  walk(rootNodes, rootPath, scopeRootId ? [] : ["Notes"])
  return items
}

export function isIdInScope(
  targetId: string,
  scopeRootId: string | null
): boolean {
  if (!scopeRootId) return true
  const targetPath = findNodePath(targetId)
  const scopePath = findNodePath(scopeRootId)
  if (!targetPath || !scopePath) return false
  return scopePath.every((id, i) => targetPath[i] === id)
}

export function loadNotesForContext(ids: string[]): NoteDocument[] {
  const out: NoteDocument[] = []
  const seen = new Set<string>()
  for (const id of ids) {
    if (seen.has(id)) continue
    const note = getNoteById(id)
    if (note) {
      seen.add(id)
      out.push(note)
    }
  }
  return out
}

/** Expand folder ids into descendant note file ids */
export function expandReferenceIds(ids: string[]): string[] {
  const out = new Set<string>()

  function collectFiles(nodes: NotesTreeNode[]) {
    for (const node of nodes) {
      if (node.type === "file") {
        if (getNoteById(node.id)) out.add(node.id)
      } else {
        collectFiles(node.children)
      }
    }
  }

  for (const id of ids) {
    const note = getNoteById(id)
    if (note) {
      out.add(id)
      continue
    }
    const path = findNodePath(id)
    if (!path) continue
    const children = subtreeAt(path)
    if (children) collectFiles(children)
  }

  return [...out]
}

export function buildNotesChatContext(opts: {
  note: NoteDocument
  pathIds: string[]
  referenceIds?: string[]
}): { systemContext: string; scopeRootId: string | null } {
  const scopeRootId = resolveChatScopeRootId(opts.note, opts.pathIds)
  const siblingIds = getSiblingNoteIds(opts.pathIds)
  const refIds = expandReferenceIds(
    (opts.referenceIds ?? []).filter((id) => isIdInScope(id, scopeRootId))
  )

  const contextIds = new Set<string>([opts.note.id, ...siblingIds, ...refIds])
  const docs = loadNotesForContext([...contextIds])

  const parts = docs.map((doc) => {
    const tag =
      doc.id === opts.note.id
        ? "CURRENT NOTE"
        : siblingIds.includes(doc.id)
          ? "SAME FOLDER"
          : "REFERENCED"
    return `--- ${tag}: ${doc.title} (${doc.id}) ---\n${serializeNoteForContext(doc)}`
  })

  const scopeLine = scopeRootId
    ? `Reference scope is limited to the "${scopeRootId}" subtree. Only @-mention items inside that scope.`
    : "You may @-mention any note or folder in the notes tree."

  return {
    scopeRootId,
    systemContext: [
      "You are a learning assistant embedded in a technical notes reader.",
      scopeLine,
      "The user is reading one note. Context below includes the current note, sibling notes in the same folder, and any @-referenced notes.",
      "Answer clearly and concisely. Use markdown in replies when helpful.",
      "",
      parts.join("\n\n"),
    ].join("\n"),
  }
}
