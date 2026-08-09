import { NextResponse } from "next/server"
import { isLocalEditEnabled } from "@/lib/local-edit"
import { applyNoteEdit } from "@/lib/notes-chat/apply-edit"
import { buildNoteBlock } from "@/lib/notes-chat/build-block"
import { getNoteById } from "@/lib/notes"
import {
  appendBlock,
  removeBlockById,
  removeBlocksOfType,
  updateBlock,
} from "@/lib/notes-chat/section-blocks"
import type { NoteBlock } from "@/lib/notes-types"

type Body = {
  noteId: string
  sectionId: string
  action: "append" | "removeType" | "removeBlock" | "updateBlock"
  blockType?: NoteBlock["type"]
  blockId?: string
  data?: Record<string, unknown>
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

  if (!body?.noteId || !body?.sectionId || !body?.action) {
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
    let sections = note.sections

    if (body.action === "removeType" && body.blockType) {
      sections = removeBlocksOfType(note, body.sectionId, body.blockType)
    } else if (body.action === "removeBlock" && body.blockId) {
      sections = removeBlockById(note, body.sectionId, body.blockId)
    } else if (body.action === "updateBlock" && body.blockId && body.data) {
      sections = updateBlock(
        note,
        body.sectionId,
        body.blockId,
        body.data as Partial<NoteBlock>
      )
    } else if (body.action === "append" && body.blockType) {
      const block = buildNoteBlock(body.blockType, body.data ?? {})
      if (!block) {
        return NextResponse.json({ error: "Invalid block data" }, { status: 400 })
      }
      if (
        block.type === "tasks" &&
        section.blocks.some((b) => b.type === "tasks")
      ) {
        return NextResponse.json(
          { error: "Section already has a checklist" },
          { status: 409 }
        )
      }
      sections = appendBlock(note, body.sectionId, block)
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const updated = await applyNoteEdit(body.noteId, { sections })
    return NextResponse.json({ ok: true, note: updated })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Save failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
