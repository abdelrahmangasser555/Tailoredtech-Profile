import type { NoteBlock, NoteDocument, NoteSection } from "@/lib/notes-types"

export function newBlockId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}`
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
  return mapSection(note, sectionId, (section) => ({
    ...section,
    blocks: [...section.blocks, block],
  }))
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
