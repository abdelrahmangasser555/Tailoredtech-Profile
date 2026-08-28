"use client"

import {
  Bold,
  Code,
  Code2,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Table2,
} from "lucide-react"
import { cn } from "@/lib/utils"

export type EditorMode = "freehand" | "ai"
export type EditorTab = "write" | "preview"

export type Insert = {
  before: string
  after?: string
  placeholder?: string
  block?: boolean
}

export const SNIPPETS: Record<string, Insert> = {
  bold: { before: "**", after: "**", placeholder: "bold" },
  italic: { before: "*", after: "*", placeholder: "italic" },
  code: { before: "`", after: "`", placeholder: "code" },
  codeblock: {
    before: "\n```ts\n",
    after: "\n```\n",
    placeholder: "code here",
    block: true,
  },
  h2: { before: "\n## ", after: "\n", placeholder: "Heading", block: true },
  h3: { before: "\n### ", after: "\n", placeholder: "Subheading", block: true },
  ul: { before: "- ", placeholder: "item", block: true },
  ol: { before: "1. ", placeholder: "item", block: true },
  quote: { before: "\n> ", after: "\n", placeholder: "quote", block: true },
  link: { before: "[", after: "](https://)", placeholder: "label" },
  hr: { before: "\n---\n", block: true },
  table: {
    before:
      "\n| Column A | Column B |\n| --- | --- |\n| cell | cell |\n| cell | cell |\n",
    block: true,
  },
}

export const TOOLBAR: {
  key: keyof typeof SNIPPETS
  label: string
  icon: React.ReactNode
}[] = [
  { key: "bold", label: "Bold", icon: <Bold className="size-3.5" /> },
  { key: "italic", label: "Italic", icon: <Italic className="size-3.5" /> },
  { key: "code", label: "Inline code", icon: <Code className="size-3.5" /> },
  { key: "codeblock", label: "Code block", icon: <Code2 className="size-3.5" /> },
  { key: "h2", label: "Heading", icon: <Heading2 className="size-3.5" /> },
  { key: "h3", label: "Subheading", icon: <Heading3 className="size-3.5" /> },
  { key: "ul", label: "Bulleted list", icon: <List className="size-3.5" /> },
  { key: "ol", label: "Numbered list", icon: <ListOrdered className="size-3.5" /> },
  { key: "quote", label: "Quote", icon: <Quote className="size-3.5" /> },
  { key: "link", label: "Link", icon: <Link2 className="size-3.5" /> },
  { key: "table", label: "Table", icon: <Table2 className="size-3.5" /> },
  { key: "hr", label: "Divider", icon: <Minus className="size-3.5" /> },
]

export const CHEATSHEET: { syntax: string; renders: string }[] = [
  { syntax: "**bold**", renders: "bold" },
  { syntax: "*italic*", renders: "italic" },
  { syntax: "`code`", renders: "inline code" },
  { syntax: "## Heading", renders: "section heading" },
  { syntax: "### Subheading", renders: "smaller heading" },
  { syntax: "- item", renders: "bullet list" },
  { syntax: "1. item", renders: "numbered list" },
  { syntax: "> quote", renders: "blockquote" },
  { syntax: "[label](url)", renders: "link" },
  { syntax: "```ts\ncode\n```", renders: "code block" },
  { syntax: "| A | B |\n| --- | --- |\n| 1 | 2 |", renders: "table" },
  { syntax: "---", renders: "horizontal rule" },
]

export function ModeToggle({
  mode,
  onChange,
}: {
  mode: EditorMode
  onChange: (mode: EditorMode) => void
}) {
  return (
    <div className="flex border border-white/15">
      <button
        type="button"
        onClick={() => onChange("freehand")}
        className={cn(
          "px-2.5 py-1.5 font-mono text-[10px] tracking-wider uppercase transition",
          mode === "freehand"
            ? "bg-accent text-[#0a0a0a]"
            : "text-white/50 hover:text-white"
        )}
      >
        Freehand
      </button>
      <button
        type="button"
        onClick={() => onChange("ai")}
        className={cn(
          "px-2.5 py-1.5 font-mono text-[10px] tracking-wider uppercase transition",
          mode === "ai"
            ? "bg-accent text-[#0a0a0a]"
            : "text-white/50 hover:text-white"
        )}
      >
        AI
      </button>
    </div>
  )
}

export function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "border px-2.5 py-1.5 font-mono text-[10px] tracking-wider uppercase transition",
        active
          ? "border-accent/40 bg-accent/10 text-accent"
          : "border-white/15 text-white/50 hover:text-white"
      )}
    >
      {children}
    </button>
  )
}
