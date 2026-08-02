"use client"

import Link from "next/link"
import { Pencil } from "lucide-react"
import { cn } from "@/lib/utils"

type LocalEditLinkProps = {
  href: string
  className?: string
  label?: string
}

/** Small edit entry point — only render when local edit is enabled (caller gates). */
export function LocalEditLink({
  href,
  className,
  label = "Edit",
}: LocalEditLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 border border-white/20 bg-white/5 px-2.5 font-mono text-[10px] tracking-[0.14em] uppercase text-white/70 transition hover:border-accent hover:text-accent",
        className
      )}
    >
      <Pencil className="size-3" />
      {label}
    </Link>
  )
}
