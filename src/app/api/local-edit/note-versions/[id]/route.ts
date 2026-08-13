import { NextResponse } from "next/server"
import { isLocalEditEnabled } from "@/lib/local-edit"
import { getNoteVersion } from "@/lib/notes-versioning"

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(
  request: Request,
  context: RouteContext
) {
  if (!isLocalEditEnabled()) {
    return NextResponse.json(
      { error: "Local edit is disabled" },
      { status: 403 }
    )
  }

  const { id } = await context.params
  const { searchParams } = new URL(request.url)
  const noteId = searchParams.get("noteId")
  if (!noteId) {
    return NextResponse.json(
      { error: "noteId required" },
      { status: 400 }
    )
  }

  const version = await getNoteVersion(noteId, id)
  if (!version) {
    return NextResponse.json({ error: "Version not found" }, { status: 404 })
  }
  return NextResponse.json({ version })
}
