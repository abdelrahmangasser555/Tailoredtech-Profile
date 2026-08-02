"use client"

import { useEffect, useState } from "react"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  EditorDivider,
  EditorPanel,
  EditorSection,
} from "@/components/editor/editor-sheet"
import {
  CompactCheck,
  CompactInput,
  CompactSelect,
  CompactTextarea,
  FieldGrid,
} from "@/components/editor/fields"
import { IconPicker } from "@/components/editor/icon-picker"
import { Button } from "@/components/ui/button"
import { HERO_VISUAL_LABELS } from "@/lib/local-edit"
import { HERO_VISUAL_OPTIONS } from "@/components/sections/solution-hero-visual"

type OutcomeDraft = { value: string; label: string; icon?: string | null }

export type ServiceMetaDraft = {
  title: string
  short: string
  description: string
  icon: string
  logo: string | null
  featured: boolean
  page: {
    enabled: boolean
    eyebrow: string
    headline: string
    headlineAccent: string
    tagline: string
    heroVisual: string
    demo: {
      label: string
      title: string
      subtitle: string
      submitLabel: string
    } | null
    outcomes: OutcomeDraft[]
    related: string[]
  }
}

type ServiceMetaSheetProps = {
  open: boolean
  onClose: () => void
  draft: ServiceMetaDraft | null
  onSave: (draft: ServiceMetaDraft) => Promise<void>
  onLiveChange?: (draft: ServiceMetaDraft) => void
}

const HERO_OPTIONS = HERO_VISUAL_OPTIONS.map((v) => ({
  value: v,
  label: HERO_VISUAL_LABELS[v] ?? v,
}))

export function ServiceMetaSheet({
  open,
  onClose,
  draft: incoming,
  onSave,
  onLiveChange,
}: ServiceMetaSheetProps) {
  const [draft, setDraft] = useState<ServiceMetaDraft | null>(null)
  const [saving, setSaving] = useState(false)

  // Seed only when the sheet opens — not when live preview updates `incoming`
  // (that feedback loop caused Maximum update depth with page charts).
  useEffect(() => {
    if (open && incoming) setDraft(structuredClone(incoming))
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

  if (!draft) {
    return (
      <EditorPanel open={open} onClose={onClose} title="Edit solution">
        <p className="text-sm text-white/40">Loading…</p>
      </EditorPanel>
    )
  }

  return (
    <EditorPanel
      open={open}
      onClose={onClose}
      title="Edit branding & meta"
      description="Hero, listing, demo CTAs, and outcomes."
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
          <FieldGrid className="mt-3">
            <CompactInput
              label="List icon (Lucide)"
              value={draft.icon}
              onChange={(e) =>
                setDraft((d) => (d ? { ...d, icon: e.target.value } : d))
              }
            />
            <CompactInput
              label="Logo path"
              value={draft.logo ?? ""}
              onChange={(e) =>
                setDraft((d) =>
                  d
                    ? { ...d, logo: e.target.value.trim() || null }
                    : d
                )
              }
            />
          </FieldGrid>
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
          <div className="mt-3 flex flex-wrap gap-2">
            <CompactCheck
              label="Featured"
              checked={draft.featured}
              onCheckedChange={(featured) =>
                setDraft((d) => (d ? { ...d, featured } : d))
              }
            />
            <CompactCheck
              label="Page enabled"
              checked={draft.page.enabled}
              onCheckedChange={(enabled) =>
                setDraft((d) =>
                  d ? { ...d, page: { ...d.page, enabled } } : d
                )
              }
            />
          </div>
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
          <CompactInput
            className="mt-3"
            label="Related ids"
            hint="comma-separated"
            value={draft.page.related.join(", ")}
            onChange={(e) =>
              setDraft((d) =>
                d
                  ? {
                      ...d,
                      page: {
                        ...d.page,
                        related: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      },
                    }
                  : d
              )
            }
          />
        </EditorSection>

        <EditorDivider />

        <EditorSection label="Demo CTA">
          {draft.page.demo ? (
            <FieldGrid>
              <CompactInput
                label="Button label"
                value={draft.page.demo.label}
                onChange={(e) =>
                  setDraft((d) =>
                    d?.page.demo
                      ? {
                          ...d,
                          page: {
                            ...d.page,
                            demo: {
                              ...d.page.demo,
                              label: e.target.value,
                            },
                          },
                        }
                      : d
                  )
                }
              />
              <CompactInput
                label="Submit label"
                value={draft.page.demo.submitLabel}
                onChange={(e) =>
                  setDraft((d) =>
                    d?.page.demo
                      ? {
                          ...d,
                          page: {
                            ...d.page,
                            demo: {
                              ...d.page.demo,
                              submitLabel: e.target.value,
                            },
                          },
                        }
                      : d
                  )
                }
              />
              <CompactInput
                label="Dialog title"
                value={draft.page.demo.title}
                onChange={(e) =>
                  setDraft((d) =>
                    d?.page.demo
                      ? {
                          ...d,
                          page: {
                            ...d.page,
                            demo: {
                              ...d.page.demo,
                              title: e.target.value,
                            },
                          },
                        }
                      : d
                  )
                }
              />
              <CompactInput
                label="Dialog subtitle"
                value={draft.page.demo.subtitle}
                onChange={(e) =>
                  setDraft((d) =>
                    d?.page.demo
                      ? {
                          ...d,
                          page: {
                            ...d.page,
                            demo: {
                              ...d.page.demo,
                              subtitle: e.target.value,
                            },
                          },
                        }
                      : d
                  )
                }
              />
            </FieldGrid>
          ) : (
            <p className="font-mono text-[10px] text-white/35">No demo block</p>
          )}
        </EditorSection>

        <EditorDivider />

        <EditorSection label="Outcomes">
          <div className="space-y-3">
            {draft.page.outcomes.map((outcome, i) => (
              <div
                key={i}
                className="space-y-2 border border-white/10 bg-black/20 p-2.5"
              >
                <div className="flex items-center justify-between">
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
                        outcomes[i] = { ...outcome, value: e.target.value }
                        return { ...d, page: { ...d.page, outcomes } }
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
                        outcomes[i] = { ...outcome, label: e.target.value }
                        return { ...d, page: { ...d.page, outcomes } }
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
      </div>
    </EditorPanel>
  )
}
