"use client"

import { XIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type EditorPanelProps = {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

/**
 * Push-style editor chrome (not an overlay).
 * Parent layout shrinks the preview; this panel owns its own scroll (Lenis-prevented).
 */
export function EditorPanel({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
}: EditorPanelProps) {
  if (!open) return null

  return (
    <aside
      data-lenis-prevent
      data-lenis-prevent-wheel
      className={cn(
        "editor-panel sticky top-0 z-40 flex h-svh w-[min(100vw,22.5rem)] shrink-0 flex-col border-l border-white/10 bg-[#050505] text-[#f5f5f0]",
        "animate-in fade-in-0 slide-in-from-right-4 duration-200",
        className
      )}
      style={
        {
          "--accent": "#D4FF00",
          "--accent-foreground": "#0A0A0A",
          "--ring": "#D4FF00",
          "--background": "#050505",
          "--foreground": "#f5f5f0",
          "--popover": "#0A0A0A",
          "--popover-foreground": "#f5f5f0",
          "--muted": "#161616",
          "--muted-foreground": "#a3a3a3",
          "--border": "rgba(255,255,255,0.12)",
          "--input": "rgba(255,255,255,0.15)",
          "--primary": "#D4FF00",
          "--primary-foreground": "#0A0A0A",
        } as React.CSSProperties
      }
    >
      <header className="flex shrink-0 items-start justify-between gap-3 border-b border-white/10 px-3.5 py-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#D4FF00]">
            {title}
          </p>
          {description ? (
            <p className="mt-1 text-[11px] leading-snug text-white/40">
              {description}
            </p>
          ) : null}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="shrink-0 text-white/45 hover:text-white"
          onClick={onClose}
          aria-label="Close editor"
        >
          <XIcon />
        </Button>
      </header>

      <div className="editor-panel-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-3.5 py-3">
        {children}
      </div>

      {footer ? (
        <footer className="shrink-0 border-t border-white/10 px-3.5 py-2.5">
          {footer}
        </footer>
      ) : null}
    </aside>
  )
}

export function EditorSection({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/35">
        {label}
      </p>
      {children}
    </div>
  )
}

export function EditorDivider() {
  return <div className="my-3.5 h-px bg-white/10" />
}
