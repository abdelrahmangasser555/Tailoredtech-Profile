import type { NoteBlock, NoteDocument, NoteSection } from "@/lib/notes-types"
import { mutateNote, type NoteEditMeta } from "@/lib/notes-chat/apply-edit"
import { buildNoteBlock } from "@/lib/notes-chat/build-block"
import {
  appendBlock,
  removeBlockById,
  removeBlocksOfType,
  updateBlock,
} from "@/lib/notes-chat/section-blocks"
import { noteOutlinePayload } from "@/lib/notes-chat/serialize"

export function mergeSectionsById(
  existing: NoteSection[],
  incoming: NoteSection[]
): NoteSection[] {
  const byId = new Map(existing.map((s) => [s.id, s]))
  const order = existing.map((s) => s.id)
  for (const section of incoming) {
    const prev = byId.get(section.id)
    if (!prev) {
      order.push(section.id)
      byId.set(section.id, section)
      continue
    }
    const blockById = new Map(prev.blocks.map((b) => [b.id, b]))
    const blockOrder = prev.blocks.map((b) => b.id)
    for (const block of section.blocks) {
      if (!blockById.has(block.id)) blockOrder.push(block.id)
      blockById.set(block.id, block)
    }
    byId.set(section.id, {
      ...prev,
      ...section,
      blocks: blockOrder.map((id) => blockById.get(id)!).filter(Boolean),
    })
  }
  return order.map((id) => byId.get(id)!).filter(Boolean)
}

export async function appendNoteBlock(
  noteId: string,
  sectionId: string,
  block: NoteBlock,
  meta?: NoteEditMeta
): Promise<{ note: NoteDocument; block: NoteBlock }> {
  const note = await mutateNote(
    noteId,
    (fresh) => {
      const section = fresh.sections.find((s) => s.id === sectionId)
      if (!section) throw new Error(`Section ${sectionId} not found`)
      if (
        block.type === "tasks" &&
        section.blocks.some((b) => b.type === "tasks")
      ) {
        throw new Error("Section already has a checklist")
      }
      return { sections: appendBlock(fresh, sectionId, block) }
    },
    meta
  )
  return { note, block }
}

export async function appendTypedBlock(
  noteId: string,
  sectionId: string,
  type: NoteBlock["type"],
  data: Record<string, unknown>,
  meta?: NoteEditMeta
): Promise<{ note: NoteDocument; block: NoteBlock }> {
  const block = buildNoteBlock(type, data)
  if (!block) throw new Error(`Invalid ${type} block data`)
  return appendNoteBlock(noteId, sectionId, block, {
    source: meta?.source || `add-${type}`,
    name: meta?.name || `Added ${type}`,
    note: meta?.note || `Appended ${type} to ${sectionId}`,
  })
}

export async function patchNoteBlock(
  noteId: string,
  sectionId: string,
  blockId: string,
  patch: Partial<NoteBlock>,
  meta?: NoteEditMeta
): Promise<NoteDocument> {
  return mutateNote(
    noteId,
    (fresh) => {
      const section = fresh.sections.find((s) => s.id === sectionId)
      const existing = section?.blocks.find((b) => b.id === blockId)
      if (!existing) throw new Error("Block not found")
      return { sections: updateBlock(fresh, sectionId, blockId, patch) }
    },
    meta
  )
}

export async function removeNoteBlock(
  noteId: string,
  sectionId: string,
  blockId: string,
  meta?: NoteEditMeta
): Promise<NoteDocument> {
  return mutateNote(
    noteId,
    (fresh) => {
      const section = fresh.sections.find((s) => s.id === sectionId)
      if (!section?.blocks.some((b) => b.id === blockId)) {
        throw new Error("Block not found")
      }
      return { sections: removeBlockById(fresh, sectionId, blockId) }
    },
    meta
  )
}

export async function removeNoteBlocksOfType(
  noteId: string,
  sectionId: string,
  type: NoteBlock["type"],
  meta?: NoteEditMeta
): Promise<NoteDocument> {
  return mutateNote(
    noteId,
    (fresh) => ({
      sections: removeBlocksOfType(fresh, sectionId, type),
    }),
    meta
  )
}

export { noteOutlinePayload }
