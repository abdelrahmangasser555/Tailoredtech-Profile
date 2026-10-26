export const TRACKSHEET_STATUSES = [
  { id: "enrolled", label: "Enrolled" },
  { id: "in-progress", label: "In progress" },
  { id: "under-development", label: "Under development" },
  { id: "under-vendor-testing", label: "Under vendor testing" },
  { id: "uat", label: "User assessment test" },
  { id: "removed", label: "Removed" },
  { id: "declined", label: "Declined" },
] as const

export const TRACKSHEET_TYPES = [
  { id: "additional-module", label: "Additional module" },
  { id: "feature", label: "Feature" },
  { id: "remove-feature", label: "Removing a feature" },
  { id: "workflow-change", label: "Change in workflow" },
  { id: "bug", label: "Bug" },
  { id: "custom", label: "Custom" },
] as const

export type TracksheetStatus = (typeof TRACKSHEET_STATUSES)[number]["id"]
export type TracksheetItemType = (typeof TRACKSHEET_TYPES)[number]["id"]
export type TracksheetPaletteId = "tailoredtech" | "bahri" | "graphite"

export type TracksheetDecorVariant =
  | "none"
  | "dotted-ring-tl"
  | "corner-cut-tr"
  | "corner-cut-bl"

export type TracksheetDecor = {
  enabled: boolean
  variant: TracksheetDecorVariant
  color: string
}

export type TracksheetFootnote = {
  enabled: boolean
  position: "before" | "after"
  markdown: string
}

export type TracksheetDisplay = {
  itemColumnLabel: string
  tableBorders: boolean
  footnote: TracksheetFootnote
  decor: TracksheetDecor
}

export type TracksheetItem = {
  id: string
  title: string
  description: string
  status: TracksheetStatus
  type: TracksheetItemType
  customTypeLabel: string
  customTypeColor: string
  targetDate: string
  images: string[]
  children: TracksheetItem[]
}

export type TracksheetCategory = {
  id: string
  title: string
  items: TracksheetItem[]
}

export type TracksheetColumns = {
  status: boolean
  type: boolean
  images: boolean
  targetDate: boolean
}

export type Tracksheet = {
  id: string
  projectName: string
  title: string
  description: string
  refNumber: string
  clientName: string
  clientLogo: string | null
  vendorLogo: string | null
  paletteId: TracksheetPaletteId
  numbering: { enabled: boolean }
  columns: TracksheetColumns
  display: TracksheetDisplay
  categories: TracksheetCategory[]
  createdAt: string
  updatedAt: string
  enabled: boolean
}

export type TracksheetConfig = {
  tracksheets: Tracksheet[]
}

export const DEFAULT_TRACKSHEET_DISPLAY: TracksheetDisplay = {
  itemColumnLabel: "Items",
  tableBorders: true,
  footnote: { enabled: false, position: "after", markdown: "" },
  decor: { enabled: false, variant: "none", color: "#003C71" },
}

export function tracksheetUid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

export function emptyTracksheetItem(): TracksheetItem {
  return {
    id: tracksheetUid("item"),
    title: "",
    description: "",
    status: "enrolled",
    type: "feature",
    customTypeLabel: "",
    customTypeColor: "#0A0A0A",
    targetDate: "",
    images: [],
    children: [],
  }
}

export function emptyTracksheet(): Tracksheet {
  const now = new Date().toISOString()
  return {
    id: tracksheetUid("tracksheet"),
    projectName: "",
    title: "",
    description: "",
    refNumber: "",
    clientName: "",
    clientLogo: null,
    vendorLogo: "/logo.svg",
    paletteId: "tailoredtech",
    numbering: { enabled: true },
    columns: { status: true, type: true, images: true, targetDate: false },
    display: { ...DEFAULT_TRACKSHEET_DISPLAY },
    categories: [
      {
        id: tracksheetUid("cat"),
        title: "Category",
        items: [emptyTracksheetItem()],
      },
    ],
    createdAt: now,
    updatedAt: now,
    enabled: true,
  }
}

function normalizeItem(item: Partial<TracksheetItem> | undefined): TracksheetItem {
  const base = emptyTracksheetItem()
  return {
    ...base,
    ...item,
    id: item?.id || base.id,
    title: item?.title ?? "",
    description: item?.description ?? "",
    status: item?.status ?? "enrolled",
    type: item?.type ?? "feature",
    customTypeLabel: item?.customTypeLabel ?? "",
    customTypeColor: item?.customTypeColor || "#0A0A0A",
    targetDate: item?.targetDate ?? "",
    images: Array.isArray(item?.images) ? item.images.filter(Boolean) : [],
    children: Array.isArray(item?.children) ? item.children.map((child) => normalizeItem(child)) : [],
  }
}

function normalizeDisplay(input: Partial<TracksheetDisplay> | undefined): TracksheetDisplay {
  const base = DEFAULT_TRACKSHEET_DISPLAY
  return {
    itemColumnLabel: input?.itemColumnLabel?.trim() || base.itemColumnLabel,
    tableBorders: input?.tableBorders ?? base.tableBorders,
    footnote: {
      enabled: input?.footnote?.enabled ?? base.footnote.enabled,
      position: input?.footnote?.position === "before" ? "before" : "after",
      markdown: input?.footnote?.markdown ?? "",
    },
    decor: {
      enabled: input?.decor?.enabled ?? base.decor.enabled,
      variant: input?.decor?.variant ?? base.decor.variant,
      color: input?.decor?.color?.trim() || base.decor.color,
    },
  }
}

export function normalizeTracksheet(input: Partial<Tracksheet> | undefined): Tracksheet {
  const base = emptyTracksheet()
  return {
    ...base,
    ...input,
    id: input?.id || base.id,
    projectName: input?.projectName ?? "",
    title: input?.title ?? "",
    description: input?.description ?? "",
    refNumber: input?.refNumber ?? "",
    clientName: input?.clientName ?? "",
    clientLogo: input?.clientLogo ?? null,
    vendorLogo: input?.vendorLogo ?? "/logo.svg",
    paletteId: input?.paletteId ?? "tailoredtech",
    numbering: { enabled: input?.numbering?.enabled ?? true },
    columns: {
      status: input?.columns?.status ?? true,
      type: input?.columns?.type ?? true,
      images: input?.columns?.images ?? true,
      targetDate: input?.columns?.targetDate ?? false,
    },
    display: normalizeDisplay(input?.display),
    categories: Array.isArray(input?.categories)
      ? input.categories.map((category) => ({
          id: category.id || tracksheetUid("cat"),
          title: category.title ?? "",
          items: (category.items ?? []).map((item) => normalizeItem(item)),
        }))
      : base.categories,
    createdAt: input?.createdAt || base.createdAt,
    updatedAt: input?.updatedAt || base.updatedAt,
    enabled: input?.enabled ?? true,
  }
}
