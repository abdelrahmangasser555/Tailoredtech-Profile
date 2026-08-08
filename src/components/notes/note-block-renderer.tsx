"use client"

import dynamic from "next/dynamic"
import type { NoteBlock, NoteExplainTerm } from "@/lib/notes-types"
import { NoteMarkdown } from "@/components/notes/blocks/note-markdown"
import { NoteYoutube } from "@/components/notes/blocks/note-youtube"
import { NoteStack } from "@/components/notes/blocks/note-stack"
import { NoteLinkBlock } from "@/components/notes/blocks/note-link-block"
import { NoteCallout } from "@/components/notes/blocks/note-callout"
import { NoteHtmlBlock } from "@/components/notes/blocks/note-html-block"
import { NoteGallery } from "@/components/notes/blocks/note-gallery"
import { NoteTerminal } from "@/components/notes/blocks/note-terminal"
import { NotePlayground } from "@/components/notes/blocks/note-playground"
import { NoteTasks } from "@/components/notes/blocks/note-tasks"
import { NoteIllustration } from "@/components/notes/illustrations/registry"

const BrandedMermaid = dynamic(
  () =>
    import("@/components/sections/branded-mermaid").then(
      (m) => m.BrandedMermaid
    ),
  {
    ssr: false,
    loading: () => (
      <div className="mt-6 h-40 border border-white/10 bg-white/[0.02]" />
    ),
  }
)

type NoteBlockRendererProps = {
  block: NoteBlock
  noteId: string
  sectionId?: string
  explainsById: Record<string, NoteExplainTerm>
  onExplain: (id: string) => void
}

export function NoteBlockRenderer({
  block,
  noteId,
  sectionId,
  explainsById,
  onExplain,
}: NoteBlockRendererProps) {
  switch (block.type) {
    case "markdown":
      return (
        <NoteMarkdown
          content={rewriteExplainLabels(block.content, explainsById)}
          onExplain={onExplain}
          className="!mt-0"
        />
      )
    case "youtube":
      return (
        <NoteYoutube
          url={block.url}
          title={block.title}
          caption={block.caption}
          noteId={noteId}
          sectionId={sectionId}
          blockId={block.id}
        />
      )
    case "stack":
      return (
        <NoteStack
          title={block.title}
          caption={block.caption}
          items={block.items}
          layers={block.layers}
          edges={block.edges}
          direction={block.direction}
        />
      )
    case "mermaid":
      return (
        <div className="mt-6 first:mt-0">
          <BrandedMermaid
            chart={block.diagram}
            title={block.title}
            caption={block.caption}
          />
        </div>
      )
    case "illustration":
      return (
        <NoteIllustration
          component={block.component}
          title={block.title}
          caption={block.caption}
          props={block.props}
        />
      )
    case "html":
      return (
        <NoteHtmlBlock
          html={block.html}
          title={block.title}
          caption={block.caption}
        />
      )
    case "link":
      return (
        <NoteLinkBlock
          href={block.href}
          label={block.label}
          description={block.description}
        />
      )
    case "callout":
      return (
        <NoteCallout tone={block.tone} title={block.title} body={block.body} />
      )
    case "gallery":
      return (
        <NoteGallery
          title={block.title}
          caption={block.caption}
          images={block.images}
        />
      )
    case "terminal":
      return (
        <NoteTerminal
          scenario={block.scenario}
          title={block.title}
          caption={block.caption}
        />
      )
    case "playground":
      return (
        <NotePlayground
          language={block.language}
          initialCode={block.initialCode}
          title={block.title}
          caption={block.caption}
          expectIncludes={block.expectIncludes}
          hint={block.hint}
        />
      )
    case "tasks":
      return (
        <NoteTasks
          noteId={noteId}
          blockId={block.id}
          title={block.title}
          items={block.items}
        />
      )
    default:
      return null
  }
}

/** Keep [[id]] markers; button text uses explain.label when available */
function rewriteExplainLabels(
  content: string,
  explainsById: Record<string, NoteExplainTerm>
): string {
  return content.replace(/\[\[([a-zA-Z0-9_-]+)\]\]/g, (full, id: string) => {
    const term = explainsById[id]
    if (!term) return full
    // Encode label in a way markdown still sees as [[id]]; label resolved in renderer
    return `[[${id}|${term.label}]]`
  })
}
