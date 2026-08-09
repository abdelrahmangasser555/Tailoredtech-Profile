"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { FolderOpen, ImagePlus, Loader2, X } from "lucide-react"
import { cn } from "@/lib/utils"

type PendingImage = {
  id: string
  file?: File
  /** Public path when already uploaded or typed */
  src?: string
  previewUrl: string
  label: string
  uploading?: boolean
  error?: string
}

type NoteImagePickerProps = {
  noteId: string
  disabled?: boolean
  onReadyChange?: (count: number) => void
}

export type NoteImagePickerHandle = {
  collectImages: () => Promise<{ src: string; label: string }[]>
  reset: () => void
}

/**
 * Paste / drag-drop / browse / path entry for note section gallery images.
 */
export function NoteImagePicker({
  noteId,
  disabled,
  onReadyChange,
  handleRef,
}: NoteImagePickerProps & {
  handleRef?: React.MutableRefObject<NoteImagePickerHandle | null>
}) {
  const [items, setItems] = useState<PendingImage[]>([])
  const [pathInput, setPathInput] = useState("")
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)

  const updateItems = useCallback(
    (next: PendingImage[] | ((prev: PendingImage[]) => PendingImage[])) => {
      setItems((prev) => {
        const value = typeof next === "function" ? next(prev) : next
        onReadyChange?.(value.filter((i) => i.src || i.file).length)
        return value
      })
    },
    [onReadyChange]
  )

  useEffect(() => {
    return () => {
      items.forEach((i) => {
        if (i.previewUrl.startsWith("blob:")) URL.revokeObjectURL(i.previewUrl)
      })
    }
    // only on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function uploadFile(file: File): Promise<string> {
    const form = new FormData()
    form.set("file", file)
    form.set("kind", "notes")
    form.set("slug", noteId)
    const res = await fetch("/api/local-edit/upload", {
      method: "POST",
      body: form,
    })
    const data = (await res.json().catch(() => null)) as {
      src?: string
      error?: string
    } | null
    if (!res.ok || !data?.src) {
      throw new Error(data?.error || "Upload failed")
    }
    return data.src
  }

  function addFiles(files: File[]) {
    const images = files.filter((f) => f.type.startsWith("image/"))
    if (!images.length) return
    updateItems((prev) => [
      ...prev,
      ...images.map((file) => ({
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
        file,
        previewUrl: URL.createObjectURL(file),
        label: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
      })),
    ])
  }

  function addPath() {
    const raw = pathInput.trim()
    if (!raw) return
    const src = raw.startsWith("/") ? raw : `/${raw.replace(/^\.?\/?/, "")}`
    updateItems((prev) => [
      ...prev,
      {
        id: `path-${src}-${Date.now()}`,
        src,
        previewUrl: src,
        label: src.split("/").pop()?.replace(/\.[^.]+$/, "") || "Image",
      },
    ])
    setPathInput("")
  }

  function handlePaste(e: React.ClipboardEvent) {
    const files = Array.from(e.clipboardData.files).filter((f) =>
      f.type.startsWith("image/")
    )
    if (files.length) {
      e.preventDefault()
      addFiles(files)
    }
  }

  useEffect(() => {
    if (!handleRef) return
    handleRef.current = {
      reset: () => {
        setItems((prev) => {
          prev.forEach((i) => {
            if (i.previewUrl.startsWith("blob:")) URL.revokeObjectURL(i.previewUrl)
          })
          return []
        })
        setPathInput("")
        onReadyChange?.(0)
      },
      collectImages: async () => {
        const out: { src: string; label: string }[] = []
        for (const item of items) {
          if (item.src) {
            out.push({ src: item.src, label: item.label })
            continue
          }
          if (!item.file) continue
          updateItems((prev) =>
            prev.map((p) =>
              p.id === item.id ? { ...p, uploading: true, error: undefined } : p
            )
          )
          try {
            const src = await uploadFile(item.file)
            out.push({ src, label: item.label })
            updateItems((prev) =>
              prev.map((p) =>
                p.id === item.id
                  ? { ...p, src, uploading: false, file: undefined }
                  : p
              )
            )
          } catch (err) {
            updateItems((prev) =>
              prev.map((p) =>
                p.id === item.id
                  ? {
                      ...p,
                      uploading: false,
                      error:
                        err instanceof Error ? err.message : "Upload failed",
                    }
                  : p
              )
            )
            throw err
          }
        }
        return out
      },
    }
  })

  return (
    <div className="mt-4 space-y-3" onPaste={handlePaste}>
      <div
        ref={dropRef}
        onDragEnter={(e) => {
          e.preventDefault()
          if (e.dataTransfer.types.includes("Files")) setDragging(true)
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => {
          if (e.currentTarget.contains(e.relatedTarget as Node)) return
          setDragging(false)
        }}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          addFiles(Array.from(e.dataTransfer.files))
        }}
        className={cn(
          "border border-dashed px-3 py-6 text-center transition",
          dragging
            ? "border-accent/60 bg-accent/5"
            : "border-white/15 bg-black/30"
        )}
      >
        <ImagePlus className="mx-auto size-5 text-white/35" />
        <p className="mt-2 text-[12px] text-white/45">
          Drop images here, paste from clipboard, or browse
        </p>
        <div className="mt-3 flex justify-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={disabled}
            onChange={(e) => {
              addFiles(Array.from(e.target.files ?? []))
              e.target.value = ""
            }}
          />
          <button
            type="button"
            disabled={disabled}
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-1.5 border border-white/15 px-2.5 py-1.5 font-mono text-[10px] tracking-wider text-white/60 uppercase transition hover:border-white/30 hover:text-white disabled:opacity-40"
          >
            <FolderOpen className="size-3" />
            Browse
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        <input
          value={pathInput}
          onChange={(e) => setPathInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              addPath()
            }
          }}
          disabled={disabled}
          placeholder="/assets/… or public path"
          className="min-w-0 flex-1 border border-white/15 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-accent/40 focus:outline-none"
        />
        <button
          type="button"
          disabled={disabled || !pathInput.trim()}
          onClick={addPath}
          className="border border-white/15 px-3 py-2 font-mono text-[10px] tracking-wider text-white/55 uppercase disabled:opacity-40"
        >
          Add path
        </button>
      </div>

      {items.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-2 border border-white/10 bg-black/40 p-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.previewUrl}
                alt=""
                className="size-12 shrink-0 object-cover border border-white/10"
              />
              <div className="min-w-0 flex-1">
                <input
                  value={item.label}
                  disabled={disabled}
                  onChange={(e) =>
                    updateItems((prev) =>
                      prev.map((p) =>
                        p.id === item.id ? { ...p, label: e.target.value } : p
                      )
                    )
                  }
                  className="w-full border border-white/10 bg-transparent px-2 py-1 text-xs text-white focus:border-accent/40 focus:outline-none"
                />
                <p className="mt-0.5 truncate font-mono text-[9px] text-white/30">
                  {item.src || item.file?.name || "pending upload"}
                  {item.uploading ? " · uploading…" : ""}
                  {item.error ? ` · ${item.error}` : ""}
                </p>
              </div>
              <button
                type="button"
                disabled={disabled}
                onClick={() =>
                  updateItems((prev) => {
                    const removed = prev.find((p) => p.id === item.id)
                    if (removed?.previewUrl.startsWith("blob:")) {
                      URL.revokeObjectURL(removed.previewUrl)
                    }
                    return prev.filter((p) => p.id !== item.id)
                  })
                }
                className="p-1 text-white/35 hover:text-white"
                aria-label="Remove"
              >
                <X className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

export function NoteImagePickerBusy({ busy }: { busy?: boolean }) {
  if (!busy) return null
  return <Loader2 className="size-3.5 animate-spin text-white/40" />
}
