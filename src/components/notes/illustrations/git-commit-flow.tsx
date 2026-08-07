"use client"

import { useEffect, useState } from "react"
import { Pause, Play, RotateCcw, StepForward } from "lucide-react"
import { cn } from "@/lib/utils"

type GitCommitFlowProps = {
  className?: string
}

type Mode = "linear" | "branch"

type CommitNode = {
  id: string
  hash: string
  label: string
  lane: "main" | "feature"
}

const LINEAR: CommitNode[] = [
  { id: "c1", hash: "a1c", label: "init", lane: "main" },
  { id: "c2", hash: "b4e", label: "feat: auth", lane: "main" },
  { id: "c3", hash: "c9f", label: "fix: edge", lane: "main" },
  { id: "c4", hash: "d2a", label: "docs", lane: "main" },
]

const BRANCH: CommitNode[] = [
  { id: "b1", hash: "a1c", label: "init", lane: "main" },
  { id: "b2", hash: "b4e", label: "main tip", lane: "main" },
  { id: "b3", hash: "f01", label: "feature start", lane: "feature" },
  { id: "b4", hash: "f02", label: "feature work", lane: "feature" },
  { id: "b5", hash: "m9a", label: "merge", lane: "main" },
]

const MODE_COPY: Record<Mode, { title: string; body: string }> = {
  linear: {
    title: "Linear history",
    body: "Each commit points at one parent. HEAD walks forward as you commit.",
  },
  branch: {
    title: "Branch + merge",
    body: "Cut a feature lane, grow commits, then merge back onto main.",
  },
}

/**
 * Interactive git flow — step / play through commits, toggle linear vs branch.
 */
export function GitCommitFlow({ className }: GitCommitFlowProps) {
  const [mode, setMode] = useState<Mode>("linear")
  const [step, setStep] = useState(1)
  const [playing, setPlaying] = useState(false)

  const commits = mode === "linear" ? LINEAR : BRANCH
  const visible = commits.slice(0, step)
  const atEnd = step >= commits.length
  const copy = MODE_COPY[mode]

  useEffect(() => {
    if (!playing) return
    if (atEnd) {
      setPlaying(false)
      return
    }
    const id = window.setTimeout(() => {
      setStep((s) => Math.min(s + 1, commits.length))
    }, 700)
    return () => window.clearTimeout(id)
  }, [playing, step, atEnd, commits.length])

  function switchMode(next: Mode) {
    setMode(next)
    setStep(1)
    setPlaying(false)
  }

  function reset() {
    setStep(1)
    setPlaying(false)
  }

  function stepOnce() {
    setPlaying(false)
    setStep((s) => Math.min(s + 1, commits.length))
  }

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <ModeButton
          active={mode === "linear"}
          onClick={() => switchMode("linear")}
          label="Linear"
        />
        <ModeButton
          active={mode === "branch"}
          onClick={() => switchMode("branch")}
          label="Branch"
        />
        <span className="mx-1 hidden h-4 w-px bg-white/15 sm:block" />
        <ControlButton
          onClick={() => {
            if (atEnd) {
              setStep(1)
              setPlaying(true)
            } else {
              setPlaying((p) => !p)
            }
          }}
          label={playing ? "Pause" : atEnd ? "Replay" : "Play"}
          icon={
            playing ? (
              <Pause className="size-3.5" />
            ) : (
              <Play className="size-3.5" />
            )
          }
        />
        <ControlButton
          onClick={stepOnce}
          label="Step"
          icon={<StepForward className="size-3.5" />}
          disabled={atEnd}
        />
        <ControlButton
          onClick={reset}
          label="Reset"
          icon={<RotateCcw className="size-3.5" />}
        />
      </div>

      <div>
        <p className="font-mono text-[10px] tracking-[0.18em] text-accent uppercase">
          {copy.title}
          <span className="ml-2 text-white/30">
            {step}/{commits.length}
          </span>
        </p>
        <p className="mt-1.5 max-w-md text-sm text-white/40">{copy.body}</p>
      </div>

      {mode === "linear" ? (
        <LinearGraph commits={visible} total={commits.length} />
      ) : (
        <BranchGraph commits={visible} all={commits} />
      )}

      {visible.length > 0 ? (
        <p className="font-mono text-[11px] text-white/35">
          HEAD →{" "}
          <span className="text-accent">
            {visible[visible.length - 1]!.hash}
          </span>
          <span className="text-white/25"> · </span>
          {visible[visible.length - 1]!.label}
        </p>
      ) : null}
    </div>
  )
}

function ModeButton({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "border px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] uppercase transition",
        active
          ? "border-accent bg-accent text-accent-foreground"
          : "border-white/15 text-white/50 hover:border-white/30 hover:text-white/80"
      )}
    >
      {label}
    </button>
  )
}

function ControlButton({
  onClick,
  label,
  icon,
  disabled,
}: {
  onClick: () => void
  label: string
  icon: React.ReactNode
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1.5 border border-white/15 px-2.5 py-1.5 font-mono text-[10px] tracking-[0.14em] text-white/55 uppercase transition hover:border-accent/40 hover:text-accent disabled:pointer-events-none disabled:opacity-30"
    >
      {icon}
      {label}
    </button>
  )
}

function LinearGraph({
  commits,
  total,
}: {
  commits: CommitNode[]
  total: number
}) {
  return (
    <div className="overflow-x-auto py-1">
      <ol className="flex min-w-max items-center">
        {Array.from({ length: total }).map((_, i) => {
          const c = commits[i]
          const revealed = Boolean(c)
          return (
            <li key={LINEAR[i]!.id} className="flex items-center">
              <div
                className={cn(
                  "flex w-20 flex-col items-center gap-2 transition md:w-24",
                  revealed ? "opacity-100" : "opacity-20"
                )}
              >
                <span
                  className={cn(
                    "size-3 transition",
                    revealed ? "bg-accent scale-100" : "bg-white/25 scale-75"
                  )}
                />
                <span className="font-mono text-[10px] tracking-[0.12em] text-accent uppercase">
                  {revealed ? c!.hash : "···"}
                </span>
                <span className="text-center text-xs text-white/45">
                  {revealed ? c!.label : "—"}
                </span>
              </div>
              {i < total - 1 ? (
                <span
                  className={cn(
                    "mb-6 h-px w-8 transition md:w-12",
                    commits.length > i + 1 ? "bg-accent/50" : "bg-white/15"
                  )}
                  aria-hidden
                />
              ) : null}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function BranchGraph({
  commits,
  all,
}: {
  commits: CommitNode[]
  all: CommitNode[]
}) {
  const revealed = new Set(commits.map((c) => c.id))
  const main = all.filter((c) => c.lane === "main")
  const feature = all.filter((c) => c.lane === "feature")

  return (
    <div className="overflow-x-auto py-1">
      <div className="flex min-w-max flex-col gap-6">
        <Lane
          label="main"
          nodes={main}
          revealed={revealed}
          accent
        />
        <div className="flex items-center gap-2 pl-14">
          <span className="h-px flex-1 border-t border-dashed border-white/20" />
          <span className="font-mono text-[9px] tracking-[0.16em] text-white/30 uppercase">
            branch off
          </span>
          <span className="h-px flex-1 border-t border-dashed border-white/20" />
        </div>
        <Lane label="feature" nodes={feature} revealed={revealed} />
      </div>
    </div>
  )
}

function Lane({
  label,
  nodes,
  revealed,
  accent,
}: {
  label: string
  nodes: CommitNode[]
  revealed: Set<string>
  accent?: boolean
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-14 shrink-0 font-mono text-[10px] tracking-[0.14em] text-white/35 uppercase">
        {label}
      </span>
      <ol className="flex items-center">
        {nodes.map((c, i) => {
          const on = revealed.has(c.id)
          return (
            <li key={c.id} className="flex items-center">
              <div
                className={cn(
                  "flex w-[4.5rem] flex-col items-center gap-1.5 transition md:w-20",
                  on ? "opacity-100" : "opacity-20"
                )}
              >
                <span
                  className={cn(
                    "size-3",
                    on
                      ? accent
                        ? "bg-accent"
                        : "bg-white"
                      : "bg-white/25"
                  )}
                />
                <span
                  className={cn(
                    "font-mono text-[10px] tracking-[0.1em] uppercase",
                    on
                      ? accent
                        ? "text-accent"
                        : "text-white/70"
                      : "text-white/25"
                  )}
                >
                  {on ? c.hash : "···"}
                </span>
                <span className="text-center text-[11px] text-white/40">
                  {on ? c.label : "—"}
                </span>
              </div>
              {i < nodes.length - 1 ? (
                <span
                  className={cn(
                    "mb-5 h-px w-6 md:w-8",
                    on && revealed.has(nodes[i + 1]!.id)
                      ? accent
                        ? "bg-accent/45"
                        : "bg-white/35"
                      : "bg-white/12"
                  )}
                  aria-hidden
                />
              ) : null}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
