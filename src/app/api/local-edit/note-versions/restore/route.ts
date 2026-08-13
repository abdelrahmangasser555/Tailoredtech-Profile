import { NextResponse } from "next/server"
import { isLocalEditEnabled } from "@/lib/local-edit"
import { restoreNoteVersion } from "@/lib/notes-versioning"

type RestoreBody = {
  noteId: string
  versionId: string
}

export async function POST(request: Request) {
  if (!isLocalEditEnabled()) {
    return NextResponse.json(
      { error: "Local edit is disabled" },
      { status: 403 }
    )
  }

  let body: RestoreBody
  try {
    body = (await request.json()) as RestoreBody
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  if (!body?.noteId || !body?.versionId) {
    return NextResponse.json(
      { error: "noteId and versionId required" },
      { status: 400 }
    )
  }

  try {
    const restored = await restoreNoteVersion(body.noteId, body.versionId)
    if (!restored) {
      return NextResponse.json(
        { error: "Version not found" },
        { status: 404 }
      )
    }
    return NextResponse.json({ ok: true, note: restored })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Restore failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
