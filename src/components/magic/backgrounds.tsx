"use client"

import { cn } from "@/lib/utils"

/** Subtle animated grid — Magic UI inspired, brand-colored */
export function GridBackground({
  className,
  fade = true,
}: {
  className?: string
  fade?: boolean
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-size-[48px_48px]",
          "[background-image:linear-gradient(to_right,color-mix(in_oklch,var(--foreground)_8%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--foreground)_8%,transparent)_1px,transparent_1px)]"
        )}
      />
      {fade && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--background)_70%)]" />
      )}
    </div>
  )
}

/** Soft teal mesh orbs for atmosphere */
export function MeshGlow({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div className="absolute -top-1/4 left-1/4 size-[520px] rounded-full bg-[var(--section-mesh)] blur-3xl" />
      <div className="absolute top-1/3 -right-1/4 size-[420px] rounded-full bg-[color-mix(in_oklch,var(--accent)_25%,transparent)] blur-3xl" />
    </div>
  )
}

/** Dot pattern overlay */
export function DotPattern({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0",
        "[background-image:radial-gradient(color-mix(in_oklch,var(--foreground)_14%,transparent)_1px,transparent_1px)]",
        "bg-size-[20px_20px]",
        "mask-[radial-gradient(ellipse_at_center,black,transparent_75%)]",
        className
      )}
    />
  )
}
