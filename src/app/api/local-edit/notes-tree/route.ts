import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { isLocalEditEnabled } from "@/lib/local-edit"
import {
  isGradRoadmapPath,
  stripGradRoadmapFromTree,
} from "@/lib/notes-managed"
import type { NotesConfig, NotesFolderNode, NotesTreeNode } from "@/lib/notes-types"

type Body = {
  pathIds: string[]
  children: NotesTreeNode[]
}

function getFolderAtPath(
  tree: NotesTreeNode[],
  pathIds: string[]
): { parentList: NotesTreeNode[]; folder: NotesFolderNode | null } | null {
  if (pathIds.length === 0) {
    return { parentList: tree, folder: null }
  }

  let current = tree
  let folder: NotesFolderNode | null = null

  for (const id of pathIds) {
    const node = current.find((n) => n.id === id)
    if (!node || node.type !== "folder") return null
    folder = node
    current = node.children
  }

  return { parentList: current, folder }
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

  if (!body || !Array.isArray(body.pathIds) || !Array.isArray(body.children)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  if (isGradRoadmapPath(body.pathIds)) {
    return NextResponse.json(
      { error: "Grad project roadmap is managed in src/config/grad-roadmap/" },
      { status: 403 }
    )
  }

  const filePath = path.join(process.cwd(), "src", "config", "notes.json")

  try {
    const raw = await fs.readFile(filePath, "utf8")
    const data = JSON.parse(raw) as NotesConfig

    if (body.pathIds.length === 0) {
      data.tree = stripGradRoadmapFromTree(body.children)
    } else {
      const located = getFolderAtPath(data.tree, body.pathIds)
      if (!located?.folder) {
        return NextResponse.json({ error: "Folder not found" }, { status: 404 })
      }
      located.folder.children = body.children
      located.folder.updatedAt = new Date().toISOString().slice(0, 10)
    }

    await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8")
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Save failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
