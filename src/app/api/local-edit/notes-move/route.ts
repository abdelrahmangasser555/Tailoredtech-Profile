import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { isLocalEditEnabled } from "@/lib/local-edit"
import {
  GRAD_ROADMAP_ROOT_ID,
  isGradRoadmapPath,
} from "@/lib/notes-managed"
import type {
  NotesConfig,
  NotesFolderNode,
  NotesTreeNode,
} from "@/lib/notes-types"

type Body = {
  nodeId: string
  /** Parent path of the node (empty = root) */
  fromPathIds: string[]
  /** Destination folder path (empty = root) */
  toPathIds: string[]
}

function childrenAt(
  tree: NotesTreeNode[],
  pathIds: string[]
): { list: NotesTreeNode[]; folder: NotesFolderNode | null } | null {
  if (pathIds.length === 0) return { list: tree, folder: null }

  let current = tree
  let folder: NotesFolderNode | null = null
  for (const id of pathIds) {
    const node = current.find((n) => n.id === id)
    if (!node || node.type !== "folder") return null
    folder = node
    current = node.children
  }
  return { list: current, folder }
}

function isDescendantPath(ancestor: string[], candidate: string[]): boolean {
  if (ancestor.length === 0) return false
  if (candidate.length < ancestor.length) return false
  return ancestor.every((id, i) => candidate[i] === id)
}

export async function POST(request: Request) {
  if (!isLocalEditEnabled()) {
    return NextResponse.json(
      { error: "Local edit is disabled" },
      { status: 403 }
    )
  }

  let body: Body
  try {
    body = (await request.json()) as Body
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  if (
    !body ||
    typeof body.nodeId !== "string" ||
    !Array.isArray(body.fromPathIds) ||
    !Array.isArray(body.toPathIds)
  ) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const fromKey = body.fromPathIds.join("/")
  const toKey = body.toPathIds.join("/")
  if (fromKey === toKey) {
    return NextResponse.json(
      { error: "Already in that folder" },
      { status: 400 }
    )
  }

  if (
    body.nodeId === GRAD_ROADMAP_ROOT_ID ||
    isGradRoadmapPath(body.fromPathIds) ||
    isGradRoadmapPath(body.toPathIds)
  ) {
    return NextResponse.json(
      { error: "Grad project roadmap is managed in src/config/grad-roadmap/" },
      { status: 403 }
    )
  }

  const filePath = path.join(process.cwd(), "src", "config", "notes.json")

  try {
    const raw = await fs.readFile(filePath, "utf8")
    const data = JSON.parse(raw) as NotesConfig

    const from = childrenAt(data.tree, body.fromPathIds)
    if (!from) {
      return NextResponse.json({ error: "Source folder not found" }, { status: 404 })
    }

    const index = from.list.findIndex((n) => n.id === body.nodeId)
    if (index === -1) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    const [node] = from.list.splice(index, 1)
    if (!node) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    // Cannot move a folder into itself or a descendant
    if (node.type === "folder") {
      const nodePath = [...body.fromPathIds, node.id]
      if (
        toKey === nodePath.join("/") ||
        isDescendantPath(nodePath, body.toPathIds)
      ) {
        from.list.splice(index, 0, node)
        return NextResponse.json(
          { error: "Cannot move a folder into itself" },
          { status: 400 }
        )
      }
    }

    const to = childrenAt(data.tree, body.toPathIds)
    if (!to) {
      from.list.splice(index, 0, node)
      return NextResponse.json(
        { error: "Destination folder not found" },
        { status: 404 }
      )
    }

    if (to.list.some((n) => n.id === node.id)) {
      from.list.splice(index, 0, node)
      return NextResponse.json(
        { error: "An item with that id already exists there" },
        { status: 409 }
      )
    }

    const today = new Date().toISOString().slice(0, 10)
    node.updatedAt = today
    to.list.push(node)

    if (from.folder) from.folder.updatedAt = today
    if (to.folder) to.folder.updatedAt = today

    // Root tree reference when from/to is root
    if (body.fromPathIds.length === 0) data.tree = from.list
    if (body.toPathIds.length === 0) data.tree = to.list

    await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8")

    const destHref =
      body.toPathIds.length === 0
        ? "/notes"
        : `/notes/${body.toPathIds.join("/")}`

    return NextResponse.json({
      ok: true,
      destHref,
      nodeHref: `${destHref === "/notes" ? "/notes" : destHref}/${node.id}`,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Move failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
