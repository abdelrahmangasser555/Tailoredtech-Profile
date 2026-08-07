"use client"

import { useMemo, useState } from "react"
import { Folder } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  listMoveDestinations,
  type NotesFolderDestination,
} from "@/lib/notes"
import type { NotesTreeNode } from "@/lib/notes-types"
import { cn } from "@/lib/utils"

type NotesMoveDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  node: NotesTreeNode | null
  currentParentPathIds: string[]
  onMoved: (destHref: string) => void
}

export function NotesMoveDialog({
  open,
  onOpenChange,
  node,
  currentParentPathIds,
  onMoved,
}: NotesMoveDialogProps) {
  const destinations = useMemo(() => {
    if (!node) return [] as NotesFolderDestination[]
    return listMoveDestinations({
      nodeId: node.id,
      nodeType: node.type,
      currentParentPathIds,
    })
  }, [node, currentParentPathIds])

  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleOpenChange(next: boolean) {
    if (!next) {
      setSelectedKey(null)
      setError(null)
      setBusy(false)
    }
    onOpenChange(next)
  }

  async function confirmMove() {
    if (!node || selectedKey === null) return
    const dest = destinations.find((d) => d.pathIds.join("/") === selectedKey)
    if (!dest) return

    setBusy(true)
    setError(null)
    try {
      const res = await fetch("/api/local-edit/notes-move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nodeId: node.id,
          fromPathIds: currentParentPathIds,
          toPathIds: dest.pathIds,
        }),
      })
      const data = (await res.json().catch(() => null)) as {
        error?: string
        destHref?: string
      } | null
      if (!res.ok) {
        throw new Error(data?.error || "Move failed")
      }
      handleOpenChange(false)
      onMoved(data?.destHref || dest.href)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Move failed")
      setBusy(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton
        className="max-h-[min(90svh,560px)] w-full max-w-[calc(100%-1.5rem)] gap-0 overflow-hidden rounded-none border border-foreground/15 bg-[#f7f7f2] p-0 text-foreground sm:max-w-md"
      >
        <DialogHeader className="border-b border-foreground/10 px-5 py-4 text-left">
          <p className="font-mono text-[10px] tracking-[0.2em] text-foreground/40 uppercase">
            Move to
          </p>
          <DialogTitle className="font-pixel-circle text-xl">
            {node?.name ?? "Item"}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Choose a destination folder. Current location is hidden.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[min(50svh,320px)] overflow-y-auto px-2 py-2">
          {destinations.length === 0 ? (
            <p className="px-3 py-6 text-sm text-muted-foreground">
              No other folders available.
            </p>
          ) : (
            <ul className="flex flex-col">
              {destinations.map((dest) => {
                const key = dest.pathIds.join("/")
                const selected = selectedKey === key
                return (
                  <li key={key || "root"}>
                    <button
                      type="button"
                      onClick={() => setSelectedKey(key)}
                      className={cn(
                        "flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition",
                        selected
                          ? "bg-foreground text-background"
                          : "text-foreground/80 hover:bg-foreground/[0.05]"
                      )}
                    >
                      <Folder
                        className={cn(
                          "size-4 shrink-0",
                          selected ? "opacity-80" : "text-foreground/40"
                        )}
                      />
                      <span className="min-w-0 truncate">{dest.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {error ? (
          <p className="border-t border-foreground/10 px-5 py-2 text-sm text-foreground/60">
            {error}
          </p>
        ) : null}

        <div className="flex items-center justify-end gap-2 border-t border-foreground/10 px-5 py-3">
          <Button
            type="button"
            variant="ghost"
            className="rounded-none"
            disabled={busy}
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="rounded-none bg-foreground text-background hover:bg-foreground/90"
            disabled={busy || selectedKey === null}
            onClick={confirmMove}
          >
            {busy ? "Moving…" : "Move"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
