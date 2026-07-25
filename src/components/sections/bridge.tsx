"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { TextReveal } from "@/components/motion/reveal"

/** Quiet bridge between the $2B moment and clients */
export function Bridge() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], [40, -40])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.4])

  return (
    <section
      ref={ref}
      className="relative overflow-x-clip bg-[var(--section-dark)] text-white"
    >
      <div className="mx-auto flex min-h-[42vh] max-w-6xl items-center px-5 py-20 md:min-h-[48vh] md:px-8 md:py-28">
        <motion.div style={{ y, opacity }} className="max-w-2xl">
          <p className="mb-4 font-mono text-[11px] tracking-[0.22em] uppercase text-accent">
            Scale
          </p>
          <TextReveal
            text="Software that moves with the fleets that move the world"
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.1] text-balance"
          />
        </motion.div>
      </div>
    </section>
  )
}
