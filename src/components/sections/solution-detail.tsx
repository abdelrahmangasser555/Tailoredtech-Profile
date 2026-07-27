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
import { ColorPanels } from "@paper-design/shaders-react"
import { GlyphMatrix } from "@/components/ui/glyph-matrix"
import { ServiceVisual } from "@/components/ui/service-visual"
import { BookDemoDialog } from "@/components/sections/book-demo-dialog"
import { BrandedMermaid } from "@/components/sections/branded-mermaid"
import {
  SectionImageGrid,
  SectionVideo,
} from "@/components/sections/section-media"
import { SectionLayerNav } from "@/components/sections/section-layer-nav"
import { Section } from "@/components/layout/section"
import {
  getRelatedServices,
  type ServiceItem,
} from "@/lib/content"
import { scrollToId } from "@/components/motion/smooth-scroll"

const EASE = [0.22, 1, 0.36, 1] as const
const ENGINE_COLORS = ["#D4FF00", "#A8E600", "#3F4A00", "#F0FF99"]

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

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        const top = visible[0]?.target.id
        if (top) setActiveId(top)
      },
      {
        rootMargin: "-28% 0px -48% 0px",
        threshold: [0.15, 0.35, 0.55],
      }
    )

    nodes.forEach((n) => observer.observe(n))
    return () => observer.disconnect()
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
        <Section tone="light" className="!py-16 md:!py-20">
          <div className="grid gap-10 sm:grid-cols-3">
            {page.outcomes.map((outcome, i) => (
              <motion.div
                key={outcome.label}
                initial={reduce ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }}
                className="relative pl-5"
              >
                <span
                  aria-hidden
                  className="absolute bottom-1 left-0 top-1 w-px bg-foreground/20"
                />
                <p className="font-pixel-circle text-3xl font-medium tracking-tight md:text-4xl">
                  {outcome.value}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {outcome.label}
                </p>
              </motion.div>
            ))}
          </div>
        </Section>
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
            {page.sections.map((section, i) => (
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
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/45 md:text-[1.05rem]">
                  {section.body}
                </p>
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
                {section.mermaid && (
                  <BrandedMermaid
                    chart={section.mermaid}
                    title={section.mermaidTitle ?? undefined}
                    caption={section.mermaidCaption ?? undefined}
                  />
                )}
              </motion.article>
            ))}
          </div>
        </div>
      </Section>

      {related.length > 0 && (
        <Section tone="light">
          <p className="mb-6 font-mono text-[11px] tracking-[0.22em] uppercase text-foreground/45">
            Related solutions
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="group border border-foreground/10 p-5 transition hover:border-accent/50"
              >
                <ServiceVisual
                  icon={item.icon}
                  logo={item.logo}
                  title={item.title}
                  className="mb-4 size-8 text-accent"
                  iconClassName="size-5"
                />
                <p className="font-pixel-circle text-lg font-medium tracking-tight transition group-hover:text-accent">
                  {item.title}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{item.short}</p>
              </Link>
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
              Book a focused demo — we reply within one business day.
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
            className="fixed bottom-5 right-5 z-50 md:bottom-8 md:right-8"
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
  const showEngine = page.heroVisual === "engine"

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[88svh] flex-col overflow-hidden bg-black text-white [--accent:#D4FF00] [--accent-foreground:#0A0A0A] lg:min-h-svh"
    >
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
            ) : (
              <ServiceVisual
                icon={service.icon}
                logo={service.logo}
                title={service.title}
                className="size-10 rounded-none bg-accent/10 text-accent"
                iconClassName="size-5"
                bare={false}
              />
            )}
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
            <a
              href={`#${page.sections[0]?.id ?? "overview"}`}
              className="inline-flex h-11 items-center gap-2 border border-white/25 px-5 text-sm font-medium text-white transition hover:bg-white/5"
            >
              Explore
              <ArrowUpRight className="size-4" />
            </a>
          </motion.div>
        </div>

        {showEngine && (
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.18, ease: EASE }}
            className="relative mx-auto aspect-square w-full max-w-md lg:max-w-none"
          >
            <ColorPanels
              colors={[...ENGINE_COLORS]}
              colorBack="#ffffff00"
              density={5.03}
              angle1={0.68}
              angle2={0.28}
              length={1.13}
              edges
              blur={0.25}
              fadeIn={0.85}
              fadeOut={0.3}
              gradient={0.56}
              speed={reduce ? 0 : 2.4}
              scale={0.96}
              rotation={180}
              style={{ width: "100%", height: "100%" }}
            />
          </motion.div>
        )}
      </div>
    </section>
  )
}
