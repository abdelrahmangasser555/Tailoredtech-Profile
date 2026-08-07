"use client"

import dynamic from "next/dynamic"
import { useMemo, useState } from "react"
import { Play, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

const Monaco = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center border border-white/10 bg-[#0a0a0a] font-mono text-xs text-white/30">
      Loading editor…
    </div>
  ),
})

type NotePlaygroundProps = {
  language?: string
  initialCode: string
  title?: string
  caption?: string
  /** Simple expected substring in console output (optional check) */
  expectIncludes?: string
  hint?: string
}

export function NotePlayground({
  language = "javascript",
  initialCode,
  title,
  caption,
  expectIncludes,
  hint,
}: NotePlaygroundProps) {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState<string[]>([])
  const [status, setStatus] = useState<"idle" | "ok" | "err" | "pass">("idle")

  const canRun = language === "javascript" || language === "js" || language === "typescript" || language === "ts"

  const run = () => {
    if (!canRun) {
      setOutput(["This playground runs JavaScript only. Edit the code, then copy it into your project."])
      setStatus("idle")
      return
    }

    const logs: string[] = []
    const fakeConsole = {
      log: (...args: unknown[]) => {
        logs.push(args.map(stringify).join(" "))
      },
      error: (...args: unknown[]) => {
        logs.push("Error: " + args.map(stringify).join(" "))
      },
      warn: (...args: unknown[]) => {
        logs.push("Warn: " + args.map(stringify).join(" "))
      },
    }

    try {
      // Strip TypeScript-ish type annotations lightly for demo runs
      const runnable =
        language === "typescript" || language === "ts"
          ? code
              .replace(/:\s*[A-Za-z0-9_<>[\]|&"'.,\s]+(?=[,)=])/g, "")
              .replace(/\bas\s+[A-Za-z0-9_<>[\]|&.]+/g, "")
          : code

      // eslint-disable-next-line no-new-func
      const fn = new Function("console", runnable)
      fn(fakeConsole)

      if (!logs.length) logs.push("(ran with no console output)")

      const joined = logs.join("\n")
      if (expectIncludes && joined.includes(expectIncludes)) {
        setStatus("pass")
        logs.push("✓ Looks right.")
      } else if (expectIncludes) {
        setStatus("ok")
        logs.push(`Tip: output should include "${expectIncludes}"`)
      } else {
        setStatus("ok")
      }
      setOutput(logs)
    } catch (e) {
      setStatus("err")
      setOutput([e instanceof Error ? e.message : String(e)])
    }
  }

  const reset = () => {
    setCode(initialCode)
    setOutput([])
    setStatus("idle")
  }

  const statusLabel = useMemo(() => {
    if (status === "pass") return "Pass"
    if (status === "err") return "Error"
    if (status === "ok") return "Ran"
    return language
  }, [status, language])

  return (
    <div className="mt-6 first:mt-0" data-lenis-prevent>
      {title ? (
        <p className="mb-3 font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
          {title}
        </p>
      ) : null}

      <div className="overflow-hidden border border-white/10">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-[#0a0a0a] px-3 py-2">
          <span
            className={cn(
              "font-mono text-[10px] tracking-[0.14em] uppercase",
              status === "pass"
                ? "text-emerald-400"
                : status === "err"
                  ? "text-red-400"
                  : "text-white/40"
            )}
          >
            {statusLabel}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 border border-white/15 px-2.5 py-1.5 font-mono text-[10px] tracking-[0.14em] text-white/55 uppercase transition hover:border-white/30 hover:text-white"
            >
              <RotateCcw className="size-3" />
              Reset
            </button>
            <button
              type="button"
              onClick={run}
              className="inline-flex items-center gap-1.5 border border-accent bg-accent px-2.5 py-1.5 font-mono text-[10px] tracking-[0.14em] text-accent-foreground uppercase"
            >
              <Play className="size-3" />
              Run
            </button>
          </div>
        </div>

        <div className="h-56 bg-[#0a0a0a]">
          <Monaco
            height="100%"
            language={language === "ts" ? "typescript" : language === "js" ? "javascript" : language}
            theme="vs-dark"
            value={code}
            onChange={(v) => setCode(v ?? "")}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              wordWrap: "on",
              padding: { top: 12 },
              automaticLayout: true,
              tabSize: 2,
            }}
          />
        </div>

        {output.length ? (
          <pre className="max-h-36 overflow-auto border-t border-white/10 bg-black/50 px-4 py-3 font-mono text-xs leading-relaxed text-white/60 whitespace-pre-wrap">
            {output.join("\n")}
          </pre>
        ) : null}
      </div>

      {hint ? (
        <p className="mt-2 font-mono text-[10px] text-white/30">{hint}</p>
      ) : null}
      {caption ? (
        <p className="mt-3 text-sm text-white/35">{caption}</p>
      ) : null}
    </div>
  )
}

function stringify(v: unknown): string {
  if (typeof v === "string") return v
  try {
    return JSON.stringify(v)
  } catch {
    return String(v)
  }
}
