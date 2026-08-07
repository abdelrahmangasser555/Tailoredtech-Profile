"use client"

import { cn } from "@/lib/utils"

type NoteHtmlBlockProps = {
  html: string
  title?: string
  caption?: string
  className?: string
}

/**
 * Author-controlled HTML from notes.json (not user-generated input).
 * Prefer registered illustrations for complex React visuals.
 */
export function NoteHtmlBlock({
  html,
  title,
  caption,
  className,
}: NoteHtmlBlockProps) {
  return (
    <div className={cn("mt-6 first:mt-0", className)}>
      {title ? (
        <p className="mb-3 font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
          {title}
        </p>
      ) : null}
      <div
        className="border border-white/10 bg-white/[0.02] p-5 text-white/70"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {caption ? (
        <p className="mt-3 text-sm text-white/35">{caption}</p>
      ) : null}
    </div>
  )
}
