"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { ImagePlus, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { CompactInput, FieldLabel } from "@/components/editor/fields"

export type GalleryImageDraft = { src: string; label: string }

type ImageGalleryEditorProps = {
  images: GalleryImageDraft[]
  onChange: (images: GalleryImageDraft[]) => void
  slug: string
  kind: "presentations" | "services"
  className?: string
}

export function ImageGalleryEditor({
  images,
  onChange,
  slug,
  kind,
  className,
}: ImageGalleryEditorProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function onPick(files: FileList | null) {
    if (!files?.length) return
    setUploading(true)
    try {
      const next = [...images]
      for (const file of Array.from(files)) {
        const form = new FormData()
        form.set("file", file)
        form.set("slug", slug)
        form.set("kind", kind)
        const res = await fetch("/api/local-edit/upload", {
          method: "POST",
          body: form,
        })
        const data = (await res.json()) as { src?: string; error?: string }
        if (!res.ok || !data.src) {
          throw new Error(data.error || "Upload failed")
        }
        next.push({ src: data.src, label: file.name.replace(/\.[^.]+$/, "") })
      }
      onChange(next)
      toast.success("Image uploaded")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <div className={cn("space-y-2.5", className)}>
      <div className="flex items-center justify-between gap-2">
        <FieldLabel hint={`${images.length} images`}>Gallery</FieldLabel>
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="inline-flex h-7 items-center gap-1.5 border border-white/15 px-2 font-mono text-[10px] tracking-[0.12em] uppercase text-white/55 transition hover:border-accent hover:text-accent disabled:opacity-40"
        >
          {uploading ? (
            <Loader2 className="size-3 animate-spin" />
          ) : (
            <ImagePlus className="size-3" />
          )}
          Upload
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          multiple
          className="hidden"
          onChange={(e) => void onPick(e.target.files)}
        />
      </div>

      {images.length === 0 ? (
        <p className="border border-dashed border-white/10 px-3 py-4 text-center font-mono text-[10px] text-white/30">
          No gallery images
        </p>
      ) : (
        <ul className="space-y-2">
          {images.map((img, i) => (
            <li
              key={`${img.src}-${i}`}
              className="grid grid-cols-[3rem_1fr_auto] items-center gap-2 border border-white/10 bg-black/20 p-1.5"
            >
              <div className="relative size-12 overflow-hidden bg-black/40">
                <Image
                  src={img.src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <CompactInput
                label="Label"
                value={img.label}
                onChange={(e) => {
                  const next = [...images]
                  next[i] = { ...img, label: e.target.value }
                  onChange(next)
                }}
                className="[&_label]:sr-only"
              />
              <button
                type="button"
                aria-label="Remove image"
                className="inline-flex size-8 items-center justify-center text-white/35 transition hover:text-red-400"
                onClick={() => onChange(images.filter((_, j) => j !== i))}
              >
                <Trash2 className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
