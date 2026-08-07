"use client"

import { useState } from "react"
import { Play } from "lucide-react"
import { cn } from "@/lib/utils"

type NoteYoutubeProps = {
  url: string
  title?: string
  caption?: string
  className?: string
}

function parseYoutubeId(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname.includes("youtu.be")) {
      return u.pathname.replace("/", "") || null
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v")
      if (id) return id
      const parts = u.pathname.split("/")
      const embedIdx = parts.indexOf("embed")
      if (embedIdx >= 0 && parts[embedIdx + 1]) return parts[embedIdx + 1]!
    }
  } catch {
    return null
  }
  return null
}

/**
 * Click-to-play facade — avoids loading a heavy YouTube iframe until needed
 * (fixes Lenis / scroll jank near video sections).
 */
export function NoteYoutube({
  url,
  title,
  caption,
  className,
}: NoteYoutubeProps) {
  const id = parseYoutubeId(url)
  const [playing, setPlaying] = useState(false)
  const embed = id
    ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`
    : null
  const poster = id
    ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
    : null

  return (
    <div
      className={cn("mt-6 first:mt-0", className)}
      style={{ contentVisibility: "auto", containIntrinsicSize: "0 360px" }}
    >
      {title ? (
        <p className="mb-3 font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
          {title}
        </p>
      ) : null}

      {embed && poster ? (
        <div className="relative aspect-video w-full overflow-hidden border border-white/10 bg-black">
          {playing ? (
            <iframe
              src={embed}
              title={title || "YouTube video"}
              className="absolute inset-0 size-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="group absolute inset-0 size-full"
              aria-label={title ? `Play ${title}` : "Play video"}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={poster}
                alt=""
                className="size-full object-cover opacity-80 transition group-hover:opacity-95"
                loading="lazy"
                decoding="async"
              />
              <span className="absolute inset-0 bg-black/35" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex size-14 items-center justify-center border border-white/20 bg-black/70 text-accent transition group-hover:border-accent/50 group-hover:bg-black/85">
                  <Play className="size-6 fill-accent text-accent" />
                </span>
              </span>
            </button>
          )}
        </div>
      ) : (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex border border-white/15 px-3 py-2 font-mono text-[11px] tracking-[0.14em] text-accent uppercase transition hover:border-accent"
        >
          Open video
        </a>
      )}

      {caption ? (
        <p className="mt-3 text-sm text-white/35">{caption}</p>
      ) : null}
    </div>
  )
}
