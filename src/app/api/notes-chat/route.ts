import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  generateId,
  generateText,
  stepCountIs,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from "ai"
import { z } from "zod"
import { getNoteById } from "@/lib/notes"
import { applyNoteEdit } from "@/lib/notes-chat/apply-edit"
import {
  buildSummarizeTodayContext,
  parseSlashCommand,
  type NotesChatCommandId,
} from "@/lib/notes-chat/commands"
import { buildNotesChatContext } from "@/lib/notes-chat/context"
import {
  resolveModelForMessages,
  NOTES_CHAT_SUMMARY_MODEL,
} from "@/lib/notes-chat/models"
import { serializeNoteJson } from "@/lib/notes-chat/serialize"
import {
  appendBlock,
  newBlockId,
} from "@/lib/notes-chat/section-blocks"
import {
  messagesToTranscript,
  splitMessagesForSummary,
  type NotesChatMode,
} from "@/lib/notes-chat/session"
import { isLocalEditEnabled } from "@/lib/local-edit"
import { getOpenRouter } from "@/lib/openrouter"
import type { NoteDocument } from "@/lib/notes-types"

export const maxDuration = 60

type Body = {
  messages: UIMessage[]
  noteId: string
  pathIds: string[]
  model?: string
  mode?: NotesChatMode
  referenceIds?: string[]
  summary?: string
  activeSectionId?: string
  command?: NotesChatCommandId
}

function lastUserText(messages: UIMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i]
    if (m.role !== "user") continue
    return m.parts
      .filter((p) => p.type === "text")
      .map((p) => (p.type === "text" ? p.text : ""))
      .join("")
  }
  return ""
}

async function maybeSummarize(
  messages: UIMessage[],
  existingSummary?: string
): Promise<{ summary: string; messages: UIMessage[] }> {
  const { toSummarize, recent } = splitMessagesForSummary(messages)
  if (toSummarize.length === 0) {
    return { summary: existingSummary ?? "", messages }
  }

  const openrouter = getOpenRouter()
  const transcript = messagesToTranscript(toSummarize)
  const { text } = await generateText({
    model: openrouter(NOTES_CHAT_SUMMARY_MODEL),
    prompt: `Summarize this notes chat history for future context. Keep key facts, decisions, and referenced topics. Be concise.

${existingSummary ? `Previous summary:\n${existingSummary}\n\n` : ""}New messages to fold in:
${transcript}`,
  })

  return { summary: text.trim(), messages: recent }
}

export async function POST(req: Request) {
  let body: Body
  try {
    body = (await req.json()) as Body
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const {
    noteId,
    pathIds,
    referenceIds,
    model: selectedModelId,
    mode: requestedMode = "ask",
    activeSectionId,
    command: bodyCommand,
  } = body
  if (!noteId || !Array.isArray(body.messages)) {
    return Response.json({ error: "Invalid payload" }, { status: 400 })
  }

  const note = getNoteById(noteId)
  if (!note || note.chat?.enabled === false) {
    return Response.json({ error: "Note not found" }, { status: 404 })
  }

  const command =
    bodyCommand ?? parseSlashCommand(lastUserText(body.messages))
  const mode: NotesChatMode =
    command === "summarize-today" ? "edit" : requestedMode

  if (mode === "edit" && !isLocalEditEnabled()) {
    return Response.json(
      { error: "Edit mode requires local edit" },
      { status: 403 }
    )
  }

  if (command === "summarize-today" && !isLocalEditEnabled()) {
    return Response.json(
      { error: "Summarize today requires local edit" },
      { status: 403 }
    )
  }

  try {
    const openrouter = getOpenRouter()
    const { summary, messages } = await maybeSummarize(
      body.messages,
      body.summary
    )

    const hasImages = messages.some((m) =>
      m.parts.some(
        (p) => p.type === "file" && p.mediaType?.startsWith("image/")
      )
    )
    const { modelId, usedVisionFallback } = resolveModelForMessages(
      selectedModelId,
      hasImages
    )
    const model = openrouter(modelId)

    const { systemContext } = buildNotesChatContext({
      note,
      pathIds: pathIds ?? [],
      referenceIds,
    })

    const activeSection =
      activeSectionId &&
      note.sections.find((s) => s.id === activeSectionId)

    const systemParts = [
      systemContext,
      summary ? `\n\nEarlier conversation summary:\n${summary}` : "",
    ]

    if (usedVisionFallback) {
      systemParts.push(
        `\n\nNote: images were attached, so this turn uses the vision fallback model (${modelId}) because the user's selected model does not accept image input.`
      )
    }

    if (activeSection) {
      systemParts.push(
        `\n\nACTIVE SECTION (user is viewing): ${activeSection.title} [${activeSection.id}]`
      )
    }

    if (command === "summarize-today") {
      systemParts.push(
        `\n\n${buildSummarizeTodayContext({
          note,
          pathIds: pathIds ?? [],
        })}`
      )
    }

    if (mode === "edit") {
      systemParts.push(`
EDIT MODE RULES:
- You can modify the open note with tools. Prefer specialized tools over dumping everything as markdown.
- For architecture / layers / tech stacks: ALWAYS use addStackBlock (not ASCII art, not markdown tables).
- For flows / sequences / relationships / system diagrams: ALWAYS use addMermaidBlock (not ASCII boxes).
- Prefer dashed mermaid links (-.-> / -->>).
- Use updateNote only for broad rewrites of markdown/copy or multi-section changes.
- When adding to the note, prefer the ACTIVE SECTION if provided.
- Valid block types: markdown, youtube, stack, mermaid, illustration, html, link, callout, gallery, terminal, playground, tasks.
${command === "summarize-today" ? "- For /summarize-today you MUST call updateNote once with the full rewritten daily summary. Do not only reply in chat." : ""}

Current note JSON:
${serializeNoteJson(note)}
`)
    }

    const tools =
      mode === "edit"
        ? {
            updateNote: {
              description:
                "Replace note content for broad edits. Prefer addStackBlock / addMermaidBlock for diagrams.",
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
              }) => {
                await applyNoteEdit(noteId, input)
                return { ok: true, message: "Note updated" }
              },
            },
            addMermaidBlock: {
              description:
                "REQUIRED for architecture/flow/sequence diagrams. Appends a mermaid block to a section. Never draw ASCII diagrams in chat when this tool can be used.",
              inputSchema: z.object({
                sectionId: z
                  .string()
                  .describe("Target section id (prefer active section)"),
                title: z.string().optional(),
                caption: z.string().optional(),
                diagram: z
                  .string()
                  .describe("Raw mermaid source only, no fences"),
              }),
              execute: async (input: {
                sectionId: string
                title?: string
                caption?: string
                diagram: string
              }) => {
                const fresh = getNoteById(noteId)
                if (!fresh) throw new Error("Note not found")
                const diagram = input.diagram
                  .replace(/^```(?:mermaid)?\s*/i, "")
                  .replace(/```\s*$/i, "")
                  .trim()
                const sections = appendBlock(fresh, input.sectionId, {
                  type: "mermaid",
                  id: newBlockId("mermaid"),
                  title: input.title,
                  caption: input.caption,
                  diagram,
                })
                await applyNoteEdit(noteId, { sections })
                return { ok: true, message: "Mermaid block added" }
              },
            },
            addStackBlock: {
              description:
                "REQUIRED for tech stacks / layered architecture visuals. Appends a stack block with layers and optional dashed edges.",
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
                        icon: z
                          .string()
                          .describe(
                            "simple-icons key like siReact, siNextdotjs, siMongodb"
                          ),
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
              }) => {
                const fresh = getNoteById(noteId)
                if (!fresh) throw new Error("Note not found")
                const sections = appendBlock(fresh, input.sectionId, {
                  type: "stack",
                  id: newBlockId("stack"),
                  title: input.title,
                  caption: input.caption,
                  direction: input.direction ?? "vertical",
                  layers: input.layers,
                  edges: input.edges,
                })
                await applyNoteEdit(noteId, { sections })
                return { ok: true, message: "Stack block added" }
              },
            },
          }
        : undefined

    const result = streamText({
      model,
      system: systemParts.join(""),
      messages: await convertToModelMessages(messages),
      tools,
      stopWhen: mode === "edit" ? stepCountIs(5) : stepCountIs(1),
    })

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({
        stream: result.stream,
        originalMessages: messages,
        generateMessageId: generateId,
      }),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Chat failed"
    return Response.json({ error: message }, { status: 500 })
  }
}
