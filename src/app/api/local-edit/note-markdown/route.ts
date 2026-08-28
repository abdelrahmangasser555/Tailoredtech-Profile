import { NextResponse } from "next/server"
import { isLocalEditEnabled } from "@/lib/local-edit"
import { generateMarkdownContent } from "@/lib/notes-chat/generate-blocks"

type Body = {
  noteId: string
  sectionId: string
  prompt: string
  currentContent?: string
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
    const markdown = await generateMarkdownContent({
      noteId: body.noteId,
      sectionId: body.sectionId,
      prompt: body.prompt,
      currentContent: body.currentContent,
    })
    return NextResponse.json({ ok: true, markdown })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Markdown generation failed"
    const status = message.includes("not found") ? 404 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
