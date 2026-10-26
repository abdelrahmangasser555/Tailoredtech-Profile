import type { TracksheetDecor } from "@/lib/tracksheets/types"

export function TracksheetDecorLayer({ decor }: { decor: TracksheetDecor }) {
  if (!decor.enabled || decor.variant === "none") return null
  const color = decor.color || "#003C71"

  if (decor.variant === "dotted-ring-tl") {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute top-4 left-4 size-28 rounded-full border-2 border-dashed opacity-40"
        style={{ borderColor: color }}
      />
    )
  }

  if (decor.variant === "corner-cut-tr") {
    return (
      <div aria-hidden className="pointer-events-none absolute top-0 right-0 overflow-hidden">
        <div
          className="size-0 border-t-[72px] border-l-[72px] border-l-transparent opacity-30"
          style={{ borderTopColor: color }}
        />
      </div>
    )
  }

  if (decor.variant === "corner-cut-bl") {
    return (
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-0 overflow-hidden">
        <div
          className="size-0 border-b-[56px] border-r-[56px] border-r-transparent opacity-25"
          style={{ borderBottomColor: color }}
        />
      </div>
    )
  }

  return null
}
