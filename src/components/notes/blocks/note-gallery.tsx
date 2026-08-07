"use client"

import { SectionImageGrid } from "@/components/sections/section-media"
import { cn } from "@/lib/utils"

type NoteGalleryImage = {
  src: string
  label: string
}

type NoteGalleryProps = {
  title?: string
  caption?: string
  images: NoteGalleryImage[]
  className?: string
}

/**
 * Image gallery — same grid + lightbox as solutions (`SectionImageGrid`).
 */
export function NoteGallery({
  title,
  caption,
  images,
  className,
}: NoteGalleryProps) {
  if (!images.length) return null

  return (
    <div className={cn("mt-6 first:mt-0", className)}>
      {title ? (
        <p className="mb-3 font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
          {title}
        </p>
      ) : null}
      <SectionImageGrid images={images} className="!mt-0" />
      {caption ? (
        <p className="mt-3 text-sm text-white/35">{caption}</p>
      ) : null}
    </div>
  )
}
