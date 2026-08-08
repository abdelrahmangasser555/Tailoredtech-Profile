import type { UIMessage } from "ai"

export type NotesChatMode = "ask" | "edit"

export type NotesChatSession = {
  noteId: string
  messages: UIMessage[]
  summary?: string
  model?: string
  mode?: NotesChatMode
  updatedAt: string
}

export const NOTES_CHAT_SESSION_PREFIX = "notes-chat-session:"
export const NOTES_CHAT_OPEN_KEY = "notes-chat-panel-open"
export const NOTES_CHAT_MODE_KEY = "notes-chat-mode"

export function sessionStorageKey(noteId: string) {
  return `${NOTES_CHAT_SESSION_PREFIX}${noteId}`
}

export function estimateMessageChars(messages: UIMessage[]): number {
  return messages.reduce((sum, m) => {
    const text = m.parts
      .filter((p) => p.type === "text")
      .map((p) => (p.type === "text" ? p.text : ""))
      .join("")
    return sum + text.length
  }, 0)
}

/** Keep recent messages; older ones should be summarized */
export function splitMessagesForSummary(
  messages: UIMessage[],
  keepRecent = 12
): { toSummarize: UIMessage[]; recent: UIMessage[] } {
  if (messages.length <= keepRecent) {
    return { toSummarize: [], recent: messages }
  }
  return {
    toSummarize: messages.slice(0, -keepRecent),
    recent: messages.slice(-keepRecent),
  }
}

export function messagesToTranscript(messages: UIMessage[]): string {
  return messages
    .map((m) => {
      const bits = m.parts.map((p) => {
        if (p.type === "text") return p.text
        if (p.type === "file" && p.mediaType?.startsWith("image/")) {
          return `[image: ${p.filename ?? "attachment"}]`
        }
        return ""
      })
      return `${m.role.toUpperCase()}: ${bits.filter(Boolean).join(" ")}`
    })
    .join("\n\n")
}
