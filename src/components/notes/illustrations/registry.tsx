"use client"

import type { ComponentType } from "react"
import { GitCommitFlow } from "@/components/notes/illustrations/git-commit-flow"
import { cn } from "@/lib/utils"

const REGISTRY: Record<string, ComponentType<{ className?: string }>> = {
  "git-commit-flow": GitCommitFlow,
}

type NoteIllustrationProps = {
  component: string
  title?: string
  caption?: string
  className?: string
}

/**
 * Renders a registered React illustration by key.
 * Add components to REGISTRY — never eval arbitrary JSX from JSON.
 */
export function NoteIllustration({
  component,
  title,
  caption,
  className,
}: NoteIllustrationProps) {
  const Comp = REGISTRY[component]

  return (
    <div className={cn("mt-6 first:mt-0", className)}>
      {title ? (
        <p className="mb-3 font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
          {title}
        </p>
      ) : null}
      <div className="border border-white/10 bg-white/[0.02] p-5 md:p-6">
        {Comp ? (
          <Comp />
        ) : (
          <p className="font-mono text-xs text-white/40">
            Unknown illustration: {component}
          </p>
        )}
      </div>
      {caption ? (
        <p className="mt-3 text-sm text-white/35">{caption}</p>
      ) : null}
    </div>
  )
}

export function listNoteIllustrations() {
  return Object.keys(REGISTRY)
}
