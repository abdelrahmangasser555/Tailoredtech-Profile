import { z } from "zod"
import { mutateNote, readFreshNote } from "@/lib/notes-chat/apply-edit"
import { buildNoteBlock } from "@/lib/notes-chat/build-block"
import {
  generateAndAppendComparison,
  generateAndAppendMermaid,
  appendMermaidFromSource,
} from "@/lib/notes-chat/generate-blocks"
import {
  appendTypedBlock,
  mergeSectionsById,
  noteOutlinePayload,
  patchNoteBlock,
} from "@/lib/notes-chat/note-mutations"
import {
  sanitizeMermaidSource,
  validateMermaidSource,
} from "@/lib/notes-chat/mermaid-validate"
import { serializeNoteForContext, serializeNoteJson } from "@/lib/notes-chat/serialize"
import { appendBlock, normalizeSectionBlockIds } from "@/lib/notes-chat/section-blocks"
import type { NoteBlock, NoteDocument, NoteSection } from "@/lib/notes-types"
import type { StopCondition, ToolSet } from "ai"

type ToolOk = {
  ok: true
  message: string
  outline?: unknown
  blockId?: string
  sectionId?: string
}
type ToolFail = { ok: false; error: string; hint?: string }
type ToolResult = ToolOk | ToolFail

async function safeEdit(fn: () => Promise<ToolOk>): Promise<ToolResult> {
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

function asSections(
  raw: Array<{
    id: string
    title: string
    blocks: Record<string, unknown>[]
    questionnaireId?: string | null
  }>
): NoteSection[] {
  return raw.map((s) => ({
    id: s.id,
    title: s.title,
    questionnaireId: s.questionnaireId,
    blocks: s.blocks as unknown as NoteBlock[],
  }))
}

export function createNotesEditTools(noteId: string) {
  return {
    readNote: {
      description: "Load live note or one section.",
      inputSchema: z.object({
        sectionId: z.string().optional(),
        format: z.enum(["summary", "json"]).optional(),
      }),
      execute: async (input: {
        sectionId?: string
        format?: "summary" | "json"
      }) => {
        const fresh = await readFreshNote(noteId)
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
                  ...noteOutlinePayload(fresh),
                  preview: serializeNoteForContext(fresh).slice(0, 6000),
                },
        }
      },
    },

    addSection: {
      description: "Add a section.",
      inputSchema: z.object({
        id: z.string().describe("kebab-case section id"),
        title: z.string(),
        afterSectionId: z
          .string()
          .optional()
          .describe("Insert after this section; omit to append at end"),
      }),
      execute: async (input: {
        id: string
        title: string
        afterSectionId?: string
      }) =>
        safeEdit(async () => {
          const note = await mutateNote(
            noteId,
            (fresh) => {
              if (fresh.sections.some((s) => s.id === input.id)) {
                throw new Error(`Section ${input.id} already exists`)
              }
              const next: NoteSection = {
                id: input.id,
                title: input.title,
                blocks: [],
              }
              const sections = [...fresh.sections]
              const idx = input.afterSectionId
                ? sections.findIndex((s) => s.id === input.afterSectionId)
                : -1
              if (idx >= 0) sections.splice(idx + 1, 0, next)
              else sections.push(next)
              return { sections }
            },
            {
              source: "add-section",
              name: "Added section",
              note: input.title,
            }
          )
          return {
            ok: true,
            message: `Section ${input.id} added`,
            outline: noteOutlinePayload(note),
          }
        }),
    },

    updateNote: {
      description: "Patch fields or merge sections by id.",
      inputSchema: z.object({
        title: z.string().optional(),
        name: z.string().optional(),
        description: z.string().optional(),
        sections: z
          .array(
            z.object({
              id: z.string(),
              title: z.string(),
              blocks: z.array(z.record(z.string(), z.unknown())),
              questionnaireId: z.string().nullable().optional(),
            })
          )
          .optional(),
        replaceAll: z
          .boolean()
          .optional()
          .describe("If true, replace the entire sections list. Default false (merge by id)."),
      }),
      execute: async (input: {
        title?: string
        name?: string
        description?: string
        sections?: Array<{
          id: string
          title: string
          blocks: Record<string, unknown>[]
          questionnaireId?: string | null
        }>
        replaceAll?: boolean
      }) =>
        safeEdit(async () => {
          const note = await mutateNote(
            noteId,
            (fresh) => {
              const update: Partial<NoteDocument> = {}
              if (input.title !== undefined) update.title = input.title
              if (input.name !== undefined) update.name = input.name
              if (input.description !== undefined) {
                update.description = input.description
              }
              if (input.sections) {
                const incoming = asSections(input.sections)
                update.sections = input.replaceAll
                  ? incoming.map(normalizeSectionBlockIds)
                  : mergeSectionsById(fresh.sections, incoming)
              }
              return update
            },
            {
              source: "update-note",
              name: input.replaceAll ? "Replaced note" : "Updated note",
              note: input.title || "Patched note fields / sections",
            }
          )
          return {
            ok: true,
            message: "Note updated",
            outline: noteOutlinePayload(note),
          }
        }),
    },

    addBlock: {
      description: "Append a typed block.",
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
        data: z.record(z.string(), z.unknown()),
      }),
      execute: async (input: {
        sectionId: string
        type: NoteBlock["type"]
        data: Record<string, unknown>
      }) => {
        if (input.type === "mermaid") {
          return safeEdit(async () => {
            const result = await appendMermaidFromSource({
              noteId,
              sectionId: input.sectionId,
              diagram: String(input.data.diagram ?? ""),
              title:
                typeof input.data.title === "string"
                  ? input.data.title
                  : undefined,
              caption:
                typeof input.data.caption === "string"
                  ? input.data.caption
                  : undefined,
            })
            return {
              ok: true,
              message: "Added mermaid block",
              outline: noteOutlinePayload(result.note),
            }
          })
        }
        return safeEdit(async () => {
          const result = await appendTypedBlock(
            noteId,
            input.sectionId,
            input.type,
            input.data
          )
          return {
            ok: true,
            message: `Added ${input.type} block`,
            outline: noteOutlinePayload(result.note),
          }
        })
      },
    },

    generateMermaidBlock: {
      description: "Generate and append a mermaid diagram.",
      inputSchema: z.object({
        sectionId: z.string(),
        prompt: z
          .string()
          .describe("What the diagram should show, in plain language"),
        title: z.string().optional(),
        caption: z.string().optional(),
      }),
      execute: async (input: {
        sectionId: string
        prompt: string
        title?: string
        caption?: string
      }) =>
        safeEdit(async () => {
          const result = await generateAndAppendMermaid({
            noteId,
            sectionId: input.sectionId,
            prompt: input.prompt,
            title: input.title,
            caption: input.caption,
          })
          return {
            ok: true,
            message: "Mermaid diagram generated",
            blockId: result.block.id,
            sectionId: input.sectionId,
            outline: noteOutlinePayload(result.note),
          }
        }),
    },

    addMermaidBlock: {
      description: "Append mermaid from raw source.",
      inputSchema: z.object({
        sectionId: z.string(),
        title: z.string().optional(),
        caption: z.string().optional(),
        diagram: z.string(),
      }),
      execute: async (input: {
        sectionId: string
        title?: string
        caption?: string
        diagram: string
      }) =>
        safeEdit(async () => {
          const result = await appendMermaidFromSource({
            noteId,
            sectionId: input.sectionId,
            diagram: input.diagram,
            title: input.title,
            caption: input.caption,
          })
          return {
            ok: true,
            message: "Mermaid block added",
            blockId: result.block.id,
            sectionId: input.sectionId,
            outline: noteOutlinePayload(result.note),
          }
        }),
    },

    updateMermaidBlock: {
      description: "Fix an existing mermaid block (one try).",
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
            hint: "Do not retry updateMermaidBlock. Call replaceBlockWithMarkdown instead.",
          }
        }
        return safeEdit(async () => {
          const note = await patchNoteBlock(
            noteId,
            input.sectionId,
            input.blockId,
            {
              diagram,
              ...(input.title ? { title: input.title } : {}),
              ...(input.caption ? { caption: input.caption } : {}),
            },
            {
              source: "update-mermaid",
              name: "Updated mermaid",
              note: input.blockId,
            }
          )
          return {
            ok: true,
            message: "Mermaid block fixed",
            outline: noteOutlinePayload(note),
          }
        })
      },
    },

    replaceBlockWithMarkdown: {
      description: "Replace a block with markdown.",
      inputSchema: z.object({
        sectionId: z.string(),
        blockId: z.string(),
        content: z.string(),
      }),
      execute: async (input: {
        sectionId: string
        blockId: string
        content: string
      }) =>
        safeEdit(async () => {
          const md = buildNoteBlock("markdown", { content: input.content })
          if (!md) throw new Error("Empty markdown replacement")
          const note = await mutateNote(
            noteId,
            (fresh) => {
              const section = fresh.sections.find((s) => s.id === input.sectionId)
              if (!section?.blocks.some((b) => b.id === input.blockId)) {
                throw new Error("Block not found")
              }
              const without = {
                ...fresh,
                sections: fresh.sections.map((s) =>
                  s.id === input.sectionId
                    ? {
                        ...s,
                        blocks: s.blocks.filter((b) => b.id !== input.blockId),
                      }
                    : s
                ),
              }
              return {
                sections: appendBlock(without, input.sectionId, md),
              }
            },
            {
              source: "replace-block",
              name: "Replaced block",
              note: `Replaced ${input.blockId} with markdown`,
            }
          )
          return {
            ok: true,
            message: "Replaced broken block with markdown",
            outline: noteOutlinePayload(note),
          }
        }),
    },

    addStackBlock: {
      description: "Append a tech-stack visual block.",
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
          const result = await appendTypedBlock(
            noteId,
            input.sectionId,
            "stack",
            { ...input, direction: input.direction ?? "vertical" }
          )
          return {
            ok: true,
            message: "Stack block added",
            outline: noteOutlinePayload(result.note),
          }
        }),
    },

    generateComparisonBlock: {
      description: "Generate and append a comparison table.",
      inputSchema: z.object({
        sectionId: z.string(),
        prompt: z.string(),
        title: z.string().optional(),
      }),
      execute: async (input: {
        sectionId: string
        prompt: string
        title?: string
      }) =>
        safeEdit(async () => {
          const result = await generateAndAppendComparison({
            noteId,
            sectionId: input.sectionId,
            prompt: input.prompt,
            title: input.title,
          })
          return {
            ok: true,
            message: "Comparison table generated",
            outline: noteOutlinePayload(result.note),
          }
        }),
    },

    addComparisonBlock: {
      description: "Append a comparison table.",
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
          cells: {
            type: "check" | "x" | "number" | "text"
            value: string | number | boolean
          }[]
        }[]
      }) =>
        safeEdit(async () => {
          const result = await appendTypedBlock(
            noteId,
            input.sectionId,
            "comparison",
            input
          )
          return {
            ok: true,
            message: "Comparison table added",
            outline: noteOutlinePayload(result.note),
          }
        }),
    },

    addMarkdownBlock: {
      description: "Append markdown.",
      inputSchema: z.object({
        sectionId: z.string(),
        content: z.string(),
      }),
      execute: async (input: { sectionId: string; content: string }) =>
        safeEdit(async () => {
          const result = await appendTypedBlock(
            noteId,
            input.sectionId,
            "markdown",
            input
          )
          return {
            ok: true,
            message: "Markdown block added",
            outline: noteOutlinePayload(result.note),
          }
        }),
    },

    addCalloutBlock: {
      description: "Append a callout.",
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
          const result = await appendTypedBlock(
            noteId,
            input.sectionId,
            "callout",
            input
          )
          return {
            ok: true,
            message: "Callout added",
            outline: noteOutlinePayload(result.note),
          }
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
  if (step.toolCalls.length > 0 && step.toolResults.length === 0) return true
  if (step.toolResults.length === 0) return false
  return step.toolResults.every((r) => {
    const out = r.output as { ok?: boolean } | undefined
    return out?.ok === false
  })
}

export function consecutiveEditFailures(
  maxFailures = 3
): StopCondition<ToolSet> {
  return ({ steps }) => {
    if (steps.length < maxFailures) return false
    const last = steps.slice(-maxFailures)
    return last.every(stepFailed)
  }
}

export function buildEditModeSystemRules(extraReasoning = false): string {
  const base = `
EDIT MODE — act with tools, do not overthink:
- Call tools directly. No long planning, no restating what each tool does, no rebuilding the note from memory.
- updateNote merges sections by id only — never pass a full stale sections list.
- Structure: addSection. Diagrams: generateMermaidBlock. Tables: generateComparisonBlock. Stacks: addStackBlock. Prose: addMarkdownBlock. Callouts: addCalloutBlock.
- Mermaid: no "|" in node labels; prefer dashed links. One mermaid fix, then replaceBlockWithMarkdown.
- Prefer ACTIVE SECTION. Trust tool results. One retry per failure, then stop.
`

  if (!extraReasoning) return base

  return `${base}
Extra reasoning is ON — you may think through structure before editing, but still write only via tools.
`
}

/** @deprecated use buildEditModeSystemRules */
export const EDIT_MODE_SYSTEM_RULES = buildEditModeSystemRules(false)
