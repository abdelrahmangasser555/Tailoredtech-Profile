"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Loader2, Sparkles } from "lucide-react"
import { NoteMarkdown } from "@/components/notes/blocks/note-markdown"
import {
  fetchAndPublishNote,
  publishNoteFromPayload,
} from "@/lib/notes-live"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  CHEATSHEET,
  ModeToggle,
  SNIPPETS,
  TabButton,
  TOOLBAR,
  type EditorMode,
  type EditorTab,
} from "@/components/notes/note-markdown-editor-helpers"

type NoteMarkdownEditorProps = {
  noteId: string
  sectionId: string
  /** When set, updates this block; otherwise appends a new markdown block */
  blockId?: string
  initialContent?: string
  open: boolean
  onClose: () => void
}

export function NoteMarkdownEditor({
  noteId,
  sectionId,
  blockId,
  initialContent = "",
  open,
  onClose,
}: NoteMarkdownEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [tab, setTab] = useState<EditorTab>("write")
  const [mode, setMode] = useState<EditorMode>("freehand")
  const [prompt, setPrompt] = useState("")
  const [busy, setBusy] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    if (open) {
      setContent(initialContent)
      setTab("write")
      setMode("freehand")
      setPrompt("")
      setShowHelp(false)
    }
  }, [open, initialContent])

  const canSave = useMemo(
    () => content.trim().length > 0 && !saving,
    [content, saving]
  )

  if (!open) return null

  function applySnippet(key: keyof typeof SNIPPETS) {
    const ta = textareaRef.current
    if (!ta) return
    const snippet = SNIPPETS[key]
    if (!snippet) return
    const { selectionStart, selectionEnd, value } = ta
    const selected = value.slice(selectionStart, selectionEnd)
    const inner = selected || snippet.placeholder || ""
    const before = snippet.before ?? ""
    const after = snippet.after ?? ""
    const next =
      value.slice(0, selectionStart) +
      before +
      inner +
      after +
      value.slice(selectionEnd)
    setContent(next)

    requestAnimationFrame(() => {
      const el = textareaRef.current
      if (!el) return
      const cursorStart = selectionStart + before.length
      const cursorEnd = cursorStart + inner.length
      el.focus()
      el.setSelectionRange(cursorStart, cursorEnd)
    })
  }

  function handleTabKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== "Tab") return
    e.preventDefault()
    const ta = e.currentTarget
    const { selectionStart, selectionEnd, value } = ta
    const next = value.slice(0, selectionStart) + "  " + value.slice(selectionEnd)
    setContent(next)
    requestAnimationFrame(() => {
      const el = textareaRef.current
      if (!el) return
      el.focus()
      el.setSelectionRange(selectionStart + 2, selectionStart + 2)
    })
  }

  async function runAi() {
    if (busy || !prompt.trim()) return
    setBusy(true)
    try {
      const res = await fetch("/api/local-edit/note-markdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          noteId,
          sectionId,
          prompt: prompt.trim(),
          currentContent: content,
        }),
      })
      const data = (await res.json().catch(() => null)) as {
        markdown?: string
        error?: string
      } | null
      if (!res.ok) throw new Error(data?.error || "AI failed")
      if (!data?.markdown?.trim()) throw new Error("AI returned empty content")
      setContent((prev) =>
        prev.trim() ? `${prev.trimEnd()}\n\n${data.markdown}` : data.markdown
      )
      setMode("freehand")
      setTab("write")
      toast.success("AI draft added")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "AI failed")
    } finally {
      setBusy(false)
    }
  }

  async function save() {
    if (!canSave) return
    setSaving(true)
    try {
      const payload: Record<string, unknown> = {
        noteId,
        sectionId,
        data: { content },
      }
      if (blockId) {
        payload.action = "updateBlock"
        payload.blockId = blockId
      } else {
        payload.action = "append"
        payload.blockType = "markdown"
      }
      const res = await fetch("/api/local-edit/note-section-block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = (await res.json().catch(() => null)) as {
        error?: string
      } | null
      if (!res.ok) throw new Error(data?.error || "Save failed")
      if (!publishNoteFromPayload(data)) {
        await fetchAndPublishNote(noteId)
      }
      toast.success(blockId ? "Markdown updated" : "Markdown block added")
      onClose()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4"
      onClick={() => !busy && !saving && onClose()}
    >
      <div
        className="flex max-h-[88vh] w-full max-w-3xl flex-col border border-white/15 bg-[#0a0a0a] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-3">
            <h3 className="font-pixel-circle text-lg text-white">
              {blockId ? "Edit markdown" : "Add markdown"}
            </h3>
            <span className="font-mono text-[10px] tracking-[0.16em] text-white/30 uppercase">
              {blockId ? "block" : "new block"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <ModeToggle mode={mode} onChange={setMode} />
            <button
              type="button"
              onClick={() => setShowHelp((v) => !v)}
              className={cn(
                "border border-white/15 px-2.5 py-1.5 font-mono text-[10px] tracking-wider uppercase transition",
                showHelp
                  ? "bg-accent text-[#0a0a0a]"
                  : "text-white/50 hover:border-accent/40 hover:text-accent"
              )}
            >
              Syntax
            </button>
          </div>
        </div>

        {showHelp ? (
          <div className="max-h-[40vh] overflow-auto border-b border-white/10 px-4 py-3">
            <p className="font-mono text-[10px] tracking-[0.16em] text-white/40 uppercase">
              Markdown reference
            </p>
            <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {CHEATSHEET.map((row) => (
                <div
                  key={row.syntax}
                  className="flex items-center justify-between gap-3 border border-white/10 bg-black/40 px-2.5 py-1.5"
                >
                  <code className="whitespace-pre-wrap font-mono text-[11px] text-accent">
                    {row.syntax}
                  </code>
                  <span className="font-mono text-[10px] tracking-wider text-white/40 uppercase">
                    {row.renders}
                  </span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowHelp(false)}
              className="mt-3 border border-white/15 px-3 py-1.5 font-mono text-[10px] tracking-wider text-white/50 uppercase hover:text-white"
            >
              Close reference
            </button>
          </div>
        ) : null}

        {mode === "ai" ? (
          <div className="border-b border-white/10 px-4 py-3">
            <p className="text-[12px] text-white/40">
              Describe what this section should cover. AI uses the note and the
              current section as context, then drops a draft you can edit.
            </p>
            <textarea
              autoFocus
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              placeholder="e.g. Explain how git staging works with a short example and a 3-item checklist"
              className="mt-2 w-full resize-none border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-accent/40 focus:outline-none"
            />
            <div className="mt-2 flex items-center justify-between gap-2">
              <p className="font-mono text-[10px] tracking-wider text-white/30 uppercase">
                Draft appends to the editor below
              </p>
              <button
                type="button"
                disabled={busy || !prompt.trim()}
                onClick={() => void runAi()}
                className="inline-flex items-center gap-1.5 bg-accent px-3 py-1.5 font-mono text-[10px] tracking-wider text-[#0a0a0a] uppercase disabled:opacity-40"
              >
                {busy ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  <Sparkles className="size-3" />
                )}
                Generate draft
              </button>
            </div>
          </div>
        ) : null}

        <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
          <div className="flex flex-wrap items-center gap-1">
            {TOOLBAR.map((tool) => (
              <button
                key={tool.key}
                type="button"
                title={tool.label}
                aria-label={tool.label}
                onClick={() => applySnippet(tool.key)}
                disabled={tab !== "write"}
                className="flex size-7 items-center justify-center border border-white/10 text-white/55 transition hover:border-accent/40 hover:text-accent disabled:opacity-30"
              >
                {tool.icon}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <TabButton active={tab === "write"} onClick={() => setTab("write")}>
              Write
            </TabButton>
            <TabButton
              active={tab === "preview"}
              onClick={() => setTab("preview")}
            >
              Preview
            </TabButton>
          </div>
        </div>

        <div className="min-h-[40vh] flex-1 overflow-auto">
          {tab === "write" ? (
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleTabKey}
              spellCheck={false}
              placeholder="Write markdown here. Use the toolbar above or tap Syntax for a reference."
              className="block h-full min-h-[40vh] w-full resize-none bg-transparent px-4 py-3 font-mono text-[13px] leading-relaxed text-white/85 placeholder:text-white/25 focus:outline-none"
            />
          ) : (
            <div className="px-4 py-4">
              {content.trim() ? (
                <NoteMarkdown content={content} />
              ) : (
                <p className="text-sm text-white/30">Nothing to preview yet.</p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-white/10 px-4 py-3">
          <p className="font-mono text-[10px] tracking-wider text-white/30 uppercase">
            {content.length} chars
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={busy || saving}
              onClick={onClose}
              className="border border-white/15 px-3 py-1.5 font-mono text-[10px] tracking-wider text-white/50 uppercase"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!canSave}
              onClick={() => void save()}
              className="inline-flex items-center gap-1.5 bg-accent px-3 py-1.5 font-mono text-[10px] tracking-wider text-[#0a0a0a] uppercase disabled:opacity-40"
            >
              {saving ? <Loader2 className="size-3 animate-spin" /> : null}
              {blockId ? "Save changes" : "Add block"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
