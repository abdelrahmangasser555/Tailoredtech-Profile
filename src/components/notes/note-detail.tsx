"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { ChevronRight } from "lucide-react"
import type {
  NoteDocument,
  NoteExplainTerm,
  NoteQuestionnaire,
} from "@/lib/notes-types"
import type { NotesBreadcrumb } from "@/lib/notes"
import { formatNotesDate } from "@/lib/notes"
import { NoteBlockRenderer } from "@/components/notes/note-block-renderer"
import { NoteExplainSheet } from "@/components/notes/note-explain-sheet"
import { NoteQuestionnaireModal } from "@/components/notes/note-questionnaire-modal"
import { NoteLessonNav } from "@/components/notes/note-lesson-nav"
import { TrackNote } from "@/components/analytics/track-note"
import { scrollToId } from "@/components/motion/smooth-scroll"
import { cn } from "@/lib/utils"

type NoteDetailProps = {
  note: NoteDocument
  breadcrumbs: NotesBreadcrumb[]
}

export function NoteDetail({ note, breadcrumbs }: NoteDetailProps) {
  const variants = {
    sidebarNav: note.variants?.sidebarNav !== false,
    compactHero: note.variants?.compactHero !== false,
    showMeta: note.variants?.showMeta !== false,
  }

  const explainsById = useMemo(() => {
    const map: Record<string, NoteExplainTerm> = {}
    for (const term of note.explains ?? []) map[term.id] = term
    return map
  }, [note.explains])

  const questionnairesById = useMemo(() => {
    const map: Record<string, NoteQuestionnaire> = {}
    for (const q of note.questionnaires ?? []) map[q.id] = q
    return map
  }, [note.questionnaires])

  const sectionKey = note.sections.map((s) => s.id).join(",")
  const [activeId, setActiveId] = useState(note.sections[0]?.id ?? "")
  const [explainId, setExplainId] = useState<string | null>(null)
  const [quizId, setQuizId] = useState<string | null>(null)

  useEffect(() => {
    setActiveId(note.sections[0]?.id ?? "")
    setExplainId(null)
    setQuizId(null)
  }, [note.id, note.sections])

  useEffect(() => {
    const ids = sectionKey.split(",").filter(Boolean)
    if (ids.length === 0) return

    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => Boolean(n))

    if (nodes.length === 0) return

    const ratios = new Map<string, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(
            entry.target.id,
            entry.isIntersecting ? entry.intersectionRatio : 0
          )
        }

        let bestId = nodes[0]?.id ?? ""
        let bestRatio = -1
        for (const node of nodes) {
          const ratio = ratios.get(node.id) ?? 0
          if (ratio > bestRatio) {
            bestRatio = ratio
            bestId = node.id
          }
        }

        const marker = window.innerHeight * 0.3
        let byPosition = nodes[0]?.id ?? bestId
        for (const node of nodes) {
          if (node.getBoundingClientRect().top <= marker) {
            byPosition = node.id
          }
        }

        const next = bestRatio > 0.08 ? byPosition : bestId
        setActiveId((prev) => (prev === next ? prev : next))
      },
      {
        root: null,
        rootMargin: "-12% 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    )

    for (const node of nodes) observer.observe(node)

    const onScroll = () => {
      const marker = window.innerHeight * 0.28
      let current = nodes[0]?.id ?? ""
      for (const node of nodes) {
        if (node.getBoundingClientRect().top <= marker) current = node.id
      }
      setActiveId((prev) => (prev === current ? prev : current))
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)

    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [note.id, sectionKey])

  return (
    <div className="min-h-svh bg-[#050505] text-white">
      <TrackNote
        noteId={note.id}
        noteTitle={note.title}
        path={
          breadcrumbs[breadcrumbs.length - 1]?.href ?? `/notes/${note.id}`
        }
        sections={note.sections.map((s) => ({
          id: s.id,
          title: s.title,
        }))}
      />
      <header
        className={cn(
          "border-b border-white/10",
          variants.compactHero
            ? "px-5 py-10 md:px-8 md:py-12"
            : "px-5 py-16 md:px-8 md:py-20"
        )}
      >
        <div className="mx-auto max-w-5xl">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] tracking-[0.16em] text-white/35 uppercase">
              {breadcrumbs.map((crumb, i) => (
                <li key={crumb.href} className="flex items-center gap-1.5">
                  {i > 0 ? (
                    <ChevronRight className="size-3 opacity-50" />
                  ) : null}
                  {i === breadcrumbs.length - 1 ? (
                    <span className="text-white/55">{crumb.name}</span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="transition hover:text-accent"
                    >
                      {crumb.name}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          <h1
            className={cn(
              "mt-5 font-pixel-circle tracking-tight text-white",
              variants.compactHero
                ? "text-3xl md:text-4xl"
                : "text-4xl md:text-5xl"
            )}
          >
            {note.title}
          </h1>

          {note.description ? (
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/45 md:text-[15px]">
              {note.description}
            </p>
          ) : null}

          {variants.showMeta ? (
            <p className="mt-5 font-mono text-[10px] tracking-[0.16em] text-white/30 uppercase">
              Created {formatNotesDate(note.createdAt)}
              <span className="mx-2 text-white/15">·</span>
              Updated {formatNotesDate(note.updatedAt)}
            </p>
          ) : null}
        </div>
      </header>

      <div className="mx-auto flex max-w-5xl gap-10 px-5 py-12 md:px-8 md:py-16">
        {variants.sidebarNav && note.sections.length > 1 ? (
          <aside className="sticky top-8 hidden h-fit w-44 shrink-0 lg:block">
            <p className="font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase">
              Sections
            </p>
            <ul className="mt-4 flex flex-col gap-1">
              {note.sections.map((section) => {
                const active = activeId === section.id
                return (
                  <li key={section.id}>
                    <button
                      type="button"
                      onClick={() => scrollToId(section.id, -24)}
                      className={cn(
                        "w-full border-l-2 px-3 py-1.5 text-left text-sm transition",
                        active
                          ? "border-accent text-accent"
                          : "border-transparent text-white/40 hover:border-white/20 hover:text-white/70"
                      )}
                    >
                      {section.title}
                    </button>
                  </li>
                )
              })}
            </ul>
          </aside>
        ) : null}

        <div className="min-w-0 flex-1">
          {note.sections.map((section) => {
            const quiz = section.questionnaireId
              ? questionnairesById[section.questionnaireId]
              : undefined

            return (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-8 border-t border-white/10 py-10 first:border-t-0 first:pt-0 md:py-12"
              >
                <h2 className="font-pixel-circle text-2xl text-white md:text-3xl">
                  {section.title}
                </h2>

                <div className="mt-6 flex flex-col gap-1">
                  {section.blocks.map((block) => (
                    <NoteBlockRenderer
                      key={block.id}
                      block={block}
                      explainsById={explainsById}
                      onExplain={setExplainId}
                    />
                  ))}
                </div>

                {quiz ? (
                  <button
                    type="button"
                    onClick={() => setQuizId(quiz.id)}
                    className="mt-8 border border-white/15 px-4 py-2.5 font-mono text-[11px] tracking-[0.16em] text-white/70 uppercase transition hover:border-accent hover:text-accent"
                  >
                    Take questionnaire
                  </button>
                ) : null}
              </section>
            )
          })}
        </div>
      </div>

      <NoteLessonNav noteId={note.id} />

      <NoteExplainSheet
        term={explainId ? explainsById[explainId] ?? null : null}
        open={Boolean(explainId && explainsById[explainId])}
        onOpenChange={(open) => {
          if (!open) setExplainId(null)
        }}
      />

      <NoteQuestionnaireModal
        questionnaire={quizId ? questionnairesById[quizId] ?? null : null}
        open={Boolean(quizId && questionnairesById[quizId])}
        noteId={note.id}
        noteTitle={note.title}
        onOpenChange={(open) => {
          if (!open) setQuizId(null)
        }}
      />
    </div>
  )
}
