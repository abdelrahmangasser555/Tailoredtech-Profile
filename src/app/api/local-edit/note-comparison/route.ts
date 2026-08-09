import { generateText } from "ai"
import { z } from "zod"
import { NextResponse } from "next/server"
import { isLocalEditEnabled } from "@/lib/local-edit"
import { getNoteById } from "@/lib/notes"
import { applyNoteEdit } from "@/lib/notes-chat/apply-edit"
import { buildNoteBlock } from "@/lib/notes-chat/build-block"
import { appendBlock } from "@/lib/notes-chat/section-blocks"
import { serializeNoteForContext } from "@/lib/notes-chat/serialize"
import { NOTES_CHAT_SUMMARY_MODEL } from "@/lib/notes-chat/models"
import { getOpenRouter } from "@/lib/openrouter"

type Body = {
  noteId: string
  sectionId: string
  prompt: string
  title?: string
}

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

export async function POST(request: Request) {
  if (!isLocalEditEnabled()) {
    return NextResponse.json(
      { error: "Local edit is disabled" },
      { status: 403 }
    )
  }

  let body: Body
  try {
    body = (await request.json()) as Body
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  if (!body?.noteId || !body?.sectionId || !body?.prompt?.trim()) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const note = getNoteById(body.noteId)
  if (!note) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 })
  }

  const section = note.sections.find((s) => s.id === body.sectionId)
  if (!section) {
    return NextResponse.json({ error: "Section not found" }, { status: 404 })
  }

  try {
    const openrouter = getOpenRouter()
    const sectionText = JSON.stringify(section, null, 2)

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
${body.title?.trim() ? `- Preferred title: ${body.title.trim()}` : ""}

NOTE:
${serializeNoteForContext(note)}

SECTION:
${sectionText}

REQUEST:
${body.prompt.trim()}`,
    })

    const cleaned = text
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim()
    const table = comparisonSchema.parse(JSON.parse(cleaned))

    const block = buildNoteBlock("comparison", {
      ...table,
      title: body.title?.trim() || table.title || "Comparison",
    })
    if (!block) {
      return NextResponse.json(
        { error: "Invalid comparison data from model" },
        { status: 500 }
      )
    }

    const sections = appendBlock(note, body.sectionId, block)
    const updated = await applyNoteEdit(body.noteId, { sections })
    return NextResponse.json({ ok: true, note: updated })
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Comparison generation failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
