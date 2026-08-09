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
import { getNoteById } from "@/lib/notes"
import {
  buildSummarizeTodayContext,
  parseSlashCommand,
  type NotesChatCommandId,
} from "@/lib/notes-chat/commands"
import { buildNotesChatContext } from "@/lib/notes-chat/context"
import {
  consecutiveEditFailures,
  createNotesEditTools,
  EDIT_MODE_SYSTEM_RULES,
} from "@/lib/notes-chat/edit-tools"
import {
  resolveModelForMessages,
  NOTES_CHAT_SUMMARY_MODEL,
} from "@/lib/notes-chat/models"
import { serializeNoteJson } from "@/lib/notes-chat/serialize"
import {
  messagesToTranscript,
  splitMessagesForSummary,
  type NotesChatMode,
} from "@/lib/notes-chat/session"
import { isLocalEditEnabled } from "@/lib/local-edit"
import { getOpenRouter } from "@/lib/openrouter"

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
${EDIT_MODE_SYSTEM_RULES}
${command === "summarize-today" ? "- For /summarize-today you MUST call updateNote once with the full rewritten daily summary. Do not only reply in chat." : ""}

Current note JSON:
${serializeNoteJson(note)}
`)
    }

    const tools = mode === "edit" ? createNotesEditTools(noteId) : undefined

    const result = streamText({
      model,
      system: systemParts.join(""),
      messages: await convertToModelMessages(messages),
      tools,
      // Multi-step agentic loop: plan → tools → re-read → more tools
      stopWhen:
        mode === "edit"
          ? [stepCountIs(14), consecutiveEditFailures(3)]
          : stepCountIs(4),
    })

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({
        stream: result.stream,
        originalMessages: messages,
        generateMessageId: generateId,
        sendReasoning: true,
      }),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Chat failed"
    return Response.json({ error: message }, { status: 500 })
  }
}
