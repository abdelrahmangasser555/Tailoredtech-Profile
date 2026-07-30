"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import type { PresentationItem } from "@/lib/content"
import { cn } from "@/lib/utils"

const EASE = [0.22, 1, 0.36, 1] as const

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

type PresentationListProps = {
  items: PresentationItem[]
  headline: string
  subheadline: string
}

export function PresentationList({
  items,
  headline,
  subheadline,
}: PresentationListProps) {
  const reduce = useReducedMotion()

  return (
    <div className="min-h-svh bg-[#050505] text-[#f5f5f0]">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <motion.header
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-14 max-w-2xl md:mb-20"
        >
          <p className="mb-4 font-mono text-[11px] tracking-[0.22em] uppercase text-white/40">
            Direct access
          </p>
          <h1 className="font-pixel-circle text-4xl font-medium tracking-tight md:text-5xl">
            {headline}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-white/45 md:text-base">
            {subheadline}
          </p>
        </motion.header>

        <div className="grid gap-6 sm:grid-cols-2 lg:gap-7">
          {items.map((item, i) => (
            <PresentationCard
              key={item.id}
              item={item}
              index={i}
              reduce={!!reduce}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function PresentationCard({
  item,
  index,
  reduce,
}: {
  item: PresentationItem
  index: number
  reduce: boolean
}) {
  const { page, brandClass } = item

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.06 + index * 0.07, ease: EASE }}
    >
      <Link
        href={item.href}
        className={cn(
          "group relative flex flex-col overflow-hidden border border-white/10 transition",
          "hover:border-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        )}
      >
        {/* Mini hero preview */}
        <div
          className={cn(
            "relative aspect-[16/10] overflow-hidden",
            brandClass
          )}
        >
          <div className="absolute inset-0 bg-[var(--section-dark,#001f3d)]" />
          <div
            aria-hidden
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: `
                radial-gradient(ellipse 70% 60% at 20% 40%, color-mix(in oklab, var(--accent) 35%, transparent), transparent 70%),
                linear-gradient(135deg, transparent 40%, color-mix(in oklab, var(--accent) 12%, transparent))
              `,
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.55),transparent_45%)]" />

          <div className="relative z-10 flex h-full flex-col justify-between p-5 md:p-6">
            <div className="flex items-start justify-between gap-3">
              {item.clientLogo ? (
                <Image
                  src={item.clientLogo}
                  alt={item.clientName ?? ""}
                  width={100}
                  height={36}
                  className="h-7 w-auto object-contain object-left brightness-0 invert"
                />
              ) : (
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/50">
                  {page.eyebrow}
                </span>
              )}
              <ArrowUpRight className="size-4 text-white/40 transition group-hover:text-[var(--accent)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>

            <div>
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--accent)]">
                {page.eyebrow}
              </p>
              <p className="mt-2 font-pixel-circle text-2xl font-medium leading-tight tracking-tight text-white md:text-[1.65rem]">
                {page.headline}{" "}
                <span className="text-[var(--accent)]">{page.headlineAccent}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 bg-[#0a0a0a] px-5 py-4 md:px-6">
          <h2 className="text-base font-medium text-white">{item.title}</h2>
          <p className="line-clamp-2 text-sm leading-relaxed text-white/45">
            {item.short}
          </p>
          <div className="mt-1 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[10px] tracking-[0.14em] uppercase text-white/35">
            <span>Created {formatDate(item.createdAt)}</span>
            <span>Updated {formatDate(item.updatedAt)}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
