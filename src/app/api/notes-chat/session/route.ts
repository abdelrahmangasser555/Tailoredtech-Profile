import { promises as fs } from "fs"
import path from "path"
import { NextResponse } from "next/server"
import type { UIMessage } from "ai"
import { isLocalEditEnabled } from "@/lib/local-edit"
import type { NotesChatSession } from "@/lib/notes-chat/session"

const sessionsDir = () =>
  path.join(process.cwd(), "src", "config", "notes-chat-sessions")

function sessionPath(noteId: string) {
  return path.join(sessionsDir(), `${noteId}.json`)
}

export async function GET(request: Request) {
  if (!isLocalEditEnabled()) {
    return NextResponse.json({ session: null })
  }

  const { searchParams } = new URL(request.url)
  const noteId = searchParams.get("noteId")
  if (!noteId) {
    return NextResponse.json({ error: "noteId required" }, { status: 400 })
  }

  try {
    const raw = await fs.readFile(sessionPath(noteId), "utf8")
    const session = JSON.parse(raw) as NotesChatSession
    return NextResponse.json({ session })
  } catch {
    return NextResponse.json({ session: null })
  }
}

export async function POST(request: Request) {
  if (!isLocalEditEnabled()) {
    return NextResponse.json({ ok: true })
  }

  let body: NotesChatSession
  try {
    body = (await request.json()) as NotesChatSession
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  if (!body?.noteId) {
    return NextResponse.json({ error: "noteId required" }, { status: 400 })
  }

  try {
    await fs.mkdir(sessionsDir(), { recursive: true })
    const session: NotesChatSession = {
      ...body,
      updatedAt: new Date().toISOString(),
    }
    await fs.writeFile(
      sessionPath(body.noteId),
      `${JSON.stringify(session, null, 2)}\n`,
      "utf8"
    )
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Save failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  if (!isLocalEditEnabled()) {
    return NextResponse.json({ ok: true })
  }

  const { searchParams } = new URL(request.url)
  const noteId = searchParams.get("noteId")
  if (!noteId) {
    return NextResponse.json({ error: "noteId required" }, { status: 400 })
  }

  try {
    await fs.unlink(sessionPath(noteId))
  } catch {
    // ignore missing
  }
  return NextResponse.json({ ok: true })
}
