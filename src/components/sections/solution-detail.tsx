"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion"
import { GlyphMatrix } from "@/components/ui/glyph-matrix"
import { RelatedSolutionCard } from "@/components/sections/related-solution-card"
import { BookDemoDialog } from "@/components/sections/book-demo-dialog"
import { BrandedMermaid } from "@/components/sections/branded-mermaid"
import {
  SectionImageGrid,
  SectionVideo,
} from "@/components/sections/section-media"
import { SectionLayerNav } from "@/components/sections/section-layer-nav"
import {
  ComparisonSectionDivider,
  SolutionComparisonTable,
} from "@/components/sections/solution-comparison-table"
import { OutcomeIconBackdrop } from "@/components/sections/outcome-icon"
import { SolutionHeroVisual, normalizeHeroVisual } from "@/components/sections/solution-hero-visual"
import { SectionChart } from "@/components/sections/section-chart"
import { SectionMarkdown } from "@/components/sections/section-markdown"
import { Section } from "@/components/layout/section"
import {
  getRelatedServices,
  type ServiceItem,
} from "@/lib/content"
import { isSectionChart } from "@/lib/section-chart"
import { scrollToId } from "@/components/motion/smooth-scroll"

const EASE = [0.22, 1, 0.36, 1] as const

type SolutionDetailProps = {
  service: ServiceItem
}

export function SolutionDetail({ service }: SolutionDetailProps) {
  const { page } = service
  const reduce = useReducedMotion()
  const related = getRelatedServices(page.related)
  const sectionIds = page.sections.map((s) => s.id).join(",")
  const [activeId, setActiveId] = useState(page.sections[0]?.id ?? "")
  const [showFloatCta, setShowFloatCta] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ids = sectionIds.split(",").filter(Boolean)
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => Boolean(n))

    if (nodes.length === 0) return

    // Scroll spy (not IntersectionObserver): tall sections with media never
    // meet IO thresholds, so active nav would freeze. Marker = ~1/3 viewport.
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

  useEffect(() => {
    const node = heroRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Float CTA only after the hero has left the top of the viewport
        setShowFloatCta(entry.boundingClientRect.bottom < 72)
      },
      { threshold: [0, 0.05, 0.15, 0.35, 0.55, 0.75, 1] }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  function scrollToSection(id: string) {
    scrollToId(id, -112)
  }

  return (
    <>
      <SolutionHero
        service={service}
        reduce={!!reduce}
        sectionRef={heroRef}
      />

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

      <Section tone="dark" className="!pt-16 md:!pt-20">
        <div
          ref={contentRef}
          className="grid gap-12 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-14 xl:grid-cols-[20rem_minmax(0,1fr)] xl:gap-16"
        >
          <aside className="hidden lg:block">
            <div className="sticky top-24">
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

              return (
              <motion.article
                key={section.id}
                id={section.id}
                initial={reduce ? false : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: 0.04, ease: EASE }}
                className="scroll-mt-28"
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
                {chart && <SectionChart config={chart} tone="dark" />}
                {section.mermaid && (
                  <BrandedMermaid
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

      {related.length > 0 && (
        <Section tone="light">
          <p className="mb-6 font-mono text-[11px] tracking-[0.22em] uppercase text-foreground/45">
            Related solutions
          </p>
          <div className="grid gap-6 sm:grid-cols-3 sm:gap-5">
            {related.map((item) => (
              <RelatedSolutionCard key={item.id} item={item} />
            ))}
          </div>
        </Section>
      )}

      <Section tone="dark">
        <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <div className="max-w-xl">
            <p className="mb-3 font-mono text-[11px] tracking-[0.22em] uppercase text-accent">
              Next step
            </p>
            <h2 className="font-pixel-circle text-3xl font-medium tracking-tight md:text-4xl">
              See {service.title} in action
            </h2>
            <p className="mt-3 text-sm text-white/45">
              Book a focused demo. We reply within one business day.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <BookDemoDialog
              solutionTitle={service.title}
              label={page.demo.label}
              title={page.demo.title}
              subtitle={page.demo.subtitle}
              submitLabel={page.demo.submitLabel}
            />
            <Link
              href="/services"
              className="inline-flex h-11 items-center gap-2 border border-white/25 px-5 text-sm font-medium text-white transition hover:bg-white/5"
            >
              All solutions
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </Section>

      <AnimatePresence>
        {showFloatCta && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="fixed bottom-5 right-5 z-50 max-md:bottom-[max(1.25rem,env(safe-area-inset-bottom))] md:bottom-8 md:right-8"
          >
            <BookDemoDialog
              solutionTitle={service.title}
              label={page.demo.label}
              title={page.demo.title}
              subtitle={page.demo.subtitle}
              submitLabel={page.demo.submitLabel}
              trigger={
                <button
                  type="button"
                  className="inline-flex h-12 cursor-pointer items-center gap-2 bg-accent px-5 text-sm font-medium text-accent-foreground shadow-[0_12px_40px_rgba(212,255,0,0.28)] transition hover:brightness-95"
                >
                  {page.demo.label}
                  <ArrowRight className="size-4" />
                </button>
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function SolutionHero({
  service,
  reduce,
  sectionRef,
}: {
  service: ServiceItem
  reduce: boolean
  sectionRef: React.RefObject<HTMLElement | null>
}) {
  const { page } = service
  const showExplore =
    "showExplore" in page ? Boolean(page.showExplore) : true
  const glyphBackdrop =
    "glyphBackdrop" in page ? Boolean(page.glyphBackdrop) : true

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[88svh] flex-col overflow-hidden bg-black text-white [--accent:#D4FF00] [--accent-foreground:#0A0A0A] lg:min-h-svh"
    >
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
            color="#D4FF00"
            cellSize={16}
            mutationRate={0.03}
            interval={110}
            fadeBottom={0.5}
            glyphs="01·•<>/=+*"
          />
        </div>
      ) : null}

      <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 px-5 pt-28 pb-14 md:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-8 lg:px-10 lg:pt-24 lg:pb-16">
        <div className="relative z-20 flex max-w-xl flex-col gap-5 lg:-translate-y-4 lg:gap-6">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="flex items-center gap-3"
          >
            {service.logo ? (
              <Image
                src={service.logo}
                alt=""
                width={40}
                height={40}
                className="size-10 object-contain"
              />
            ) : null}
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

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28, ease: EASE }}
            className="flex flex-wrap gap-3 pt-1"
          >
            <BookDemoDialog
              solutionTitle={service.title}
              label={page.demo.label}
              title={page.demo.title}
              subtitle={page.demo.subtitle}
              submitLabel={page.demo.submitLabel}
            />
            {showExplore ? (
              <a
                href={`#${page.sections[0]?.id ?? "overview"}`}
                className="inline-flex h-11 items-center gap-2 border border-white/25 px-5 text-sm font-medium text-white transition hover:bg-white/5"
              >
                Explore
                <ArrowUpRight className="size-4" />
              </a>
            ) : null}
          </motion.div>
        </div>

        {normalizeHeroVisual(page.heroVisual) !== "glyph" && (
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.18, ease: EASE }}
          >
            <SolutionHeroVisual kind={page.heroVisual} reduce={reduce} />
          </motion.div>
        )}
      </div>
    </section>
  )
}
