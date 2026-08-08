"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { FileText, Folder, Slash } from "lucide-react"
import type { NoteMentionItem } from "@/lib/notes-chat/context"
import type { NotesChatCommand } from "@/lib/notes-chat/commands"
import { cn } from "@/lib/utils"

const MIN_HEIGHT = 72
const MAX_HEIGHT = 168

type NoteChatMentionInputProps = {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
  placeholder?: string
  mentions: NoteMentionItem[]
  referenceIds: string[]
  onReferencesChange: (ids: string[]) => void
  commands?: NotesChatCommand[]
  onCommandSelect?: (command: NotesChatCommand) => void
  onPasteFiles?: (files: File[]) => void
  onDropFiles?: (files: File[]) => void
}

type TextSegment =
  | { type: "text"; text: string }
  | { type: "mention"; text: string; item: NoteMentionItem }
  | { type: "command"; text: string; command: NotesChatCommand }

function buildSegments(
  value: string,
  mentions: NoteMentionItem[],
  referenceIds: string[],
  commands: NotesChatCommand[]
): TextSegment[] {
  if (!value) return []

  const mentionCandidates = mentions.filter(
    (m) => referenceIds.includes(m.id) || value.includes(`@${m.name}`)
  )
  const commandCandidates = commands.filter((c) =>
    value.toLowerCase().includes(`/${c.slash}`)
  )

  type Hit = {
    start: number
    end: number
    segment: TextSegment
  }

  const hits: Hit[] = []

  for (const item of mentionCandidates) {
    const token = `@${item.name}`
    let from = 0
    while (from < value.length) {
      const idx = value.indexOf(token, from)
      if (idx < 0) break
      hits.push({
        start: idx,
        end: idx + token.length,
        segment: { type: "mention", text: token, item },
      })
      from = idx + token.length
    }
  }

  for (const command of commandCandidates) {
    const token = `/${command.slash}`
    const lower = value.toLowerCase()
    let from = 0
    while (from < lower.length) {
      const idx = lower.indexOf(token, from)
      if (idx < 0) break
      hits.push({
        start: idx,
        end: idx + token.length,
        segment: {
          type: "command",
          text: value.slice(idx, idx + token.length),
          command,
        },
      })
      from = idx + token.length
    }
  }

  if (hits.length === 0) return [{ type: "text", text: value }]

  hits.sort((a, b) => a.start - b.start || b.end - a.end)
  const picked: Hit[] = []
  let cursor = 0
  for (const hit of hits) {
    if (hit.start < cursor) continue
    picked.push(hit)
    cursor = hit.end
  }

  const segments: TextSegment[] = []
  let last = 0
  for (const hit of picked) {
    if (hit.start > last) {
      segments.push({ type: "text", text: value.slice(last, hit.start) })
    }
    segments.push(hit.segment)
    last = hit.end
  }
  if (last < value.length) {
    segments.push({ type: "text", text: value.slice(last) })
  }
  return segments
}

function mentionAtIndex(
  value: string,
  index: number,
  mentions: NoteMentionItem[],
  referenceIds: string[],
  commands: NotesChatCommand[]
): NoteMentionItem | null {
  const segments = buildSegments(value, mentions, referenceIds, commands)
  let cursor = 0
  for (const seg of segments) {
    const next = cursor + seg.text.length
    if (index >= cursor && index < next) {
      return seg.type === "mention" ? seg.item : null
    }
    cursor = next
  }
  return null
}

export function NoteChatMentionInput({
  value,
  onChange,
  onSubmit,
  disabled,
  placeholder,
  mentions,
  referenceIds,
  onReferencesChange,
  commands = [],
  onCommandSelect,
  onPasteFiles,
  onDropFiles,
}: NoteChatMentionInputProps) {
  const router = useRouter()
  const [mentionOpen, setMentionOpen] = useState(false)
  const [mentionQuery, setMentionQuery] = useState("")
  const [mentionIndex, setMentionIndex] = useState(0)
  const [commandOpen, setCommandOpen] = useState(false)
  const [commandQuery, setCommandQuery] = useState("")
  const [commandIndex, setCommandIndex] = useState(0)
  const [dragging, setDragging] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const mirrorRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const filteredMentions = mentions.filter((m) => {
    const q = mentionQuery.toLowerCase()
    if (!q) return true
    return (
      m.name.toLowerCase().includes(q) ||
      m.pathLabel.toLowerCase().includes(q) ||
      m.id.toLowerCase().includes(q)
    )
  })

  const filteredCommands = commands.filter((c) => {
    const q = commandQuery.toLowerCase()
    if (!q) return true
    return (
      c.slash.includes(q) ||
      c.label.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
    )
  })

  const segments = useMemo(
    () => buildSegments(value, mentions, referenceIds, commands),
    [value, mentions, referenceIds, commands]
  )

  useEffect(() => {
    setMentionIndex(0)
  }, [mentionQuery, mentionOpen])

  useEffect(() => {
    setCommandIndex(0)
  }, [commandQuery, commandOpen])

  useEffect(() => {
    if ((!mentionOpen && !commandOpen) || !listRef.current) return
    const active = listRef.current.querySelector<HTMLElement>(
      `[data-picker-index="${mentionOpen ? mentionIndex : commandIndex}"]`
    )
    active?.scrollIntoView({ block: "nearest" })
  }, [mentionIndex, commandIndex, mentionOpen, commandOpen])

  useEffect(() => {
    const el = textareaRef.current
    const mirror = mirrorRef.current
    if (!el) return
    el.style.height = "auto"
    const next = Math.min(Math.max(el.scrollHeight, MIN_HEIGHT), MAX_HEIGHT)
    el.style.height = `${next}px`
    if (mirror) mirror.style.height = `${next}px`
  }, [value])

  function syncMirrorScroll() {
    const el = textareaRef.current
    const mirror = mirrorRef.current
    if (!el || !mirror) return
    mirror.scrollTop = el.scrollTop
  }

  function closePickers() {
    setMentionOpen(false)
    setMentionQuery("")
    setCommandOpen(false)
    setCommandQuery("")
  }

  function insertMention(item: NoteMentionItem) {
    const el = textareaRef.current
    if (!el) return

    const cursor = el.selectionStart
    const before = value.slice(0, cursor)
    const atIndex = before.lastIndexOf("@")
    if (atIndex < 0) return

    const next = `${value.slice(0, atIndex)}@${item.name} ${value.slice(cursor)}`
    onChange(next)

    if (!referenceIds.includes(item.id)) {
      onReferencesChange([...referenceIds, item.id])
    }

    closePickers()
    requestAnimationFrame(() => {
      el.focus()
      const pos = atIndex + item.name.length + 2
      el.setSelectionRange(pos, pos)
    })
  }

  function selectCommand(command: NotesChatCommand) {
    closePickers()
    onChange("")
    onCommandSelect?.(command)
  }

  function updatePickers(next: string, cursor: number) {
    const before = next.slice(0, cursor)

    const atIndex = before.lastIndexOf("@")
    const slashIndex = before.lastIndexOf("/")

    const atActive =
      atIndex >= 0 &&
      !before.slice(atIndex + 1).includes(" ") &&
      (slashIndex < 0 || atIndex > slashIndex)

    const slashActive =
      slashIndex >= 0 &&
      !before.slice(slashIndex + 1).includes(" ") &&
      (atIndex < 0 || slashIndex > atIndex) &&
      (slashIndex === 0 || /\s/.test(before[slashIndex - 1] ?? " "))

    if (atActive) {
      setMentionOpen(true)
      setMentionQuery(before.slice(atIndex + 1))
      setCommandOpen(false)
      setCommandQuery("")
      return
    }

    if (slashActive && commands.length > 0) {
      setCommandOpen(true)
      setCommandQuery(before.slice(slashIndex + 1))
      setMentionOpen(false)
      setMentionQuery("")
      return
    }

    closePickers()
  }

  function handleChange(next: string) {
    onChange(next)
    const el = textareaRef.current
    if (!el) return
    updatePickers(next, el.selectionStart)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (commandOpen && filteredCommands.length > 0) {
      const len = Math.min(filteredCommands.length, 20)
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setCommandIndex((i) => (i + 1) % len)
        return
      }
      if (e.key === "ArrowUp") {
        e.preventDefault()
        setCommandIndex((i) => (i - 1 + len) % len)
        return
      }
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        const item = filteredCommands[commandIndex]
        if (item) selectCommand(item)
        return
      }
      if (e.key === "Escape") {
        setCommandOpen(false)
        return
      }
    }

    if (mentionOpen && filteredMentions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setMentionIndex((i) => (i + 1) % Math.min(filteredMentions.length, 40))
        return
      }
      if (e.key === "ArrowUp") {
        e.preventDefault()
        const len = Math.min(filteredMentions.length, 40)
        setMentionIndex((i) => (i - 1 + len) % len)
        return
      }
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        const item = filteredMentions[mentionIndex]
        if (item) insertMention(item)
        return
      }
      if (e.key === "Escape") {
        setMentionOpen(false)
        return
      }
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSubmit()
    }
  }

  function handleClick(e: React.MouseEvent<HTMLTextAreaElement>) {
    const el = textareaRef.current
    if (!el) return
    requestAnimationFrame(() => {
      const item = mentionAtIndex(
        value,
        el.selectionStart,
        mentions,
        referenceIds,
        commands
      )
      if (!item) return
      const href = `/notes/${item.pathIds.join("/")}`
      if (e.metaKey || e.ctrlKey) {
        window.open(href, "_blank", "noopener,noreferrer")
      } else {
        router.push(href)
      }
    })
  }

  function collectImages(list: FileList | File[]): File[] {
    return Array.from(list).filter((f) => f.type.startsWith("image/"))
  }

  function handlePaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    if (!onPasteFiles) return
    const fromList = collectImages(e.clipboardData.files)
    const fromItems: File[] = []
    for (const item of Array.from(e.clipboardData.items)) {
      if (item.kind !== "file" || !item.type.startsWith("image/")) continue
      const file = item.getAsFile()
      if (file) fromItems.push(file)
    }
    const seen = new Set<string>()
    const files = [...fromList, ...fromItems].filter((f) => {
      const key = `${f.name}-${f.size}-${f.lastModified}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    if (files.length) {
      e.preventDefault()
      onPasteFiles(files)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const files = collectImages(e.dataTransfer.files)
    if (files.length && onDropFiles) onDropFiles(files)
  }

  const visibleMentions = filteredMentions.slice(0, 40)
  const visibleCommands = filteredCommands.slice(0, 20)

  return (
    <div
      className="relative"
      onDragEnter={(e) => {
        e.preventDefault()
        if (e.dataTransfer.types.includes("Files")) setDragging(true)
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={(e) => {
        if (e.currentTarget.contains(e.relatedTarget as Node)) return
        setDragging(false)
      }}
      onDrop={handleDrop}
    >
      {commandOpen && visibleCommands.length > 0 ? (
        <ul
          ref={listRef}
          data-lenis-prevent
          data-lenis-prevent-wheel
          onWheel={(e) => e.stopPropagation()}
          className="notes-panel-scroll absolute bottom-full left-0 right-0 z-20 mb-1 max-h-52 overflow-y-auto overscroll-contain border border-white/15 bg-[#0c0c0c] py-1 shadow-xl"
          role="listbox"
          aria-label="Chat commands"
        >
          {visibleCommands.map((item, i) => (
            <li key={item.id}>
              <button
                type="button"
                role="option"
                data-picker-index={i}
                aria-selected={i === commandIndex}
                onMouseDown={(e) => {
                  e.preventDefault()
                  selectCommand(item)
                }}
                className={cn(
                  "flex w-full items-start gap-2 px-3 py-2 text-left transition",
                  i === commandIndex
                    ? "bg-accent/15 text-white"
                    : "text-white/70 hover:bg-white/5"
                )}
              >
                <Slash className="mt-0.5 size-3 shrink-0 text-accent/80" />
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-medium">
                    /{item.slash}
                    <span className="ml-2 font-normal text-white/45">
                      {item.label}
                    </span>
                  </span>
                  <span className="mt-0.5 block text-[10px] leading-snug text-white/35">
                    {item.description}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {mentionOpen && visibleMentions.length > 0 ? (
        <ul
          ref={listRef}
          data-lenis-prevent
          data-lenis-prevent-wheel
          onWheel={(e) => e.stopPropagation()}
          className="notes-panel-scroll absolute bottom-full left-0 right-0 z-20 mb-1 max-h-48 overflow-y-auto overscroll-contain border border-white/15 bg-[#0c0c0c] py-1 shadow-xl"
          role="listbox"
        >
          {visibleMentions.map((item, i) => (
            <li key={`${item.type}-${item.id}`}>
              <button
                type="button"
                role="option"
                data-picker-index={i}
                aria-selected={i === mentionIndex}
                onMouseDown={(e) => {
                  e.preventDefault()
                  insertMention(item)
                }}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition",
                  i === mentionIndex
                    ? "bg-accent/15 text-white"
                    : "text-white/70 hover:bg-white/5"
                )}
              >
                {item.type === "folder" ? (
                  <Folder className="size-3 shrink-0 text-accent/70" />
                ) : (
                  <FileText className="size-3 shrink-0 opacity-50" />
                )}
                <span className="min-w-0 truncate font-medium">{item.name}</span>
                <span className="ml-auto truncate font-mono text-[9px] text-white/30">
                  {item.type === "folder" ? "folder" : item.pathLabel}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <div
        className={cn(
          "relative border bg-black/40 transition",
          dragging
            ? "border-accent/60 ring-1 ring-accent/30"
            : "border-white/12 focus-within:border-accent/40"
        )}
      >
        <div
          ref={mirrorRef}
          aria-hidden
          data-lenis-prevent
          className="notes-panel-scroll pointer-events-none absolute inset-0 overflow-y-auto px-3 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap wrap-anywhere"
          style={{ minHeight: MIN_HEIGHT, maxHeight: MAX_HEIGHT }}
        >
          {segments.length === 0 ? (
            <span className="text-white/28">{placeholder}</span>
          ) : (
            segments.map((seg, i) =>
              seg.type === "mention" ? (
                <span
                  key={i}
                  className="rounded-[2px] bg-accent/20 font-medium text-accent underline decoration-accent/40 underline-offset-2"
                >
                  {seg.text}
                </span>
              ) : seg.type === "command" ? (
                <span
                  key={i}
                  className="rounded-[2px] bg-white/10 font-mono text-[12px] font-medium text-accent"
                >
                  {seg.text}
                </span>
              ) : (
                <span key={i} className="text-white/90">
                  {seg.text}
                </span>
              )
            )
          )}
          <br />
        </div>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onClick={handleClick}
          onPaste={handlePaste}
          onScroll={syncMirrorScroll}
          disabled={disabled}
          rows={3}
          placeholder=""
          title="Type / for commands · @ to mention · click @mention to open"
          className="notes-chat-input notes-panel-scroll relative z-[1] w-full resize-none overflow-y-auto bg-transparent px-3 py-2.5 text-[13px] leading-relaxed caret-accent focus:outline-none disabled:opacity-50"
          style={{ minHeight: MIN_HEIGHT, maxHeight: MAX_HEIGHT }}
        />

        {dragging ? (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/55 font-mono text-[10px] tracking-wider text-accent uppercase">
            Drop image
          </div>
        ) : null}
      </div>
    </div>
  )
}
