"use client"

import { ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type NoteLinkBlockProps = {
  href: string
  label: string
  description?: string
  className?: string
}

export function NoteLinkBlock({
  href,
  label,
  description,
  className,
}: NoteLinkBlockProps) {
  const external = href.startsWith("http")
  const classNames = cn(
    "group mt-5 flex items-start justify-between gap-4 border-b border-white/10 py-3 first:mt-0 transition hover:border-accent/40",
    className
  )

  const inner = (
    <>
      <span>
        <span className="font-pixel-circle text-lg text-white transition group-hover:text-accent md:text-xl">
          {label}
        </span>
        {description ? (
          <span className="mt-1 block text-sm text-white/40">{description}</span>
        ) : null}
      </span>
      <ArrowUpRight className="mt-1 size-4 shrink-0 text-white/35 transition group-hover:text-accent" />
    </>
  )

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={classNames}>
        {inner}
      </a>
    )
  }

  return (
    <Link href={href} className={classNames}>
      {inner}
    </Link>
  )
}
