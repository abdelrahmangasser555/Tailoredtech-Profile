"use client"

import { XIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type EditorStageProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  /** Wider stage for charts / markdown */
  size?: "md" | "lg" | "xl"
  className?: string
}

/** Center overlay for nested editors (comparison, markdown expand, charts). */
export function EditorStage({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = "lg",
  className,
}: EditorStageProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        data-lenis-prevent
        className={cn(
          "flex max-h-[min(92vh,900px)] flex-col gap-0 overflow-hidden rounded-none border-white/15 bg-[#050505] p-0 text-[#f5f5f0] ring-0",
          size === "md" && "w-[min(96vw,34rem)] sm:max-w-lg",
          size === "lg" && "w-[min(96vw,52rem)] sm:max-w-3xl",
          size === "xl" && "w-[min(96vw,72rem)] sm:max-w-5xl",
          className
        )}
        style={
          {
            "--accent": "#D4FF00",
            "--accent-foreground": "#0A0A0A",
            "--ring": "#D4FF00",
            "--popover": "#050505",
            "--popover-foreground": "#f5f5f0",
            "--background": "#050505",
            "--foreground": "#f5f5f0",
            "--border": "rgba(255,255,255,0.12)",
            "--muted-foreground": "#a3a3a3",
            "--chart-1": "#D4FF00",
            "--chart-2": "#8fa3b8",
            "--chart-3": "#a8a8aa",
            "--chart-4": "#6b9fc4",
            "--chart-5": "#dce6ef",
          } as React.CSSProperties
        }
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-white/10 px-4 py-3">
          <div className="min-w-0">
            <DialogTitle className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#D4FF00]">
              {title}
            </DialogTitle>
            {description ? (
              <DialogDescription className="mt-1 text-xs text-white/40">
                {description}
              </DialogDescription>
            ) : null}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-white/45 hover:text-white"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
          >
            <XIcon />
          </Button>
        </div>

        <div
          data-lenis-prevent
          className="editor-panel-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4"
        >
          {children}
        </div>

        {footer ? (
          <div className="shrink-0 border-t border-white/10 px-4 py-3">
            {footer}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
