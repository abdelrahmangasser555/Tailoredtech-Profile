"use client"

/**
 * Command-driven git playground.
 * Type real git commands and watch the commit graph update.
 */

import { useCallback, useMemo, useRef, useState } from "react"
import { RotateCcw, Terminal } from "lucide-react"
import { cn } from "@/lib/utils"

type GitPlaygroundProps = {
  className?: string
  /** "first-repo" | "branches" | "free" */
  mode?: "first-repo" | "branches" | "free"
}

type Commit = {
  id: string
  hash: string
  message: string
  branch: string
  parents: string[]
}

type GitState = {
  initialized: boolean
  branch: string
  branches: string[]
  commits: Commit[]
  staged: string[]
  untracked: string[]
  headByBranch: Record<string, string | null>
  log: { type: "in" | "out" | "ok" | "err" | "hint"; text: string }[]
}

function hash() {
  return Math.random().toString(16).slice(2, 5)
}

function fresh(mode: GitPlaygroundProps["mode"]): GitState {
  if (mode === "branches") {
    const c0: Commit = {
      id: "c0",
      hash: "a1c",
      message: "init",
      branch: "main",
      parents: [],
    }
    return {
      initialized: true,
      branch: "main",
      branches: ["main"],
      commits: [c0],
      staged: [],
      untracked: ["login.tsx"],
      headByBranch: { main: c0.id },
      log: [
        {
          type: "hint",
          text: "Repo already has one commit on main. Create feature-login, switch to it, stage, commit, then merge back.",
        },
      ],
    }
  }

  return {
    initialized: false,
    branch: "main",
    branches: ["main"],
    commits: [],
    staged: [],
    untracked: ["README.md"],
    headByBranch: { main: null },
    log: [
      {
        type: "hint",
        text: 'Start with: git init  then  git status  then  git add .  then  git commit -m "first commit"',
      },
    ],
  }
}

function parseCommitMessage(cmd: string): string | null {
  const m =
    cmd.match(/-m\s+"([^"]+)"/) ||
    cmd.match(/-m\s+'([^']+)'/) ||
    cmd.match(/-m\s+(\S+)/)
  return m?.[1] ?? null
}

function run(cmdRaw: string, state: GitState): GitState {
  const cmd = cmdRaw.trim()
  const lower = cmd.toLowerCase()
  const push = (
    lines: GitState["log"],
    next: Partial<GitState> = {}
  ): GitState => ({
    ...state,
    ...next,
    log: [...state.log, { type: "in", text: `$ ${cmd}` }, ...lines],
  })

  if (!cmd) return state

  if (lower === "help" || lower === "?") {
    return push([
      {
        type: "hint",
        text: "Commands: git init | status | add . | commit -m \"msg\" | branch NAME | checkout NAME | switch NAME | merge NAME | log | ls",
      },
    ])
  }

  if (lower === "clear") {
    return { ...state, log: [] }
  }

  if (lower === "ls" || lower === "dir") {
    const files = [
      ...state.untracked.map((f) => `? ${f}`),
      ...state.staged.map((f) => `A ${f}`),
    ]
    return push([
      {
        type: "out",
        text: files.length ? files.join("\n") : "(working tree empty of new files)",
      },
    ])
  }

  if (lower === "git init") {
    if (state.initialized) {
      return push([{ type: "err", text: "Already a git repository." }])
    }
    return push(
      [
        { type: "out", text: "Initialized empty Git repository in ./.git/" },
        { type: "ok", text: "Ready. Run git status." },
      ],
      { initialized: true }
    )
  }

  if (!state.initialized && lower.startsWith("git ")) {
    return push([
      {
        type: "err",
        text: "fatal: not a git repository (run git init first)",
      },
    ])
  }

  if (lower === "git status" || lower.startsWith("git status ")) {
    const lines: string[] = [`On branch ${state.branch}`]
    if (state.staged.length) {
      lines.push("Changes to be committed:")
      for (const f of state.staged) lines.push(`  new file:   ${f}`)
    }
    if (state.untracked.length) {
      lines.push("Untracked files:")
      for (const f of state.untracked) lines.push(`  ${f}`)
    }
    if (!state.staged.length && !state.untracked.length) {
      lines.push(
        state.commits.length
          ? "nothing to commit, working tree clean"
          : "No commits yet"
      )
    }
    return push([{ type: "out", text: lines.join("\n") }])
  }

  if (lower.startsWith("git add")) {
    if (!state.untracked.length && !state.staged.length) {
      return push([{ type: "out", text: "Nothing specified, nothing added." }])
    }
    const staged = [...new Set([...state.staged, ...state.untracked])]
    return push(
      [
        {
          type: "out",
          text: `Staged ${state.untracked.length || staged.length} file(s).`,
        },
        { type: "ok", text: "Next: git commit -m \"your message\"" },
      ],
      { staged, untracked: [] }
    )
  }

  if (lower.startsWith("git commit")) {
    const message = parseCommitMessage(cmd)
    if (!message) {
      return push([
        {
          type: "err",
          text: 'Include a message: git commit -m "your message"',
        },
      ])
    }
    if (!state.staged.length && !lower.includes("-a") && !lower.includes("-am")) {
      return push([
        {
          type: "err",
          text: "nothing to commit (use git add . first)",
        },
      ])
    }
    const parent = state.headByBranch[state.branch]
    const id = `c${state.commits.length + 1}`
    const h = hash()
    const commit: Commit = {
      id,
      hash: h,
      message,
      branch: state.branch,
      parents: parent ? [parent] : [],
    }
    return push(
      [
        {
          type: "out",
          text: `[${state.branch} ${h}] ${message}`,
        },
        {
          type: "ok",
          text: `Commit saved. HEAD is now ${h}.`,
        },
      ],
      {
        commits: [...state.commits, commit],
        staged: [],
        untracked: [],
        headByBranch: { ...state.headByBranch, [state.branch]: id },
      }
    )
  }

  if (lower.startsWith("git branch") && !lower.includes("checkout")) {
    const parts = cmd.split(/\s+/).filter(Boolean)
    if (parts.length === 2) {
      const list = state.branches
        .map((b) => `${b === state.branch ? "* " : "  "}${b}`)
        .join("\n")
      return push([{ type: "out", text: list }])
    }
    const name = parts[2]
    if (!name) {
      return push([{ type: "err", text: "usage: git branch <name>" }])
    }
    if (state.branches.includes(name)) {
      return push([{ type: "err", text: `branch '${name}' already exists` }])
    }
    return push(
      [
        { type: "out", text: `Created branch ${name}` },
        { type: "ok", text: `Run: git checkout ${name}` },
      ],
      {
        branches: [...state.branches, name],
        headByBranch: {
          ...state.headByBranch,
          [name]: state.headByBranch[state.branch] ?? null,
        },
      }
    )
  }

  if (lower.startsWith("git checkout") || lower.startsWith("git switch")) {
    const name = cmd.split(/\s+/).pop()!
    if (!state.branches.includes(name)) {
      return push([
        {
          type: "err",
          text: `pathspec '${name}' did not match any known branch`,
        },
      ])
    }
    return push(
      [
        { type: "out", text: `Switched to branch '${name}'` },
        { type: "ok", text: `You are now on ${name}.` },
      ],
      { branch: name }
    )
  }

  if (lower.startsWith("git merge")) {
    const name = cmd.split(/\s+/).pop()!
    if (!state.branches.includes(name)) {
      return push([{ type: "err", text: `merge: ${name} not found` }])
    }
    if (name === state.branch) {
      return push([{ type: "err", text: "Cannot merge a branch into itself." }])
    }
    const otherHead = state.headByBranch[name]
    if (!otherHead) {
      return push([{ type: "err", text: `Branch ${name} has no commits.` }])
    }
    const parent = state.headByBranch[state.branch]
    const id = `c${state.commits.length + 1}`
    const h = hash()
    const commit: Commit = {
      id,
      hash: h,
      message: `Merge branch '${name}'`,
      branch: state.branch,
      parents: parent ? [parent, otherHead] : [otherHead],
    }
    return push(
      [
        { type: "out", text: `Updating ... Fast-forward` },
        { type: "out", text: `Merged '${name}' into ${state.branch}` },
        { type: "ok", text: "History is connected again." },
      ],
      {
        commits: [...state.commits, commit],
        headByBranch: { ...state.headByBranch, [state.branch]: id },
      }
    )
  }

  if (lower === "git log" || lower.startsWith("git log ")) {
    if (!state.commits.length) {
      return push([{ type: "out", text: "No commits yet." }])
    }
    const text = [...state.commits]
      .reverse()
      .map((c) => `${c.hash}  (${c.branch})  ${c.message}`)
      .join("\n")
    return push([{ type: "out", text }])
  }

  return push([
    {
      type: "err",
      text: `Unknown or unsupported here: ${cmd}. Type help`,
    },
  ])
}

const LINE: Record<GitState["log"][0]["type"], string> = {
  in: "text-white/90",
  out: "text-white/55",
  ok: "text-emerald-400/90",
  err: "text-red-400/90",
  hint: "text-white/40 italic",
}

export function GitCommitFlow({ className, mode = "first-repo" }: GitPlaygroundProps) {
  const [state, setState] = useState(() => fresh(mode))
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const logRef = useRef<HTMLDivElement>(null)

  const submit = useCallback(() => {
    const next = run(input, state)
    setState(next)
    setInput("")
    requestAnimationFrame(() => {
      if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
    })
  }, [input, state])

  const reset = useCallback(() => {
    setState(fresh(mode))
    setInput("")
    inputRef.current?.focus()
  }, [mode])

  const tips = useMemo(() => {
    if (mode === "branches") {
      return [
        "git branch feature-login",
        "git checkout feature-login",
        "git add .",
        'git commit -m "add login form"',
        "git checkout main",
        "git merge feature-login",
      ]
    }
    return [
      "git init",
      "git status",
      "git add .",
      'git commit -m "first commit"',
      "git log",
    ]
  }, [mode])

  return (
    <div
      className={cn("flex flex-col gap-4", className)}
      data-lenis-prevent
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-[10px] tracking-[0.16em] text-white/40 uppercase">
          Live git graph
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 border border-white/15 px-2.5 py-1.5 font-mono text-[10px] tracking-[0.14em] text-white/55 uppercase transition hover:border-accent/40 hover:text-accent"
        >
          <RotateCcw className="size-3" />
          Reset
        </button>
      </div>

      <CommitGraph state={state} />

      <div className="border border-white/10 bg-[#0a0a0a]">
        <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2 font-mono text-[10px] text-white/35">
          <Terminal className="size-3.5" />
          <span>
            {state.branch}
            {state.initialized ? "" : " (not a repo yet)"}
          </span>
          <span className="ml-auto text-white/25">
            {state.commits.length} commit{state.commits.length === 1 ? "" : "s"}
          </span>
        </div>

        <div
          ref={logRef}
          className="max-h-44 overflow-y-auto px-4 py-3 font-mono text-xs leading-relaxed"
          onClick={() => inputRef.current?.focus()}
        >
          {state.log.map((line, i) => (
            <div key={i} className={cn("whitespace-pre-wrap", LINE[line.type])}>
              {line.text}
            </div>
          ))}
        </div>

        <form
          className="flex border-t border-white/10"
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
        >
          <span className="px-3 py-2.5 font-mono text-xs text-accent">$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="min-w-0 flex-1 bg-transparent py-2.5 pr-4 font-mono text-xs text-white outline-none placeholder:text-white/20"
            placeholder='e.g. git commit -m "first commit"'
            spellCheck={false}
            autoComplete="off"
          />
        </form>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {tips.map((tip) => (
          <button
            key={tip}
            type="button"
            onClick={() => {
              setInput(tip)
              inputRef.current?.focus()
            }}
            className="border border-white/10 px-2 py-1 font-mono text-[10px] text-white/40 transition hover:border-white/25 hover:text-white/70"
          >
            {tip}
          </button>
        ))}
      </div>
    </div>
  )
}

function CommitGraph({ state }: { state: GitState }) {
  if (!state.commits.length) {
    return (
      <div className="border border-dashed border-white/10 px-4 py-8 text-center font-mono text-xs text-white/30">
        No commits yet. After git commit, nodes appear here.
      </div>
    )
  }

  // Chronological commit list with active HEAD highlight
  return (
    <div className="overflow-x-auto border border-white/10 bg-white/[0.02] px-4 py-5">
      <ol className="flex min-w-max items-end gap-0">
        {state.commits.map((c, i) => {
          const isHead = Object.values(state.headByBranch).includes(c.id)
          const onCurrent = c.id === state.headByBranch[state.branch]
          return (
            <li key={c.id} className="flex items-end">
              <div className="flex w-[5.5rem] flex-col items-center gap-1.5 md:w-24">
                <span
                  className={cn(
                    "size-3.5 transition",
                    onCurrent
                      ? "bg-accent scale-110"
                      : c.branch === "main"
                        ? "bg-white"
                        : "bg-white/50"
                  )}
                />
                <span
                  className={cn(
                    "font-mono text-[10px] tracking-[0.12em] uppercase",
                    onCurrent ? "text-accent" : "text-white/55"
                  )}
                >
                  {c.hash}
                </span>
                <span className="line-clamp-2 text-center text-[11px] text-white/40">
                  {c.message}
                </span>
                <span className="font-mono text-[9px] text-white/25">
                  {c.branch}
                  {isHead && onCurrent ? " · HEAD" : ""}
                </span>
              </div>
              {i < state.commits.length - 1 ? (
                <span className="mb-10 h-px w-6 bg-white/25 md:w-10" aria-hidden />
              ) : null}
            </li>
          )
        })}
      </ol>
      <p className="mt-4 font-mono text-[10px] text-white/30">
        Active branch:{" "}
        <span className="text-accent">{state.branch}</span>
        {state.staged.length ? (
          <span className="text-white/40">
            {" "}
            · staged: {state.staged.join(", ")}
          </span>
        ) : null}
      </p>
    </div>
  )
}
