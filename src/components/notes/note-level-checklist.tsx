"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { ListChecks, Plus, Trash2 } from "lucide-react"
import type { NoteDocument, NoteTaskItem } from "@/lib/notes-types"
import { NoteTasks } from "@/components/notes/blocks/note-tasks"
import { isLocalEditEnabled } from "@/lib/local-edit"
import { toast } from "sonner"

export const NOTE_CHECKLIST_BLOCK_ID = "__note-checklist__"

type NoteLevelChecklistProps = {
  note: NoteDocument
}

export function NoteLevelChecklist({ note }: NoteLevelChecklistProps) {
  const router = useRouter()
  const localEdit = isLocalEditEnabled()
  const [busy, setBusy] = useState(false)

  const checklist = note.checklist

  async function createChecklist() {
    if (!localEdit || busy) return
    setBusy(true)
    try {
      const items: NoteTaskItem[] = [
        { id: "task-1", label: "First task", children: [] },
      ]
      const res = await fetch("/api/local-edit/note-checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          noteId: note.id,
          checklist: { title: "Checklist", items },
        }),
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string
        } | null
        throw new Error(data?.error || "Failed to add checklist")
      }
      toast.success("Checklist added")
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed")
    } finally {
      setBusy(false)
    }
  }

  async function removeChecklist() {
    if (!localEdit || busy) return
    if (!window.confirm("Remove the note checklist?")) return
    setBusy(true)
    try {
      const res = await fetch("/api/local-edit/note-checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteId: note.id, checklist: null }),
      })
      if (!res.ok) throw new Error("Failed to remove")
      toast.success("Checklist removed")
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed")
    } finally {
      setBusy(false)
    }
  }

  if (!checklist) {
    if (!localEdit) return null
    return (
      <div className="mb-10 border border-dashed border-white/15 px-4 py-6">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-8 items-center justify-center border border-white/15 bg-white/3">
              <ListChecks className="size-4 text-white/40" />
            </div>
            <div>
              <p className="text-sm text-white/70">Note checklist</p>
              <p className="mt-1 text-[12px] text-white/35">
                Add a checklist for this whole note. It stays at the top and
                saves to JSON while local edit is on.
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={() => void createChecklist()}
            className="inline-flex items-center gap-1.5 border border-accent/40 bg-accent px-3 py-2 font-mono text-[10px] tracking-wider text-[#0a0a0a] uppercase transition hover:bg-accent/90 disabled:opacity-40"
          >
            <Plus className="size-3" />
            Add checklist
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-10">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="font-mono text-[10px] tracking-[0.18em] text-white/35 uppercase">
          Note checklist
        </p>
        {localEdit ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => void removeChecklist()}
            className="inline-flex items-center gap-1 font-mono text-[9px] tracking-wider text-white/30 uppercase transition hover:text-white/60"
          >
            <Trash2 className="size-3" />
            Remove
          </button>
        ) : null}
      </div>
      <NoteTasks
        noteId={note.id}
        blockId={NOTE_CHECKLIST_BLOCK_ID}
        title={checklist.title ?? "Checklist"}
        items={checklist.items ?? []}
        syncNoteChecklist
      />
    </div>
  )
}
