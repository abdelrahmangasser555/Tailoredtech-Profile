"use client"

import type { ComponentType } from "react"
import { GitCommitFlow } from "@/components/notes/illustrations/git-commit-flow"
import { cn } from "@/lib/utils"

type IllusProps = { className?: string; mode?: "first-repo" | "branches" | "free" }

const REGISTRY: Record<string, ComponentType<IllusProps>> = {
  "git-commit-flow": (props) => (
    <GitCommitFlow {...props} mode={props.mode ?? "first-repo"} />
  ),
  "git-branch-flow": (props) => (
    <GitCommitFlow {...props} mode={props.mode ?? "branches"} />
  ),
}

type NoteIllustrationProps = {
  component: string
  title?: string
  caption?: string
  className?: string
  props?: Record<string, unknown>
}

/**
 * Renders a registered React illustration by key.
 * Add components to REGISTRY. Never eval arbitrary JSX from JSON.
 */
export function NoteIllustration({
  component,
  title,
  caption,
  className,
  props,
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
          <Comp {...(props as IllusProps)} />
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
