"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { isLocalEditEnabled } from "@/lib/local-edit"
import { BrandedMermaid } from "@/components/sections/branded-mermaid"
import { cleanupMermaidOrphans } from "@/components/sections/mermaid-cleanup"

type NoteMermaidBlockProps = {
  noteId: string
  sectionId?: string
  blockId: string
  diagram: string
  title?: string
  caption?: string
}

export function NoteMermaidBlock({
  noteId,
  sectionId,
  blockId,
  diagram,
  title,
  caption,
}: NoteMermaidBlockProps) {
  const router = useRouter()
  const localEdit = isLocalEditEnabled()

  async function replaceWithText(errorMessage: string) {
    if (!sectionId || !localEdit) return
    const content = [
      `**Diagram unavailable**${title ? ` — ${title}` : ""}`,
      "",
      "The mermaid diagram failed to render and was replaced with this summary.",
      "",
      errorMessage.slice(0, 500),
      "",
      "Original source (for reference, not rendered):",
      "",
      "```text",
      diagram.slice(0, 2000),
      "```",
    ].join("\n")

    const res = await fetch("/api/local-edit/note-section-block", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        noteId,
        sectionId,
        action: "removeBlock",
        blockId,
      }),
    })
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null
      throw new Error(data?.error || "Failed to remove diagram")
    }

    const add = await fetch("/api/local-edit/note-section-block", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        noteId,
        sectionId,
        action: "append",
        blockType: "markdown",
        data: { content },
      }),
    })
    if (!add.ok) {
      const data = (await add.json().catch(() => null)) as { error?: string } | null
      throw new Error(data?.error || "Failed to add text replacement")
    }

    toast.success("Diagram replaced with text")
    cleanupMermaidOrphans()
    router.refresh()
  }

  return (
    <div className="mt-6 first:mt-0">
      <BrandedMermaid
        chart={diagram}
        title={title}
        caption={caption}
        onReplaceWithText={
          localEdit && sectionId
            ? async (err) => {
                try {
                  await replaceWithText(err)
                } catch (e) {
                  toast.error(e instanceof Error ? e.message : "Replace failed")
                }
              }
            : undefined
        }
      />
    </div>
  )
}
