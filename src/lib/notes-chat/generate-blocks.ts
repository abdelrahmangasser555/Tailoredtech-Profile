import { generateText } from "ai"
import { z } from "zod"
import { getOpenRouter } from "@/lib/openrouter"
import { NOTES_CHAT_SUMMARY_MODEL } from "@/lib/notes-chat/models"
import { buildNoteBlock } from "@/lib/notes-chat/build-block"
import {
  sanitizeMermaidSource,
  validateMermaidSource,
} from "@/lib/notes-chat/mermaid-validate"
import { appendNoteBlock } from "@/lib/notes-chat/note-mutations"
import { serializeNoteForContext } from "@/lib/notes-chat/serialize"
import { readFreshNote } from "@/lib/notes-chat/apply-edit"
import type { NoteBlock, NoteDocument, NoteSection } from "@/lib/notes-types"

const comparisonSchema = z.object({
  title: z.string().optional(),
  caption: z.string().optional(),
  rowHeader: z.string().optional(),
  columns: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        highlight: z.boolean().optional(),
      })
    )
    .min(1),
  rows: z
    .array(
      z.object({
        label: z.string(),
        cells: z.array(
          z.object({
            type: z.enum(["check", "x", "number", "text"]),
            value: z.union([z.boolean(), z.number(), z.string()]),
          })
        ),
      })
    )
    .min(1),
})

async function loadSection(noteId: string, sectionId: string): Promise<{
  note: NoteDocument
  section: NoteSection
}> {
  const note = await readFreshNote(noteId)
  if (!note) throw new Error("Note not found")
  const section = note.sections.find((s) => s.id === sectionId)
  if (!section) throw new Error("Section not found")
  return { note, section }
}

export async function generateMermaidSource(input: {
  note: NoteDocument
  section: NoteSection
  prompt: string
}): Promise<string> {
  const openrouter = getOpenRouter()
  const { text } = await generateText({
    model: openrouter(NOTES_CHAT_SUMMARY_MODEL),
    prompt: `You write Mermaid diagrams for a learning notes site.

Rules:
- Output ONLY the mermaid source. No markdown fences. No explanation.
- Prefer flowchart or sequenceDiagram.
- Use dashed links where possible (-.-> or -->>).
- Keep node labels short.
- Never put "|" inside node label brackets.
- Match the note and the CURRENT SECTION the user is editing.

NOTE CONTEXT:
${serializeNoteForContext(input.note)}

CURRENT SECTION JSON:
${JSON.stringify(input.section, null, 2)}

USER REQUEST:
${input.prompt.trim()}`,
  })

  const diagram = sanitizeMermaidSource(text)
  if (!diagram) throw new Error("Model returned an empty diagram")
  return diagram
}

export async function generateAndAppendMermaid(input: {
  noteId: string
  sectionId: string
  prompt: string
  title?: string
  caption?: string
}): Promise<{ note: NoteDocument; block: NoteBlock; diagram: string }> {
  const { note, section } = await loadSection(input.noteId, input.sectionId)
  const diagram = await generateMermaidSource({
    note,
    section,
    prompt: input.prompt,
  })
  const parseError = await validateMermaidSource(diagram)
  if (parseError) {
    throw new Error(`Mermaid parse error: ${parseError}`)
  }
  const block = buildNoteBlock("mermaid", {
    diagram,
    title: input.title?.trim() || "Diagram",
    caption: input.caption,
  })
  if (!block || block.type !== "mermaid") {
    throw new Error("Invalid mermaid diagram")
  }
  const result = await appendNoteBlock(input.noteId, input.sectionId, block, {
    source: "add-mermaid",
    name: "Added mermaid",
    note: input.title?.trim() || input.prompt.trim().slice(0, 80),
  })
  return { ...result, diagram }
}

export async function appendMermaidFromSource(input: {
  noteId: string
  sectionId: string
  diagram: string
  title?: string
  caption?: string
}): Promise<{ note: NoteDocument; block: NoteBlock }> {
  const diagram = sanitizeMermaidSource(input.diagram)
  const parseError = await validateMermaidSource(diagram)
  if (parseError) {
    throw new Error(`Mermaid parse error: ${parseError}`)
  }
  const block = buildNoteBlock("mermaid", {
    diagram,
    title: input.title,
    caption: input.caption,
  })
  if (!block || block.type !== "mermaid") {
    throw new Error("Invalid mermaid diagram")
  }
  return appendNoteBlock(input.noteId, input.sectionId, block, {
    source: "add-mermaid",
    name: "Added mermaid",
    note: input.title?.trim() || "Mermaid diagram",
  })
}

export async function generateMarkdownContent(input: {
  noteId: string
  sectionId: string
  prompt: string
  /** Existing markdown in the block being edited, so the model can extend/rewrite it */
  currentContent?: string
}): Promise<string> {
  const { note, section } = await loadSection(input.noteId, input.sectionId)
  const openrouter = getOpenRouter()
  const { text } = await generateText({
    model: openrouter(NOTES_CHAT_SUMMARY_MODEL),
    prompt: `You write Markdown content for ONE section of a learning notes site.

Rules:
- Output ONLY Markdown. No code fences around the whole answer, no preamble, no closing remarks.
- Use GitHub Flavored Markdown: headings (## / ###), **bold**, *italic*, lists (- and 1.), > blockquotes, tables, inline \`code\`, and fenced code blocks with a language tag.
- Keep it focused and concise. Match the note and the CURRENT SECTION the user is editing.
- Do NOT wrap the entire answer in backticks. Fenced code blocks are fine inside.
- Plain text paragraphs are fine when no formatting is needed.

NOTE CONTEXT:
${serializeNoteForContext(note)}

CURRENT SECTION JSON:
${JSON.stringify(section, null, 2)}

${input.currentContent?.trim() ? `EXISTING MARKDOWN IN THIS BLOCK (rewrite or extend it):\n${input.currentContent.trim()}\n` : ""}
USER REQUEST:
${input.prompt.trim()}`,
  })

  const cleaned = text
    .replace(/^\s*```(?:markdown|md)?\s*\n/i, "")
    .replace(/\n```\s*$/i, "")
    .trim()
  if (!cleaned) throw new Error("Model returned empty markdown")
  return cleaned
}

export async function generateAndAppendComparison(input: {
  noteId: string
  sectionId: string
  prompt: string
  title?: string
}): Promise<{ note: NoteDocument; block: NoteBlock }> {
  const { note, section } = await loadSection(input.noteId, input.sectionId)
  const openrouter = getOpenRouter()
  const { text } = await generateText({
    model: openrouter(NOTES_CHAT_SUMMARY_MODEL),
    prompt: `Return ONLY valid JSON for a comparison table (no markdown fences):
{
  "title": string,
  "caption"?: string,
  "rowHeader"?: string,
  "columns": [{ "id": string, "label": string, "highlight"?: boolean }],
  "rows": [{ "label": string, "cells": [{ "type": "check"|"x"|"number"|"text", "value": boolean|number|string }] }]
}

Rules:
- Prefer check / x cells for yes/no.
- Use number or text when a boolean does not fit.
- Keep column ids short kebab-case.
- Each row.cells length MUST equal columns length.
- 3–7 rows, 2–5 columns.
- Match the note and CURRENT SECTION.
${input.title?.trim() ? `- Preferred title: ${input.title.trim()}` : ""}

NOTE:
${serializeNoteForContext(note)}

SECTION:
${JSON.stringify(section, null, 2)}

REQUEST:
${input.prompt.trim()}`,
  })

  const cleaned = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim()
  const table = comparisonSchema.parse(JSON.parse(cleaned))
  const block = buildNoteBlock("comparison", {
    ...table,
    title: input.title?.trim() || table.title || "Comparison",
  })
  if (!block) throw new Error("Invalid comparison data from model")
  return appendNoteBlock(input.noteId, input.sectionId, block, {
    source: "add-comparison",
    name: "Added comparison",
    note: input.title?.trim() || input.prompt.trim().slice(0, 80),
  })
}
