import type { NotesTreeNode } from "@/lib/notes-types"

/** Root folder id for the code-managed grad learning path */
export const GRAD_ROADMAP_ROOT_ID = "grad-project-roadmap"

export function isGradRoadmapPath(pathIds: string[]): boolean {
  return pathIds[0] === GRAD_ROADMAP_ROOT_ID
}

/** Remove grad roadmap nodes before persisting notes.json (lives in grad-roadmap/) */
export function stripGradRoadmapFromTree(tree: NotesTreeNode[]): NotesTreeNode[] {
  return tree.filter(
    (n) => !(n.type === "folder" && n.id === GRAD_ROADMAP_ROOT_ID)
  )
}
