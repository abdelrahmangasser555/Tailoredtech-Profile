"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

type Preview = {
  url: string
  title: string | null
  description: string | null
  image: string | null
  siteName: string | null
  favicon: string | null
}

type NoteLinkBlockProps = {
  href: string
  label: string
  description?: string
  className?: string
}

export function NoteLinkBlock({
  href,
  label,
  description,
  className,
}: NoteLinkBlockProps) {
  const external = href.startsWith("http")
  const [preview, setPreview] = useState<Preview | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!external) return
    let cancelled = false
    setFailed(false)
    setPreview(null)

    fetch(`/api/link-preview?url=${encodeURIComponent(href)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("preview failed")
        return res.json() as Promise<Preview>
      })
      .then((data) => {
        if (!cancelled) setPreview(data)
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })

    return () => {
      cancelled = true
    }
  }, [href, external])

  if (!external) {
    return (
      <Link
        href={href}
        className={cn(
          "group mt-5 flex items-start justify-between gap-4 border border-white/10 bg-white/[0.02] p-4 transition hover:border-accent/40 first:mt-0",
          className
        )}
      >
        <span>
          <span className="font-pixel-circle text-lg text-white transition group-hover:text-accent md:text-xl">
            {label}
          </span>
          {description ? (
            <span className="mt-1 block text-sm text-white/40">
              {description}
            </span>
          ) : null}
        </span>
        <ArrowUpRight className="mt-1 size-4 shrink-0 text-white/35 transition group-hover:text-accent" />
      </Link>
    )
  }

  const title = preview?.title || label
  const desc = preview?.description || description
  const host =
    preview?.siteName ||
    (() => {
      try {
        return new URL(href).hostname.replace(/^www\./, "")
      } catch {
        return href
      }
    })()

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "group mt-5 block overflow-hidden border border-white/10 bg-white/[0.02] transition hover:border-accent/40 first:mt-0",
        className
      )}
    >
      <div className="grid gap-0 sm:grid-cols-[minmax(0,1fr)_11rem]">
        <div className="flex min-w-0 flex-col justify-between gap-3 p-4">
          <div>
            <div className="flex items-center gap-2">
              {preview?.favicon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview.favicon}
                  alt=""
                  width={14}
                  height={14}
                  className="size-3.5 rounded-sm bg-white/10 object-contain"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).style.display = "none"
                  }}
                />
              ) : null}
              <span className="font-mono text-[10px] tracking-[0.14em] text-white/35 uppercase">
                {host}
              </span>
            </div>
            <p className="mt-2 font-pixel-circle text-lg leading-snug text-white transition group-hover:text-accent md:text-xl">
              {title}
            </p>
            {desc ? (
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/40">
                {desc}
              </p>
            ) : null}
            {!preview && !failed ? (
              <p className="mt-2 font-mono text-[10px] text-white/25">
                Loading preview…
              </p>
            ) : null}
          </div>
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em] text-white/35 uppercase transition group-hover:text-accent">
            Open link
            <ExternalLink className="size-3" />
          </span>
        </div>

        <div className="relative hidden min-h-[7.5rem] border-t border-white/10 bg-black/40 sm:block sm:border-t-0 sm:border-l">
          {preview?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview.image}
              alt=""
              className="absolute inset-0 size-full object-cover opacity-90 transition group-hover:opacity-100"
              onError={(e) => {
                ;(e.target as HTMLImageElement).style.display = "none"
              }}
            />
          ) : (
            <div className="flex size-full items-center justify-center px-3 text-center font-mono text-[10px] text-white/25">
              {failed ? "No preview" : "…"}
            </div>
          )}
        </div>
      </div>
    </a>
  )
}
