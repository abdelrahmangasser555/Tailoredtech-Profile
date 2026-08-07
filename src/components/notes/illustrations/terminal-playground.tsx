"use client"

import { useCallback, useRef, useState } from "react"
import { RotateCcw, Terminal } from "lucide-react"
import {
  createTerminalState,
  runTerminalCommand,
  TERMINAL_SCENARIOS,
  type TerminalLine,
  type TerminalState,
} from "@/components/notes/illustrations/terminal-scenarios"
import { cn } from "@/lib/utils"

type TerminalPlaygroundProps = {
  scenario: string
  title?: string
  caption?: string
  className?: string
}

const LINE_STYLES: Record<TerminalLine["type"], string> = {
  input: "text-white/90",
  output: "text-white/55",
  success: "text-emerald-400/90",
  error: "text-red-400/90",
  hint: "text-white/40 italic",
}

export function TerminalPlayground({
  scenario,
  title,
  caption,
  className,
}: TerminalPlaygroundProps) {
  const meta = TERMINAL_SCENARIOS[scenario]
  const [state, setState] = useState<TerminalState>(() =>
    createTerminalState(scenario)
  )
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "output", text: meta?.starterHint ?? "Type a command and press Enter." },
  ])
  const [input, setInput] = useState("")
  const [done, setDone] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const reset = useCallback(() => {
    setState(createTerminalState(scenario))
    setLines([
      { type: "output", text: meta?.starterHint ?? "Type a command and press Enter." },
    ])
    setInput("")
    setDone(false)
    inputRef.current?.focus()
  }, [scenario, meta?.starterHint])

  const submit = useCallback(() => {
    const cmd = input.trim()
    if (!cmd) return

    const result = runTerminalCommand(scenario, cmd, state)
    setState(result.state)
    setLines((prev) => [
      ...prev,
      { type: "input", text: `$ ${cmd}` },
      ...result.lines,
    ])
    setInput("")

    const scenarioMeta = TERMINAL_SCENARIOS[scenario]
    if (
      scenarioMeta &&
      result.state.goalIndex >= scenarioMeta.goals.length &&
      !done
    ) {
      setDone(true)
      setLines((prev) => [
        ...prev,
        { type: "success", text: "Scenario complete. You walked the full flow." },
      ])
    }
  }, [input, scenario, state, done])

  const goal = meta?.goals[state.goalIndex]
  const progress = meta
    ? `${Math.min(state.goalIndex, meta.goals.length)}/${meta.goals.length}`
    : null

  return (
    <div className={cn("mt-6 first:mt-0", className)}>
      {(title || meta?.title) && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
            {title ?? meta?.title}
          </p>
          {progress ? (
            <span className="font-mono text-[10px] text-white/30">
              Step {progress}
            </span>
          ) : null}
        </div>
      )}

      <div className="border border-white/10 bg-[#0a0a0a]" data-lenis-prevent>
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
          <div className="flex items-center gap-2 font-mono text-[10px] text-white/35">
            <Terminal className="size-3.5" />
            <span>{state.cwd}</span>
          </div>
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-1 font-mono text-[10px] text-white/35 uppercase transition hover:text-accent"
          >
            <RotateCcw className="size-3" />
            Reset
          </button>
        </div>

        <div
          className="max-h-56 overflow-y-auto px-4 py-3 font-mono text-xs leading-relaxed"
          onClick={() => inputRef.current?.focus()}
        >
          {lines.map((line, i) => (
            <div key={i} className={cn("whitespace-pre-wrap", LINE_STYLES[line.type])}>
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
            placeholder={goal ? `Next: ${goal}` : "command…"}
            spellCheck={false}
            autoComplete="off"
          />
        </form>
      </div>

      {goal && !done ? (
        <p className="mt-2 font-mono text-[10px] text-white/30">
          Try: <span className="text-white/50">{goal}</span>
        </p>
      ) : null}

      {caption ? (
        <p className="mt-3 text-sm text-white/35">{caption}</p>
      ) : null}
    </div>
  )
}
