import type { NotesTreeNode } from "@/lib/notes-types"

/** Root folder id for the code-managed grad learning path */
export const GRAD_ROADMAP_ROOT_ID = "grad-project-roadmap"

/** Root folder id for Ahmed Tamer (Moshka) learning path */
export const MOSHKA_ROOT_ID = "moshka"

export const MANAGED_NOTES_ROOT_IDS = [
  GRAD_ROADMAP_ROOT_ID,
  MOSHKA_ROOT_ID,
] as const

export type ManagedNotesRootId = (typeof MANAGED_NOTES_ROOT_IDS)[number]

const MANAGED_SET = new Set<string>(MANAGED_NOTES_ROOT_IDS)

export function isManagedNotesRootId(id: string): boolean {
  return MANAGED_SET.has(id)
}

export function isManagedNotesPath(pathIds: string[]): boolean {
  return Boolean(pathIds[0] && isManagedNotesRootId(pathIds[0]))
}

export function isGradRoadmapPath(pathIds: string[]): boolean {
  return pathIds[0] === GRAD_ROADMAP_ROOT_ID
}

export function isMoshkaPath(pathIds: string[]): boolean {
  return pathIds[0] === MOSHKA_ROOT_ID
}

/** Remove code-managed roots before persisting notes.json */
export function stripManagedRootsFromTree(
  tree: NotesTreeNode[]
): NotesTreeNode[] {
  return tree.filter(
    (n) => !(n.type === "folder" && isManagedNotesRootId(n.id))
  )
}

/** @deprecated use stripManagedRootsFromTree */
export function stripGradRoadmapFromTree(
  tree: NotesTreeNode[]
): NotesTreeNode[] {
  return stripManagedRootsFromTree(tree)
}
