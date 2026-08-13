import { NextResponse } from "next/server"
import { isLocalEditEnabled } from "@/lib/local-edit"
import {
  listNoteVersions,
  snapshotNoteVersion,
  readFreshNote,
} from "@/lib/notes-versioning"

export async function GET(request: Request) {
  if (!isLocalEditEnabled()) {
    return NextResponse.json(
      { error: "Local edit is disabled" },
      { status: 403 }
    )
  }

  const { searchParams } = new URL(request.url)
  const noteId = searchParams.get("noteId")
  if (!noteId) {
    return NextResponse.json(
      { error: "noteId required" },
      { status: 400 }
    )
  }

  const versions = await listNoteVersions(noteId)
  return NextResponse.json({ versions })
}

type CreateBody = {
  noteId: string
  source?: string
  name?: string
  note?: string
}

/** Manually snapshot the current note state (e.g. before a risky edit). */
export async function POST(request: Request) {
  if (!isLocalEditEnabled()) {
    return NextResponse.json(
      { error: "Local edit is disabled" },
      { status: 403 }
    )
  }

  let body: CreateBody
  try {
    body = (await request.json()) as CreateBody
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  if (!body?.noteId) {
    return NextResponse.json({ error: "noteId required" }, { status: 400 })
  }

  const note = await readFreshNote(body.noteId)
  if (!note) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 })
  }

  try {
    const version = await snapshotNoteVersion(body.noteId, note, {
      source: body.source?.trim() || "manual",
      name: body.name,
      note: body.note,
    })
    return NextResponse.json({ ok: true, version })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Snapshot failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
