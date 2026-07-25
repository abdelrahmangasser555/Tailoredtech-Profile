"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

/** Infinite horizontal marquee — Magic UI style */
export function Marquee({
  children,
  className,
  pauseOnHover = true,
  reverse = false,
  speed = 40,
}: {
  children: React.ReactNode
  className?: string
  pauseOnHover?: boolean
  reverse?: boolean
  speed?: number
}) {
  return (
    <div
      className={cn(
        "group flex overflow-hidden [--gap:2.5rem]",
        className
      )}
    >
      <div
        className={cn(
          "flex min-w-full shrink-0 items-center gap-(--gap) py-4 animate-marquee",
          reverse && "animate-marquee-reverse",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
        style={{ ["--duration" as string]: `${speed}s` }}
      >
        {children}
      </div>
      <div
        aria-hidden
        className={cn(
          "flex min-w-full shrink-0 items-center gap-(--gap) py-4 animate-marquee",
          reverse && "animate-marquee-reverse",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
        style={{ ["--duration" as string]: `${speed}s` }}
      >
        {children}
      </div>
    </div>
  )
}

/** Border beam effect on hover — Aceternity inspired */
export function BorderBeam({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      >
        <div className="absolute -inset-px rounded-2xl bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,var(--accent)_10%,transparent_25%)] opacity-60 animate-spin-slow" />
      </div>
      <div className="relative z-10 h-full bg-card m-px rounded-[calc(1rem-1px)]">
        {children}
      </div>
    </div>
  )
}

/** Spotlight that follows cursor — Aceternity inspired */
export function SpotlightCard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    }
    el.addEventListener("mousemove", onMove)
    return () => el.removeEventListener("mousemove", onMove)
  }, [])

  return (
    <div
      ref={ref}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card/80",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(420px circle at ${pos.x}px ${pos.y}px, color-mix(in oklch, var(--accent) 18%, transparent), transparent 40%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
