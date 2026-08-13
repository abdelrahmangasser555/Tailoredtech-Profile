import { NextResponse } from "next/server"
import { isLocalEditEnabled } from "@/lib/local-edit"
import { mutateNote } from "@/lib/notes-chat/apply-edit"
import type { NoteTaskItem } from "@/lib/notes-types"

type Body = {
  noteId: string
  /** Set checklist, or null to remove */
  checklist: { title?: string; items: NoteTaskItem[] } | null
  /** Optional: append a tasks block into a section */
  appendSectionTasks?: {
    sectionId: string
    title?: string
    items?: NoteTaskItem[]
  }
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

  if (!body?.noteId) {
    return NextResponse.json({ error: "noteId required" }, { status: 400 })
  }

  try {
    if (body.appendSectionTasks) {
      const { sectionId, title, items } = body.appendSectionTasks
      const blockId = `tasks-${Date.now().toString(36)}`
      const updated = await mutateNote(
        body.noteId,
        (note) => ({
          sections: note.sections.map((section) => {
            if (section.id !== sectionId) return section
            if (section.blocks.some((b) => b.type === "tasks")) return section
            return {
              ...section,
              blocks: [
                ...section.blocks,
                {
                  type: "tasks" as const,
                  id: blockId,
                  title: title ?? "Checklist",
                  items: items ?? [
                    { id: "task-1", label: "New task", children: [] },
                  ],
                },
              ],
            }
          }),
        }),
        {
          source: "add-tasks",
          name: "Added checklist",
          note: sectionId,
        }
      )
      return NextResponse.json({ ok: true, note: updated })
    }

    if (!("checklist" in body)) {
      return NextResponse.json(
        { error: "checklist or appendSectionTasks required" },
        { status: 400 }
      )
    }

    const updated = await mutateNote(
      body.noteId,
      () => ({ checklist: body.checklist }),
      {
        source: "update-checklist",
        name: "Updated checklist",
        note: body.noteId,
      }
    )
    return NextResponse.json({ ok: true, note: updated })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Save failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
