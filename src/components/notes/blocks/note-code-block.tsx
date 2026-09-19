"use client"

import { useEffect, useState } from "react"
import { Check, Copy } from "lucide-react"
import { codeToHtml, bundledLanguages, type BundledLanguage } from "shiki"
import { transformerNotationDiff } from "@shikijs/transformers"
import { cn } from "@/lib/utils"
import {
  parseCodeMeta,
  parseNoteCodeDiff,
  type DiffLineKind,
} from "@/lib/notes-code-diff"

type NoteCodeBlockProps = {
  code: string
  language?: string
  className?: string
}

const LANG_ALIASES: Record<string, BundledLanguage> = {
  ts: "typescript",
  tsx: "tsx",
  js: "javascript",
  jsx: "jsx",
  sh: "bash",
  shell: "bash",
  zsh: "bash",
  terminal: "bash",
  console: "bash",
  yml: "yaml",
  md: "markdown",
  text: "plaintext",
  txt: "plaintext",
  plaintext: "plaintext",
}

const TERMINAL_LANGS = new Set([
  "bash",
  "sh",
  "shell",
  "zsh",
  "terminal",
  "console",
])

function resolveShikiLang(raw: string): BundledLanguage {
  const aliased = LANG_ALIASES[raw.toLowerCase()] ?? raw.toLowerCase()
  if (aliased in bundledLanguages) return aliased
  return "plaintext"
}

function CodeChrome({
  displayLang,
  isTerminal,
  filename,
  hasDiff,
  copied,
  onCopy,
}: {
  displayLang: string
  isTerminal: boolean
  filename?: string
  hasDiff: boolean
  copied: boolean
  onCopy: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-white/3 px-3 py-1.5">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] tracking-[0.16em] text-white/35 uppercase">
          {displayLang}
        </span>
        {isTerminal ? (
          <span className="truncate font-mono text-[10px] tracking-[0.08em] text-white/55">
            Run this in your terminal
          </span>
        ) : filename ? (
          <span className="truncate font-mono text-[10px] text-white/45">
            {filename}
          </span>
        ) : null}
        {hasDiff ? (
          <span className="flex items-center gap-2 font-mono text-[9px] tracking-[0.12em] uppercase">
            <span className="text-accent">+ add</span>
            <span className="text-white/35">− remove</span>
          </span>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onCopy}
        className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em] text-white/40 uppercase transition hover:text-accent"
      >
        {copied ? (
          <>
            <Check className="size-3" />
            Copied
          </>
        ) : (
          <>
            <Copy className="size-3" />
            {hasDiff ? "Copy needed" : "Copy"}
          </>
        )}
      </button>
    </div>
  )
}

function FallbackDiffPre({
  lines,
  kinds,
}: {
  lines: string[]
  kinds: DiffLineKind[]
}) {
  return (
    <pre className="note-code-pre notes-thin-scroll has-diff overflow-x-auto overflow-y-hidden bg-black/40 p-0 font-mono text-[13px] leading-relaxed text-white/80">
      {lines.map((line, i) => {
        const kind = kinds[i] ?? "context"
        return (
          <span
            key={i}
            className={cn(
              "line",
              kind === "add" && "diff add",
              kind === "remove" && "diff remove"
            )}
          >
            {line || " "}
          </span>
        )
      })}
    </pre>
  )
}

/**
 * Shiki fenced code. Diff lines: `+ ` / `- ` prefixes, `// [!code ++]`,
 * or fence meta `add=` / `remove=`. Copy omits removed lines and markers.
 */
export function NoteCodeBlock({
  code,
  language = "text",
  className,
}: NoteCodeBlockProps) {
  const [html, setHtml] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const meta = parseCodeMeta(language)
  const parsed = parseNoteCodeDiff(code, {
    addLines: meta.addLines,
    removeLines: meta.removeLines,
  })
  const shikiLang = resolveShikiLang(meta.lang)
  const isTerminal = TERMINAL_LANGS.has(meta.lang.toLowerCase())
  const displayLang = isTerminal ? "terminal" : meta.lang || "text"

  async function copy() {
    try {
      await navigator.clipboard.writeText(parsed.copyCode)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    let cancelled = false
    const kinds = parsed.kinds
    const hasDiff = parsed.hasDiff

    codeToHtml(parsed.displayCode, {
      lang: shikiLang,
      theme: "github-dark-default",
      transformers: [
        transformerNotationDiff({
          classLineAdd: "diff add",
          classLineRemove: "diff remove",
          classActivePre: "has-diff",
          matchAlgorithm: "v3",
        }),
        {
          name: "note-line-diff",
          line(node, line) {
            const kind = kinds[line - 1]
            if (kind === "add") this.addClassToHast(node, "diff add")
            if (kind === "remove") this.addClassToHast(node, "diff remove")
          },
          code(node) {
            const kids = node.children
            const last = kids[kids.length - 1]
            if (
              last &&
              last.type === "element" &&
              Array.isArray(last.children) &&
              last.children.length === 0
            ) {
              kids.pop()
            }
          },
          pre(node) {
            if (hasDiff) this.addClassToHast(node, "has-diff")
          },
        },
      ],
    })
      .then((result: string) => {
        if (!cancelled) setHtml(result)
      })
      .catch(() => {
        if (!cancelled) setHtml(null)
      })

    return () => {
      cancelled = true
    }
  }, [parsed.displayCode, parsed.hasDiff, shikiLang, parsed.kinds.join(",")])

  return (
    <div
      className={cn(
        "note-code group relative mt-5 overflow-hidden border border-white/10 first:mt-0",
        parsed.hasDiff && "note-code-diff",
        className
      )}
    >
      <CodeChrome
        displayLang={displayLang}
        isTerminal={isTerminal}
        filename={meta.filename}
        hasDiff={parsed.hasDiff}
        copied={copied}
        onCopy={copy}
      />

      {html ? (
        <div
          className="note-code-shiki notes-thin-scroll [&_pre]:m-0 [&_pre]:overflow-x-auto [&_pre]:overflow-y-hidden [&_pre]:bg-transparent! [&_pre]:px-4 [&_pre]:py-3 [&_pre]:font-mono [&_pre]:text-[13px] [&_pre]:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <FallbackDiffPre
          lines={parsed.displayCode.split("\n")}
          kinds={parsed.kinds}
        />
      )}
    </div>
  )
}
