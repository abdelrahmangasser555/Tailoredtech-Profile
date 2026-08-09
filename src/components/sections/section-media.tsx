"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { Expand, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { resetScrollState } from "@/components/motion/smooth-scroll"

const EASE = [0.22, 1, 0.36, 1] as const

export type GalleryImage = {
  src: string
  label: string
}

type SectionVideoProps = {
  src: string
  poster?: string | null
  caption?: string
  className?: string
}

export function SectionVideo({
  src,
  poster,
  caption,
  className,
}: SectionVideoProps) {
  return (
    <figure className={cn("mt-10", className)}>
      <div className="overflow-hidden border border-white/10 bg-black">
        <p className="border-b border-white/10 px-4 py-2 font-mono text-[10px] tracking-[0.22em] uppercase text-accent">
          Video
        </p>
        <video
          className="aspect-video w-full object-cover"
          controls
          playsInline
          preload="metadata"
          poster={poster ?? undefined}
          src={src}
        >
          <track kind="captions" />
        </video>
      </div>
      {caption && (
        <figcaption className="mt-3 font-mono text-[11px] tracking-wide text-white/35">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

function ImageLightbox({
  images,
  openIndex,
  onClose,
  onChange,
}: {
  images: readonly GalleryImage[]
  openIndex: number
  onClose: () => void
  onChange: (index: number) => void
}) {
  const count = images.length
  const current = images[openIndex]

  useEffect(() => {
    window.__lenis?.stop()
    document.documentElement.style.overflow = "hidden"
    document.body.style.overflow = "hidden"

    return () => {
      resetScrollState()
    }
  }, [])

  if (!current) return null

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 p-4 md:p-8"
      data-lenis-prevent
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <button
        type="button"
        className="absolute right-4 top-4 z-10 inline-flex size-10 cursor-pointer items-center justify-center border border-white/20 text-white transition hover:border-accent hover:text-accent md:right-8 md:top-8"
        onClick={onClose}
        aria-label="Close"
      >
        <X className="size-5" />
      </button>

      <motion.div
        className="relative flex max-h-[min(90vh,960px)] w-full max-w-5xl flex-col"
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 6 }}
        transition={{ duration: 0.28, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative min-h-0 flex-1 overflow-hidden border border-white/15 bg-[#070707]">
          <div className="relative mx-auto h-[min(74vh,780px)] w-full">
            <Image
              src={current.src}
              alt={current.label || ""}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              quality={95}
              className="object-contain p-3 md:p-5"
              priority
            />
          </div>
        </div>
        <div className="mt-3 flex shrink-0 items-center justify-between gap-4">
          <div className="min-w-0">
            {current.label ? (
              <p className="truncate font-pixel-circle text-sm tracking-tight text-white/85 md:text-base">
                {current.label}
              </p>
            ) : null}
            <p className="mt-0.5 font-mono text-[11px] tracking-[0.18em] uppercase text-white/40">
              {String(openIndex + 1).padStart(2, "0")} /{" "}
              {String(count).padStart(2, "0")}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={openIndex <= 0}
              onClick={() => onChange(Math.max(0, openIndex - 1))}
              className="cursor-pointer border border-white/20 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-white/70 transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-30"
            >
              Prev
            </button>
            <button
              type="button"
              disabled={openIndex >= count - 1}
              onClick={() => onChange(Math.min(count - 1, openIndex + 1))}
              className="cursor-pointer border border-white/20 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-white/70 transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

type SectionImageGridProps = {
  images: readonly GalleryImage[]
  className?: string
  /**
   * Crisp modern gallery (no bottom fade, contain fit, sharp chrome).
   * Set false for the classic cover + overlay style.
   */
  enhanced?: boolean
}

/** Default solution / presentation gallery. */
export function SectionImageGrid({
  images,
  className,
  enhanced = true,
}: SectionImageGridProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const count = images.length
  if (count === 0) return null

  if (!enhanced) {
    return (
      <ClassicImageGrid
        images={images}
        className={className}
        openIndex={openIndex}
        setOpenIndex={setOpenIndex}
      />
    )
  }

  const cols =
    count === 1
      ? "grid-cols-1"
      : count === 2
        ? "grid-cols-1 lg:grid-cols-2"
        : "grid-cols-1 sm:grid-cols-2"

  return (
    <div className={cn("mt-10", className)}>
      <p className="mb-4 font-mono text-[10px] tracking-[0.22em] uppercase text-accent">
        Gallery · {count}
      </p>

      <div className={cn("grid gap-4 md:gap-5", cols)}>
        {images.map((image, i) => (
          <motion.button
            key={`${image.src}-${i}`}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="group flex cursor-pointer flex-col overflow-hidden border border-white/12 bg-[#080808] text-left outline-none transition-[border-color,box-shadow] duration-300 hover:border-accent/45 hover:shadow-[0_0_0_1px_rgba(212,255,0,0.12)] focus-visible:ring-2 focus-visible:ring-accent"
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          >
            <div
              className={cn(
                "relative w-full bg-[#0c0c0c]",
                count === 1 ? "aspect-[16/9] min-h-[220px] md:min-h-[320px]" : "aspect-[16/10]",
              )}
            >
              <Image
                src={image.src}
                alt={image.label || ""}
                fill
                sizes={
                  count === 1
                    ? "(max-width: 1024px) 100vw, 900px"
                    : "(max-width: 768px) 100vw, 50vw"
                }
                quality={95}
                className="object-contain object-center p-2 md:p-3"
              />
              <span className="absolute right-2.5 top-2.5 inline-flex size-8 items-center justify-center border border-white/15 bg-black/70 text-accent opacity-0 transition duration-200 group-hover:opacity-100">
                <Expand className="size-3.5" />
              </span>
            </div>
            {image.label ? (
              <span className="flex items-center justify-between gap-3 border-t border-white/10 px-3.5 py-3 md:px-4">
                <span className="min-w-0 truncate font-pixel-circle text-[13px] tracking-tight text-white/80 md:text-sm">
                  {image.label}
                </span>
                <span className="shrink-0 font-mono text-[10px] tracking-[0.18em] uppercase text-white/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </span>
            ) : null}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <ImageLightbox
            images={images}
            openIndex={openIndex}
            onClose={() => setOpenIndex(null)}
            onChange={setOpenIndex}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function ClassicImageGrid({
  images,
  className,
  openIndex,
  setOpenIndex,
}: {
  images: readonly GalleryImage[]
  className?: string
  openIndex: number | null
  setOpenIndex: (i: number | null) => void
}) {
  const count = images.length
  const cols =
    count === 1
      ? "grid-cols-1"
      : count === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : count <= 4
          ? "grid-cols-1 sm:grid-cols-2"
          : "grid-cols-2 lg:grid-cols-4"

  return (
    <div className={cn("mt-10", className)}>
      <p className="mb-4 font-mono text-[10px] tracking-[0.22em] uppercase text-accent">
        Gallery · {count}
      </p>

      <div className={cn("grid gap-3 md:gap-4", cols)}>
        {images.map((image, i) => (
          <motion.button
            key={`${image.src}-${i}`}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="group relative aspect-[16/10] cursor-pointer overflow-hidden border border-white/12 bg-black text-left outline-none focus-visible:ring-2 focus-visible:ring-accent"
            whileHover={{ y: -3 }}
            transition={{ type: "spring", stiffness: 360, damping: 28 }}
          >
            <Image
              src={image.src}
              alt={image.label || ""}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition duration-500 group-hover:scale-[1.04]"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition group-hover:opacity-95" />
            <span className="absolute right-2 top-2 inline-flex size-7 items-center justify-center bg-black/65 text-accent opacity-0 transition group-hover:opacity-100">
              <Expand className="size-3.5" />
            </span>
            {image.label ? (
              <span className="absolute inset-x-0 bottom-0 p-3 md:p-4">
                <span className="block translate-y-1 font-pixel-circle text-sm tracking-tight text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:text-base">
                  {image.label}
                </span>
              </span>
            ) : null}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <ImageLightbox
            images={images}
            openIndex={openIndex}
            onClose={() => setOpenIndex(null)}
            onChange={setOpenIndex}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

type SectionImageStackProps = {
  images: readonly GalleryImage[]
  className?: string
}

/**
 * Stacked / fanned gallery — kept for reuse on other surfaces.
 * Prefer SectionImageGrid on solution pages.
 */
export function SectionImageStack({
  images,
  className,
}: SectionImageStackProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const count = images.length
  if (count === 0) return null

  const stackHeight = Math.min(220 + count * 18, 360)

  return (
    <div className={cn("mt-10", className)}>
      <p className="mb-4 font-mono text-[10px] tracking-[0.22em] uppercase text-accent">
        Stack · {count}
      </p>

      <div
        className="relative mx-auto w-full max-w-md"
        style={{ height: stackHeight }}
      >
        {images.map((image, i) => {
          const fromTop = i * 14
          const rotate = (i - (count - 1) / 2) * 2.4
          const x = (i - (count - 1) / 2) * 10

          return (
            <motion.button
              key={`${image.src}-${i}`}
              type="button"
              onClick={() => setOpenIndex(i)}
              className="absolute left-1/2 top-0 w-[min(100%,20rem)] -translate-x-1/2 cursor-pointer overflow-hidden border border-white/15 bg-black text-left shadow-[0_16px_40px_rgba(0,0,0,0.55)] outline-none focus-visible:ring-2 focus-visible:ring-accent"
              style={{
                zIndex: i + 1,
                marginTop: fromTop,
              }}
              initial={false}
              whileHover={{
                y: -8,
                scale: 1.02,
                rotate: 0,
                zIndex: 40,
              }}
              animate={{ x, rotate }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
            >
              <span className="absolute right-2 top-2 z-10 inline-flex size-7 items-center justify-center bg-black/70 text-accent">
                <Expand className="size-3.5" />
              </span>
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={image.src}
                  alt={image.label || ""}
                  fill
                  sizes="(max-width: 768px) 90vw, 320px"
                  quality={95}
                  className="object-cover"
                />
              </div>
              {image.label ? (
                <span className="absolute inset-x-0 bottom-0 bg-black/70 px-3 py-2 font-pixel-circle text-xs text-white">
                  {image.label}
                </span>
              ) : null}
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <ImageLightbox
            images={images}
            openIndex={openIndex}
            onClose={() => setOpenIndex(null)}
            onChange={setOpenIndex}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
