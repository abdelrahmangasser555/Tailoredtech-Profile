/**
 * Client-side notes progress. Works in production without LOCAL_EDIT.
 * Keys are namespaced so other notes tools do not collide.
 */

export const NOTES_PROGRESS_STORAGE_KEY = "tt-notes-progress:v1"

export type NotesProgressLast = {
  noteId: string
  pathIds: string[]
  href: string
  title: string
  visitedAt: string
  progressRootId: string
}

export type NotesProgressStore = {
  version: 1
  last: NotesProgressLast | null
  lastByRoot: Record<string, NotesProgressLast>
  completed: Record<string, string>
}

export type NotesLearnerProgressPayload = {
  completedNoteIds: string[]
  lastNoteId?: string
  lastTitle?: string
  lastHref?: string
  completedCount: number
  totalCount?: number
}

const EMPTY: NotesProgressStore = {
  version: 1,
  last: null,
  lastByRoot: {},
  completed: {},
}

function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined"
}

export function readNotesProgress(): NotesProgressStore {
  if (!canUseStorage()) return EMPTY
  try {
    const raw = localStorage.getItem(NOTES_PROGRESS_STORAGE_KEY)
    if (!raw) return EMPTY
    const parsed = JSON.parse(raw) as Partial<NotesProgressStore>
    if (parsed.version !== 1) return EMPTY
    return {
      version: 1,
      last: parsed.last ?? null,
      lastByRoot: parsed.lastByRoot ?? {},
      completed: parsed.completed ?? {},
    }
  } catch {
    return EMPTY
  }
}

export function writeNotesProgress(store: NotesProgressStore) {
  if (!canUseStorage()) return
  localStorage.setItem(NOTES_PROGRESS_STORAGE_KEY, JSON.stringify(store))
}

export function recordNoteVisit(input: {
  noteId: string
  pathIds: string[]
  href: string
  title: string
  progressRootIds: string[]
}) {
  if (!input.progressRootIds.length) return
  const store = readNotesProgress()
  const visitedAt = new Date().toISOString()
  const primary = input.progressRootIds[input.progressRootIds.length - 1]!
  const last: NotesProgressLast = {
    noteId: input.noteId,
    pathIds: input.pathIds,
    href: input.href,
    title: input.title,
    visitedAt,
    progressRootId: primary,
  }
  store.last = last
  for (const rootId of input.progressRootIds) {
    store.lastByRoot[rootId] = { ...last, progressRootId: rootId }
  }
  writeNotesProgress(store)
  return store
}

export function setNoteCompleted(noteId: string, done: boolean) {
  const store = readNotesProgress()
  if (done) store.completed[noteId] = new Date().toISOString()
  else delete store.completed[noteId]
  writeNotesProgress(store)
  return store
}

export function isNoteCompleted(noteId: string, store = readNotesProgress()) {
  return Boolean(store.completed[noteId])
}

export function continueTarget(
  rootId: string,
  lessons: { id: string; name: string; href: string }[],
  store = readNotesProgress()
): { id: string; name: string; href: string; kind: "resume" | "next" | "start" } | null {
  if (!lessons.length) return null
  const last = store.lastByRoot[rootId]
  if (last) {
    const match = lessons.find((l) => l.id === last.noteId)
    if (match) {
      return { ...match, kind: "resume" }
    }
  }
  const next = lessons.find((l) => !store.completed[l.id])
  if (next) return { ...next, kind: store.completed[next.id] ? "start" : "next" }
  return { ...lessons[0]!, kind: "start" }
}

export function countCompleted(
  lessonIds: string[],
  store = readNotesProgress()
) {
  return lessonIds.filter((id) => store.completed[id]).length
}

export function learnerProgressPayload(
  rootId: string | null,
  totalCount?: number
): NotesLearnerProgressPayload {
  const store = readNotesProgress()
  const last = rootId ? store.lastByRoot[rootId] ?? store.last : store.last
  const completedNoteIds = Object.keys(store.completed)
  return {
    completedNoteIds,
    lastNoteId: last?.noteId,
    lastTitle: last?.title,
    lastHref: last?.href,
    completedCount: completedNoteIds.length,
    totalCount,
  }
}
