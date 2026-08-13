"use client"

import { useEffect, useState } from "react"
import { History, Loader2, RotateCcw } from "lucide-react"
import { fetchAndPublishNote, publishNoteFromPayload } from "@/lib/notes-live"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { isLocalEditEnabled } from "@/lib/local-edit"
import { formatNotesDate } from "@/lib/notes"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type VersionMeta = {
  id: string
  noteId: string
  createdAt: string
  updatedAt?: string
  source: string
  name: string
  note: string
  summary: string
  sectionCount: number
}

type NoteHistorySheetProps = {
  noteId: string
}

function shortId(id: string) {
  const parts = id.split("-")
  return parts[parts.length - 1]?.slice(0, 6) || id.slice(-6)
}

export function NoteHistorySheet({ noteId }: NoteHistorySheetProps) {
  const [open, setOpen] = useState(false)
  const [versions, setVersions] = useState<VersionMeta[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [restoring, setRestoring] = useState(false)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    setLoading(true)
    setVersions([])
    setSelectedId(null)
    fetch(`/api/local-edit/note-versions?noteId=${encodeURIComponent(noteId)}`)
      .then((r) =>
        r.ok ? r.json() : Promise.reject(new Error("Failed to load history"))
      )
      .then((data: { versions: VersionMeta[] }) => {
        if (cancelled) return
        setVersions(data.versions ?? [])
      })
      .catch((err: Error) => {
        if (!cancelled) toast.error(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [open, noteId])

  async function restore(versionId: string) {
    if (restoring) return
    if (
      !window.confirm(
        "Restore this version? Current state is snapshotted first, so you can undo."
      )
    ) {
      return
    }
    setRestoring(true)
    try {
      const res = await fetch("/api/local-edit/note-versions/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteId, versionId }),
      })
      const data = (await res.json().catch(() => null)) as {
        error?: string
      } | null
      if (!res.ok) throw new Error(data?.error || "Restore failed")
      if (!publishNoteFromPayload(data)) {
        await fetchAndPublishNote(noteId)
      }
      toast.success("Version restored")
      setOpen(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Restore failed")
    } finally {
      setRestoring(false)
    }
  }

  if (!isLocalEditEnabled()) return null

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 border border-white/15 px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] text-white/55 uppercase transition hover:border-accent/40 hover:text-accent"
      >
        <History className="size-3.5" />
        History
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="flex h-full max-h-svh w-full flex-col overflow-hidden gap-0 border-white/10 bg-[#050505] p-0 text-white sm:max-w-sm"
          data-lenis-prevent
          data-lenis-prevent-wheel
        >
          <SheetHeader className="shrink-0 border-b border-white/10 pr-12">
            <p className="font-mono text-[10px] tracking-[0.2em] text-white/35 uppercase">
              Local
            </p>
            <SheetTitle className="font-pixel-circle text-2xl text-white">
              Versions
            </SheetTitle>
            <SheetDescription className="text-[12px] text-white/40">
              Edits in the same hour share one snapshot. Select, then restore.
            </SheetDescription>
          </SheetHeader>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3">
            {loading ? (
              <div className="flex items-center justify-center py-10 text-white/30">
                <Loader2 className="size-4 animate-spin" />
              </div>
            ) : versions.length === 0 ? (
              <p className="px-1 py-6 font-mono text-[10px] tracking-wider text-white/30 uppercase">
                No versions yet
              </p>
            ) : (
              <ul className="flex flex-col gap-1">
                {versions.map((v) => {
                  const active = v.id === selectedId
                  return (
                    <li key={v.id}>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedId((prev) =>
                            prev === v.id ? null : v.id
                          )
                        }
                        className={cn(
                          "w-full border px-3 py-2 text-left transition",
                          active
                            ? "border-accent/50 bg-white/5"
                            : "border-white/10 hover:border-white/20 hover:bg-white/3"
                        )}
                      >
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="truncate text-[13px] font-medium text-white">
                            {v.name || "Edit"}
                          </span>
                          <span className="shrink-0 font-mono text-[9px] tracking-wider text-white/30 uppercase">
                            {formatNotesDate(v.updatedAt || v.createdAt)}
                          </span>
                        </div>
                        <p className="mt-0.5 font-mono text-[9px] tracking-wider text-white/25">
                          {shortId(v.id)}
                          <span className="mx-1.5 text-white/15">·</span>
                          {v.sectionCount} sec
                        </p>
                        {v.note ? (
                          <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-white/45">
                            {v.note}
                          </p>
                        ) : null}
                      </button>
                      {active ? (
                        <div className="flex items-center justify-end border border-t-0 border-accent/50 bg-white/3 px-3 py-1.5">
                          <button
                            type="button"
                            disabled={restoring}
                            onClick={() => void restore(v.id)}
                            className="inline-flex items-center gap-1 bg-accent px-2.5 py-1 font-mono text-[9px] tracking-wider text-[#0a0a0a] uppercase disabled:opacity-40"
                          >
                            {restoring ? (
                              <Loader2 className="size-3 animate-spin" />
                            ) : (
                              <RotateCcw className="size-3" />
                            )}
                            Restore
                          </button>
                        </div>
                      ) : null}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
