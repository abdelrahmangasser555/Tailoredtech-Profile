import notesConfig from "@/config/notes.json"
import type {
  NoteDocument,
  NotesConfig,
  NotesFolderNode,
  NotesTreeNode,
} from "@/lib/notes-types"

export type { NoteDocument, NotesConfig, NotesTreeNode, NotesFolderNode }

export const notes = notesConfig as NotesConfig

export type NotesBreadcrumb = {
  id: string
  name: string
  href: string
  type: "root" | "folder" | "file"
}

export type NotesResolveResult =
  | {
      kind: "folder"
      folder: NotesFolderNode | null
      children: NotesTreeNode[]
      breadcrumbs: NotesBreadcrumb[]
      pathIds: string[]
    }
  | {
      kind: "file"
      note: NoteDocument
      node: Extract<NotesTreeNode, { type: "file" }>
      breadcrumbs: NotesBreadcrumb[]
      pathIds: string[]
    }

function isFolder(node: NotesTreeNode): node is NotesFolderNode {
  return node.type === "folder"
}

export function getNotesRootChildren(): NotesTreeNode[] {
  return notes.tree
}

export function getNoteById(id: string): NoteDocument | undefined {
  const note = notes.notes[id]
  if (!note || !note.enabled) return undefined
  return note
}

export function getAllNoteIds(): string[] {
  return Object.values(notes.notes)
    .filter((n) => n.enabled)
    .map((n) => n.id)
}

/** Collect every folder/file path segment list for static generation */
export function getAllNotesPaths(): string[][] {
  const paths: string[][] = [[]]

  function walk(nodes: NotesTreeNode[], prefix: string[]) {
    for (const node of nodes) {
      const next = [...prefix, node.id]
      paths.push(next)
      if (isFolder(node)) walk(node.children, next)
    }
  }

  walk(notes.tree, [])
  return paths
}

function findInTree(
  nodes: NotesTreeNode[],
  id: string
): NotesTreeNode | undefined {
  for (const node of nodes) {
    if (node.id === id) return node
    if (isFolder(node)) {
      const found = findInTree(node.children, id)
      if (found) return found
    }
  }
  return undefined
}

/** Walk path segments from root; returns null if any segment is missing */
export function resolveNotesPath(pathIds: string[]): NotesResolveResult | null {
  const breadcrumbs: NotesBreadcrumb[] = [
    { id: "root", name: "Notes", href: "/notes", type: "root" },
  ]

  if (pathIds.length === 0) {
    return {
      kind: "folder",
      folder: null,
      children: notes.tree,
      breadcrumbs,
      pathIds: [],
    }
  }

  let current: NotesTreeNode[] = notes.tree
  let folder: NotesFolderNode | null = null
  const walked: string[] = []

  for (let i = 0; i < pathIds.length; i++) {
    const id = pathIds[i]!
    const node = current.find((n) => n.id === id)
    if (!node) return null

    walked.push(id)
    const href = `/notes/${walked.join("/")}`

    if (node.type === "file") {
      if (i !== pathIds.length - 1) return null
      const note = getNoteById(node.id)
      if (!note) return null
      breadcrumbs.push({
        id: node.id,
        name: node.name,
        href,
        type: "file",
      })
      return {
        kind: "file",
        note,
        node,
        breadcrumbs,
        pathIds: walked,
      }
    }

    folder = node
    breadcrumbs.push({
      id: node.id,
      name: node.name,
      href,
      type: "folder",
    })
    current = node.children

    if (i === pathIds.length - 1) {
      return {
        kind: "folder",
        folder,
        children: node.children,
        breadcrumbs,
        pathIds: walked,
      }
    }
  }

  return null
}

export function getParentPath(pathIds: string[]): string {
  if (pathIds.length <= 1) return "/notes"
  return `/notes/${pathIds.slice(0, -1).join("/")}`
}

export function findNodePath(
  targetId: string,
  nodes: NotesTreeNode[] = notes.tree,
  prefix: string[] = []
): string[] | null {
  for (const node of nodes) {
    const next = [...prefix, node.id]
    if (node.id === targetId) return next
    if (isFolder(node)) {
      const found = findNodePath(targetId, node.children, next)
      if (found) return found
    }
  }
  return null
}

export function hrefForNode(nodeId: string): string {
  const path = findNodePath(nodeId)
  if (!path) return "/notes"
  return `/notes/${path.join("/")}`
}

export function formatNotesDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d)
}

export function findFolderNode(
  pathIds: string[]
): NotesFolderNode | null {
  if (pathIds.length === 0) return null
  let current: NotesTreeNode[] = notes.tree
  let folder: NotesFolderNode | null = null
  for (const id of pathIds) {
    const node = current.find((n) => n.id === id)
    if (!node || node.type !== "folder") return null
    folder = node
    current = node.children
  }
  return folder
}

export type NotesFolderDestination = {
  /** Empty array = Notes root */
  pathIds: string[]
  label: string
  href: string
}

/**
 * Folder picker options for Move to.
 * Excludes the node itself and (for folders) all descendants.
 */
export function listMoveDestinations(opts: {
  nodeId: string
  nodeType: "file" | "folder"
  /** Parent path of the node being moved (empty = root child) */
  currentParentPathIds: string[]
}): NotesFolderDestination[] {
  const blocked = new Set<string>()
  if (opts.nodeType === "folder") {
    blocked.add(opts.nodeId)
  }

  const destinations: NotesFolderDestination[] = [
    {
      pathIds: [],
      label: "Notes (root)",
      href: "/notes",
    },
  ]

  function walk(nodes: NotesTreeNode[], prefix: string[], names: string[]) {
    for (const node of nodes) {
      if (node.type !== "folder") continue
      if (blocked.has(node.id)) continue
      const pathIds = [...prefix, node.id]
      const labelParts = [...names, node.name]
      destinations.push({
        pathIds,
        label: labelParts.join(" / "),
        href: `/notes/${pathIds.join("/")}`,
      })
      walk(node.children, pathIds, labelParts)
    }
  }

  walk(notes.tree, [], [])

  const currentKey = opts.currentParentPathIds.join("/")
  return destinations.filter((d) => d.pathIds.join("/") !== currentKey)
}

export { findInTree, isFolder }
