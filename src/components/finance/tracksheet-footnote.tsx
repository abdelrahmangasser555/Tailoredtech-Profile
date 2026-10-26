"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export function TracksheetFootnote({
  markdown,
  muted,
  ink,
}: {
  markdown: string
  muted: string
  ink: string
}) {
  if (!markdown.trim()) return null
  return (
    <div
      className="tracksheet-footnote px-5 py-4 text-sm leading-relaxed [&_a]:underline [&_li]:ml-4 [&_ol]:list-decimal [&_p]:mb-2 [&_strong]:font-semibold [&_ul]:list-disc"
      style={{ color: muted, borderTop: `1px solid ${muted}22` }}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  )
}
