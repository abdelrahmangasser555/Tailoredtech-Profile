"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { NoteExplainTerm } from "@/lib/notes-types"
import { SectionMarkdown } from "@/components/sections/section-markdown"

type NoteExplainSheetProps = {
  term: NoteExplainTerm | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NoteExplainSheet({
  term,
  open,
  onOpenChange,
}: NoteExplainSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full border-white/10 bg-[#050505] text-white sm:max-w-md"
      >
        {term ? (
          <>
            <SheetHeader className="pr-8">
              <p className="font-mono text-[10px] tracking-[0.2em] text-white/35 uppercase">
                Explain
              </p>
              <SheetTitle className="font-pixel-circle text-2xl text-white">
                {term.title}
              </SheetTitle>
              <SheetDescription className="sr-only">
                Details for {term.title}
              </SheetDescription>
            </SheetHeader>
            <div className="mt-2 px-4 pb-8">
              <SectionMarkdown content={term.body} tone="dark" className="!mt-0" />
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
