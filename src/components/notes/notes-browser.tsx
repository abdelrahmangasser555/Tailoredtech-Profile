"use client"

import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronRight,
  FileText,
  Folder,
  FolderPlus,
  FilePlus,
  FolderInput,
  GripVertical,
  Pencil,
  Trash2,
} from "lucide-react"
import type { NotesTreeNode } from "@/lib/notes-types"
import type { NotesBreadcrumb } from "@/lib/notes"
import { formatNotesDate, getParentPath } from "@/lib/notes"
import { isLocalEditEnabled } from "@/lib/local-edit"
import { NotesMoveDialog } from "@/components/notes/notes-move-dialog"
import { TrackNoteBrowser } from "@/components/analytics/track-note-browser"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type NotesBrowserProps = {
  pathIds: string[]
  breadcrumbs: NotesBreadcrumb[]
  entries: NotesTreeNode[]
  folderName: string | null
}

type ContextMenuState = {
  x: number
  y: number
  target: NotesTreeNode | null
}

export function NotesBrowser({
  pathIds,
  breadcrumbs,
  entries,
  folderName,
}: NotesBrowserProps) {
  const router = useRouter()
  const localEdit = isLocalEditEnabled()
  const [items, setItems] = useState(entries)
  const [menu, setMenu] = useState<ContextMenuState | null>(null)
  const [moveTarget, setMoveTarget] = useState<NotesTreeNode | null>(null)
  const [dragId, setDragId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  /** Skip overwriting optimistic order when refresh echoes the same write */
  const pendingOrderRef = useRef<string[] | null>(null)
  const didDragRef = useRef(false)

  useEffect(() => {
    if (pendingOrderRef.current) {
      const pending = pendingOrderRef.current.join(",")
      const incoming = entries.map((e) => e.id).join(",")
      if (pending === incoming) {
        pendingOrderRef.current = null
        setItems(entries)
        return
      }
      // Server hasn't caught up yet — keep local order
      return
    }
    setItems(entries)
  }, [entries])

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setMenu(null)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenu(null)
    }
    window.addEventListener("mousedown", onPointerDown)
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener("mousedown", onPointerDown)
      window.removeEventListener("keydown", onKey)
    }
  }, [])

  const persistTree = useCallback(
    async (nextChildren: NotesTreeNode[]) => {
      if (!localEdit) return
      pendingOrderRef.current = nextChildren.map((n) => n.id)
      try {
        const res = await fetch("/api/local-edit/notes-tree", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pathIds, children: nextChildren }),
        })
        if (!res.ok) {
          const data = (await res.json().catch(() => null)) as {
            error?: string
          } | null
          throw new Error(data?.error || "Save failed")
        }
        toast.success("Order updated")
        router.refresh()
      } catch (err) {
        pendingOrderRef.current = null
        toast.error(err instanceof Error ? err.message : "Save failed")
        setItems(entries)
      }
    },
    [entries, localEdit, pathIds, router]
  )

  function openHref(node: NotesTreeNode) {
    const base = pathIds.length ? `/notes/${pathIds.join("/")}` : "/notes"
    return `${base}/${node.id}`
  }

  function onContextMenu(
    e: React.MouseEvent,
    target: NotesTreeNode | null
  ) {
    e.preventDefault()
    if (!localEdit) return
    setMenu({ x: e.clientX, y: e.clientY, target })
  }

  async function createNode(type: "folder" | "file") {
    setMenu(null)
    const name =
      typeof window !== "undefined"
        ? window.prompt(type === "folder" ? "Folder name" : "Note name")
        : null
    if (!name?.trim()) return

    const id = slugify(name)
    const today = new Date().toISOString().slice(0, 10)
    const node: NotesTreeNode =
      type === "folder"
        ? {
            type: "folder",
            id,
            name: name.trim(),
            createdAt: today,
            updatedAt: today,
            children: [],
          }
        : {
            type: "file",
            id,
            name: name.trim(),
            createdAt: today,
            updatedAt: today,
          }

    if (items.some((n) => n.id === id)) {
      toast.error("An item with that id already exists")
      return
    }

    const next = [...items, node]
    setItems(next)

    if (!localEdit) return

    try {
      const res = await fetch("/api/local-edit/notes-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pathIds, node }),
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string
        } | null
        throw new Error(data?.error || "Create failed")
      }
      toast.success(type === "folder" ? "Folder created" : "Note created")
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Create failed")
      setItems(entries)
    }
  }

  async function renameTarget() {
    if (!menu?.target) return
    const target = menu.target
    setMenu(null)
    const name = window.prompt("Rename", target.name)
    if (!name?.trim() || name.trim() === target.name) return

    const next = items.map((n) =>
      n.id === target.id
        ? {
            ...n,
            name: name.trim(),
            updatedAt: new Date().toISOString().slice(0, 10),
          }
        : n
    )
    setItems(next)
    await persistTree(next)
  }

  async function deleteTarget() {
    if (!menu?.target) return
    const target = menu.target
    setMenu(null)
    if (!window.confirm(`Delete “${target.name}”?`)) return
    const next = items.filter((n) => n.id !== target.id)
    setItems(next)
    await persistTree(next)
  }

  function openMoveDialog() {
    if (!menu?.target) return
    setMoveTarget(menu.target)
    setMenu(null)
  }

  function onMoved(destHref: string) {
    if (moveTarget) {
      setItems((prev) => prev.filter((n) => n.id !== moveTarget.id))
    }
    setMoveTarget(null)
    toast.success("Moved")
    router.refresh()
    router.push(destHref)
  }

  function onDragStart(e: React.DragEvent, id: string) {
    if (!localEdit) return
    didDragRef.current = true
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", id)
    setDragId(id)
  }

  function onDragOver(e: React.DragEvent, id: string) {
    if (!localEdit || !dragId || dragId === id) return
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setOverId(id)
  }

  async function onDrop(e: React.DragEvent, targetId: string) {
    e.preventDefault()
    e.stopPropagation()
    if (!localEdit) return

    const sourceId = dragId || e.dataTransfer.getData("text/plain")
    if (!sourceId || sourceId === targetId) {
      setDragId(null)
      setOverId(null)
      return
    }

    const from = items.findIndex((n) => n.id === sourceId)
    const to = items.findIndex((n) => n.id === targetId)
    if (from < 0 || to < 0) {
      setDragId(null)
      setOverId(null)
      return
    }

    const next = [...items]
    const [moved] = next.splice(from, 1)
    if (!moved) return
    next.splice(to, 0, moved)

    setItems(next)
    setDragId(null)
    setOverId(null)
    await persistTree(next)
  }

  const parentHref = getParentPath(pathIds)

  return (
    <div className="min-h-svh bg-[#f7f7f2] text-foreground">
      <TrackNoteBrowser
        folderPath={
          pathIds.length ? `/notes/${pathIds.join("/")}` : "/notes"
        }
        folderName={folderName}
        itemCount={items.length}
      />
      <div className="mx-auto max-w-5xl px-5 py-10 md:px-8 md:py-14">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] tracking-[0.16em] text-foreground/40 uppercase">
            {breadcrumbs.map((crumb, i) => (
              <li key={crumb.href} className="flex items-center gap-1.5">
                {i > 0 ? (
                  <ChevronRight className="size-3 opacity-50" />
                ) : null}
                {i === breadcrumbs.length - 1 ? (
                  <span className="text-foreground/70">{crumb.name}</span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="transition hover:text-foreground"
                  >
                    {crumb.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-pixel-circle text-3xl tracking-tight md:text-4xl">
              {folderName ?? "Notes"}
            </h1>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground">
              {localEdit
                ? "Right-click to create. Drag the handle to reorder."
                : "Browse folders and open notes."}
            </p>
          </div>
          {pathIds.length > 0 ? (
            <Link
              href={parentHref}
              className="font-mono text-[10px] tracking-[0.16em] text-foreground/45 uppercase transition hover:text-foreground"
            >
              ↑ Parent
            </Link>
          ) : null}
        </div>

        <div
          className="mt-10"
          onContextMenu={(e) => {
            if ((e.target as HTMLElement).closest("[data-notes-row]")) return
            onContextMenu(e, null)
          }}
        >
          <div className="grid grid-cols-[1.25rem_minmax(0,1fr)_7rem_7rem] gap-2 border-b border-foreground/10 pb-2 font-mono text-[10px] tracking-[0.16em] text-foreground/35 uppercase md:grid-cols-[1.25rem_minmax(0,1fr)_8rem_8rem_5rem]">
            <span />
            <span>Name</span>
            <span className="text-right">Created</span>
            <span className="text-right">Updated</span>
            <span className="hidden text-right md:block">Kind</span>
          </div>

          {items.length === 0 ? (
            <p className="mt-10 text-sm text-muted-foreground">
              Empty folder
              {localEdit ? " — right-click to add something." : "."}
            </p>
          ) : (
            <ul className="divide-y divide-foreground/8">
              {items.map((node) => {
                const href = openHref(node)
                return (
                  <li
                    key={node.id}
                    data-notes-row
                    onDragOver={(e) => onDragOver(e, node.id)}
                    onDrop={(e) => onDrop(e, node.id)}
                    onDragEnd={() => {
                      setDragId(null)
                      setOverId(null)
                      window.setTimeout(() => {
                        didDragRef.current = false
                      }, 0)
                    }}
                    onContextMenu={(e) => onContextMenu(e, node)}
                    className={cn(
                      "group relative",
                      overId === node.id &&
                        dragId &&
                        dragId !== node.id &&
                        "bg-foreground/[0.04]",
                      dragId === node.id && "opacity-45"
                    )}
                  >
                    {overId === node.id && dragId && dragId !== node.id ? (
                      <span
                        className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-foreground/50"
                        aria-hidden
                      />
                    ) : null}
                    <div className="grid grid-cols-[1.25rem_minmax(0,1fr)_7rem_7rem] items-center gap-2 py-3.5 md:grid-cols-[1.25rem_minmax(0,1fr)_8rem_8rem_5rem]">
                      {localEdit ? (
                        <button
                          type="button"
                          draggable
                          aria-label={`Reorder ${node.name}`}
                          onDragStart={(e) => onDragStart(e, node.id)}
                          onClick={(e) => e.preventDefault()}
                          className="flex cursor-grab items-center justify-center text-foreground/30 active:cursor-grabbing hover:text-foreground/60"
                        >
                          <GripVertical className="size-3.5" />
                        </button>
                      ) : (
                        <span />
                      )}
                      <Link
                        href={href}
                        onClick={(e) => {
                          if (didDragRef.current) {
                            e.preventDefault()
                            didDragRef.current = false
                          }
                        }}
                        className="contents"
                      >
                        <span className="flex min-w-0 items-center gap-3 transition group-hover:opacity-80">
                          {node.type === "folder" ? (
                            <Folder className="size-4 shrink-0 text-foreground/45" />
                          ) : (
                            <FileText className="size-4 shrink-0 text-foreground/45" />
                          )}
                          <span className="truncate text-sm font-medium md:text-[15px]">
                            {node.name}
                          </span>
                        </span>
                        <span className="text-right font-mono text-[11px] text-foreground/40">
                          {formatNotesDate(node.createdAt)}
                        </span>
                        <span className="text-right font-mono text-[11px] text-foreground/40">
                          {formatNotesDate(node.updatedAt)}
                        </span>
                        <span className="hidden text-right font-mono text-[10px] tracking-[0.14em] text-foreground/35 uppercase md:block">
                          {node.type}
                        </span>
                      </Link>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>

      {menu && localEdit ? (
        <div
          ref={menuRef}
          className="fixed z-50 min-w-48 border border-foreground/15 bg-[#f7f7f2] py-1 shadow-lg"
          style={{ left: menu.x, top: menu.y }}
          role="menu"
        >
          <MenuItem
            icon={<FolderPlus className="size-3.5" />}
            label="New folder"
            onClick={() => createNode("folder")}
          />
          <MenuItem
            icon={<FilePlus className="size-3.5" />}
            label="New note"
            onClick={() => createNode("file")}
          />
          {menu.target ? (
            <>
              <div className="my-1 h-px bg-foreground/10" />
              <MenuItem
                icon={<Pencil className="size-3.5" />}
                label="Rename"
                onClick={renameTarget}
              />
              <MenuItem
                icon={<FolderInput className="size-3.5" />}
                label="Move to…"
                onClick={openMoveDialog}
              />
              <MenuItem
                icon={<Trash2 className="size-3.5" />}
                label="Delete"
                onClick={deleteTarget}
                danger
              />
            </>
          ) : null}
        </div>
      ) : null}

      <NotesMoveDialog
        open={Boolean(moveTarget)}
        onOpenChange={(open) => {
          if (!open) setMoveTarget(null)
        }}
        node={moveTarget}
        currentParentPathIds={pathIds}
        onMoved={onMoved}
      />
    </div>
  )
}

function MenuItem({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
  danger?: boolean
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition hover:bg-foreground/[0.05]",
        danger ? "text-foreground/70" : "text-foreground/80"
      )}
    >
      <span className="text-foreground/45">{icon}</span>
      {label}
    </button>
  )
}

function slugify(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48)
}
