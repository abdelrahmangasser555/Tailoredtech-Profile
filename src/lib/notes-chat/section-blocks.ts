import type { NoteBlock, NoteDocument, NoteSection } from "@/lib/notes-types"

export function newBlockId(prefix: string) {
  const stamp = Date.now().toString(36)
  const rand = Math.random().toString(36).slice(2, 6)
  return `${prefix}-${stamp}-${rand}`
}

export function ensureUniqueBlockId(
  block: NoteBlock,
  existingIds: Set<string>
): NoteBlock {
  if (!existingIds.has(block.id)) {
    existingIds.add(block.id)
    return block
  }
  let next = { ...block, id: newBlockId(block.type) }
  while (existingIds.has(next.id)) {
    next = { ...next, id: newBlockId(block.type) }
  }
  existingIds.add(next.id)
  return next
}

export function normalizeSectionBlockIds(section: NoteSection): NoteSection {
  const seenIds = new Set<string>()
  return {
    ...section,
    blocks: section.blocks.map((block) => ensureUniqueBlockId(block, seenIds)),
  }
}

export function mapSection(
  note: NoteDocument,
  sectionId: string,
  fn: (section: NoteSection) => NoteSection
): NoteSection[] {
  return note.sections.map((s) => (s.id === sectionId ? fn(s) : s))
}

export function appendBlock(
  note: NoteDocument,
  sectionId: string,
  block: NoteBlock
): NoteSection[] {
  return mapSection(note, sectionId, (section) => {
    const existingIds = new Set(section.blocks.map((b) => b.id))
    const unique = ensureUniqueBlockId(block, existingIds)
    return {
      ...section,
      blocks: [...section.blocks, unique],
    }
  })
}

export function removeBlocksOfType(
  note: NoteDocument,
  sectionId: string,
  type: NoteBlock["type"]
): NoteSection[] {
  return mapSection(note, sectionId, (section) => ({
    ...section,
    blocks: section.blocks.filter((b) => b.type !== type),
  }))
}

export function removeBlockById(
  note: NoteDocument,
  sectionId: string,
  blockId: string
): NoteSection[] {
  return mapSection(note, sectionId, (section) => ({
    ...section,
    blocks: section.blocks.filter((b) => b.id !== blockId),
  }))
}

export function updateBlock(
  note: NoteDocument,
  sectionId: string,
  blockId: string,
  patch: Partial<NoteBlock>
): NoteSection[] {
  return mapSection(note, sectionId, (section) => ({
    ...section,
    blocks: section.blocks.map((b) =>
      b.id === blockId ? ({ ...b, ...patch } as NoteBlock) : b
    ),
  }))
}
