"use client"

import { useMemo, useState } from "react"
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react"
import { track } from "@/lib/analytics/track"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { NoteQuestionnaire } from "@/lib/notes-types"
import { cn } from "@/lib/utils"

type NoteQuestionnaireModalProps = {
  questionnaire: NoteQuestionnaire | null
  open: boolean
  onOpenChange: (open: boolean) => void
  noteId?: string
  noteTitle?: string
}

export function NoteQuestionnaireModal({
  questionnaire,
  open,
  onOpenChange,
  noteId,
  noteTitle,
}: NoteQuestionnaireModalProps) {
  const pages = questionnaire?.pages ?? []
  const [pageIndex, setPageIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [revealed, setRevealed] = useState(false)

  const page = pages[pageIndex]
  const isLast = pageIndex >= pages.length - 1

  const progress = useMemo(() => {
    if (pages.length === 0) return 0
    return ((pageIndex + 1) / pages.length) * 100
  }, [pageIndex, pages.length])

  function reset() {
    setPageIndex(0)
    setAnswers({})
    setRevealed(false)
  }

  function handleOpenChange(next: boolean) {
    if (!next) reset()
    onOpenChange(next)
  }

  function completeQuestionnaire() {
    if (!questionnaire) return
    track("questionnaire_completed", {
      questionnaire_id: questionnaire.id,
      question_count: pages.reduce(
        (count, currentPage) => count + currentPage.questions.length,
        0
      ),
      note_id: noteId,
      note_title: noteTitle,
    })
    handleOpenChange(false)
  }

  function selectOption(questionId: string, optionId: string) {
    if (revealed) return
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }))
  }

  function allAnsweredOnPage() {
    if (!page) return false
    return page.questions.every((q) => Boolean(answers[q.id]))
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[min(90svh,720px)] w-full max-w-[calc(100%-1.5rem)] gap-0 overflow-hidden rounded-none border border-white/10 bg-[#050505] p-0 text-white sm:max-w-lg"
      >
        {questionnaire ? (
          <>
            <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
              <DialogHeader className="gap-1.5 text-left">
                <p className="font-mono text-[10px] tracking-[0.2em] text-white/35 uppercase">
                  Questionnaire
                </p>
                <DialogTitle className="font-pixel-circle text-xl text-white md:text-2xl">
                  {questionnaire.title}
                </DialogTitle>
                {questionnaire.description ? (
                  <DialogDescription className="text-sm text-white/40">
                    {questionnaire.description}
                  </DialogDescription>
                ) : null}
              </DialogHeader>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="shrink-0 text-white/50 hover:bg-white/5 hover:text-white"
                onClick={() => handleOpenChange(false)}
              >
                <X className="size-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>

            <div className="h-px w-full bg-white/5">
              <div
                className="h-px bg-accent transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="max-h-[min(60svh,480px)] overflow-y-auto px-5 py-5">
              {page?.title ? (
                <p className="mb-4 font-mono text-[10px] tracking-[0.18em] text-accent uppercase">
                  {page.title}
                </p>
              ) : null}

              <div className="flex flex-col gap-8">
                {page?.questions.map((q) => {
                  const selected = answers[q.id]
                  const correct = q.options.find((o) => o.correct)
                  return (
                    <div key={q.id}>
                      <p className="text-sm leading-relaxed text-white/80 md:text-[15px]">
                        {q.prompt}
                      </p>
                      <ul className="mt-3 flex flex-col gap-2">
                        {q.options.map((opt) => {
                          const isSelected = selected === opt.id
                          const showCorrect =
                            revealed && correct?.id === opt.id
                          const showWrong =
                            revealed && isSelected && !opt.correct
                          return (
                            <li key={opt.id}>
                              <button
                                type="button"
                                onClick={() => selectOption(q.id, opt.id)}
                                className={cn(
                                  "flex w-full items-center gap-3 border px-3 py-2.5 text-left text-sm transition",
                                  showCorrect
                                    ? "border-accent/60 bg-accent/10 text-white"
                                    : showWrong
                                      ? "border-white/25 bg-white/5 text-white/50"
                                      : isSelected
                                        ? "border-accent/40 bg-white/[0.04] text-white"
                                        : "border-white/10 text-white/60 hover:border-white/25 hover:text-white/80"
                                )}
                              >
                                <span
                                  className={cn(
                                    "flex size-4 shrink-0 items-center justify-center border",
                                    showCorrect
                                      ? "border-accent bg-accent text-accent-foreground"
                                      : isSelected
                                        ? "border-accent"
                                        : "border-white/25"
                                  )}
                                >
                                  {showCorrect ? (
                                    <Check className="size-3" />
                                  ) : null}
                                </span>
                                {opt.label}
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                      {revealed && q.explanation ? (
                        <p className="mt-3 text-sm text-white/40">
                          {q.explanation}
                        </p>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-white/10 px-5 py-4">
              <Button
                type="button"
                variant="ghost"
                disabled={pageIndex === 0}
                className="gap-1 text-white/50 hover:bg-white/5 hover:text-white disabled:opacity-30"
                onClick={() => {
                  setRevealed(false)
                  setPageIndex((i) => Math.max(0, i - 1))
                }}
              >
                <ChevronLeft className="size-4" />
                Back
              </Button>

              <p className="font-mono text-[10px] tracking-[0.16em] text-white/30 uppercase">
                {pageIndex + 1} / {pages.length}
              </p>

              {!revealed ? (
                <Button
                  type="button"
                  disabled={!allAnsweredOnPage()}
                  className="rounded-none bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-40"
                  onClick={() => setRevealed(true)}
                >
                  Check
                </Button>
              ) : isLast ? (
                <Button
                  type="button"
                  className="rounded-none bg-accent text-accent-foreground hover:bg-accent/90"
                  onClick={completeQuestionnaire}
                >
                  Done
                </Button>
              ) : (
                <Button
                  type="button"
                  className="gap-1 rounded-none bg-accent text-accent-foreground hover:bg-accent/90"
                  onClick={() => {
                    setRevealed(false)
                    setPageIndex((i) => i + 1)
                  }}
                >
                  Next
                  <ChevronRight className="size-4" />
                </Button>
              )}
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
