export type NotesChatModel = {
  id: string
  label: string
  /** Native image / multimodal input support */
  vision?: boolean
}

export const NOTES_CHAT_MODELS: NotesChatModel[] = [
  { id: "deepseek/deepseek-v4-pro", label: "DeepSeek V4 Pro" },
  { id: "deepseek/deepseek-v4-flash-0731", label: "DeepSeek V4 Flash" },
  { id: "deepseek/deepseek-v4-flash", label: "DeepSeek V4 Flash (latest)" },
  {
    id: "anthropic/claude-sonnet-4",
    label: "Claude Sonnet 4",
    vision: true,
  },
  {
    id: "openai/gpt-4.1-mini",
    label: "GPT-4.1 Mini",
    vision: true,
  },
  {
    id: "google/gemini-2.5-flash-lite",
    label: "Gemini 2.5 Flash Lite",
    vision: true,
  },
]

export const DEFAULT_NOTES_CHAT_MODEL = "deepseek/deepseek-v4-pro"

export const NOTES_CHAT_SUMMARY_MODEL = "deepseek/deepseek-v4-flash-0731"

/**
 * Cheap multimodal fallback when the selected chat model cannot read images.
 * Gemini 2.5 Flash Lite is among the lowest-cost OpenRouter vision options.
 */
export const NOTES_CHAT_VISION_FALLBACK_MODEL = "google/gemini-2.5-flash-lite"

export const NOTES_CHAT_MODEL_STORAGE_KEY = "notes-chat-model"

export function resolveNotesChatModel(id?: string): string {
  if (id && NOTES_CHAT_MODELS.some((m) => m.id === id)) return id
  return DEFAULT_NOTES_CHAT_MODEL
}

export function modelSupportsVision(id?: string): boolean {
  const model = NOTES_CHAT_MODELS.find((m) => m.id === id)
  return Boolean(model?.vision)
}

/** Prefer selected model; fall back to cheap vision model when images are present */
export function resolveModelForMessages(
  preferredId: string | undefined,
  hasImages: boolean
): { modelId: string; usedVisionFallback: boolean } {
  const preferred = resolveNotesChatModel(preferredId)
  if (!hasImages || modelSupportsVision(preferred)) {
    return { modelId: preferred, usedVisionFallback: false }
  }
  return {
    modelId: NOTES_CHAT_VISION_FALLBACK_MODEL,
    usedVisionFallback: true,
  }
}
