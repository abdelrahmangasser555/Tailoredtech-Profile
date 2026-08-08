"use client"

import { useCallback, useEffect, useState } from "react"
import { Check, ChevronRight, Plus, Trash2 } from "lucide-react"
import type { NoteTaskItem } from "@/lib/notes-types"
import {
  addTask,
  cloneTasks,
  countTasks,
  formatTaskDate,
  removeTask,
  slugifyTaskId,
  tasksStorageKey,
  toggleTaskDone,
  updateTaskLabel,
} from "@/lib/notes-chat/tasks"
import { isLocalEditEnabled } from "@/lib/local-edit"
import { cn } from "@/lib/utils"

type NoteTasksProps = {
  noteId: string
  blockId: string
  title?: string
  items: NoteTaskItem[]
  /** When true (note-level checklist), also write items into note-overrides.json */
  syncNoteChecklist?: boolean
}

function loadFromLocalStorage(
  noteId: string,
  blockId: string
): NoteTaskItem[] | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(tasksStorageKey(noteId, blockId))
    if (!raw) return null
    return JSON.parse(raw) as NoteTaskItem[]
  } catch {
    return null
  }
}

function saveToLocalStorage(
  noteId: string,
  blockId: string,
  items: NoteTaskItem[]
) {
  if (typeof window === "undefined") return
  localStorage.setItem(tasksStorageKey(noteId, blockId), JSON.stringify(items))
}

export function NoteTasks({
  noteId,
  blockId,
  title,
  items,
  syncNoteChecklist,
}: NoteTasksProps) {
  const localEdit = isLocalEditEnabled()
  const [tasks, setTasks] = useState<NoteTaskItem[]>(() => cloneTasks(items))
  const [hydrated, setHydrated] = useState(false)
  const [addingUnder, setAddingUnder] = useState<string | null | "root">(null)
  const [draft, setDraft] = useState("")

  useEffect(() => {
    let cancelled = false

    async function hydrate() {
      let next = loadFromLocalStorage(noteId, blockId)

      if (localEdit) {
        try {
          const res = await fetch(
            `/api/local-edit/note-tasks?noteId=${encodeURIComponent(noteId)}&blockId=${encodeURIComponent(blockId)}`
          )
          const data = (await res.json()) as { items: NoteTaskItem[] | null }
          if (data.items) next = data.items
        } catch {
          // keep localStorage / seed
        }
      }

      if (!cancelled) {
        setTasks(next ?? cloneTasks(items))
        setHydrated(true)
      }
    }

    void hydrate()
    return () => {
      cancelled = true
    }
  }, [noteId, blockId, items, localEdit])

  const persist = useCallback(
    async (next: NoteTaskItem[]) => {
      setTasks(next)
      saveToLocalStorage(noteId, blockId, next)

      if (localEdit) {
        try {
          await fetch("/api/local-edit/note-tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ noteId, blockId, items: next }),
          })
          if (syncNoteChecklist) {
            await fetch("/api/local-edit/note-checklist", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                noteId,
                checklist: { title: title ?? "Checklist", items: next },
              }),
            })
          }
        } catch {
          // localStorage still holds state
        }
      }
    },
    [noteId, blockId, localEdit, syncNoteChecklist, title]
  )

  function onToggle(taskId: string, done: boolean) {
    void persist(toggleTaskDone(tasks, taskId, done))
  }

  function onRename(taskId: string, label: string) {
    if (!localEdit) return
    const trimmed = label.trim()
    if (!trimmed) return
    void persist(updateTaskLabel(tasks, taskId, trimmed))
  }

  function onRemove(taskId: string) {
    if (!localEdit) return
    void persist(removeTask(tasks, taskId))
  }

  function commitAdd(parentId: string | null) {
    const label = draft.trim()
    if (!label) {
      setAddingUnder(null)
      setDraft("")
      return
    }
    const task: NoteTaskItem = {
      id: slugifyTaskId(label),
      label,
      done: false,
      completedAt: null,
      children: [],
    }
    void persist(addTask(tasks, parentId, task))
    setDraft("")
    setAddingUnder(null)
  }

  const { total, done } = countTasks(tasks)

  return (
    <div className="mt-6 first:mt-0 border border-white/10 bg-white/[0.02]">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div>
          {title ? (
            <h3 className="font-pixel-circle text-lg text-white md:text-xl">
              {title}
            </h3>
          ) : (
            <h3 className="font-mono text-[10px] tracking-[0.18em] text-white/40 uppercase">
              Tasks
            </h3>
          )}
          <p className="mt-1 font-mono text-[10px] tracking-wide text-white/30">
            {hydrated ? `${done} / ${total} done` : "…"}
          </p>
        </div>
        {localEdit ? (
          <button
            type="button"
            onClick={() => {
              setAddingUnder("root")
              setDraft("")
            }}
            className="inline-flex items-center gap-1.5 border border-white/15 px-2.5 py-1.5 font-mono text-[10px] tracking-wider text-white/55 uppercase transition hover:border-accent/40 hover:text-accent"
          >
            <Plus className="size-3" />
            Add task
          </button>
        ) : null}
      </div>

      <ul className="px-2 py-2 md:px-3">
        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            depth={0}
            localEdit={localEdit}
            addingUnder={addingUnder}
            draft={draft}
            onDraftChange={setDraft}
            onStartAdd={(id) => {
              setAddingUnder(id)
              setDraft("")
            }}
            onCancelAdd={() => {
              setAddingUnder(null)
              setDraft("")
            }}
            onCommitAdd={commitAdd}
            onToggle={onToggle}
            onRename={onRename}
            onRemove={onRemove}
          />
        ))}

        {addingUnder === "root" ? (
          <li className="px-2 py-1.5">
            <AddTaskInput
              draft={draft}
              onDraftChange={setDraft}
              onCommit={() => commitAdd(null)}
              onCancel={() => {
                setAddingUnder(null)
                setDraft("")
              }}
              placeholder="New task…"
            />
          </li>
        ) : null}

        {tasks.length === 0 && addingUnder !== "root" ? (
          <li className="px-3 py-6 text-center text-xs text-white/30">
            No tasks yet
            {localEdit ? " — add one to get started." : "."}
          </li>
        ) : null}
      </ul>
    </div>
  )
}

function TaskRow({
  task,
  depth,
  localEdit,
  addingUnder,
  draft,
  onDraftChange,
  onStartAdd,
  onCancelAdd,
  onCommitAdd,
  onToggle,
  onRename,
  onRemove,
}: {
  task: NoteTaskItem
  depth: number
  localEdit: boolean
  addingUnder: string | null | "root"
  draft: string
  onDraftChange: (v: string) => void
  onStartAdd: (id: string) => void
  onCancelAdd: () => void
  onCommitAdd: (parentId: string | null) => void
  onToggle: (id: string, done: boolean) => void
  onRename: (id: string, label: string) => void
  onRemove: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(true)
  const hasChildren = Boolean(task.children?.length)
  const padding = 8 + depth * 16

  return (
    <li>
      <div
        className="group flex items-start gap-2 py-1.5 pr-1"
        style={{ paddingLeft: padding }}
      >
        {hasChildren || localEdit ? (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className={cn(
              "mt-1 shrink-0 text-white/25 transition hover:text-white/55",
              !hasChildren && "opacity-0 group-hover:opacity-40"
            )}
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            <ChevronRight
              className={cn(
                "size-3.5 transition-transform",
                expanded && "rotate-90"
              )}
            />
          </button>
        ) : (
          <span className="mt-1 size-3.5 shrink-0" />
        )}

        <button
          type="button"
          onClick={() => onToggle(task.id, !task.done)}
          aria-pressed={Boolean(task.done)}
          aria-label={task.done ? "Mark incomplete" : "Mark complete"}
          className={cn(
            "mt-0.5 flex size-4 shrink-0 items-center justify-center border transition",
            task.done
              ? "border-accent bg-accent text-[#0a0a0a]"
              : "border-white/30 hover:border-accent/60"
          )}
        >
          {task.done ? <Check className="size-2.5 stroke-[3]" /> : null}
        </button>

        <div className="min-w-0 flex-1">
          {localEdit ? (
            <input
              defaultValue={task.label}
              key={`${task.id}-${task.label}`}
              onBlur={(e) => {
                if (e.target.value.trim() !== task.label) {
                  onRename(task.id, e.target.value)
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") (e.target as HTMLInputElement).blur()
              }}
              className={cn(
                "w-full bg-transparent text-[13px] leading-snug text-white/85 outline-none",
                task.done && "text-white/35 line-through"
              )}
            />
          ) : (
            <p
              className={cn(
                "text-[13px] leading-snug text-white/85",
                task.done && "text-white/35 line-through"
              )}
            >
              {task.label}
            </p>
          )}
          {task.done && task.completedAt ? (
            <p className="mt-0.5 font-mono text-[9px] tracking-wide text-white/25">
              Done {formatTaskDate(task.completedAt)}
            </p>
          ) : null}
        </div>

        {localEdit ? (
          <div className="flex shrink-0 opacity-0 transition group-hover:opacity-100 focus-within:opacity-100">
            <button
              type="button"
              onClick={() => onStartAdd(task.id)}
              className="p-1 text-white/30 hover:text-accent"
              aria-label="Add subtask"
              title="Add subtask"
            >
              <Plus className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onRemove(task.id)}
              className="p-1 text-white/30 hover:text-white/70"
              aria-label="Delete task"
              title="Delete"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ) : null}
      </div>

      {expanded ? (
        <ul>
          {task.children?.map((child) => (
            <TaskRow
              key={child.id}
              task={child}
              depth={depth + 1}
              localEdit={localEdit}
              addingUnder={addingUnder}
              draft={draft}
              onDraftChange={onDraftChange}
              onStartAdd={onStartAdd}
              onCancelAdd={onCancelAdd}
              onCommitAdd={onCommitAdd}
              onToggle={onToggle}
              onRename={onRename}
              onRemove={onRemove}
            />
          ))}
          {addingUnder === task.id ? (
            <li style={{ paddingLeft: padding + 28 }} className="py-1.5 pr-2">
              <AddTaskInput
                draft={draft}
                onDraftChange={onDraftChange}
                onCommit={() => onCommitAdd(task.id)}
                onCancel={onCancelAdd}
                placeholder="Subtask…"
              />
            </li>
          ) : null}
        </ul>
      ) : null}
    </li>
  )
}

function AddTaskInput({
  draft,
  onDraftChange,
  onCommit,
  onCancel,
  placeholder,
}: {
  draft: string
  onDraftChange: (v: string) => void
  onCommit: () => void
  onCancel: () => void
  placeholder: string
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        autoFocus
        value={draft}
        onChange={(e) => onDraftChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onCommit()
          if (e.key === "Escape") onCancel()
        }}
        placeholder={placeholder}
        className="min-w-0 flex-1 border border-white/15 bg-black/40 px-2.5 py-1.5 text-[13px] text-white placeholder:text-white/30 focus:border-accent/40 focus:outline-none"
      />
      <button
        type="button"
        onClick={onCommit}
        className="border border-accent/40 bg-accent px-2 py-1.5 font-mono text-[9px] tracking-wider text-[#0a0a0a] uppercase"
      >
        Add
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="border border-white/15 px-2 py-1.5 font-mono text-[9px] tracking-wider text-white/45 uppercase"
      >
        Esc
      </button>
    </div>
  )
}
