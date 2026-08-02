"use client"

import { useEffect, useId, useRef, useState } from "react"
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { CompactInput, FieldLabel } from "@/components/editor/fields"
import {
  InputGroup,
  InputGroupTextarea,
} from "@/components/ui/input-group"

type MermaidFieldProps = {
  value: string
  onChange: (value: string) => void
  title: string
  onTitleChange: (value: string) => void
  caption: string
  onCaptionChange: (value: string) => void
  className?: string
}

export async function validateMermaid(source: string): Promise<string | null> {
  const chart = source.trim()
  if (!chart) return null
  try {
    const mermaid = (await import("mermaid")).default
    mermaid.initialize({ startOnLoad: false, securityLevel: "strict" })
    await mermaid.parse(chart)
    return null
  } catch (err) {
    return err instanceof Error ? err.message : "Invalid mermaid syntax"
  }
}

/** Mermaid source + live preview + syntax gate */
export function MermaidField({
  value,
  onChange,
  title,
  onTitleChange,
  caption,
  onCaptionChange,
  className,
}: MermaidFieldProps) {
  const uid = useId().replace(/:/g, "")
  const previewRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [checking, setChecking] = useState(false)
  const [ok, setOk] = useState(false)

  useEffect(() => {
    let cancelled = false
    const chart = value.trim()
    if (!chart) {
      setError(null)
      setOk(false)
      if (previewRef.current) previewRef.current.innerHTML = ""
      return
    }

    setChecking(true)
    const t = window.setTimeout(async () => {
      try {
        const mermaid = (await import("mermaid")).default
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "dark",
        })
        await mermaid.parse(chart)
        if (cancelled) return
        setError(null)
        setOk(true)
        const id = `mermaid-edit-${uid}-${Date.now()}`
        const { svg } = await mermaid.render(id, chart)
        if (cancelled || !previewRef.current) return
        previewRef.current.innerHTML = svg
        const el = previewRef.current.querySelector("svg")
        if (el) {
          el.setAttribute("width", "100%")
          el.removeAttribute("height")
          el.style.width = "100%"
          el.style.height = "auto"
          el.style.maxHeight = "220px"
        }
      } catch (err) {
        if (cancelled) return
        setOk(false)
        setError(err instanceof Error ? err.message : "Invalid mermaid")
        if (previewRef.current) previewRef.current.innerHTML = ""
      } finally {
        if (!cancelled) setChecking(false)
      }
    }, 380)

    return () => {
      cancelled = true
      window.clearTimeout(t)
    }
  }, [value, uid])

  return (
    <div className={cn("space-y-3", className)}>
      <div className="grid gap-3 sm:grid-cols-2">
        <CompactInput
          label="Diagram title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
        <CompactInput
          label="Caption"
          value={caption}
          onChange={(e) => onCaptionChange(e.target.value)}
        />
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <FieldLabel>Mermaid source</FieldLabel>
          <span className="inline-flex items-center gap-1 font-mono text-[9px] tracking-wide uppercase">
            {checking ? (
              <>
                <Loader2 className="size-3 animate-spin text-white/40" />
                <span className="text-white/35">Checking</span>
              </>
            ) : error ? (
              <>
                <AlertCircle className="size-3 text-red-400" />
                <span className="text-red-400">Invalid</span>
              </>
            ) : ok ? (
              <>
                <CheckCircle2 className="size-3 text-accent" />
                <span className="text-accent">Valid</span>
              </>
            ) : (
              <span className="text-white/25">Empty</span>
            )}
          </span>
        </div>
        <InputGroup className="h-auto rounded-none border-white/15 bg-white/[0.03] has-[[data-slot=input-group-control]:focus-visible]:border-accent has-[[data-slot=input-group-control]:focus-visible]:ring-accent/25">
          <InputGroupTextarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={7}
            className="min-h-[8rem] font-mono text-[11px] leading-relaxed text-white/85 placeholder:text-white/25"
            placeholder={"flowchart LR\n  A -.-> B"}
            aria-invalid={Boolean(error)}
          />
        </InputGroup>
        {error ? (
          <p className="mt-1.5 font-mono text-[10px] leading-snug text-red-400/90">
            {error}
          </p>
        ) : null}
      </div>

      <div>
        <FieldLabel>Preview</FieldLabel>
        <div
          ref={previewRef}
          className="flex min-h-24 items-center justify-center overflow-hidden border border-white/10 bg-black/30 p-3"
        />
      </div>
    </div>
  )
}
