import { generateText } from "ai"
import { NextResponse } from "next/server"
import { isLocalEditEnabled } from "@/lib/local-edit"
import { getNoteById } from "@/lib/notes"
import { applyNoteEdit } from "@/lib/notes-chat/apply-edit"
import { appendBlock, newBlockId } from "@/lib/notes-chat/section-blocks"
import { serializeNoteForContext } from "@/lib/notes-chat/serialize"
import { NOTES_CHAT_SUMMARY_MODEL } from "@/lib/notes-chat/models"
import { getOpenRouter } from "@/lib/openrouter"

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

  const note = getNoteById(body.noteId)
  if (!note) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 })
  }

  const section = note.sections.find((s) => s.id === body.sectionId)
  if (!section) {
    return NextResponse.json({ error: "Section not found" }, { status: 404 })
  }

  try {
    const openrouter = getOpenRouter()
    const sectionText = JSON.stringify(section, null, 2)
    const { text } = await generateText({
      model: openrouter(NOTES_CHAT_SUMMARY_MODEL),
      prompt: `You write Mermaid diagrams for a learning notes site.

Rules:
- Output ONLY the mermaid source. No markdown fences. No explanation.
- Prefer flowchart or sequenceDiagram.
- Use dashed links where possible (-.-> or -->>).
- Keep node labels short.
- Match the note and the CURRENT SECTION the user is editing.

NOTE CONTEXT:
${serializeNoteForContext(note)}

CURRENT SECTION JSON:
${sectionText}

USER REQUEST:
${body.prompt.trim()}`,
    })

    const diagram = text
      .replace(/^```(?:mermaid)?\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim()

    if (!diagram) {
      return NextResponse.json(
        { error: "Model returned an empty diagram" },
        { status: 500 }
      )
    }

    const block = {
      type: "mermaid" as const,
      id: newBlockId("mermaid"),
      title: body.title?.trim() || "Diagram",
      diagram,
    }

    const sections = appendBlock(note, body.sectionId, block)
    const updated = await applyNoteEdit(body.noteId, { sections })
    return NextResponse.json({ ok: true, note: updated, diagram })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Mermaid generation failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
