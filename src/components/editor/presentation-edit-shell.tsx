"use client"

import { useMemo, useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { PresentationDetail } from "@/components/sections/presentation-detail"
import {
  PresentationMetaSheet,
  type PresentationMetaDraft,
} from "@/components/editor/presentation-meta-sheet"
import {
  SectionEditSheet,
  type EditableSection,
} from "@/components/editor/section-edit-sheet"
import { EditTrigger } from "@/components/editor/edit-trigger"
import { saveContentItem } from "@/components/editor/save"
import type { PresentationItem } from "@/lib/content"

type PresentationEditShellProps = {
  presentation: PresentationItem
}

function applyMetaDraft(
  item: PresentationItem,
  draft: PresentationMetaDraft
): PresentationItem {
  return {
    ...item,
    title: draft.title,
    short: draft.short,
    description: draft.description,
    brandClass: draft.brandClass,
    clientLogo: draft.clientLogo,
    clientName: draft.clientName,
    page: {
      ...item.page,
      enabled: draft.page.enabled,
      eyebrow: draft.page.eyebrow,
      headline: draft.page.headline,
      headlineAccent: draft.page.headlineAccent,
      tagline: draft.page.tagline,
      heroVisual: draft.page.heroVisual,
      showExplore: draft.page.showExplore,
      glyphBackdrop: draft.page.glyphBackdrop,
      outcomes: draft.page.outcomes,
      comparison: draft.page.comparison
        ? {
            ...draft.page.comparison,
            columns: draft.page.comparison.columns,
            rows: draft.page.comparison.rows,
          }
        : item.page.comparison,
    },
  } as PresentationItem
}

function applySectionDraft(
  item: PresentationItem,
  section: EditableSection
): PresentationItem {
  const sections = item.page.sections.map((s) =>
    s.id === section.id
      ? {
          ...s,
          ...section,
          images: section.images ?? [],
          bullets: section.bullets ?? [],
        }
      : s
  )
  return { ...item, page: { ...item.page, sections } } as PresentationItem
}

export function PresentationEditShell({
  presentation: initial,
}: PresentationEditShellProps) {
  const [item, setItem] = useState(initial)
  const [metaOpen, setMetaOpen] = useState(false)
  const [sectionId, setSectionId] = useState<string | null>(null)

  const activeSection = useMemo(() => {
    if (!sectionId) return null
    return (
      (item.page.sections.find((s) => s.id === sectionId) as
        | EditableSection
        | undefined) ?? null
    )
  }, [item, sectionId])

  const metaDraft: PresentationMetaDraft = useMemo(
    () => ({
      title: item.title,
      short: item.short,
      description: item.description,
      brandClass: item.brandClass ?? "",
      clientLogo: item.clientLogo ?? "",
      clientName: item.clientName ?? "",
      page: {
        enabled: item.page.enabled,
        eyebrow: item.page.eyebrow ?? "",
        headline: item.page.headline,
        headlineAccent: item.page.headlineAccent,
        tagline: item.page.tagline,
        heroVisual: item.page.heroVisual ?? "engine",
        showExplore:
          "showExplore" in item.page
            ? Boolean(item.page.showExplore)
            : true,
        glyphBackdrop:
          "glyphBackdrop" in item.page
            ? Boolean(item.page.glyphBackdrop)
            : true,
        outcomes: item.page.outcomes.map((o) => ({
          value: o.value,
          label: o.label,
          icon: o.icon ?? null,
        })),
        comparison: item.page.comparison
          ? {
              enabled: item.page.comparison.enabled,
              eyebrow: item.page.comparison.eyebrow,
              title: item.page.comparison.title,
              columns: item.page.comparison.columns.map((c) => ({ ...c })),
              rows: item.page.comparison.rows.map((r) => ({
                label: r.label,
                star: (r as { star?: boolean }).star,
                cells: r.cells.map((cell) => ({ ...cell })),
              })),
            }
          : null,
      },
    }),
    [item]
  )

  async function persist(next: PresentationItem) {
    const saved = await saveContentItem({
      kind: "presentations",
      id: item.id,
      item: next,
    })
    setItem(saved as PresentationItem)
  }

  async function addSection() {
    const base = `section-${item.page.sections.length + 1}`
    let id = base
    let n = 2
    while (item.page.sections.some((s) => s.id === id)) {
      id = `${base}-${n++}`
    }
    const section = {
      id,
      title: "New section",
      icon: "Layers",
      body: "",
      bullets: [] as string[],
      video: null,
      images: [] as { src: string; label: string }[],
      mermaid: null,
      mermaidTitle: null,
      mermaidCaption: null,
      chart: null,
    }
    const next = {
      ...item,
      page: {
        ...item.page,
        sections: [...item.page.sections, section],
      },
    } as PresentationItem
    await persist(next)
    setSectionId(id)
    toast.message("Section added")
  }

  return (
    <div className="flex min-h-svh">
      <div className="min-w-0 flex-1">
        <div className="sticky top-0 z-50 flex items-center justify-between gap-3 border-b border-white/10 bg-(--section-dark,#050505)/95 px-4 py-2.5 backdrop-blur-md md:px-8">
          <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/40">
            Local edit · {item.id}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void addSection()}
              className="inline-flex h-7 items-center gap-1.5 border border-white/20 px-2.5 font-mono text-[10px] tracking-[0.14em] uppercase text-white/60 transition hover:border-accent hover:text-accent"
            >
              <Plus className="size-3" />
              Section
            </button>
            <EditTrigger
              label="Edit branding"
              onClick={() => setMetaOpen(true)}
            />
          </div>
        </div>

        <PresentationDetail
          presentation={item}
          editMode
          editHandlers={{
            onEditMeta: () => setMetaOpen(true),
            onEditSection: (id) => setSectionId(id),
          }}
        />
      </div>

      <PresentationMetaSheet
        open={metaOpen}
        onClose={() => setMetaOpen(false)}
        draft={metaDraft}
        onLiveChange={(draft) =>
          setItem((prev) => applyMetaDraft(prev, draft))
        }
        onSave={async (draft) => {
          await persist(applyMetaDraft(item, draft))
        }}
      />

      <SectionEditSheet
        open={Boolean(sectionId)}
        onClose={() => setSectionId(null)}
        section={activeSection}
        slug={item.id}
        kind="presentations"
        onLiveChange={(section) =>
          setItem((prev) => applySectionDraft(prev, section))
        }
        onSave={async (section) => {
          await persist(applySectionDraft(item, section))
        }}
      />
    </div>
  )
}
