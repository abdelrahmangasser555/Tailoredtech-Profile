"use client"

import { Archive, Check, Download } from "lucide-react"
import type { NotesStarter } from "@/lib/notes-types"
import { cn } from "@/lib/utils"

type NoteDownloadProps = {
  files: NotesStarter[]
  title?: string
  caption?: string
  className?: string
  /** Light notes browser vs dark note reader */
  tone?: "dark" | "light"
}

export function NoteDownload({
  files,
  title,
  caption,
  className,
  tone = "dark",
}: NoteDownloadProps) {
  const light = tone === "light"
  if (!files.length) return null

  return (
    <div className={cn("mt-6 first:mt-0", className)}>
      {title ? (
        <p
          className={cn(
            "mb-3 font-mono text-[10px] tracking-[0.2em] uppercase",
            light ? "text-foreground/40" : "text-white/40"
          )}
        >
          {title}
        </p>
      ) : null}
      <ul className="flex flex-col gap-2">
        {files.map((file) => (
          <li key={file.id}>
            <a
              href={file.href}
              download
              className={cn(
                "group flex items-start gap-3 border px-4 py-3.5 transition",
                light
                  ? "border-foreground/12 bg-white hover:border-foreground/30"
                  : "border-white/10 bg-white/[0.02] hover:border-accent/40"
              )}
            >
              <Archive
                className={cn(
                  "mt-0.5 size-4 shrink-0",
                  light ? "text-foreground/45" : "text-white/45 group-hover:text-accent"
                )}
              />
              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    "block font-pixel-circle text-lg leading-snug",
                    light
                      ? "text-foreground"
                      : "text-white group-hover:text-accent"
                  )}
                >
                  {file.label}
                </span>
                {file.description ? (
                  <span
                    className={cn(
                      "mt-1 block text-sm",
                      light ? "text-foreground/50" : "text-white/40"
                    )}
                  >
                    {file.description}
                  </span>
                ) : null}
              </span>
              <Download
                className={cn(
                  "mt-1 size-4 shrink-0",
                  light ? "text-foreground/35" : "text-white/35 group-hover:text-accent"
                )}
              />
            </a>
          </li>
        ))}
      </ul>
      {caption ? (
        <p
          className={cn(
            "mt-3 text-sm",
            light ? "text-foreground/45" : "text-white/35"
          )}
        >
          {caption}
        </p>
      ) : null}
    </div>
  )
}

export function NoteStartersInline({
  files,
  tone = "dark",
}: {
  files: NotesStarter[]
  tone?: "dark" | "light"
}) {
  return (
    <NoteDownload
      files={files}
      title="Starter zip"
      tone={tone}
    />
  )
}

export function DoneMark({
  done,
  className,
}: {
  done: boolean
  className?: string
}) {
  if (!done) return null
  return (
    <Check
      className={cn("size-3.5 shrink-0 text-foreground/55", className)}
      aria-label="Done"
    />
  )
}
