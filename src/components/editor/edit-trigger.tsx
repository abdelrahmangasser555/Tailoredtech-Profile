"use client"

import { Pencil } from "lucide-react"
import { cn } from "@/lib/utils"

type EditTriggerProps = {
  label?: string
  onClick: () => void
  className?: string
}

/** Compact accent edit chip for overlaying preview surfaces */
export function EditTrigger({
  label = "Edit",
  onClick,
  className,
}: EditTriggerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-7 items-center gap-1.5 border border-accent/50 bg-accent px-2.5 font-mono text-[10px] tracking-[0.14em] uppercase text-accent-foreground transition hover:brightness-110",
        className
      )}
    >
      <Pencil className="size-3" />
      {label}
    </button>
  )
}
