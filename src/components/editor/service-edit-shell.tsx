"use client"

import { useMemo, useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { SolutionDetail } from "@/components/sections/solution-detail"
import {
  ServiceMetaSheet,
  type ServiceMetaDraft,
} from "@/components/editor/service-meta-sheet"
import {
  SectionEditSheet,
  type EditableSection,
} from "@/components/editor/section-edit-sheet"
import { EditTrigger } from "@/components/editor/edit-trigger"
import { saveContentItem } from "@/components/editor/save"
import type { ServiceItem } from "@/lib/content"

type ServiceEditShellProps = {
  service: ServiceItem
}

function applyMetaDraft(item: ServiceItem, draft: ServiceMetaDraft): ServiceItem {
  return {
    ...item,
    title: draft.title,
    short: draft.short,
    description: draft.description,
    icon: draft.icon,
    logo: draft.logo,
    featured: draft.featured,
    page: {
      ...item.page,
      enabled: draft.page.enabled,
      eyebrow: draft.page.eyebrow,
      headline: draft.page.headline,
      headlineAccent: draft.page.headlineAccent,
      tagline: draft.page.tagline,
      heroVisual: draft.page.heroVisual,
      demo: draft.page.demo ?? item.page.demo,
      outcomes: draft.page.outcomes,
      related: draft.page.related,
    },
  } as ServiceItem
}

function applySectionDraft(
  item: ServiceItem,
  section: EditableSection
): ServiceItem {
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
  return { ...item, page: { ...item.page, sections } } as ServiceItem
}

export function ServiceEditShell({ service: initial }: ServiceEditShellProps) {
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

  const metaDraft: ServiceMetaDraft = useMemo(
    () => ({
      title: item.title,
      short: item.short,
      description: item.description,
      icon: item.icon,
      logo: item.logo,
      featured: item.featured,
      page: {
        enabled: item.page.enabled,
        eyebrow: item.page.eyebrow,
        headline: item.page.headline,
        headlineAccent: item.page.headlineAccent,
        tagline: item.page.tagline,
        heroVisual: item.page.heroVisual ?? "engine",
        demo: item.page.demo ? { ...item.page.demo } : null,
        outcomes: item.page.outcomes.map((o) => ({
          value: o.value,
          label: o.label,
          icon: o.icon ?? null,
        })),
        related: [...item.page.related],
      },
    }),
    [item]
  )

  async function persist(next: ServiceItem) {
    const saved = await saveContentItem({
      kind: "services",
      id: item.id,
      item: next,
    })
    setItem(saved as ServiceItem)
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
    } as ServiceItem
    await persist(next)
    setSectionId(id)
    toast.message("Section added")
  }

  return (
    <div className="flex min-h-svh">
      <div className="min-w-0 flex-1">
        <div className="sticky top-0 z-50 flex items-center justify-between gap-3 border-b border-white/10 bg-black/95 px-4 py-2.5 backdrop-blur-md md:px-8">
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

        <SolutionDetail
          service={item}
          editMode
          editHandlers={{
            onEditMeta: () => setMetaOpen(true),
            onEditSection: (id) => setSectionId(id),
          }}
        />
      </div>

      <ServiceMetaSheet
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
        kind="services"
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
