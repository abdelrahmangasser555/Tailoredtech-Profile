"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  isFileUIPart,
  isToolUIPart,
  type FileUIPart,
  type UIMessage,
} from "ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Check,
  ChevronDown,
  Folder,
  ImagePlus,
  Loader2,
  MessageSquare,
  Pencil,
  Send,
  Sparkles,
  Square,
  Trash2,
  X,
} from "lucide-react";
import type { NoteDocument } from "@/lib/notes-types";
import type { NoteMentionItem } from "@/lib/notes-chat/context";
import {
  DEFAULT_NOTES_CHAT_MODEL,
  NOTES_CHAT_MODELS,
  NOTES_CHAT_MODEL_STORAGE_KEY,
  NOTES_CHAT_VISION_FALLBACK_MODEL,
  modelSupportsVision,
  resolveNotesChatModel,
} from "@/lib/notes-chat/models";
import {
  NOTES_CHAT_MODE_KEY,
  NOTES_CHAT_OPEN_KEY,
  sessionStorageKey,
  type NotesChatMode,
  type NotesChatSession,
} from "@/lib/notes-chat/session";
import { NoteChatMentionInput } from "@/components/notes/note-chat-mention-input";
import {
  NOTES_CHAT_COMMANDS,
  parseSlashCommand,
  type NotesChatCommand,
} from "@/lib/notes-chat/commands";
import { isLocalEditEnabled } from "@/lib/local-edit";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Image from "next/image";

type NoteChatPanelProps = {
  note: NoteDocument;
  pathIds: string[];
  mentionItems: NoteMentionItem[];
  activeSectionId?: string;
};

function messageText(message: UIMessage): string {
  return message.parts
    .filter((p) => p.type === "text")
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("");
}

function hasActiveTool(message: UIMessage | undefined): boolean {
  if (!message) return false;
  return message.parts.some(
    (p) =>
      isToolUIPart(p) &&
      (p.state === "input-streaming" ||
        p.state === "input-available" ||
        p.state === "approval-requested"),
  );
}

function loadLocalSession(noteId: string): NotesChatSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(sessionStorageKey(noteId));
    if (!raw) return null;
    return JSON.parse(raw) as NotesChatSession;
  } catch {
    return null;
  }
}

function saveLocalSession(session: NotesChatSession) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    sessionStorageKey(session.noteId),
    JSON.stringify(session),
  );
}

const SUGGESTIONS = [
  "Summarize this note in 3 bullets",
  "What should I learn next?",
  "Explain the key idea simply",
];

const MAX_CHAT_IMAGES = 4;
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

async function filesToFileUIParts(files: File[]): Promise<FileUIPart[]> {
  const parts: FileUIPart[] = [];
  for (const file of files) {
    if (!file.type.startsWith("image/")) continue;
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error(`${file.name || "Image"} is over 4MB`);
      continue;
    }
    const url = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error ?? new Error("Read failed"));
      reader.readAsDataURL(file);
    });
    parts.push({
      type: "file",
      mediaType: file.type || "image/png",
      filename: file.name || `image-${Date.now()}.png`,
      url,
    });
  }
  return parts;
}

function messageImages(message: UIMessage): FileUIPart[] {
  return message.parts.filter(
    (p): p is FileUIPart =>
      isFileUIPart(p) && Boolean(p.mediaType?.startsWith("image/")),
  );
}

export function NoteChatPanel({
  note,
  pathIds,
  mentionItems,
  activeSectionId,
}: NoteChatPanelProps) {
  const router = useRouter();
  const localEdit = isLocalEditEnabled();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [model, setModel] = useState(DEFAULT_NOTES_CHAT_MODEL);
  const [mode, setMode] = useState<NotesChatMode>("ask");
  const [referenceIds, setReferenceIds] = useState<string[]>([]);
  const [summary, setSummary] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<FileUIPart[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const availableCommands = useMemo(
    () => (localEdit ? NOTES_CHAT_COMMANDS : []),
    [localEdit],
  );

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/notes-chat",
        body: () => ({
          noteId: note.id,
          pathIds,
          model,
          mode,
          referenceIds,
          summary,
          activeSectionId,
        }),
      }),
    [note.id, pathIds, model, mode, referenceIds, summary, activeSectionId],
  );

  const persistSession = useCallback(
    async (nextMessages: UIMessage[]) => {
      const persistedMessages = nextMessages.map((message) => ({
        ...message,
        parts: message.parts.map((part) => {
          if (
            isFileUIPart(part) &&
            part.url.startsWith("data:") &&
            part.mediaType?.startsWith("image/")
          ) {
            return {
              type: "text" as const,
              text: `[Image attached: ${part.filename ?? "image"}]`,
            };
          }
          return part;
        }),
      }));
      const session: NotesChatSession = {
        noteId: note.id,
        messages: persistedMessages,
        summary,
        model,
        mode,
        updatedAt: new Date().toISOString(),
      };
      saveLocalSession(session);
      if (localEdit) {
        try {
          await fetch("/api/notes-chat/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(session),
          });
        } catch {
          // localStorage still holds session
        }
      }
    },
    [note.id, summary, model, mode, localEdit],
  );

  const {
    messages,
    sendMessage,
    status,
    setMessages,
    error,
    stop,
    clearError,
  } = useChat({
    id: note.id,
    transport,
    onFinish: ({ messages: next }) => {
      void persistSession(next);
      if (mode === "edit") {
        const last = next[next.length - 1];
        const tools = last?.parts.filter(isToolUIPart) ?? [];
        const wrote = tools.some(
          (p) =>
            p.state === "output-available" &&
            (p.type === "tool-updateNote" ||
              p.type === "tool-addMermaidBlock" ||
              p.type === "tool-addStackBlock"),
        );
        if (wrote) {
          toast.success("Note updated");
          router.refresh();
        }
      }
    },
  });

  useEffect(() => {
    const storedOpen = localStorage.getItem(NOTES_CHAT_OPEN_KEY);
    setOpen(storedOpen === "true");

    const storedModel = localStorage.getItem(NOTES_CHAT_MODEL_STORAGE_KEY);
    if (storedModel) setModel(resolveNotesChatModel(storedModel));

    const storedMode = localStorage.getItem(
      NOTES_CHAT_MODE_KEY,
    ) as NotesChatMode;
    if (storedMode === "ask" || storedMode === "edit") setMode(storedMode);
  }, []);

  useEffect(() => {
    setHydrated(false);
    setReferenceIds([]);

    async function hydrate() {
      let session = loadLocalSession(note.id);

      if (localEdit) {
        try {
          const res = await fetch(
            `/api/notes-chat/session?noteId=${encodeURIComponent(note.id)}`,
          );
          const data = (await res.json()) as {
            session: NotesChatSession | null;
          };
          if (data.session?.updatedAt) {
            const localTime = session?.updatedAt ?? "";
            if (!session || data.session.updatedAt > localTime) {
              session = data.session;
              if (session) saveLocalSession(session);
            }
          }
        } catch {
          // use local only
        }
      }

      if (session) {
        setMessages(session.messages ?? []);
        setSummary(session.summary ?? "");
        if (session.model) setModel(resolveNotesChatModel(session.model));
        if (session.mode) setMode(session.mode);
      } else {
        setMessages([]);
        setSummary("");
      }

      setHydrated(true);
    }

    void hydrate();
  }, [note.id, localEdit, setMessages]);

  useEffect(() => {
    if (!hydrated) return;
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, status, hydrated]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j") {
        e.preventDefault();
        setOpen((prev) => {
          const next = !prev;
          localStorage.setItem(NOTES_CHAT_OPEN_KEY, String(next));
          return next;
        });
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function toggleOpen() {
    const next = !open;
    setOpen(next);
    localStorage.setItem(NOTES_CHAT_OPEN_KEY, String(next));
  }

  function handleModelChange(next: string) {
    setModel(next);
    localStorage.setItem(NOTES_CHAT_MODEL_STORAGE_KEY, next);
  }

  function handleModeChange(next: NotesChatMode) {
    setMode(next);
    localStorage.setItem(NOTES_CHAT_MODE_KEY, next);
  }

  async function addPendingImages(files: File[]) {
    if (!files.length) return;
    const parts = await filesToFileUIParts(files);
    if (!parts.length) return;
    setPendingFiles((prev) => {
      const next = [...prev, ...parts].slice(0, MAX_CHAT_IMAGES);
      if (prev.length + parts.length > MAX_CHAT_IMAGES) {
        toast.message(`Up to ${MAX_CHAT_IMAGES} images per message`);
      }
      return next;
    });
  }

  async function handleSubmit(textOverride?: string) {
    const text = (textOverride ?? input).trim();
    const files = textOverride ? [] : pendingFiles;
    if (
      (!text && files.length === 0) ||
      status === "streaming" ||
      status === "submitted"
    ) {
      return;
    }

    const slash = parseSlashCommand(text);
    if (slash === "summarize-today") {
      if (!localEdit) {
        toast.error("Summarize today needs local edit");
        return;
      }
      await runCommand(
        NOTES_CHAT_COMMANDS.find((c) => c.id === "summarize-today")!,
      );
      return;
    }

    if (!textOverride) {
      setInput("");
      setPendingFiles([]);
    }
    clearError();

    if (files.length > 0 && !modelSupportsVision(model)) {
      toast.message("Using vision fallback", {
        description: `${NOTES_CHAT_MODELS.find((m) => m.id === NOTES_CHAT_VISION_FALLBACK_MODEL)?.label ?? "Gemini Flash Lite"} will read the image(s).`,
      });
    }

    if (files.length > 0) {
      await sendMessage(text ? { text, files } : { files });
    } else {
      await sendMessage({ text });
    }
  }

  async function runCommand(command: NotesChatCommand) {
    if (status === "streaming" || status === "submitted") return;
    if (command.editOnly && !localEdit) {
      toast.error("This command needs local edit");
      return;
    }

    if (command.editOnly && mode !== "edit") {
      handleModeChange("edit");
    }

    setInput("");
    setPendingFiles([]);
    clearError();

    const prompt =
      command.id === "summarize-today"
        ? "/summarize-today — Rewrite this open note as a summary of everything created or updated today. Read all of today's notes and use updateNote."
        : `/${command.slash}`;

    toast.message(command.label, {
      description: "Gathering today's notes…",
    });

    await sendMessage(
      { text: prompt },
      {
        body: {
          command: command.id,
          mode: "edit",
        },
      },
    );
  }

  async function clearSession() {
    setMessages([]);
    setSummary("");
    setReferenceIds([]);
    setPendingFiles([]);
    clearError();
    localStorage.removeItem(sessionStorageKey(note.id));
    if (localEdit) {
      await fetch(
        `/api/notes-chat/session?noteId=${encodeURIComponent(note.id)}`,
        { method: "DELETE" },
      );
    }
    toast.success("Chat cleared");
  }

  const thinking = status === "submitted" || status === "streaming";
  const lastAssistant = [...messages]
    .reverse()
    .find((m) => m.role === "assistant");
  const editingNow = mode === "edit" && hasActiveTool(lastAssistant);
  const referenced = mentionItems.filter((m) => referenceIds.includes(m.id));

  if (note.chat?.enabled === false) return null;

  return (
    <>
      {/* Mobile backdrop */}
      <button
        type="button"
        aria-label="Close chat"
        onClick={toggleOpen}
        className={cn(
          "fixed inset-0 z-30 bg-black/55 transition-opacity md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* Floating toggle */}
      <button
        type="button"
        onClick={toggleOpen}
        aria-expanded={open}
        aria-label={open ? "Close note chat" : "Open note chat"}
        className={cn(
          "fixed bottom-5 right-5 z-40 flex items-center gap-2 border border-white/15 bg-[#0a0a0a] px-3.5 py-2.5 text-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.45)] transition hover:border-accent/50 hover:text-accent",
          open && "border-accent/40 text-accent",
        )}
      >
        <MessageSquare className="size-4" />
        <span className="font-mono text-[10px] tracking-[0.14em] uppercase">
          {open ? "Close" : "Chat"}
        </span>
        {!open && thinking ? (
          <Loader2 className="size-3.5 animate-spin text-accent" />
        ) : null}
      </button>

      <aside
        data-lenis-prevent
        className={cn(
          "fixed inset-y-0 right-0 z-40 flex w-full max-w-[22rem] flex-col border-l border-white/10 bg-[#070707] text-white shadow-[-12px_0_40px_rgba(0,0,0,0.35)] transition-transform duration-300 ease-out sm:max-w-sm",
          open ? "translate-x-0" : "translate-x-full",
        )}
        aria-hidden={!open}
      >
        <header className="flex shrink-0 items-start gap-3 border-b border-white/10 px-4 py-3.5">
          <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center  bg-accent/10 text-accent">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="size-8"
            >
              <path d="M4 2h2v2H4zm0 20h2v-2H4zM6 4h4v2H6zm0 16h4v-2H6zM4 6h2v4H4zm0 12h2v-4H4zM2 4h2v2H2zm0 16h2v-2H2z" />
              <path d="M8 2h2v4H8zm0 20h2v-4H8zM2 8h2v8H2zm8 0h3v2h-3zm4 3h4v2h-4zm2-8h2v2h-2zm-2 2h2v2h-2zm2 14h2v2h-2zm-2-2h2v2h-2zM10 2h3v2h-3zm0 18h3v2h-3zM8 10h2v4H8zm2 4h3v2h-3zm8-5h2v2h-2zm0-8h2v2h-2zm0 16h2v2h-2zm2-6h2v2h-2zm0-8h2v2h-2zm0 16h2v2h-2zm-2-6h2v2h-2zm0-8h2v2h-2zm0 16h2v2h-2z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium tracking-tight">
              Note assistant
            </p>
            <p className="mt-0.5 truncate text-[11px] text-white/40">
              {note.title}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void clearSession()}
            className="p-1.5 text-white/30 transition hover:text-white/70"
            aria-label="Clear chat"
            title="Clear chat"
          >
            <Trash2 className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={toggleOpen}
            className="p-1.5 text-white/30 transition hover:text-white/70"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="flex shrink-0 flex-col gap-2 border-b border-white/10 px-4 py-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="notes-chat-model">
              Model
            </label>
            <div className="relative min-w-0 flex-1">
              <select
                id="notes-chat-model"
                value={model}
                onChange={(e) => handleModelChange(e.target.value)}
                className="notes-chat-model-select w-full appearance-none border border-white/15 bg-[#111] py-2 pr-8 pl-2.5 font-mono text-[10px] tracking-wide text-white/85 focus:border-accent/50 focus:outline-none"
              >
                {NOTES_CHAT_MODELS.map((m) => (
                  <option
                    key={m.id}
                    value={m.id}
                    className="bg-[#111] text-white"
                  >
                    {m.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-accent/80" />
            </div>

            {localEdit ? (
              <div
                className="flex shrink-0 border border-white/12"
                role="group"
                aria-label="Chat mode"
              >
                {(["ask", "edit"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleModeChange(m)}
                    className={cn(
                      "inline-flex items-center gap-1 px-2.5 py-1.5 font-mono text-[10px] tracking-wider uppercase transition",
                      mode === m
                        ? m === "edit"
                          ? "bg-white text-black"
                          : "bg-accent text-[#0a0a0a]"
                        : "text-white/45 hover:text-white/80",
                    )}
                  >
                    {m === "edit" ? <Pencil className="size-2.5" /> : null}
                    {m}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {mode === "edit" ? (
            <p className="font-mono text-[9px] tracking-wide text-white/35">
              Edit mode writes to the open note with no approval step.
            </p>
          ) : null}
        </div>

        {referenced.length > 0 ? (
          <div
            data-lenis-prevent
            data-lenis-prevent-wheel
            onWheel={(e) => e.stopPropagation()}
            className="notes-panel-scroll max-h-24 shrink-0 overflow-y-auto overscroll-contain border-b border-white/10 px-4 py-2"
          >
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <p className="font-mono text-[9px] tracking-wider text-white/30 uppercase">
                Context · {referenced.length}
              </p>
              <button
                type="button"
                onClick={() => setReferenceIds([])}
                className="font-mono text-[9px] tracking-wider text-white/30 uppercase hover:text-white/60"
              >
                Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {referenced.map((ref) => (
                <span
                  key={ref.id}
                  className={cn(
                    "inline-flex max-w-full items-center gap-1 border px-2 py-0.5 font-mono text-[9px]",
                    ref.type === "folder"
                      ? "border-accent/40 bg-accent/10 text-accent"
                      : "border-white/15 bg-white/5 text-white/65",
                  )}
                >
                  {ref.type === "folder" ? (
                    <Folder className="size-2.5 shrink-0" />
                  ) : null}
                  <span className="truncate">@{ref.name}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setReferenceIds((ids) =>
                        ids.filter((id) => id !== ref.id),
                      )
                    }
                    className="opacity-50 hover:opacity-100"
                    aria-label={`Remove ${ref.name}`}
                  >
                    <X className="size-2.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <div
          ref={scrollRef}
          data-lenis-prevent
          data-lenis-prevent-wheel
          className="notes-panel-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4"
        >
          {!hydrated ? (
            <div className="flex h-full items-center justify-center gap-2 text-xs text-white/35">
              <Loader2 className="size-3.5 animate-spin" />
              Loading session…
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full flex-col justify-center gap-5">
              <div className="text-center">
                <div className="mx-auto mb-3 flex size-10 items-center justify-center border border-white/10 bg-white/[0.03]">
                  <Sparkles className="size-4 text-white/25" />
                </div>
                <p className="text-sm text-white/55">Chat about this note</p>
                <p className="mx-auto mt-1.5 max-w-[240px] text-[11px] leading-relaxed text-white/30">
                  Sibling notes in this folder are included. Type{" "}
                  <kbd className="border border-white/15 px-1 font-mono text-white/45">
                    @
                  </kbd>{" "}
                  to add more context.
                </p>
              </div>
              <ul className="flex flex-col gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      onClick={() => void handleSubmit(s)}
                      className="w-full border border-white/10 bg-white/[0.02] px-3 py-2.5 text-left text-[12px] text-white/55 transition hover:border-white/20 hover:bg-white/[0.04] hover:text-white/80"
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <ul className="flex min-w-0 flex-col gap-3.5">
              {messages.map((message) => {
                const text = messageText(message);
                const tools = message.parts.filter(isToolUIPart);
                const images = messageImages(message);
                if (!text && tools.length === 0 && images.length === 0) {
                  return null;
                }

                return (
                  <li
                    key={message.id}
                    className="flex min-w-0 flex-col gap-1.5"
                  >
                    <span className="font-mono text-[9px] tracking-[0.16em] text-white/25 uppercase">
                      {message.role === "user" ? "You" : "Assistant"}
                    </span>

                    {message.role === "user" ? (
                      <div className="min-w-0 overflow-hidden border border-accent/25 bg-accent/5 px-3 py-2.5 text-[13px] leading-relaxed text-white/90">
                        {images.length > 0 ? (
                          <div className="mb-2 flex flex-wrap gap-1.5">
                            {images.map((img, i) => (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                key={`${message.id}-img-${i}`}
                                src={img.url}
                                alt={img.filename ?? "Attached image"}
                                className="max-h-36 max-w-full border border-white/15 object-contain"
                              />
                            ))}
                          </div>
                        ) : null}
                        {text ? (
                          <div className="max-w-full overflow-x-auto whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
                            {text}
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <div className="min-w-0 overflow-hidden border border-white/10 bg-white/2 px-3 py-2.5 text-[13px] leading-relaxed text-white/75">
                        {tools.map((part) => {
                          const done = part.state === "output-available";
                          const failed = part.state === "output-error";
                          const toolLabel = part.type.replace("tool-", "");
                          return (
                            <div
                              key={part.toolCallId}
                              className={cn(
                                "mb-2 flex items-center gap-2 border px-2 py-1.5 font-mono text-[10px]",
                                done
                                  ? "border-accent/30 text-accent/90"
                                  : failed
                                    ? "border-red-400/30 text-red-300"
                                    : "border-white/15 text-white/50",
                              )}
                            >
                              {done ? (
                                <Check className="size-3" />
                              ) : (
                                <Loader2 className="size-3 animate-spin" />
                              )}
                              {toolLabel === "updateNote"
                                ? done
                                  ? "Note updated"
                                  : "Updating note…"
                                : toolLabel === "addMermaidBlock"
                                  ? done
                                    ? "Mermaid added"
                                    : "Adding mermaid…"
                                  : toolLabel === "addStackBlock"
                                    ? done
                                      ? "Stack added"
                                      : "Adding stack…"
                                    : done
                                      ? `Ran ${toolLabel}`
                                      : `Running ${toolLabel}…`}
                            </div>
                          );
                        })}
                        {text ? (
                          <div className="notes-chat-md prose-invert max-w-full min-w-0 overflow-x-auto break-words [overflow-wrap:anywhere] [&_a]:text-accent [&_a]:underline [&_code]:rounded-none [&_code]:bg-white/10 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[11px] [&_code]:break-all [&_li]:my-0.5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-4 [&_p]:my-1.5 [&_p]:first:mt-0 [&_p]:last:mb-0 [&_pre]:my-2 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:border [&_pre]:border-white/10 [&_pre]:bg-black/40 [&_pre]:p-2 [&_pre]:text-[11px] [&_pre]:whitespace-pre [&_strong]:text-white/90 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-4">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {text}
                            </ReactMarkdown>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </li>
                );
              })}

              {thinking ? (
                <li className="flex items-center gap-2 px-1 py-1 text-xs text-white/45">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-40" />
                    <span className="relative inline-flex size-2 rounded-full bg-accent" />
                  </span>
                  {editingNow
                    ? "Editing note…"
                    : status === "submitted"
                      ? "Starting…"
                      : "Thinking…"}
                </li>
              ) : null}
            </ul>
          )}
        </div>

        {error ? (
          <div className="shrink-0 border-t border-red-500/25 bg-red-500/10 px-4 py-2.5">
            <p className="text-xs text-red-200">{error.message}</p>
            <button
              type="button"
              onClick={() => clearError()}
              className="mt-1 font-mono text-[9px] tracking-wider text-red-200/70 uppercase hover:text-red-100"
            >
              Dismiss
            </button>
          </div>
        ) : null}

        <footer className="shrink-0 border-t border-white/10 p-3.5">
          {pendingFiles.length > 0 ? (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {pendingFiles.map((file, i) => (
                <div
                  key={`${file.filename}-${i}`}
                  className="group relative size-14 overflow-hidden border border-white/15 bg-black/40"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={file.url}
                    alt={file.filename ?? "Attachment"}
                    className="size-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setPendingFiles((prev) =>
                        prev.filter((_, idx) => idx !== i),
                      )
                    }
                    className="absolute top-0.5 right-0.5 bg-black/70 p-0.5 text-white/80 opacity-0 transition group-hover:opacity-100"
                    aria-label="Remove image"
                  >
                    <X className="size-2.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : null}

          {!modelSupportsVision(model) && pendingFiles.length > 0 ? (
            <p className="mb-2 font-mono text-[9px] tracking-wide text-white/35">
              Images →{" "}
              {NOTES_CHAT_MODELS.find(
                (m) => m.id === NOTES_CHAT_VISION_FALLBACK_MODEL,
              )?.label ?? "vision fallback"}
            </p>
          ) : null}

          <NoteChatMentionInput
            value={input}
            onChange={setInput}
            onSubmit={() => void handleSubmit()}
            disabled={thinking}
            placeholder={
              localEdit
                ? mode === "edit"
                  ? "Edit note… (@ context · / commands)"
                  : "Ask… (@ mention · / commands)"
                : "Ask about this note… (@ to reference)"
            }
            mentions={mentionItems}
            referenceIds={referenceIds}
            onReferencesChange={setReferenceIds}
            commands={availableCommands}
            onCommandSelect={(cmd) => void runCommand(cmd)}
            onPasteFiles={(files) => void addPendingImages(files)}
            onDropFiles={(files) => void addPendingImages(files)}
          />
          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  const list = e.target.files;
                  if (list?.length) void addPendingImages(Array.from(list));
                  e.target.value = "";
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={thinking || pendingFiles.length >= MAX_CHAT_IMAGES}
                className="inline-flex items-center gap-1 border border-white/12 px-2 py-1.5 font-mono text-[10px] tracking-wider text-white/45 uppercase transition hover:border-white/25 hover:text-white/75 disabled:opacity-35"
                title="Attach image"
              >
                <ImagePlus className="size-3" />
                Img
              </button>
              <p className="font-mono text-[9px] text-white/20">
                ⌘J · Enter · / · @ · paste
              </p>
            </div>
            <div className="flex gap-1.5">
              {thinking ? (
                <button
                  type="button"
                  onClick={() => stop()}
                  className="inline-flex items-center gap-1.5 border border-white/15 px-2.5 py-1.5 font-mono text-[10px] uppercase text-white/55 transition hover:border-white/30 hover:text-white"
                >
                  <Square className="size-2.5 fill-current" />
                  Stop
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => void handleSubmit()}
                disabled={
                  (!input.trim() && pendingFiles.length === 0) || thinking
                }
                className="inline-flex items-center gap-1.5 bg-accent px-3 py-1.5 font-mono text-[10px] tracking-wider text-[#0a0a0a] uppercase transition hover:bg-accent/90 disabled:opacity-35"
              >
                <Send className="size-3" />
                Send
              </button>
            </div>
          </div>
        </footer>
      </aside>
    </>
  );
}
