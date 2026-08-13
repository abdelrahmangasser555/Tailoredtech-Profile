import { NextResponse } from "next/server"
import { isLocalEditEnabled } from "@/lib/local-edit"
import { mutateNote } from "@/lib/notes-chat/apply-edit"
import { buildNoteBlock } from "@/lib/notes-chat/build-block"
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

  try {
    const updated = await mutateNote(
      body.noteId,
      (note) => {
        const section = note.sections.find((s) => s.id === body.sectionId)
        if (!section) throw new Error("Section not found")

        if (body.action === "removeType" && body.blockType) {
          return {
            sections: removeBlocksOfType(note, body.sectionId, body.blockType),
          }
        }
        if (body.action === "removeBlock" && body.blockId) {
          return {
            sections: removeBlockById(note, body.sectionId, body.blockId),
          }
        }
        if (body.action === "updateBlock" && body.blockId && body.data) {
          return {
            sections: updateBlock(
              note,
              body.sectionId,
              body.blockId,
              body.data as Partial<NoteBlock>
            ),
          }
        }
        if (body.action === "append" && body.blockType) {
          const block = buildNoteBlock(body.blockType, body.data ?? {})
          if (!block) throw new Error("Invalid block data")
          if (
            block.type === "tasks" &&
            section.blocks.some((b) => b.type === "tasks")
          ) {
            throw new Error("Section already has a checklist")
          }
          return { sections: appendBlock(note, body.sectionId, block) }
        }
        throw new Error("Invalid action")
      },
      {
        source: `section-${body.action}`,
        name:
          body.action === "append"
            ? `Added ${body.blockType ?? "block"}`
            : body.action === "removeBlock" || body.action === "removeType"
              ? "Removed block"
              : "Updated block",
        note: body.sectionId,
      }
    )
    return NextResponse.json({ ok: true, note: updated })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Save failed"
    const status =
      message === "Section not found" || message === "Note not found"
        ? 404
        : message === "Section already has a checklist"
          ? 409
          : 500
    return NextResponse.json({ error: message }, { status })
  }
}
