"use client"

import { useEffect, useState } from "react"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  EditorPanel,
  EditorDivider,
  EditorSection,
} from "@/components/editor/editor-sheet"
import { EditorStage } from "@/components/editor/editor-stage"
import {
  CompactCheck,
  CompactInput,
  CompactSelect,
  CompactTextarea,
  FieldGrid,
} from "@/components/editor/fields"
import { IconPicker } from "@/components/editor/icon-picker"
import { Button } from "@/components/ui/button"
import {
  BRAND_CLASS_OPTIONS,
  HERO_VISUAL_LABELS,
} from "@/lib/local-edit"
import { HERO_VISUAL_OPTIONS } from "@/components/sections/solution-hero-visual"

type OutcomeDraft = { value: string; label: string; icon?: string | null }

type ComparisonCell = {
  type: string
  value: boolean | number | string
}

type ComparisonRow = {
  label: string
  star?: boolean
  cells: ComparisonCell[]
}

type ComparisonDraft = {
  enabled: boolean
  eyebrow: string
  title: string
  columns: { id: string; label: string; highlight?: boolean }[]
  rows: ComparisonRow[]
}

export type PresentationMetaDraft = {
  title: string
  short: string
  description: string
  brandClass: string
  clientLogo: string
  clientName: string
  page: {
    enabled: boolean
    eyebrow: string
    headline: string
    headlineAccent: string
    tagline: string
    heroVisual: string
    showExplore: boolean
    glyphBackdrop: boolean
    outcomes: OutcomeDraft[]
    comparison: ComparisonDraft | null
  }
}

type MetaEditSheetProps = {
  open: boolean
  onClose: () => void
  draft: PresentationMetaDraft | null
  onSave: (draft: PresentationMetaDraft) => Promise<void>
  onLiveChange?: (draft: PresentationMetaDraft) => void
}

const HERO_OPTIONS = HERO_VISUAL_OPTIONS.map((v) => ({
  value: v,
  label: HERO_VISUAL_LABELS[v] ?? v,
}))

const BRAND_OPTIONS = BRAND_CLASS_OPTIONS.map((b) => ({
  value: b.value,
  label: b.label,
}))

function defaultComparison(): ComparisonDraft {
  return {
    enabled: true,
    eyebrow: "Compare",
    title: "",
    columns: [
      { id: "a", label: "Us", highlight: true },
      { id: "b", label: "Other" },
    ],
    rows: [],
  }
}

export function PresentationMetaSheet({
  open,
  onClose,
  draft: incoming,
  onSave,
  onLiveChange,
}: MetaEditSheetProps) {
  const [draft, setDraft] = useState<PresentationMetaDraft | null>(null)
  const [saving, setSaving] = useState(false)
  const [comparisonOpen, setComparisonOpen] = useState(false)
  const [comparisonDraft, setComparisonDraft] =
    useState<ComparisonDraft | null>(null)

  // Seed only when the sheet opens — not when live preview updates `incoming`
  // (that feedback loop caused Maximum update depth with page charts).
  useEffect(() => {
    if (open && incoming) {
      setDraft(structuredClone(incoming))
      setComparisonOpen(false)
      setComparisonDraft(null)
    }
    // intentionally omit `incoming` — live preview must not re-seed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    if (open && draft) onLiveChange?.(draft)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, open])

  async function handleSave() {
    if (!draft) return
    setSaving(true)
    try {
      await onSave(draft)
      onClose()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  function openComparisonStage() {
    setComparisonDraft(
      draft?.page.comparison
        ? structuredClone(draft.page.comparison)
        : defaultComparison()
    )
    setComparisonOpen(true)
  }

  function saveComparisonStage() {
    if (!comparisonDraft) return
    setDraft((d) =>
      d ? { ...d, page: { ...d.page, comparison: comparisonDraft } } : d
    )
    setComparisonOpen(false)
  }

  if (!draft) {
    return (
      <EditorPanel open={open} onClose={onClose} title="Edit branding">
        <p className="text-sm text-white/40">Loading…</p>
      </EditorPanel>
    )
  }

  const comparison = draft.page.comparison

  return (
    <EditorPanel
      open={open}
      onClose={onClose}
      title="Edit branding & meta"
      description="Hero, brand theme, outcomes, and comparison table."
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            className="h-9 rounded-none text-white/55"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="accent"
            className="h-9 rounded-none px-4"
            disabled={saving}
            onClick={() => void handleSave()}
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : null}
            Save
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <EditorSection label="Listing">
          <CompactInput
            label="Title"
            value={draft.title}
            onChange={(e) =>
              setDraft((d) => (d ? { ...d, title: e.target.value } : d))
            }
          />
          <CompactTextarea
            className="mt-3"
            label="Short"
            rows={2}
            value={draft.short}
            onChange={(e) =>
              setDraft((d) => (d ? { ...d, short: e.target.value } : d))
            }
          />
          <CompactTextarea
            className="mt-3"
            label="Description"
            rows={3}
            value={draft.description}
            onChange={(e) =>
              setDraft((d) =>
                d ? { ...d, description: e.target.value } : d
              )
            }
          />
        </EditorSection>

        <EditorDivider />

        <EditorSection label="Brand & client">
          <FieldGrid>
            <CompactSelect
              label="Brand theme"
              value={draft.brandClass}
              options={BRAND_OPTIONS}
              onValueChange={(v) =>
                setDraft((d) => (d ? { ...d, brandClass: v } : d))
              }
            />
            <CompactInput
              label="Client name"
              value={draft.clientName}
              onChange={(e) =>
                setDraft((d) =>
                  d ? { ...d, clientName: e.target.value } : d
                )
              }
            />
          </FieldGrid>
          <CompactInput
            className="mt-3"
            label="Client logo path"
            value={draft.clientLogo}
            onChange={(e) =>
              setDraft((d) =>
                d ? { ...d, clientLogo: e.target.value } : d
              )
            }
            placeholder="/clients/…"
          />
        </EditorSection>

        <EditorDivider />

        <EditorSection label="Hero">
          <FieldGrid>
            <CompactInput
              label="Eyebrow"
              value={draft.page.eyebrow}
              onChange={(e) =>
                setDraft((d) =>
                  d
                    ? {
                        ...d,
                        page: { ...d.page, eyebrow: e.target.value },
                      }
                    : d
                )
              }
            />
            <CompactSelect
              label="Hero visual"
              value={draft.page.heroVisual}
              options={HERO_OPTIONS}
              onValueChange={(v) =>
                setDraft((d) =>
                  d
                    ? {
                        ...d,
                        page: { ...d.page, heroVisual: v },
                      }
                    : d
                )
              }
            />
          </FieldGrid>
          <FieldGrid className="mt-3">
            <CompactInput
              label="Headline"
              value={draft.page.headline}
              onChange={(e) =>
                setDraft((d) =>
                  d
                    ? {
                        ...d,
                        page: { ...d.page, headline: e.target.value },
                      }
                    : d
                )
              }
            />
            <CompactInput
              label="Headline accent"
              value={draft.page.headlineAccent}
              onChange={(e) =>
                setDraft((d) =>
                  d
                    ? {
                        ...d,
                        page: {
                          ...d.page,
                          headlineAccent: e.target.value,
                        },
                      }
                    : d
                )
              }
            />
          </FieldGrid>
          <CompactTextarea
            className="mt-3"
            label="Tagline"
            rows={3}
            value={draft.page.tagline}
            onChange={(e) =>
              setDraft((d) =>
                d
                  ? {
                      ...d,
                      page: { ...d.page, tagline: e.target.value },
                    }
                  : d
              )
            }
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <CompactCheck
              label="Enabled"
              checked={draft.page.enabled}
              onCheckedChange={(enabled) =>
                setDraft((d) =>
                  d ? { ...d, page: { ...d.page, enabled } } : d
                )
              }
            />
            <CompactCheck
              label="Show explore"
              checked={draft.page.showExplore}
              onCheckedChange={(showExplore) =>
                setDraft((d) =>
                  d ? { ...d, page: { ...d.page, showExplore } } : d
                )
              }
            />
            <CompactCheck
              label="Glyph backdrop"
              checked={draft.page.glyphBackdrop}
              onCheckedChange={(glyphBackdrop) =>
                setDraft((d) =>
                  d ? { ...d, page: { ...d.page, glyphBackdrop } } : d
                )
              }
            />
          </div>
        </EditorSection>

        <EditorDivider />

        <EditorSection label="Outcomes">
          <div className="space-y-3">
            {draft.page.outcomes.map((outcome, i) => (
              <div
                key={i}
                className="space-y-2 border border-white/10 bg-black/20 p-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/35">
                    Outcome {i + 1}
                  </p>
                  <button
                    type="button"
                    className="text-white/30 hover:text-red-400"
                    onClick={() =>
                      setDraft((d) =>
                        d
                          ? {
                              ...d,
                              page: {
                                ...d.page,
                                outcomes: d.page.outcomes.filter(
                                  (_, j) => j !== i
                                ),
                              },
                            }
                          : d
                      )
                    }
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
                <FieldGrid>
                  <CompactInput
                    label="Value"
                    value={outcome.value}
                    onChange={(e) =>
                      setDraft((d) => {
                        if (!d) return d
                        const outcomes = [...d.page.outcomes]
                        outcomes[i] = {
                          ...outcome,
                          value: e.target.value,
                        }
                        return {
                          ...d,
                          page: { ...d.page, outcomes },
                        }
                      })
                    }
                  />
                  <CompactInput
                    label="Label"
                    value={outcome.label}
                    onChange={(e) =>
                      setDraft((d) => {
                        if (!d) return d
                        const outcomes = [...d.page.outcomes]
                        outcomes[i] = {
                          ...outcome,
                          label: e.target.value,
                        }
                        return {
                          ...d,
                          page: { ...d.page, outcomes },
                        }
                      })
                    }
                  />
                </FieldGrid>
                <IconPicker
                  label="Icon"
                  catalog="outcome"
                  value={outcome.icon}
                  onChange={(icon) =>
                    setDraft((d) => {
                      if (!d) return d
                      const outcomes = [...d.page.outcomes]
                      outcomes[i] = { ...outcome, icon }
                      return { ...d, page: { ...d.page, outcomes } }
                    })
                  }
                />
              </div>
            ))}
            <button
              type="button"
              className="inline-flex h-8 items-center gap-1.5 border border-dashed border-white/20 px-2.5 font-mono text-[10px] tracking-[0.12em] uppercase text-white/45 hover:border-accent hover:text-accent"
              onClick={() =>
                setDraft((d) =>
                  d
                    ? {
                        ...d,
                        page: {
                          ...d.page,
                          outcomes: [
                            ...d.page.outcomes,
                            { value: "", label: "", icon: null },
                          ],
                        },
                      }
                    : d
                )
              }
            >
              <Plus className="size-3.5" />
              Add outcome
            </button>
          </div>
        </EditorSection>

        <EditorDivider />

        <EditorSection label="Comparison">
          <div className="flex flex-wrap items-center gap-2">
            <CompactCheck
              label="Enabled"
              checked={Boolean(comparison?.enabled)}
              onCheckedChange={(enabled) =>
                setDraft((d) => {
                  if (!d) return d
                  const base: ComparisonDraft =
                    d.page.comparison ?? defaultComparison()
                  return {
                    ...d,
                    page: {
                      ...d.page,
                      comparison: { ...base, enabled },
                    },
                  }
                })
              }
            />
            <Button
              type="button"
              variant="ghost"
              className="h-9 flex-1 rounded-none border border-white/15 text-white/60 hover:border-accent hover:text-accent"
              onClick={openComparisonStage}
            >
              Edit comparison table
            </Button>
          </div>
          {comparison ? (
            <p className="mt-2 font-mono text-[9px] tracking-wide text-white/30">
              {comparison.columns.length} columns · {comparison.rows.length}{" "}
              rows
            </p>
          ) : null}
        </EditorSection>
      </div>

      <EditorStage
        open={comparisonOpen}
        onOpenChange={setComparisonOpen}
        title="Comparison table"
        description="Eyebrow, title, columns, and rows for the comparison block."
        size="lg"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              className="h-9 rounded-none text-white/55"
              onClick={() => setComparisonOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="accent"
              className="h-9 rounded-none px-4"
              onClick={saveComparisonStage}
            >
              Apply
            </Button>
          </div>
        }
      >
        {comparisonDraft ? (
          <div className="space-y-3">
            <FieldGrid>
              <CompactInput
                label="Eyebrow"
                value={comparisonDraft.eyebrow}
                onChange={(e) =>
                  setComparisonDraft((c) =>
                    c ? { ...c, eyebrow: e.target.value } : c
                  )
                }
              />
              <CompactInput
                label="Title"
                value={comparisonDraft.title}
                onChange={(e) =>
                  setComparisonDraft((c) =>
                    c ? { ...c, title: e.target.value } : c
                  )
                }
              />
            </FieldGrid>

            <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/35">
              Columns
            </p>
            <FieldGrid>
              {comparisonDraft.columns.map((col, i) => (
                <CompactInput
                  key={col.id}
                  label={`Col ${i + 1}`}
                  value={col.label}
                  onChange={(e) =>
                    setComparisonDraft((c) => {
                      if (!c) return c
                      const columns = [...c.columns]
                      columns[i] = { ...col, label: e.target.value }
                      return { ...c, columns }
                    })
                  }
                />
              ))}
            </FieldGrid>

            <div className="flex items-center justify-between gap-2">
              <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/35">
                Rows
              </p>
              <button
                type="button"
                className="inline-flex h-7 items-center gap-1 border border-white/15 px-2 font-mono text-[10px] uppercase tracking-wider text-white/45 hover:text-accent"
                onClick={() =>
                  setComparisonDraft((c) => {
                    if (!c) return c
                    const colCount = c.columns.length
                    return {
                      ...c,
                      rows: [
                        ...c.rows,
                        {
                          label: "New row",
                          cells: Array.from({ length: colCount }, () => ({
                            type: "check",
                            value: true,
                          })),
                        },
                      ],
                    }
                  })
                }
              >
                <Plus className="size-3" />
                Row
              </button>
            </div>

            <div className="space-y-2">
              {comparisonDraft.rows.map((row, ri) => (
                <div
                  key={ri}
                  className="space-y-2 border border-white/10 bg-black/20 p-2"
                >
                  <div className="flex items-center gap-2">
                    <CompactInput
                      label="Label"
                      className="flex-1 [&_label]:sr-only"
                      value={row.label}
                      onChange={(e) =>
                        setComparisonDraft((c) => {
                          if (!c) return c
                          const rows = [...c.rows]
                          rows[ri] = { ...row, label: e.target.value }
                          return { ...c, rows }
                        })
                      }
                    />
                    <CompactCheck
                      label="Star"
                      checked={Boolean(row.star)}
                      onCheckedChange={(star) =>
                        setComparisonDraft((c) => {
                          if (!c) return c
                          const rows = [...c.rows]
                          rows[ri] = { ...row, star: star || undefined }
                          return { ...c, rows }
                        })
                      }
                    />
                    <button
                      type="button"
                      className="text-white/30 hover:text-red-400"
                      onClick={() =>
                        setComparisonDraft((c) =>
                          c
                            ? {
                                ...c,
                                rows: c.rows.filter((_, j) => j !== ri),
                              }
                            : c
                        )
                      }
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                  <FieldGrid>
                    {row.cells.map((cell, ci) => (
                      <div key={ci} className="space-y-1.5">
                        <CompactSelect
                          label={`Cell ${ci + 1} type`}
                          value={cell.type}
                          options={[
                            { value: "check", label: "Check" },
                            { value: "x", label: "X" },
                            { value: "text", label: "Text" },
                            { value: "number", label: "Number" },
                          ]}
                          onValueChange={(type) =>
                            setComparisonDraft((c) => {
                              if (!c) return c
                              const rows = [...c.rows]
                              const cells = [...row.cells]
                              cells[ci] = {
                                type,
                                value:
                                  type === "check" || type === "x"
                                    ? type === "check"
                                    : type === "number"
                                      ? 0
                                      : "",
                              }
                              rows[ri] = { ...row, cells }
                              return { ...c, rows }
                            })
                          }
                        />
                        {cell.type === "check" || cell.type === "x" ? (
                          <CompactCheck
                            label={cell.type === "check" ? "True" : "False"}
                            checked={Boolean(cell.value)}
                            onCheckedChange={(v) =>
                              setComparisonDraft((c) => {
                                if (!c) return c
                                const rows = [...c.rows]
                                const cells = [...row.cells]
                                cells[ci] = { ...cell, value: v }
                                rows[ri] = { ...row, cells }
                                return { ...c, rows }
                              })
                            }
                          />
                        ) : (
                          <CompactInput
                            label="Value"
                            value={String(cell.value ?? "")}
                            onChange={(e) =>
                              setComparisonDraft((c) => {
                                if (!c) return c
                                const rows = [...c.rows]
                                const cells = [...row.cells]
                                cells[ci] = {
                                  ...cell,
                                  value:
                                    cell.type === "number"
                                      ? Number(e.target.value) || 0
                                      : e.target.value,
                                }
                                rows[ri] = { ...row, cells }
                                return { ...c, rows }
                              })
                            }
                          />
                        )}
                      </div>
                    ))}
                  </FieldGrid>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </EditorStage>
    </EditorPanel>
  )
}
