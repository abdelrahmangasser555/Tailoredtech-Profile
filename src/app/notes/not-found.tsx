"use client"

import Link from "next/link"
import { ArrowLeft, FileQuestion } from "lucide-react"

export default function NotesNotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-[#050505] px-6 text-center text-white">
      <div className="mb-5 flex size-12 items-center justify-center border border-white/15 bg-white/[0.03]">
        <FileQuestion className="size-5 text-white/40" />
      </div>
      <p className="font-mono text-[10px] tracking-[0.2em] text-white/35 uppercase">
        Notes · 404
      </p>
      <h1 className="mt-3 font-pixel-circle text-3xl tracking-tight md:text-4xl">
        Note not found
      </h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/45">
        This path is missing from the notes tree, or the note is disabled.
        Try the browser root or go back.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/notes"
          className="inline-flex items-center gap-2 border border-accent/40 bg-accent px-4 py-2.5 font-mono text-[11px] tracking-[0.14em] text-[#0a0a0a] uppercase transition hover:bg-accent/90"
        >
          Open notes
        </Link>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 border border-white/15 px-4 py-2.5 font-mono text-[11px] tracking-[0.14em] text-white/60 uppercase transition hover:border-white/30 hover:text-white"
        >
          <ArrowLeft className="size-3.5" />
          Back
        </button>
      </div>
    </div>
  )
}
