"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import { GlyphMatrix } from "@/components/ui/glyph-matrix"
import { BrandedMermaid } from "@/components/sections/branded-mermaid"
import {
  SectionImageGrid,
  SectionVideo,
} from "@/components/sections/section-media"
import {
  SectionChart,
  SectionChartsGrid,
} from "@/components/sections/section-chart"
import { SectionLayerNav } from "@/components/sections/section-layer-nav"
import { SectionMarkdown } from "@/components/sections/section-markdown"
import {
  ComparisonSectionDivider,
  SolutionComparisonTable,
} from "@/components/sections/solution-comparison-table"
import { OutcomeIconBackdrop } from "@/components/sections/outcome-icon"
import {
  SolutionHeroVisual,
  normalizeHeroVisual,
  paletteForBrand,
} from "@/components/sections/solution-hero-visual"
import { Section } from "@/components/layout/section"
import { isSectionChart, isSectionCharts } from "@/lib/section-chart"
import type { PresentationItem } from "@/lib/content"
import { scrollToId } from "@/components/motion/smooth-scroll"
import { cn } from "@/lib/utils"

const EASE = [0.22, 1, 0.36, 1] as const

type PresentationDetailProps = {
  presentation: PresentationItem
}

export function PresentationDetail({ presentation }: PresentationDetailProps) {
  const { page, brandClass } = presentation
  const reduce = useReducedMotion()
  const sectionIds = page.sections.map((s) => s.id).join(",")
  const [activeId, setActiveId] = useState(page.sections[0]?.id ?? "")
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ids = sectionIds.split(",").filter(Boolean)
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => Boolean(n))

    if (nodes.length === 0) return

    const updateActive = () => {
      const marker = window.innerHeight * 0.32
      let current = nodes[0]?.id ?? ""
      for (const node of nodes) {
        if (node.getBoundingClientRect().top <= marker) {
          current = node.id
        }
      }
      setActiveId((prev) => (prev === current ? prev : current))
    }

    updateActive()
    window.addEventListener("scroll", updateActive, { passive: true })
    window.addEventListener("resize", updateActive)

    let offLenis: (() => void) | undefined
    const attachLenis = () => {
      const lenis = window.__lenis
      if (!lenis || offLenis) return
      offLenis = lenis.on("scroll", updateActive)
    }
    attachLenis()
    const retry = window.setTimeout(attachLenis, 200)

    return () => {
      window.clearTimeout(retry)
      window.removeEventListener("scroll", updateActive)
      window.removeEventListener("resize", updateActive)
      offLenis?.()
    }
  }, [sectionIds])

  function scrollToSection(id: string) {
    scrollToId(id, -48)
  }

  return (
    <div className={cn("min-h-svh", brandClass)}>
      <PresentationHero presentation={presentation} reduce={!!reduce} />

      {page.outcomes.length > 0 && (
        <Section
          tone="light"
          className={
            page.comparison?.enabled
              ? "!py-16 !pb-12 md:!pt-20 md:!pb-14"
              : "!py-16 md:!py-20"
          }
        >
          <div className="grid gap-10 sm:grid-cols-3">
            {page.outcomes.map((outcome, i) => (
              <motion.div
                key={outcome.label}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }}
                className="relative overflow-hidden pl-5 pr-2"
              >
                <span
                  aria-hidden
                  className="absolute bottom-1 left-0 top-1 w-px bg-foreground/20"
                />
                <OutcomeIconBackdrop name={outcome.icon} />
                <p className="relative font-pixel-circle text-3xl font-medium tracking-tight md:text-4xl">
                  {outcome.value}
                </p>
                <p className="relative mt-2 text-sm text-muted-foreground">
                  {outcome.label}
                </p>
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      {page.comparison?.enabled && (
        <>
          {page.outcomes.length > 0 && <ComparisonSectionDivider />}
          <SolutionComparisonTable
            data={page.comparison}
            tightTop={page.outcomes.length > 0}
          />
        </>
      )}

      <Section tone="dark" className="!pt-16 md:!pt-20 !pb-24 md:!pb-32">
        <div
          ref={contentRef}
          className="grid gap-12 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-14 xl:grid-cols-[20rem_minmax(0,1fr)] xl:gap-16"
        >
          <aside className="hidden lg:block">
            <div className="sticky top-8">
              <p className="mb-6 font-mono text-[10px] tracking-[0.22em] uppercase text-white/35">
                Sections
              </p>
              <SectionLayerNav
                sections={page.sections}
                activeId={activeId}
                reduce={!!reduce}
                onSelect={scrollToSection}
              />
            </div>
          </aside>

          <div className="min-w-0 space-y-20 md:space-y-28">
            {page.sections.map((section, i) => {
              const chart =
                "chart" in section && isSectionChart(section.chart)
                  ? section.chart
                  : null
              const charts =
                "charts" in section && isSectionCharts(section.charts)
                  ? section.charts
                  : null

              return (
                <motion.article
                  key={section.id}
                  id={section.id}
                  initial={reduce ? false : { opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.55, ease: EASE }}
                  className="scroll-mt-12"
                >
                  <div className="mb-5 flex items-center gap-4">
                    <span className="font-mono text-[11px] tracking-[0.2em] text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span aria-hidden className="h-px flex-1 bg-white/10" />
                  </div>
                  <h2 className="font-pixel-circle text-3xl font-medium tracking-tight text-white md:text-4xl">
                    {section.title}
                  </h2>
                  {section.body?.trim() ? (
                    <SectionMarkdown content={section.body} tone="dark" />
                  ) : null}
                  {section.bullets.length > 0 && (
                    <ul className="mt-8 space-y-3">
                      {section.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex gap-3 text-sm leading-relaxed text-white/70 md:text-[15px]"
                        >
                          <span
                            aria-hidden
                            className="mt-2 size-1.5 shrink-0 bg-accent"
                          />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.video && <SectionVideo src={section.video} />}
                  {section.images.length > 0 && (
                    <SectionImageGrid images={section.images} />
                  )}
                  {charts ? (
                    <SectionChartsGrid charts={charts} tone="dark" />
                  ) : (
                    chart && <SectionChart config={chart} tone="dark" />
                  )}
                  {section.mermaid && (
                    <BrandedMermaid
                      brandClass={brandClass}
                      chart={section.mermaid}
                      title={section.mermaidTitle ?? undefined}
                      caption={section.mermaidCaption ?? undefined}
                    />
                  )}
                </motion.article>
              )
            })}
          </div>
        </div>
      </Section>
    </div>
  )
}

function PresentationHero({
  presentation,
  reduce,
}: {
  presentation: PresentationItem
  reduce: boolean
}) {
  const { page, clientLogo, clientName, brandClass } = presentation
  const palette = paletteForBrand(brandClass)
  const sectionRef = useRef<HTMLElement>(null)
  const [glyphColor, setGlyphColor] = useState("#E07040")
  const showExplore =
    "showExplore" in page ? Boolean(page.showExplore) : true
  const glyphBackdrop =
    "glyphBackdrop" in page ? Boolean(page.glyphBackdrop) : true

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return
    const resolved = getComputedStyle(node).getPropertyValue("--accent").trim()
    if (resolved) setGlyphColor(resolved)
  }, [brandClass])

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[88svh] flex-col overflow-hidden bg-[var(--section-dark)] text-[var(--section-dark-fg,#f5f5f0)] lg:min-h-svh"
    >
      {clientLogo ? (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="absolute top-5 left-5 z-30 md:top-7 md:left-8 lg:left-10"
        >
          <Image
            src={clientLogo}
            alt={clientName ?? "Client"}
            width={320}
            height={110}
            className="h-20 w-auto max-w-[min(70vw,18rem)] object-contain object-left brightness-0 invert md:h-24 md:max-w-[20rem] lg:h-28 lg:max-w-[22rem]"
            priority
          />
        </motion.div>
      ) : null}

      {glyphBackdrop ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 opacity-45"
          style={{
            maskImage:
              "radial-gradient(ellipse 55% 50% at 30% 40%, transparent 0%, rgba(0,0,0,0.3) 45%, black 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 55% 50% at 30% 40%, transparent 0%, rgba(0,0,0,0.3) 45%, black 75%)",
          }}
        >
          <GlyphMatrix
            className="h-full w-full"
            color={glyphColor}
            cellSize={16}
            mutationRate={0.03}
            interval={110}
            fadeBottom={0.5}
            glyphs="01·•<>/=+*"
          />
        </div>
      ) : null}

      <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 px-5 pt-28 pb-14 md:px-8 md:pt-32 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-8 lg:px-10 lg:pt-36 lg:pb-16">
        <div className="relative z-20 flex max-w-xl flex-col gap-5 lg:-translate-y-4 lg:gap-6">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="flex flex-col gap-4"
          >
            <p className="font-mono text-[11px] tracking-[0.24em] uppercase text-accent">
              {page.eyebrow}
            </p>
          </motion.div>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.06, ease: EASE }}
            className="font-pixel-circle text-[clamp(2.4rem,6vw,4.5rem)] font-medium leading-[1.05] tracking-[-0.04em]"
          >
            {page.headline}
            <br />
            <span className="text-accent">{page.headlineAccent}</span>
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.16, ease: EASE }}
            className="max-w-md text-sm leading-relaxed text-white/50 md:text-base"
          >
            {page.tagline}
          </motion.p>

          {showExplore ? (
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.28, ease: EASE }}
              className="flex flex-wrap gap-3 pt-1"
            >
              <a
                href={`#${page.sections[0]?.id ?? "overview"}`}
                className="inline-flex h-11 items-center gap-2 border border-white/25 px-5 text-sm font-medium text-white transition hover:bg-white/5"
              >
                Explore
                <ArrowUpRight className="size-4" />
              </a>
            </motion.div>
          ) : null}
        </div>

        {normalizeHeroVisual(page.heroVisual) !== "glyph" && (
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.18, ease: EASE }}
          >
            <SolutionHeroVisual
              kind={page.heroVisual}
              reduce={reduce}
              palette={palette}
            />
          </motion.div>
        )}
      </div>
    </section>
  )
}
