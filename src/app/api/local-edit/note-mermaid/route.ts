import { NextResponse } from "next/server"
import { isLocalEditEnabled } from "@/lib/local-edit"
import { generateAndAppendMermaid } from "@/lib/notes-chat/generate-blocks"

type Body = {
  noteId: string
  sectionId: string
  prompt: string
  title?: string
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
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  if (!body?.noteId || !body?.sectionId || !body?.prompt?.trim()) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  try {
    const { note, diagram } = await generateAndAppendMermaid({
      noteId: body.noteId,
      sectionId: body.sectionId,
      prompt: body.prompt,
      title: body.title,
    })
    return NextResponse.json({ ok: true, note, diagram })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Mermaid generation failed"
    const status = message.includes("not found") ? 404 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
