"use client"

import type { ReactNode } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { NoteCodeBlock } from "@/components/notes/blocks/note-code-block"
import { cn } from "@/lib/utils"

type NoteMarkdownProps = {
  content: string
  className?: string
  /** Map explain id → open sheet */
  onExplain?: (id: string) => void
}

const EXPLAIN_RE = /\[\[([a-zA-Z0-9_-]+)(?:\|([^\]]+))?\]\]/g

function withExplains(
  text: string,
  onExplain?: (id: string) => void
): ReactNode[] {
  const parts: ReactNode[] = []
  let last = 0
  let match: RegExpExecArray | null
  const re = new RegExp(EXPLAIN_RE)
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index))
    }
    const id = match[1]!
    const label = match[2] || id.replace(/-/g, " ")
    parts.push(
      <button
        key={`${id}-${match.index}`}
        type="button"
        onClick={() => onExplain?.(id)}
        className="inline border-b border-accent/50 text-white/85 transition hover:border-accent hover:text-accent"
      >
        {label}
      </button>
    )
    last = match.index + match[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

function mapChildren(
  children: ReactNode,
  onExplain?: (id: string) => void
): ReactNode {
  if (typeof children === "string") {
    if (!children.includes("[[")) return children
    return withExplains(children, onExplain)
  }
  if (Array.isArray(children)) {
    return children.map((child, i) => (
      <span key={i}>{mapChildren(child, onExplain)}</span>
    ))
  }
  return children
}

/**
 * Note markdown — GFM + Shiki code + [[explain-id]] sheet triggers.
 */
export function NoteMarkdown({
  content,
  className,
  onExplain,
}: NoteMarkdownProps) {
  return (
    <div
      className={cn(
        "note-md mt-5 max-w-2xl text-base leading-relaxed text-white/45 md:text-[1.05rem]",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => (
            <h3 className="mt-8 mb-3 font-pixel-circle text-xl font-medium tracking-tight text-white first:mt-0 md:text-2xl">
              {mapChildren(children, onExplain)}
            </h3>
          ),
          h3: ({ children }) => (
            <h4 className="mt-6 mb-2 font-mono text-[11px] tracking-[0.18em] text-accent uppercase first:mt-0">
              {mapChildren(children, onExplain)}
            </h4>
          ),
          p: ({ children }) => (
            <p className="mt-4 first:mt-0 leading-relaxed">
              {mapChildren(children, onExplain)}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="mt-4 flex list-none flex-col gap-2.5 first:mt-0 [&_li]:relative [&_li]:pl-4 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.55em] [&_li]:before:size-1.5 [&_li]:before:bg-accent">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mt-4 flex list-decimal flex-col gap-2.5 pl-5 first:mt-0 marker:font-mono marker:text-[11px] marker:text-accent [&_li]:pl-1">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-sm leading-relaxed text-white/70 md:text-[15px]">
              {mapChildren(children, onExplain)}
            </li>
          ),
          strong: ({ children }) => (
            <strong className="font-medium text-white/85">
              {mapChildren(children, onExplain)}
            </strong>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="underline decoration-accent/50 underline-offset-4 transition hover:decoration-accent"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noreferrer" : undefined}
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="mt-4 border-l-2 border-accent/50 pl-4 text-white/55 first:mt-0">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="mt-5 overflow-x-auto border border-white/10 first:mt-0">
              <table className="w-full min-w-[20rem] border-collapse text-left text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="border-b border-white/10 bg-white/[0.03]">
              {children}
            </thead>
          ),
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => (
            <tr className="border-b border-white/8 last:border-b-0">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2.5 font-mono text-[10px] font-normal tracking-[0.14em] text-white/45 uppercase">
              {mapChildren(children, onExplain)}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2.5 align-top text-white/65">
              {mapChildren(children, onExplain)}
            </td>
          ),
          code: ({ className: codeClass, children }) => {
            const isBlock = Boolean(codeClass)
            const text = String(children).replace(/\n$/, "")
            if (isBlock) {
              return <NoteCodeBlock code={text} language={codeClass} />
            }
            return (
              <code className="rounded-sm bg-white/10 px-1 py-0.5 font-mono text-[0.85em] text-accent">
                {children}
              </code>
            )
          },
          pre: ({ children }) => <>{children}</>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
