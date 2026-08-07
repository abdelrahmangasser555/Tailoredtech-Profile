"use client"

import { cn } from "@/lib/utils"

type NoteCalloutProps = {
  tone?: "info" | "tip" | "warn"
  title?: string
  body: string
  className?: string
}

const TONE: Record<
  NonNullable<NoteCalloutProps["tone"]>,
  { bar: string; label: string }
> = {
  info: { bar: "bg-white/40", label: "Info" },
  tip: { bar: "bg-accent", label: "Tip" },
  warn: { bar: "bg-white/70", label: "Note" },
}

export function NoteCallout({
  tone = "info",
  title,
  body,
  className,
}: NoteCalloutProps) {
  const t = TONE[tone]
  return (
    <aside
      className={cn(
        "mt-5 flex gap-3 border border-white/10 bg-white/[0.02] p-4 first:mt-0",
        className
      )}
    >
      <span className={cn("mt-1 h-8 w-0.5 shrink-0", t.bar)} aria-hidden />
      <div>
        <p className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
          {title || t.label}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-white/55">{body}</p>
      </div>
    </aside>
  )
}
