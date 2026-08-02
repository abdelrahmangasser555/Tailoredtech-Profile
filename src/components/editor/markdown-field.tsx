"use client"

import { useRef } from "react"
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Link2,
  Highlighter,
  Maximize2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { FieldLabel } from "@/components/editor/fields"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { EditorStage } from "@/components/editor/editor-stage"
import { Button } from "@/components/ui/button"
import { useState } from "react"

type MarkdownFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  hint?: string
  rows?: number
  className?: string
  /** Allow expand-to-center stage */
  expandable?: boolean
}

function wrapSelection(
  el: HTMLTextAreaElement,
  before: string,
  after: string,
  emptyPlaceholder = "text"
) {
  const start = el.selectionStart
  const end = el.selectionEnd
  const selected = el.value.slice(start, end) || emptyPlaceholder
  const next =
    el.value.slice(0, start) + before + selected + after + el.value.slice(end)
  return {
    next,
    cursorStart: start + before.length,
    cursorEnd: start + before.length + selected.length,
  }
}

function prefixLines(el: HTMLTextAreaElement, prefix: string) {
  const start = el.selectionStart
  const end = el.selectionEnd
  const before = el.value.slice(0, start)
  const selected = el.value.slice(start, end) || "item"
  const after = el.value.slice(end)
  const lines = selected.split("\n").map((line) => {
    const trimmed = line.replace(/^\s+/, "")
    if (!trimmed) return prefix
    if (trimmed.startsWith(prefix)) return line
    return `${prefix}${trimmed}`
  })
  const block = lines.join("\n")
  return {
    next: before + block + after,
    cursorStart: start,
    cursorEnd: start + block.length,
  }
}

function MarkdownToolbar({
  textareaRef,
  value,
  onChange,
  extra,
}: {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
  value: string
  onChange: (v: string) => void
  extra?: React.ReactNode
}) {
  function apply(
    mutator: (el: HTMLTextAreaElement) => {
      next: string
      cursorStart: number
      cursorEnd: number
    }
  ) {
    const el = textareaRef.current
    if (!el) return
    const { next, cursorStart, cursorEnd } = mutator(el)
    onChange(next)
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(cursorStart, cursorEnd)
    })
  }

  const tools = [
    {
      icon: Bold,
      label: "Bold",
      run: () => apply((el) => wrapSelection(el, "**", "**", "bold")),
    },
    {
      icon: Italic,
      label: "Italic",
      run: () => apply((el) => wrapSelection(el, "_", "_", "italic")),
    },
    {
      icon: Highlighter,
      label: "Highlight",
      run: () => apply((el) => wrapSelection(el, "**", "**", "highlight")),
    },
    {
      icon: Heading2,
      label: "Heading",
      run: () =>
        apply((el) => {
          const start = el.selectionStart
          const lineStart = el.value.lastIndexOf("\n", start - 1) + 1
          const next =
            el.value.slice(0, lineStart) + "### " + el.value.slice(lineStart)
          return {
            next,
            cursorStart: start + 4,
            cursorEnd: el.selectionEnd + 4,
          }
        }),
    },
    {
      icon: List,
      label: "Bullet list",
      run: () => apply((el) => prefixLines(el, "- ")),
    },
    {
      icon: ListOrdered,
      label: "Numbered list",
      run: () => apply((el) => prefixLines(el, "1. ")),
    },
    {
      icon: Link2,
      label: "Link",
      run: () => apply((el) => wrapSelection(el, "[", "](url)", "link")),
    },
  ] as const

  return (
    <InputGroupAddon
      align="block-start"
      className="gap-0.5 border-b border-white/10 px-1.5 py-1"
    >
      {tools.map((tool) => (
        <InputGroupButton
          key={tool.label}
          type="button"
          size="icon-xs"
          variant="ghost"
          aria-label={tool.label}
          title={tool.label}
          className="text-white/50 hover:bg-white/5 hover:text-[#D4FF00]"
          onClick={tool.run}
        >
          <tool.icon className="size-3.5" />
        </InputGroupButton>
      ))}
      <span className="ml-auto flex items-center gap-1">{extra}</span>
      {/* keep value referenced for lint */}
      <span className="sr-only">{value.length}</span>
    </InputGroupAddon>
  )
}

export function MarkdownField({
  label,
  value,
  onChange,
  hint,
  rows = 5,
  className,
  expandable = true,
}: MarkdownFieldProps) {
  const ref = useRef<HTMLTextAreaElement>(null)
  const expandRef = useRef<HTMLTextAreaElement>(null)
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={cn("min-w-0", className)}>
      <FieldLabel hint={hint}>{label}</FieldLabel>
      <InputGroup
        className={cn(
          "h-auto flex-col rounded-none border-white/15 bg-white/[0.03]",
          "has-[[data-slot=input-group-control]:focus-visible]:border-[#D4FF00]",
          "has-[[data-slot=input-group-control]:focus-visible]:ring-[#D4FF00]/25"
        )}
      >
        <MarkdownToolbar
          textareaRef={ref}
          value={value}
          onChange={onChange}
          extra={
            expandable ? (
              <InputGroupButton
                type="button"
                size="icon-xs"
                variant="ghost"
                aria-label="Expand editor"
                title="Expand"
                className="text-white/50 hover:text-[#D4FF00]"
                onClick={() => setExpanded(true)}
              >
                <Maximize2 className="size-3.5" />
              </InputGroupButton>
            ) : null
          }
        />
        <InputGroupTextarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className="min-h-[6rem] font-mono text-[12px] leading-relaxed text-white/85 placeholder:text-white/25"
          placeholder="Markdown body…"
        />
      </InputGroup>

      <EditorStage
        open={expanded}
        onOpenChange={setExpanded}
        title="Markdown editor"
        description="Select text and use the toolbar. Changes sync live."
        size="lg"
        footer={
          <div className="flex justify-end">
            <Button
              type="button"
              variant="accent"
              className="h-9 rounded-none px-4"
              onClick={() => setExpanded(false)}
            >
              Done
            </Button>
          </div>
        }
      >
        <InputGroup className="h-auto flex-col rounded-none border-white/15 bg-white/[0.03]">
          <MarkdownToolbar
            textareaRef={expandRef}
            value={value}
            onChange={onChange}
          />
          <InputGroupTextarea
            ref={expandRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={18}
            className="min-h-[50vh] font-mono text-[13px] leading-relaxed text-white/90"
            placeholder="Markdown body…"
          />
        </InputGroup>
      </EditorStage>
    </div>
  )
}
