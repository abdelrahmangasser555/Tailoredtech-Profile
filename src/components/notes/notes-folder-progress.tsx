"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRight, CircleCheck } from "lucide-react"
import type { NotesLessonRef, NotesStarter } from "@/lib/notes"
import {
  continueTarget,
  countCompleted,
  readNotesProgress,
} from "@/lib/notes-progress"
import { NoteDownload } from "@/components/notes/blocks/note-download"
import { cn } from "@/lib/utils"

type NotesFolderProgressProps = {
  trackProgress: boolean
  progressRootId: string | null
  currentLessons: NotesLessonRef[]
  starters: NotesStarter[]
  folderName: string | null
}

export function NotesFolderProgress({
  trackProgress,
  progressRootId,
  currentLessons,
  starters,
  folderName,
}: NotesFolderProgressProps) {
  const [ready, setReady] = useState(false)
  const [, setTick] = useState(0)

  useEffect(() => {
    setReady(true)
  }, [])

  const store = ready ? readNotesProgress() : null
  const total = currentLessons.length
  const done = store ? countCompleted(currentLessons.map((l) => l.id), store) : 0
  const target =
    ready && progressRootId
      ? continueTarget(progressRootId, currentLessons, store ?? undefined)
      : null
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)

  if (!trackProgress || total === 0) {
    if (!starters.length) return null
    return (
      <div className="mt-8">
        <NoteDownload
          files={starters}
          title="Starter zip"
          tone="light"
        />
      </div>
    )
  }

  return (
    <div className="mt-8 border border-foreground/12 bg-white px-5 py-5 md:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.16em] text-foreground/40 uppercase">
            Progress
          </p>
          <p className="mt-1 font-pixel-circle text-2xl text-foreground">
            {ready ? `${done} of ${total}` : `0 of ${total}`}
          </p>
          <p className="mt-1 text-sm text-foreground/50">
            {folderName ? `${folderName}. ` : ""}
            {ready && done === total
              ? "You finished this folder. Nice."
              : "Pick up where you stopped."}
          </p>
        </div>
        {target ? (
          <Link
            href={target.href}
            className="inline-flex items-center gap-2 border border-foreground bg-foreground px-4 py-2.5 font-mono text-[11px] tracking-[0.14em] text-white uppercase transition hover:bg-foreground/90"
          >
            {target.kind === "resume" ? "Continue" : done === 0 ? "Start" : "Next lesson"}
            <ArrowRight className="size-3.5" />
          </Link>
        ) : null}
      </div>

      <div className="mt-4 h-1.5 w-full bg-foreground/10">
        <div
          className="h-full bg-foreground transition-[width]"
          style={{ width: `${ready ? pct : 0}%` }}
        />
      </div>

      {target ? (
        <p className="mt-3 flex items-center gap-2 text-sm text-foreground/55">
          <CircleCheck className="size-3.5 shrink-0 text-foreground/40" />
          <span>
            {target.kind === "resume" ? "Last open: " : "Up next: "}
            <span className="text-foreground">{target.name}</span>
          </span>
        </p>
      ) : null}

      {starters.length ? (
        <NoteDownload
          files={starters}
          title="Starter zip"
          caption="Tiny scaffold. No node_modules. Unzip and open the README first."
          tone="light"
          className="mt-5"
        />
      ) : null}

      <button
        type="button"
        className="sr-only"
        onClick={() => setTick((n) => n + 1)}
      >
        Refresh progress
      </button>
    </div>
  )
}

export function NotesEntryProgress({
  lessonIds,
  className,
}: {
  lessonIds: string[]
  className?: string
}) {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    setReady(true)
  }, [])
  const store = ready ? readNotesProgress() : null
  const total = lessonIds.length
  const done = store ? countCompleted(lessonIds, store) : 0
  if (!total) return null
  const pct = Math.round((done / total) * 100)

  return (
    <span
      className={cn(
        "hidden items-center justify-end gap-2 font-mono text-[10px] tracking-[0.12em] text-foreground/40 uppercase md:flex",
        className
      )}
    >
      {ready ? `${done}/${total}` : `0/${total}`}
      <span className="inline-block h-1 w-10 bg-foreground/10">
        <span
          className="block h-full bg-foreground/70"
          style={{ width: `${ready ? pct : 0}%` }}
        />
      </span>
    </span>
  )
}

export function useCompletedSet(ids: string[]) {
  const [completed, setCompleted] = useState<Set<string>>(new Set())
  useEffect(() => {
    const store = readNotesProgress()
    setCompleted(new Set(ids.filter((id) => store.completed[id])))
  }, [ids.join("|")])
  return completed
}

export function NotesRootContinue({
  lessonsByRoot,
}: {
  lessonsByRoot: Record<string, NotesLessonRef[]>
}) {
  const [href, setHref] = useState<string | null>(null)
  const [label, setLabel] = useState<string | null>(null)

  const roots = useMemo(() => Object.keys(lessonsByRoot), [lessonsByRoot])

  useEffect(() => {
    const store = readNotesProgress()
    const last = store.last
    if (!last) return
    if (!roots.includes(last.progressRootId) && !lessonsByRoot[last.progressRootId]) {
      const match = Object.values(lessonsByRoot)
        .flat()
        .find((l) => l.id === last.noteId)
      if (match) {
        setHref(match.href)
        setLabel(last.title)
      }
      return
    }
    setHref(last.href)
    setLabel(last.title)
  }, [roots, lessonsByRoot])

  if (!href || !label) return null

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 border border-foreground/15 bg-white px-3 py-2 font-mono text-[10px] tracking-[0.14em] text-foreground/70 uppercase transition hover:border-foreground/40 hover:text-foreground"
    >
      Continue
      <span className="max-w-[12rem] truncate font-sans text-[11px] tracking-normal normal-case text-foreground">
        {label}
      </span>
      <ArrowRight className="size-3" />
    </Link>
  )
}
