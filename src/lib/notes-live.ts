import type { NoteDocument } from "@/lib/notes-types"

export const NOTES_LIVE_EVENT = "notes:live-update"

export function publishNoteUpdate(note: NoteDocument) {
  if (typeof window === "undefined") return
  window.dispatchEvent(
    new CustomEvent<NoteDocument>(NOTES_LIVE_EVENT, { detail: note })
  )
}

export function publishNoteFromPayload(data: unknown): boolean {
  if (!data || typeof data !== "object" || !("note" in data)) return false
  const note = (data as { note?: NoteDocument }).note
  if (!note?.id || !Array.isArray(note.sections)) return false
  publishNoteUpdate(note)
  return true
}

export async function fetchAndPublishNote(noteId: string): Promise<NoteDocument> {
  const res = await fetch(
    `/api/local-edit/note?noteId=${encodeURIComponent(noteId)}`
  )
  const data = (await res.json().catch(() => null)) as {
    note?: NoteDocument
    error?: string
  } | null
  if (!res.ok || !data?.note) {
    throw new Error(data?.error || "Failed to reload note")
  }
  publishNoteUpdate(data.note)
  return data.note
}

export function subscribeNoteUpdates(
  noteId: string,
  onUpdate: (note: NoteDocument) => void
): () => void {
  if (typeof window === "undefined") return () => undefined
  const handler = (event: Event) => {
    const note = (event as CustomEvent<NoteDocument>).detail
    if (note?.id === noteId) onUpdate(note)
  }
  window.addEventListener(NOTES_LIVE_EVENT, handler)
  return () => window.removeEventListener(NOTES_LIVE_EVENT, handler)
}
