import type { NoteTaskItem } from "@/lib/notes-types"

export type NoteTasksStore = Record<string, NoteTaskItem[]>

export function tasksStorageKey(noteId: string, blockId: string) {
  return `notes-tasks:${noteId}:${blockId}`
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

export function formatTaskDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d)
}

export function cloneTasks(items: NoteTaskItem[]): NoteTaskItem[] {
  return items.map((item) => ({
    ...item,
    children: item.children ? cloneTasks(item.children) : undefined,
  }))
}

export function toggleTaskDone(
  items: NoteTaskItem[],
  taskId: string,
  done: boolean
): NoteTaskItem[] {
  return items.map((item) => {
    if (item.id === taskId) {
      return {
        ...item,
        done,
        completedAt: done ? todayIso() : null,
        children: item.children,
      }
    }
    if (item.children?.length) {
      return {
        ...item,
        children: toggleTaskDone(item.children, taskId, done),
      }
    }
    return item
  })
}

export function updateTaskLabel(
  items: NoteTaskItem[],
  taskId: string,
  label: string
): NoteTaskItem[] {
  return items.map((item) => {
    if (item.id === taskId) return { ...item, label }
    if (item.children?.length) {
      return {
        ...item,
        children: updateTaskLabel(item.children, taskId, label),
      }
    }
    return item
  })
}

export function addTask(
  items: NoteTaskItem[],
  parentId: string | null,
  task: NoteTaskItem
): NoteTaskItem[] {
  if (!parentId) return [...items, task]
  return items.map((item) => {
    if (item.id === parentId) {
      return {
        ...item,
        children: [...(item.children ?? []), task],
      }
    }
    if (item.children?.length) {
      return {
        ...item,
        children: addTask(item.children, parentId, task),
      }
    }
    return item
  })
}

export function removeTask(
  items: NoteTaskItem[],
  taskId: string
): NoteTaskItem[] {
  return items
    .filter((item) => item.id !== taskId)
    .map((item) =>
      item.children
        ? { ...item, children: removeTask(item.children, taskId) }
        : item
    )
}

export function countTasks(items: NoteTaskItem[]): {
  total: number
  done: number
} {
  let total = 0
  let done = 0
  function walk(list: NoteTaskItem[]) {
    for (const item of list) {
      total += 1
      if (item.done) done += 1
      if (item.children?.length) walk(item.children)
    }
  }
  walk(items)
  return { total, done }
}

export function slugifyTaskId(label: string): string {
  const base = label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40)
  return `${base || "task"}-${Date.now().toString(36).slice(-4)}`
}
