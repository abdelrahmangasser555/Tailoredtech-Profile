"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  CirclePlay,
  ImagePlus,
  Link2,
  ListChecks,
  Loader2,
  Sparkles,
  Trash2,
} from "lucide-react"
import { isLocalEditEnabled } from "@/lib/local-edit"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type NoteSectionActionsProps = {
  noteId: string
  sectionId: string
  hasTasks: boolean
}

type ModalKind = "mermaid" | "youtube" | "link" | "images" | null

export function NoteSectionActions({
  noteId,
  sectionId,
  hasTasks,
}: NoteSectionActionsProps) {
  const router = useRouter()
  const localEdit = isLocalEditEnabled()
  const [busy, setBusy] = useState(false)
  const [modal, setModal] = useState<ModalKind>(null)
  const [fieldA, setFieldA] = useState("")
  const [fieldB, setFieldB] = useState("")

  if (!localEdit) return null

  async function postBlock(payload: Record<string, unknown>) {
    const res = await fetch("/api/local-edit/note-section-block", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const data = (await res.json().catch(() => null)) as {
      error?: string
    } | null
    if (!res.ok) throw new Error(data?.error || "Failed")
  }

  async function addChecklist() {
    if (busy || hasTasks) return
    setBusy(true)
    try {
      await postBlock({
        noteId,
        sectionId,
        action: "append",
        blockType: "tasks",
        data: { title: "Checklist" },
      })
      toast.success("Checklist added")
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed")
    } finally {
      setBusy(false)
    }
  }

  async function removeChecklist() {
    if (busy || !hasTasks) return
    if (!window.confirm("Remove checklist from this section?")) return
    setBusy(true)
    try {
      await postBlock({
        noteId,
        sectionId,
        action: "removeType",
        blockType: "tasks",
      })
      toast.success("Checklist removed")
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed")
    } finally {
      setBusy(false)
    }
  }

  function openModal(kind: ModalKind) {
    setFieldA("")
    setFieldB("")
    setModal(kind)
  }

  async function submitModal() {
    if (!modal || busy) return
    setBusy(true)
    try {
      if (modal === "youtube") {
        const url = fieldA.trim()
        if (!url) throw new Error("Paste a YouTube URL")
        await postBlock({
          noteId,
          sectionId,
          action: "append",
          blockType: "youtube",
          data: { url, title: fieldB.trim() || undefined },
        })
        toast.success("YouTube block added")
      } else if (modal === "link") {
        const href = fieldA.trim()
        if (!href) throw new Error("Paste a URL")
        let label = fieldB.trim()
        let description: string | undefined
        try {
          const previewRes = await fetch(
            `/api/link-preview?url=${encodeURIComponent(href)}`
          )
          if (previewRes.ok) {
            const preview = (await previewRes.json()) as {
              title?: string | null
              description?: string | null
            }
            if (!label && preview.title) label = preview.title
            if (preview.description) description = preview.description
          }
        } catch {
          // keep manual fields
        }
        await postBlock({
          noteId,
          sectionId,
          action: "append",
          blockType: "link",
          data: {
            href,
            label: label || href,
            description,
          },
        })
        toast.success("Link added")
      } else if (modal === "images") {
        const lines = fieldA
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean)
        if (!lines.length) throw new Error("Add at least one image URL")
        const images = lines.map((line, i) => {
          const [src, ...rest] = line.split("|").map((s) => s.trim())
          return {
            src: src!,
            label: rest.join("|") || `Image ${i + 1}`,
          }
        })
        await postBlock({
          noteId,
          sectionId,
          action: "append",
          blockType: "gallery",
          data: {
            title: fieldB.trim() || "Images",
            images,
          },
        })
        toast.success("Images added")
      } else if (modal === "mermaid") {
        const prompt = fieldA.trim()
        if (!prompt) throw new Error("Describe the diagram")
        const res = await fetch("/api/local-edit/note-mermaid", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            noteId,
            sectionId,
            prompt,
            title: fieldB.trim() || undefined,
          }),
        })
        const data = (await res.json().catch(() => null)) as {
          error?: string
        } | null
        if (!res.ok) throw new Error(data?.error || "Failed to generate")
        toast.success("Mermaid diagram added")
      }

      setModal(null)
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed")
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center gap-1.5">
        <ActionIcon
          label={hasTasks ? "Remove checklist" : "Add checklist"}
          onClick={() =>
            void (hasTasks ? removeChecklist() : addChecklist())
          }
          disabled={busy}
          danger={hasTasks}
        >
          {hasTasks ? (
            <Trash2 className="size-3.5" />
          ) : (
            <ListChecks className="size-3.5" />
          )}
        </ActionIcon>
        <ActionIcon
          label="Add images"
          onClick={() => openModal("images")}
          disabled={busy}
        >
          <ImagePlus className="size-3.5" />
        </ActionIcon>
        <ActionIcon
          label="Add mermaid (AI)"
          onClick={() => openModal("mermaid")}
          disabled={busy}
        >
          <Sparkles className="size-3.5" />
        </ActionIcon>
        <ActionIcon
          label="Add YouTube"
          onClick={() => openModal("youtube")}
          disabled={busy}
        >
          <CirclePlay className="size-3.5" />
        </ActionIcon>
        <ActionIcon
          label="Add link"
          onClick={() => openModal("link")}
          disabled={busy}
        >
          <Link2 className="size-3.5" />
        </ActionIcon>
        {busy ? (
          <Loader2 className="ml-1 size-3.5 animate-spin text-white/30" />
        ) : null}
      </div>

      {modal ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4"
          onClick={() => !busy && setModal(null)}
        >
          <div
            className="w-full max-w-md border border-white/15 bg-[#0a0a0a] p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-pixel-circle text-lg text-white">
              {modal === "mermaid"
                ? "Generate mermaid"
                : modal === "youtube"
                  ? "Add YouTube"
                  : modal === "link"
                    ? "Add link"
                    : "Add images"}
            </h3>
            <p className="mt-1 text-[12px] text-white/40">
              {modal === "mermaid"
                ? "Describe the diagram. AI uses this note and the current section."
                : modal === "youtube"
                  ? "Paste a YouTube URL. Title is optional."
                  : modal === "link"
                    ? "Paste a URL. Preview metadata is fetched when possible."
                    : "One image per line: url or url|label"}
            </p>

            <textarea
              autoFocus
              value={fieldA}
              onChange={(e) => setFieldA(e.target.value)}
              rows={modal === "images" || modal === "mermaid" ? 5 : 2}
              placeholder={
                modal === "mermaid"
                  ? "Architecture of auth → API → database…"
                  : modal === "youtube"
                    ? "https://www.youtube.com/watch?v=…"
                    : modal === "link"
                      ? "https://…"
                      : "/assets/shot.png|Dashboard"
              }
              className="mt-4 w-full resize-none border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-accent/40 focus:outline-none"
            />

            <input
              value={fieldB}
              onChange={(e) => setFieldB(e.target.value)}
              placeholder={
                modal === "mermaid"
                  ? "Title (optional)"
                  : modal === "youtube"
                    ? "Title (optional)"
                    : modal === "link"
                      ? "Label (optional)"
                      : "Gallery title (optional)"
              }
              className="mt-2 w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-accent/40 focus:outline-none"
            />

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => setModal(null)}
                className="border border-white/15 px-3 py-1.5 font-mono text-[10px] tracking-wider text-white/50 uppercase"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void submitModal()}
                className="inline-flex items-center gap-1.5 bg-accent px-3 py-1.5 font-mono text-[10px] tracking-wider text-[#0a0a0a] uppercase disabled:opacity-40"
              >
                {busy ? <Loader2 className="size-3 animate-spin" /> : null}
                {modal === "mermaid" ? "Generate" : "Add"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

function ActionIcon({
  label,
  children,
  onClick,
  disabled,
  danger,
}: {
  label: string
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  danger?: boolean
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "group relative flex size-8 items-center justify-center border transition disabled:opacity-40",
        danger
          ? "border-white/15 text-white/40 hover:border-red-400/40 hover:text-red-300"
          : "border-white/15 text-white/40 hover:border-accent/40 hover:text-accent"
      )}
    >
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 -translate-x-1/2 whitespace-nowrap border border-white/15 bg-[#0a0a0a] px-2 py-1 font-mono text-[9px] tracking-wider text-white/70 uppercase opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-visible:opacity-100">
        {label}
      </span>
    </button>
  )
}
