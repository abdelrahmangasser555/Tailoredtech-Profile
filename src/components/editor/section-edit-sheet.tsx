"use client"

import { useEffect, useState } from "react"
import { Loader2, Settings2 } from "lucide-react"
import { toast } from "sonner"
import {
  EditorDivider,
  EditorPanel,
  EditorSection,
} from "@/components/editor/editor-sheet"
import {
  CompactCheck,
  CompactInput,
  CompactTextarea,
  FieldGrid,
} from "@/components/editor/fields"
import { MarkdownField } from "@/components/editor/markdown-field"
import { IconPicker } from "@/components/editor/icon-picker"
import {
  MermaidField,
  validateMermaid,
} from "@/components/editor/mermaid-field"
import { ImageGalleryEditor } from "@/components/editor/image-gallery-editor"
import { ChartVisualEditor } from "@/components/editor/chart-visual-editor"
import { Button } from "@/components/ui/button"

export type EditableSection = {
  id: string
  title: string
  icon?: string | null
  body?: string
  bullets?: string[]
  video?: string | null
  images?: { src: string; label: string }[]
  mermaid?: string | null
  mermaidTitle?: string | null
  mermaidCaption?: string | null
  chart?: unknown
  charts?: unknown
}

type SectionEditSheetProps = {
  open: boolean
  onClose: () => void
  section: EditableSection | null
  slug: string
  kind: "presentations" | "services"
  onSave: (section: EditableSection) => Promise<void>
  onLiveChange?: (section: EditableSection) => void
}

export function SectionEditSheet({
  open,
  onClose,
  section,
  slug,
  kind,
  onSave,
  onLiveChange,
}: SectionEditSheetProps) {
  const [draft, setDraft] = useState<EditableSection | null>(null)
  const [saving, setSaving] = useState(false)
  const [chartsOpen, setChartsOpen] = useState(false)

  // Seed only when the sheet opens or the section id changes — not when
  // live preview pushes the same section back with a new object identity
  // (that loop caused Maximum update depth with Recharts).
  const sectionId = section?.id
  useEffect(() => {
    if (!open || !section) return
    setDraft({
      ...section,
      body: section.body ?? "",
      bullets: [...(section.bullets ?? [])],
      images: [...(section.images ?? [])],
      mermaid: section.mermaid ?? "",
      mermaidTitle: section.mermaidTitle ?? "",
      mermaidCaption: section.mermaidCaption ?? "",
      video: section.video ?? "",
      icon: section.icon ?? null,
      chart: section.chart ?? null,
      charts: section.charts ?? null,
    })
    setChartsOpen(false)
    // intentionally omit `section` — live preview must not re-seed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, sectionId])

  useEffect(() => {
    if (open && draft) onLiveChange?.(draft)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, open])

  if (!draft) {
    return (
      <EditorPanel open={open} onClose={onClose} title="Edit section">
        <p className="text-sm text-white/40">No section selected</p>
      </EditorPanel>
    )
  }

  async function handleSave() {
    if (!draft) return
    const mermaid = String(draft.mermaid ?? "").trim()
    if (mermaid) {
      const err = await validateMermaid(mermaid)
      if (err) {
        toast.error(`Mermaid invalid: ${err}`)
        return
      }
    }

    setSaving(true)
    try {
      await onSave({
        ...draft,
        body: draft.body ?? "",
        bullets: (draft.bullets ?? []).map((b) => b.trim()).filter(Boolean),
        images: draft.images ?? [],
        mermaid: mermaid || null,
        mermaidTitle: String(draft.mermaidTitle ?? "").trim() || null,
        mermaidCaption: String(draft.mermaidCaption ?? "").trim() || null,
        video: String(draft.video ?? "").trim() || null,
        icon: draft.icon || null,
        chart: draft.chart ?? null,
        charts: draft.charts ?? null,
      })
      onClose()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  const bulletsText = (draft.bullets ?? []).join("\n")
  const chartCount = Array.isArray(draft.charts)
    ? draft.charts.length
    : draft.chart
      ? 1
      : 0

  return (
    <EditorPanel
      open={open}
      onClose={onClose}
      title={`Edit · ${draft.title || draft.id}`}
      description="Changes write to the local JSON config on save."
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
            Save section
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <EditorSection label="Identity">
          <FieldGrid>
            <CompactInput
              label="Section id"
              value={draft.id}
              disabled
              hint="immutable"
            />
            <CompactInput
              label="Title"
              value={draft.title}
              onChange={(e) =>
                setDraft((d) => (d ? { ...d, title: e.target.value } : d))
              }
            />
          </FieldGrid>
          <IconPicker
            label="Nav icon"
            catalog="section"
            value={draft.icon}
            onChange={(icon) =>
              setDraft((d) => (d ? { ...d, icon } : d))
            }
            className="mt-3"
          />
        </EditorSection>

        <EditorDivider />

        <EditorSection label="Copy">
          <MarkdownField
            label="Body"
            hint="markdown"
            value={draft.body ?? ""}
            onChange={(body) =>
              setDraft((d) => (d ? { ...d, body } : d))
            }
          />
          <CompactTextarea
            label="Bullets"
            hint="one per line"
            className="mt-3"
            rows={4}
            value={bulletsText}
            onChange={(e) =>
              setDraft((d) =>
                d
                  ? {
                      ...d,
                      bullets: e.target.value.split("\n"),
                    }
                  : d
              )
            }
          />
        </EditorSection>

        <EditorDivider />

        <EditorSection label="Media">
          <CompactInput
            label="Video path"
            hint="public path or empty"
            value={String(draft.video ?? "")}
            onChange={(e) =>
              setDraft((d) => (d ? { ...d, video: e.target.value } : d))
            }
            placeholder="/assets/hero_section.mp4"
          />
          <ImageGalleryEditor
            className="mt-3"
            images={draft.images ?? []}
            onChange={(images) =>
              setDraft((d) => (d ? { ...d, images } : d))
            }
            slug={slug}
            kind={kind}
          />
        </EditorSection>

        <EditorDivider />

        <EditorSection label="Diagram">
          <MermaidField
            value={String(draft.mermaid ?? "")}
            onChange={(mermaid) =>
              setDraft((d) => (d ? { ...d, mermaid } : d))
            }
            title={String(draft.mermaidTitle ?? "")}
            onTitleChange={(mermaidTitle) =>
              setDraft((d) => (d ? { ...d, mermaidTitle } : d))
            }
            caption={String(draft.mermaidCaption ?? "")}
            onCaptionChange={(mermaidCaption) =>
              setDraft((d) => (d ? { ...d, mermaidCaption } : d))
            }
          />
          <CompactCheck
            className="mt-3"
            label="Clear mermaid"
            checked={!String(draft.mermaid ?? "").trim()}
            onCheckedChange={(clear) => {
              if (clear) {
                setDraft((d) =>
                  d
                    ? {
                        ...d,
                        mermaid: "",
                        mermaidTitle: "",
                        mermaidCaption: "",
                      }
                    : d
                )
              }
            }}
          />
        </EditorSection>

        <EditorDivider />

        <EditorSection label="Charts">
          <Button
            type="button"
            variant="ghost"
            className="h-9 w-full justify-start gap-2 rounded-none border border-white/15 text-white/60 hover:border-accent hover:text-accent"
            onClick={() => setChartsOpen(true)}
          >
            <Settings2 className="size-3.5" />
            Configure charts
          </Button>
          <p className="mt-2 font-mono text-[9px] tracking-wide text-white/30">
            {chartCount} chart{chartCount === 1 ? "" : "s"} configured
          </p>
        </EditorSection>
      </div>

      <ChartVisualEditor
        open={chartsOpen}
        onOpenChange={setChartsOpen}
        chart={draft.chart}
        charts={draft.charts}
        onSave={({ chart, charts }) =>
          setDraft((d) => (d ? { ...d, chart, charts } : d))
        }
      />
    </EditorPanel>
  )
}
