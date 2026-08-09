import { z } from "zod"
import { getNoteById } from "@/lib/notes"
import { applyNoteEdit } from "@/lib/notes-chat/apply-edit"
import {
  NOTE_BLOCK_TYPES,
  buildNoteBlock,
} from "@/lib/notes-chat/build-block"
import {
  sanitizeMermaidSource,
  validateMermaidSource,
} from "@/lib/notes-chat/mermaid-validate"
import { serializeNoteForContext, serializeNoteJson } from "@/lib/notes-chat/serialize"
import {
  appendBlock,
  removeBlockById,
  updateBlock,
} from "@/lib/notes-chat/section-blocks"
import type { NoteBlock, NoteDocument } from "@/lib/notes-types"
import type { StopCondition, ToolSet } from "ai"

type ToolOk = { ok: true; message: string }
type ToolFail = { ok: false; error: string }
type ToolResult = ToolOk | ToolFail

async function safeEdit(
  fn: () => Promise<ToolOk>
): Promise<ToolResult> {
  try {
    return await fn()
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Edit failed",
    }
  }
}

const comparisonCellSchema = z.object({
  type: z.enum(["check", "x", "number", "text"]),
  value: z.union([z.boolean(), z.number(), z.string()]),
})

export function createNotesEditTools(noteId: string) {
  return {
    readNote: {
      description:
        "Re-read the current note (or one section) after edits. Use between tool calls to decide where the next block should go.",
      inputSchema: z.object({
        sectionId: z
          .string()
          .optional()
          .describe("If set, return only this section"),
        format: z
          .enum(["summary", "json"])
          .optional()
          .describe("summary = compact text, json = full structure"),
      }),
      execute: async (input: {
        sectionId?: string
        format?: "summary" | "json"
      }) => {
        const fresh = getNoteById(noteId)
        if (!fresh) return { ok: false as const, error: "Note not found" }
        if (input.sectionId) {
          const section = fresh.sections.find((s) => s.id === input.sectionId)
          if (!section) {
            return { ok: false as const, error: `Section ${input.sectionId} not found` }
          }
          return {
            ok: true as const,
            message: `Section ${section.title}`,
            section:
              input.format === "json"
                ? section
                : {
                    id: section.id,
                    title: section.title,
                    blockTypes: section.blocks.map((b) => `${b.type}:${b.id}`),
                  },
          }
        }
        return {
          ok: true as const,
          message: "Note loaded",
          note:
            input.format === "json"
              ? JSON.parse(serializeNoteJson(fresh))
              : {
                  id: fresh.id,
                  title: fresh.title,
                  sections: fresh.sections.map((s) => ({
                    id: s.id,
                    title: s.title,
                    blocks: s.blocks.map((b) => ({
                      type: b.type,
                      id: b.id,
                      title:
                        "title" in b && typeof b.title === "string"
                          ? b.title
                          : undefined,
                    })),
                  })),
                  preview: serializeNoteForContext(fresh).slice(0, 6000),
                },
        }
      },
    },

    updateNote: {
      description:
        "Rewrite or patch the open note (title/sections/blocks). Use for broad multi-block edits. Prefer specialized add* tools for a single new block.",
      inputSchema: z.object({
        title: z.string().optional(),
        name: z.string().optional(),
        description: z.string().optional(),
        sections: z.array(
          z.object({
            id: z.string(),
            title: z.string(),
            blocks: z.array(z.record(z.string(), z.unknown())),
            questionnaireId: z.string().nullable().optional(),
          })
        ),
      }),
      execute: async (input: {
        title?: string
        name?: string
        description?: string
        sections: NoteDocument["sections"]
      }) =>
        safeEdit(async () => {
          await applyNoteEdit(noteId, input)
          return { ok: true, message: "Note updated" }
        }),
    },

    addBlock: {
      description:
        "Append ANY supported block type to a section. Use when no specialized tool fits. Types: markdown, youtube, stack, mermaid, illustration, html, link, callout, gallery, terminal, playground, tasks, comparison.",
      inputSchema: z.object({
        sectionId: z.string(),
        type: z.enum([
          "markdown",
          "youtube",
          "stack",
          "mermaid",
          "illustration",
          "html",
          "link",
          "callout",
          "gallery",
          "terminal",
          "playground",
          "tasks",
          "comparison",
        ]),
        data: z
          .record(z.string(), z.unknown())
          .describe("Block fields for the chosen type (without id)"),
      }),
      execute: async (input: {
        sectionId: string
        type: NoteBlock["type"]
        data: Record<string, unknown>
      }) => {
        if (input.type === "mermaid") {
          const diagram = sanitizeMermaidSource(
            String(input.data.diagram ?? "")
          )
          const parseError = await validateMermaidSource(diagram)
          if (parseError) {
            return {
              ok: false as const,
              error: `Mermaid parse error: ${parseError}`,
              hint: "Fix once, then replaceBlockWithMarkdown if it still fails. Avoid | inside node labels.",
            }
          }
          input = { ...input, data: { ...input.data, diagram } }
        }
        return safeEdit(async () => {
          const fresh = getNoteById(noteId)
          if (!fresh) throw new Error("Note not found")
          const block = buildNoteBlock(input.type, input.data)
          if (!block) throw new Error(`Invalid ${input.type} block data`)
          if (
            block.type === "tasks" &&
            fresh.sections
              .find((s) => s.id === input.sectionId)
              ?.blocks.some((b) => b.type === "tasks")
          ) {
            throw new Error("Section already has a checklist")
          }
          const sections = appendBlock(fresh, input.sectionId, block)
          await applyNoteEdit(noteId, { sections })
          return { ok: true, message: `Added ${input.type} block` }
        })
      },
    },

    addMermaidBlock: {
      description:
        "Append a mermaid diagram block. Prefer this for flows/sequences over ASCII. Avoid | inside node labels — use <br/> or short text. Diagram is validated before save.",
      inputSchema: z.object({
        sectionId: z.string(),
        title: z.string().optional(),
        caption: z.string().optional(),
        diagram: z.string().describe("Raw mermaid source only, no fences"),
      }),
      execute: async (input: {
        sectionId: string
        title?: string
        caption?: string
        diagram: string
      }) => {
        const diagram = sanitizeMermaidSource(input.diagram)
        const parseError = await validateMermaidSource(diagram)
        if (parseError) {
          return {
            ok: false as const,
            error: `Mermaid parse error: ${parseError}`,
            hint: "Fix the diagram once (no PIPE in node labels like [~6 months | $60K] — use short labels). If the second attempt still fails, call replaceBlockWithMarkdown instead of retrying again.",
          }
        }
        return safeEdit(async () => {
          const fresh = getNoteById(noteId)
          if (!fresh) throw new Error("Note not found")
          const block = buildNoteBlock("mermaid", { ...input, diagram })
          if (!block || block.type !== "mermaid") {
            throw new Error("Invalid mermaid diagram")
          }
          const sections = appendBlock(fresh, input.sectionId, block)
          await applyNoteEdit(noteId, { sections })
          return {
            ok: true,
            message: "Mermaid block added",
            blockId: block.id,
            sectionId: input.sectionId,
          }
        })
      },
    },

    updateMermaidBlock: {
      description:
        "Fix an existing mermaid block after a parse error. Call at most once per block. If validation still fails, use replaceBlockWithMarkdown.",
      inputSchema: z.object({
        sectionId: z.string(),
        blockId: z.string(),
        diagram: z.string(),
        title: z.string().optional(),
        caption: z.string().optional(),
      }),
      execute: async (input: {
        sectionId: string
        blockId: string
        diagram: string
        title?: string
        caption?: string
      }) => {
        const diagram = sanitizeMermaidSource(input.diagram)
        const parseError = await validateMermaidSource(diagram)
        if (parseError) {
          return {
            ok: false as const,
            error: `Mermaid still invalid: ${parseError}`,
            hint: "Do not retry updateMermaidBlock. Call replaceBlockWithMarkdown with a text explanation of the flow instead.",
            blockId: input.blockId,
            sectionId: input.sectionId,
          }
        }
        return safeEdit(async () => {
          const fresh = getNoteById(noteId)
          if (!fresh) throw new Error("Note not found")
          const section = fresh.sections.find((s) => s.id === input.sectionId)
          const existing = section?.blocks.find((b) => b.id === input.blockId)
          if (!existing || existing.type !== "mermaid") {
            throw new Error("Mermaid block not found")
          }
          const sections = updateBlock(fresh, input.sectionId, input.blockId, {
            diagram,
            title: input.title ?? existing.title,
            caption: input.caption ?? existing.caption,
          })
          await applyNoteEdit(noteId, { sections })
          return { ok: true, message: "Mermaid block fixed" }
        })
      },
    },

    replaceBlockWithMarkdown: {
      description:
        "Remove a broken block (usually mermaid) and replace it with markdown text. Use after one failed mermaid fix.",
      inputSchema: z.object({
        sectionId: z.string(),
        blockId: z.string(),
        content: z
          .string()
          .describe("Markdown that replaces the removed block"),
      }),
      execute: async (input: {
        sectionId: string
        blockId: string
        content: string
      }) =>
        safeEdit(async () => {
          const fresh = getNoteById(noteId)
          if (!fresh) throw new Error("Note not found")
          const section = fresh.sections.find((s) => s.id === input.sectionId)
          if (!section?.blocks.some((b) => b.id === input.blockId)) {
            throw new Error("Block not found")
          }
          let sections = removeBlockById(fresh, input.sectionId, input.blockId)
          const md = buildNoteBlock("markdown", { content: input.content })
          if (!md) throw new Error("Empty markdown replacement")
          const noteAfterRemove = { ...fresh, sections }
          sections = appendBlock(noteAfterRemove, input.sectionId, md)
          await applyNoteEdit(noteId, { sections })
          return {
            ok: true,
            message: "Replaced broken block with markdown",
          }
        }),
    },

    addStackBlock: {
      description:
        "Append a tech-stack / layered architecture visual block.",
      inputSchema: z.object({
        sectionId: z.string(),
        title: z.string().optional(),
        caption: z.string().optional(),
        direction: z.enum(["vertical", "horizontal"]).optional(),
        layers: z.array(
          z.object({
            id: z.string(),
            label: z.string(),
            items: z.array(
              z.object({
                icon: z.string(),
                label: z.string(),
              })
            ),
          })
        ),
        edges: z
          .array(
            z.object({
              from: z.string(),
              to: z.string(),
              label: z.string().optional(),
            })
          )
          .optional(),
      }),
      execute: async (input: {
        sectionId: string
        title?: string
        caption?: string
        direction?: "vertical" | "horizontal"
        layers: {
          id: string
          label: string
          items: { icon: string; label: string }[]
        }[]
        edges?: { from: string; to: string; label?: string }[]
      }) =>
        safeEdit(async () => {
          const fresh = getNoteById(noteId)
          if (!fresh) throw new Error("Note not found")
          const block = buildNoteBlock("stack", {
            ...input,
            direction: input.direction ?? "vertical",
          })
          if (!block) throw new Error("Invalid stack block")
          const sections = appendBlock(fresh, input.sectionId, block)
          await applyNoteEdit(noteId, { sections })
          return { ok: true, message: "Stack block added" }
        }),
    },

    addComparisonBlock: {
      description:
        "Append a comparison table (check/x/number/text cells). Prefer this over markdown tables.",
      inputSchema: z.object({
        sectionId: z.string(),
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
              cells: z.array(comparisonCellSchema),
            })
          )
          .min(1),
      }),
      execute: async (input: {
        sectionId: string
        title?: string
        caption?: string
        rowHeader?: string
        columns: { id: string; label: string; highlight?: boolean }[]
        rows: {
          label: string
          cells: { type: "check" | "x" | "number" | "text"; value: string | number | boolean }[]
        }[]
      }) =>
        safeEdit(async () => {
          const fresh = getNoteById(noteId)
          if (!fresh) throw new Error("Note not found")
          const block = buildNoteBlock("comparison", input)
          if (!block) throw new Error("Invalid comparison table")
          const sections = appendBlock(fresh, input.sectionId, block)
          await applyNoteEdit(noteId, { sections })
          return { ok: true, message: "Comparison table added" }
        }),
    },

    addMarkdownBlock: {
      description: "Append a markdown content block to a section.",
      inputSchema: z.object({
        sectionId: z.string(),
        content: z.string(),
      }),
      execute: async (input: { sectionId: string; content: string }) =>
        safeEdit(async () => {
          const fresh = getNoteById(noteId)
          if (!fresh) throw new Error("Note not found")
          const block = buildNoteBlock("markdown", input)
          if (!block) throw new Error("Empty markdown")
          const sections = appendBlock(fresh, input.sectionId, block)
          await applyNoteEdit(noteId, { sections })
          return { ok: true, message: "Markdown block added" }
        }),
    },

    addCalloutBlock: {
      description: "Append an info/tip/warn callout block.",
      inputSchema: z.object({
        sectionId: z.string(),
        tone: z.enum(["info", "tip", "warn"]).optional(),
        title: z.string().optional(),
        body: z.string(),
      }),
      execute: async (input: {
        sectionId: string
        tone?: "info" | "tip" | "warn"
        title?: string
        body: string
      }) =>
        safeEdit(async () => {
          const fresh = getNoteById(noteId)
          if (!fresh) throw new Error("Note not found")
          const block = buildNoteBlock("callout", input)
          if (!block) throw new Error("Invalid callout")
          const sections = appendBlock(fresh, input.sectionId, block)
          await applyNoteEdit(noteId, { sections })
          return { ok: true, message: "Callout added" }
        }),
    },
  }
}

function stepFailed(step: {
  content: Array<{ type: string }>
  toolResults: Array<{ output?: unknown; type?: string }>
  toolCalls: Array<unknown>
}): boolean {
  const hardError = step.content.some((c) => c.type === "tool-error")
  if (hardError) return true

  if (step.toolCalls.length > 0 && step.toolResults.length === 0) {
    return true
  }

  if (step.toolResults.length === 0) return false

  return step.toolResults.every((r) => {
    const out = r.output as { ok?: boolean } | undefined
    return out?.ok === false
  })
}

/** Stop after N consecutive failed edit steps to avoid infinite retry loops */
export function consecutiveEditFailures(
  maxFailures = 3
): StopCondition<ToolSet> {
  return ({ steps }) => {
    if (steps.length < maxFailures) return false
    const last = steps.slice(-maxFailures)
    return last.every(stepFailed)
  }
}

export const EDIT_MODE_SYSTEM_RULES = `
EDIT MODE RULES (agentic — multi-step):
- You may call MULTIPLE tools in one turn and across several steps. Plan → act → readNote → adjust.
- Typical loop: readNote → add blocks → readNote → fix placement/content → brief reply.
- Comparison matrices: ALWAYS use addComparisonBlock (never markdown tables).
- Architecture / tech stacks: ALWAYS use addStackBlock.
- Flows / sequences: ALWAYS use addMermaidBlock. Never put "|" inside node label brackets (breaks Mermaid). Prefer short labels and dashed links -.-> / -->>.
- Mermaid errors: if addMermaidBlock/updateMermaidBlock returns a parse error, fix ONCE with updateMermaidBlock. If it still fails, call replaceBlockWithMarkdown (do not loop).
- Simple prose: addMarkdownBlock or updateNote.
- Tips/warnings: addCalloutBlock.
- Catch-all: addBlock with the correct type + data.
- Prefer the ACTIVE SECTION when adding blocks.
- If a tool returns { ok: false }, fix once. After repeated soft failures the loop stops — explain and stop.
- Valid block types: ${NOTE_BLOCK_TYPES.join(", ")}.
`
