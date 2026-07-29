"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"
import { getIcon } from "@/lib/icons"
import { cn } from "@/lib/utils"
import type { ServiceItem } from "@/lib/content"

const EASE = [0.22, 1, 0.36, 1] as const

const cardVariants = {
  rest: {},
  hover: {
    transition: { staggerChildren: 0, delayChildren: 0 },
  },
}

const iconVariants = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -2,
    scale: 1.04,
    transition: { duration: 0.45, ease: EASE },
  },
}

const arrowTransition = { duration: 0.38, ease: EASE }

const arrowOutVariants = {
  rest: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: arrowTransition,
  },
  hover: {
    x: 12,
    y: -12,
    opacity: 0,
    transition: arrowTransition,
  },
}

const arrowInVariants = {
  rest: {
    x: -12,
    y: 12,
    opacity: 0,
    transition: arrowTransition,
  },
  hover: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: arrowTransition,
  },
}

const MotionLink = motion.create(Link)

export function RelatedSolutionCard({ item }: { item: ServiceItem }) {
  const Icon = getIcon(item.icon)

  return (
    <MotionLink
      href={item.href}
      initial="rest"
      animate="rest"
      whileHover="hover"
      variants={cardVariants}
      className={cn(
        "group relative block overflow-visible border border-foreground/10 bg-white",
        "pt-10 pl-5 pr-5 pb-5 transition-[border-color,box-shadow] duration-500",
        "hover:border-foreground/25 hover:shadow-[0_16px_48px_rgba(0,0,0,0.06)]"
      )}
      style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
    >
      <motion.span
        aria-hidden
        variants={iconVariants}
        className="pointer-events-none absolute -left-2 -top-6 z-10 will-change-transform"
      >
        <Icon
          className={cn(
            "size-14 text-foreground/18 stroke-[1.15]",
            "transition-colors duration-500 group-hover:text-foreground/42"
          )}
          aria-hidden
        />
      </motion.span>

      <div className="relative z-0 flex items-start justify-between gap-3">
        <p className="font-pixel-circle text-lg font-medium tracking-tight text-foreground">
          {item.title}
        </p>

        <span
          aria-hidden
          className="relative mt-0.5 flex size-4 shrink-0 items-center justify-center overflow-visible"
        >
          <motion.span
            variants={arrowOutVariants}
            className="absolute inset-0 flex items-center justify-center will-change-transform"
          >
            <ArrowUpRight className="size-4 text-foreground/25" strokeWidth={2} />
          </motion.span>
          <motion.span
            variants={arrowInVariants}
            className="absolute inset-0 flex items-center justify-center will-change-transform"
          >
            <ArrowUpRight
              className="size-4 text-foreground/55"
              strokeWidth={2}
            />
          </motion.span>
        </span>
      </div>
      <p className="relative z-0 mt-2 text-sm leading-relaxed text-muted-foreground">
        {item.short}
      </p>
    </MotionLink>
  )
}
