import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { isLocalEditEnabled } from "@/lib/local-edit"
import { isGradRoadmapPath } from "@/lib/notes-managed"
import type {
  NoteDocument,
  NotesConfig,
  NotesFolderNode,
  NotesTreeNode,
} from "@/lib/notes-types"

type Body = {
  pathIds: string[]
  node: NotesTreeNode
}

function getFolderAtPath(
  tree: NotesTreeNode[],
  pathIds: string[]
): NotesFolderNode | "root" | null {
  if (pathIds.length === 0) return "root"

  let current = tree
  let folder: NotesFolderNode | null = null

  for (const id of pathIds) {
    const node = current.find((n) => n.id === id)
    if (!node || node.type !== "folder") return null
    folder = node
    current = node.children
  }

  return folder
}

function stubNote(node: Extract<NotesTreeNode, { type: "file" }>): NoteDocument {
  return {
    id: node.id,
    name: node.name,
    title: node.name,
    description: "",
    createdAt: node.createdAt,
    updatedAt: node.updatedAt,
    enabled: true,
    variants: {
      sidebarNav: true,
      compactHero: true,
      showMeta: true,
    },
    explains: [],
    questionnaires: [],
    sections: [
      {
        id: "start",
        title: "Start",
        blocks: [
          {
            type: "markdown",
            id: "start-md",
            content: "New note — replace this with your content.",
          },
        ],
      },
    ],
  }
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

  if (!body?.node || !Array.isArray(body.pathIds)) {
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
    const target = getFolderAtPath(data.tree, body.pathIds)
    if (!target) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 })
    }

    const list = target === "root" ? data.tree : target.children
    if (list.some((n) => n.id === body.node.id)) {
      return NextResponse.json(
        { error: "Id already exists in this folder" },
        { status: 409 }
      )
    }

    list.push(body.node)

    if (body.node.type === "file") {
      data.notes[body.node.id] = stubNote(body.node)
    }

    if (target !== "root") {
      target.updatedAt = new Date().toISOString().slice(0, 10)
    }

    await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8")
    return NextResponse.json({ ok: true, node: body.node })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Create failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
