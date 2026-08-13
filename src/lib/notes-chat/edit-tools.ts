import { z } from "zod"
import { mutateNote, readFreshNote } from "@/lib/notes-chat/apply-edit"
import { NOTE_BLOCK_TYPES, buildNoteBlock } from "@/lib/notes-chat/build-block"
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
import { appendBlock } from "@/lib/notes-chat/section-blocks"
import { STACK_ICON_HINT } from "@/lib/notes-stack-icons"
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
      description:
        "Re-read the live note from disk (or one section). Use after edits. Never rewrite the whole note from memory.",
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
      description:
        "Create a new section. Prefer this over updateNote when adding structure.",
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
      description:
        "Patch title/description, or merge specific sections by id. Unmentioned sections are KEPT. Never pass a full stale sections array. Use replaceAll only when rewriting the entire note on purpose (rare).",
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
                  ? incoming
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
      description:
        "Append ANY supported block type to a section. For mermaid, prefer generateMermaidBlock.",
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
      description:
        "Generate a mermaid diagram from a description and append it. Same engine as the section Generate mermaid button. Prefer this over writing mermaid source yourself.",
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
      description:
        "Append mermaid from raw source you already wrote. Prefer generateMermaidBlock. Avoid | inside node labels.",
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
      description:
        "Fix an existing mermaid block. Call at most once per block. If it still fails, use replaceBlockWithMarkdown.",
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
      description:
        "Remove a broken block and append markdown in the same section.",
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
      description:
        `Append a tech-stack / layered architecture visual block. Icon names: ${STACK_ICON_HINT}. Aliases like mongo, mongodb, azure, node, nextjs also work.`,
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
      description:
        "Generate a comparison table from a description and append it. Same engine as the section Generate comparison button.",
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
      description:
        "Append a comparison table you already structured. Prefer generateComparisonBlock.",
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
      description: "Append a markdown content block to a section.",
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

export const EDIT_MODE_SYSTEM_RULES = `
EDIT MODE RULES (agentic — multi-step):
- Tools write to disk immediately. Parallel tool calls are serialized. Do not reconstruct the whole note from chat memory.
- NEVER call updateNote with a full sections list copied from earlier context. That wipes later edits. updateNote MERGES sections by id and keeps unmentioned sections.
- New sections: addSection. New blocks: specialized add* / generate* tools.
- Flows / sequences: ALWAYS generateMermaidBlock (plain-language prompt). Same engine as the UI Generate mermaid button. Only use addMermaidBlock if you already have valid source.
- Never put "|" inside mermaid node label brackets. Prefer dashed links -.-> / -->>.
- Mermaid errors: fix ONCE with updateMermaidBlock. If it still fails, replaceBlockWithMarkdown (do not loop).
- Comparison matrices: generateComparisonBlock (or addComparisonBlock if you already have cells). Never markdown tables.
- Architecture / tech stacks: addStackBlock. Use icon names like azure, mongodb, nodedotjs, nextdotjs (${STACK_ICON_HINT}).
- Simple prose: addMarkdownBlock. Tips/warnings: addCalloutBlock.
- Catch-all: addBlock with the correct type + data.
- Prefer the ACTIVE SECTION when adding blocks.
- After a successful add, trust the returned outline. Do not rebuild the note.
- If a tool returns { ok: false }, fix once. After repeated soft failures the loop stops — explain and stop.
- Valid block types: ${NOTE_BLOCK_TYPES.join(", ")}.
`
