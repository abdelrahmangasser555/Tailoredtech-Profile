import { NextResponse } from "next/server"
import { isLocalEditEnabled } from "@/lib/local-edit"
import { readFreshNote } from "@/lib/notes-chat/apply-edit"

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
    return NextResponse.json({ error: "noteId required" }, { status: 400 })
  }

  const note = await readFreshNote(noteId)
  if (!note) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 })
  }

  return NextResponse.json({ note })
}
