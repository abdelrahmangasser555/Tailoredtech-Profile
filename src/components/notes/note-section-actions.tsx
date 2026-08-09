"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
  CirclePlay,
  ImagePlus,
  Link2,
  ListChecks,
  Loader2,
  Sparkles,
  Table2,
  Trash2,
} from "lucide-react"
import {
  NoteImagePicker,
  type NoteImagePickerHandle,
} from "@/components/notes/note-image-picker"
import { isLocalEditEnabled } from "@/lib/local-edit"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type NoteSectionActionsProps = {
  noteId: string
  sectionId: string
  hasTasks: boolean
}

type ModalKind = "mermaid" | "comparison" | "youtube" | "link" | "images" | null

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
  const [imageCount, setImageCount] = useState(0)
  const imagePickerRef = useRef<NoteImagePickerHandle | null>(null)

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
    setImageCount(0)
    imagePickerRef.current?.reset()
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
        const images = await imagePickerRef.current?.collectImages()
        if (!images?.length) throw new Error("Add at least one image")
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
        toast.success(
          images.length === 1 ? "Image added" : `${images.length} images added`
        )
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
      } else if (modal === "comparison") {
        const prompt = fieldA.trim()
        if (!prompt) throw new Error("Describe the comparison")
        const res = await fetch("/api/local-edit/note-comparison", {
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
        toast.success("Comparison table added")
      }

      setModal(null)
      imagePickerRef.current?.reset()
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed")
    } finally {
      setBusy(false)
    }
  }

  const modalTitle =
    modal === "mermaid"
      ? "Generate mermaid"
      : modal === "comparison"
        ? "Generate comparison"
        : modal === "youtube"
          ? "Add YouTube"
          : modal === "link"
            ? "Add link"
            : "Add images"

  const modalHint =
    modal === "mermaid"
      ? "Describe the diagram. AI uses this note and the current section."
      : modal === "comparison"
        ? "Describe what to compare. AI builds a check/x table from this note and section."
        : modal === "youtube"
          ? "Paste a YouTube URL. Title is optional."
          : modal === "link"
            ? "Paste a URL. Preview metadata is fetched when possible."
            : "Paste, drop, browse files, or type a public path. Files save under /assets/uploads/notes/{noteId}/"

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
          label="Add comparison (AI)"
          onClick={() => openModal("comparison")}
          disabled={busy}
        >
          <Table2 className="size-3.5" />
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
            className={cn(
              "w-full border border-white/15 bg-[#0a0a0a] p-4 shadow-2xl",
              modal === "images" ? "max-w-lg" : "max-w-md"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-pixel-circle text-lg text-white">{modalTitle}</h3>
            <p className="mt-1 text-[12px] text-white/40">{modalHint}</p>

            {modal === "images" ? (
              <>
                <NoteImagePicker
                  noteId={noteId}
                  disabled={busy}
                  handleRef={imagePickerRef}
                  onReadyChange={setImageCount}
                />
                <input
                  value={fieldB}
                  onChange={(e) => setFieldB(e.target.value)}
                  placeholder="Gallery title (optional)"
                  className="mt-3 w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-accent/40 focus:outline-none"
                />
              </>
            ) : (
              <>
                <textarea
                  autoFocus
                  value={fieldA}
                  onChange={(e) => setFieldA(e.target.value)}
                  rows={modal === "mermaid" || modal === "comparison" ? 5 : 2}
                  placeholder={
                    modal === "mermaid"
                      ? "Architecture of auth → API → database…"
                      : modal === "comparison"
                        ? "Compare REST vs GraphQL for this section…"
                        : modal === "youtube"
                          ? "https://www.youtube.com/watch?v=…"
                          : "https://…"
                  }
                  className="mt-4 w-full resize-none border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-accent/40 focus:outline-none"
                />
                <input
                  value={fieldB}
                  onChange={(e) => setFieldB(e.target.value)}
                  placeholder={
                    modal === "link" ? "Label (optional)" : "Title (optional)"
                  }
                  className="mt-2 w-full border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-accent/40 focus:outline-none"
                />
              </>
            )}

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
                disabled={busy || (modal === "images" && imageCount === 0)}
                onClick={() => void submitModal()}
                className="inline-flex items-center gap-1.5 bg-accent px-3 py-1.5 font-mono text-[10px] tracking-wider text-[#0a0a0a] uppercase disabled:opacity-40"
              >
                {busy ? <Loader2 className="size-3 animate-spin" /> : null}
                {modal === "mermaid" || modal === "comparison"
                  ? "Generate"
                  : "Add"}
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
