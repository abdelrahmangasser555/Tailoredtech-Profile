"use client"

import { useEffect, useState } from "react"
import { Check, RotateCcw } from "lucide-react"
import {
  isNoteCompleted,
  recordNoteVisit,
  setNoteCompleted,
} from "@/lib/notes-progress"
import type { NotesStarter } from "@/lib/notes-types"
import { NoteDownload } from "@/components/notes/blocks/note-download"
import { cn } from "@/lib/utils"

type NoteProgressActionsProps = {
  noteId: string
  title: string
  pathIds: string[]
  href: string
  progressRootIds: string[]
  starters: NotesStarter[]
}

export function NoteProgressActions({
  noteId,
  title,
  pathIds,
  href,
  progressRootIds,
  starters,
}: NoteProgressActionsProps) {
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (progressRootIds.length) {
      recordNoteVisit({
        noteId,
        pathIds,
        href,
        title,
        progressRootIds,
      })
    }
    setDone(isNoteCompleted(noteId))
  }, [noteId, pathIds.join("/"), href, title, progressRootIds.join("|")])

  if (!progressRootIds.length && !starters.length) return null

  function toggle() {
    const next = !done
    setNoteCompleted(noteId, next)
    setDone(next)
  }

  return (
    <div className="mt-6 flex flex-col gap-4">
      {progressRootIds.length ? (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={toggle}
            className={cn(
              "inline-flex items-center gap-2 border px-4 py-2.5 font-mono text-[11px] tracking-[0.14em] uppercase transition",
              done
                ? "border-accent bg-accent text-accent-foreground hover:bg-accent/90"
                : "border-white/20 text-white/70 hover:border-accent hover:text-accent"
            )}
          >
            {done ? (
              <>
                <Check className="size-3.5" />
                Done
              </>
            ) : (
              "Mark as done"
            )}
          </button>
          {done ? (
            <button
              type="button"
              onClick={toggle}
              className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em] text-white/35 uppercase transition hover:text-white/70"
            >
              <RotateCcw className="size-3" />
              Undo
            </button>
          ) : (
            <p className="text-sm text-white/35">
              Tick this when the hands-on bit works on your machine.
            </p>
          )}
        </div>
      ) : null}

      {starters.length ? (
        <NoteDownload files={starters} title="Starter zip" tone="dark" />
      ) : null}
    </div>
  )
}
