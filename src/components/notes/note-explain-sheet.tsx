"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { NoteExplainTerm } from "@/lib/notes-types"
import { NoteMarkdown } from "@/components/notes/blocks/note-markdown"
import { NoteBlockRenderer } from "@/components/notes/note-block-renderer"

type NoteExplainSheetProps = {
  term: NoteExplainTerm | null
  open: boolean
  onOpenChange: (open: boolean) => void
  noteId?: string
  explainsById?: Record<string, NoteExplainTerm>
  onExplain?: (id: string) => void
}

export function NoteExplainSheet({
  term,
  open,
  onOpenChange,
  noteId = "",
  explainsById = {},
  onExplain,
}: NoteExplainSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto border-white/10 bg-[#050505] text-white sm:max-w-lg"
      >
        {term ? (
          <>
            <SheetHeader className="pr-8">
              <p className="font-mono text-[10px] tracking-[0.2em] text-white/35 uppercase">
                More detail
              </p>
              <SheetTitle className="font-pixel-circle text-2xl text-white">
                {term.title}
              </SheetTitle>
              <SheetDescription className="sr-only">
                Details for {term.title}
              </SheetDescription>
            </SheetHeader>
            <div className="mt-2 px-4 pb-10">
              <NoteMarkdown
                content={term.body}
                onExplain={onExplain}
                className="!mt-0"
              />
              {term.blocks?.length ? (
                <div className="mt-6 flex flex-col gap-2">
                  {term.blocks.map((block) => (
                    <NoteBlockRenderer
                      key={block.id}
                      block={block}
                      noteId={noteId}
                      explainsById={explainsById}
                      onExplain={onExplain ?? (() => undefined)}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
