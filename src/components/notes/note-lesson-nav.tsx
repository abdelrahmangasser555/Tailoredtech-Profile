import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { getLessonNeighbors } from "@/lib/notes"
import { cn } from "@/lib/utils"

type NoteLessonNavProps = {
  noteId: string
  className?: string
}

export function NoteLessonNav({ noteId, className }: NoteLessonNavProps) {
  const { prev, next } = getLessonNeighbors(noteId)

  if (!prev && !next) return null

  return (
    <nav
      aria-label="Lesson navigation"
      className={cn(
        "mx-auto max-w-5xl border-t border-white/10 px-5 py-10 md:px-8 md:py-12",
        className
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch sm:justify-between">
        {prev ? (
          <Link
            href={prev.href}
            className="group flex min-w-0 flex-1 flex-col border border-white/10 bg-white/[0.02] px-5 py-4 transition hover:border-white/20 hover:bg-white/[0.04]"
          >
            <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.16em] text-white/35 uppercase">
              <ArrowLeft className="size-3 transition group-hover:-translate-x-0.5 group-hover:text-accent" />
              Previous
            </span>
            <span className="mt-2 truncate font-pixel-circle text-lg text-white group-hover:text-accent">
              {prev.name}
            </span>
          </Link>
        ) : (
          <div className="hidden flex-1 sm:block" />
        )}

        {next ? (
          <Link
            href={next.href}
            className="group flex min-w-0 flex-1 flex-col border border-white/10 bg-white/[0.02] px-5 py-4 text-right transition hover:border-accent/40 hover:bg-white/[0.04] sm:items-end"
          >
            <span className="flex items-center justify-end gap-1.5 font-mono text-[10px] tracking-[0.16em] text-white/35 uppercase">
              Next
              <ArrowRight className="size-3 transition group-hover:translate-x-0.5 group-hover:text-accent" />
            </span>
            <span className="mt-2 truncate font-pixel-circle text-lg text-white group-hover:text-accent">
              {next.name}
            </span>
          </Link>
        ) : null}
      </div>
    </nav>
  )
}
