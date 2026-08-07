"use client"

import { useEffect, useState } from "react"
import { Check, Copy } from "lucide-react"
import { codeToHtml, bundledLanguages, type BundledLanguage } from "shiki"
import { cn } from "@/lib/utils"

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
  yml: "yaml",
  md: "markdown",
  text: "plaintext",
  txt: "plaintext",
  plaintext: "plaintext",
}

function resolveShikiLang(raw: string): BundledLanguage {
  const label = raw.replace(/^language-/, "").toLowerCase() || "plaintext"
  const aliased = LANG_ALIASES[label] ?? label
  if (aliased in bundledLanguages) return aliased
  return "plaintext"
}

/**
 * Modern fenced-code renderer via Shiki + copy button.
 */
export function NoteCodeBlock({
  code,
  language = "text",
  className,
}: NoteCodeBlockProps) {
  const [html, setHtml] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const shikiLang = resolveShikiLang(language)
  const displayLang = language.replace(/^language-/, "") || "text"

  useEffect(() => {
    let cancelled = false
    const source = code.replace(/\n$/, "")

    codeToHtml(source, {
      lang: shikiLang,
      theme: "github-dark-default",
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
  }, [code, shikiLang])

  async function copy() {
    try {
      await navigator.clipboard.writeText(code.replace(/\n$/, ""))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      /* ignore */
    }
  }

  return (
    <div
      className={cn(
        "note-code group relative mt-5 overflow-hidden border border-white/10 first:mt-0",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-white/10 bg-white/3 px-3 py-1.5">
        <span className="font-mono text-[10px] tracking-[0.16em] text-white/35 uppercase">
          {displayLang}
        </span>
        <button
          type="button"
          onClick={copy}
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
              Copy
            </>
          )}
        </button>
      </div>

      {html ? (
        <div
          className="[&_pre]:m-0 [&_pre]:overflow-x-auto [&_pre]:bg-transparent! [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-[13px] [&_pre]:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="overflow-x-auto bg-black/40 p-4 font-mono text-[13px] leading-relaxed text-white/75">
          <code>{code}</code>
        </pre>
      )}
    </div>
  )
}
