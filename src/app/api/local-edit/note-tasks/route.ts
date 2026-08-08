import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { isLocalEditEnabled } from "@/lib/local-edit"
import type { NoteTaskItem } from "@/lib/notes-types"
import type { NoteTasksStore } from "@/lib/notes-chat/tasks"
import { tasksStorageKey } from "@/lib/notes-chat/tasks"

const filePath = () =>
  path.join(process.cwd(), "src", "config", "note-tasks.json")

async function readStore(): Promise<NoteTasksStore> {
  try {
    const raw = await fs.readFile(filePath(), "utf8")
    return JSON.parse(raw) as NoteTasksStore
  } catch {
    return {}
  }
}

export async function GET(request: Request) {
  if (!isLocalEditEnabled()) {
    return NextResponse.json({ items: null })
  }

  const { searchParams } = new URL(request.url)
  const noteId = searchParams.get("noteId")
  const blockId = searchParams.get("blockId")
  if (!noteId || !blockId) {
    return NextResponse.json({ error: "noteId and blockId required" }, { status: 400 })
  }

  const store = await readStore()
  const key = tasksStorageKey(noteId, blockId)
  return NextResponse.json({ items: store[key] ?? null })
}

export async function POST(request: Request) {
  if (!isLocalEditEnabled()) {
    return NextResponse.json(
      { error: "Local edit is disabled" },
      { status: 403 }
    )
  }

  let body: { noteId: string; blockId: string; items: NoteTaskItem[] }
  try {
    body = (await request.json()) as typeof body
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  if (!body?.noteId || !body?.blockId || !Array.isArray(body.items)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  try {
    const store = await readStore()
    const key = tasksStorageKey(body.noteId, body.blockId)
    store[key] = body.items
    await fs.writeFile(filePath(), `${JSON.stringify(store, null, 2)}\n`, "utf8")
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Save failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
