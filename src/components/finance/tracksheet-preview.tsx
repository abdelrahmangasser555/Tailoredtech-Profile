import {
  ArrowLeftRight,
  Bug,
  LayoutGrid,
  Minus,
  Sparkles,
  Tag,
  type LucideIcon,
} from "lucide-react"
import type { Tracksheet, TracksheetItemType } from "@/lib/tracksheets/types"
import { flattenTracksheet } from "@/lib/tracksheets/numbering"
import {
  getPalette,
  statusLabel,
  statusSwatch,
  typeLabel,
  typeSwatch,
} from "@/lib/tracksheets/palettes"

const TYPE_ICONS: Record<TracksheetItemType, LucideIcon> = {
  "additional-module": LayoutGrid,
  feature: Sparkles,
  "remove-feature": Minus,
  "workflow-change": ArrowLeftRight,
  bug: Bug,
  custom: Tag,
}

export function TracksheetPreview({ sheet }: { sheet: Tracksheet }) {
  const palette = getPalette(sheet.paletteId)
  const rows = flattenTracksheet(sheet)
  const showNo = sheet.numbering.enabled
  const showStatus = sheet.columns.status
  const showType = sheet.columns.type
  const showImages = sheet.columns.images

  return (
    <article
      className="overflow-hidden border text-left"
      style={{ background: palette.paper, borderColor: palette.line, color: palette.ink }}
    >
      <header className="flex flex-wrap items-center gap-4 px-5 py-4" style={{ borderBottom: `1px solid ${palette.line}` }}>
        <div className="flex items-center gap-3">
          <Logo src={sheet.vendorLogo} alt="Vendor" />
          {sheet.vendorLogo && sheet.clientLogo ? (
            <span className="font-mono text-xs" style={{ color: palette.muted }}>
              ×
            </span>
          ) : null}
          <Logo src={sheet.clientLogo} alt="Client" />
        </div>
        <div className="ml-auto text-right">
          {sheet.refNumber ? (
            <p className="font-mono text-[10px] tracking-[0.16em] uppercase" style={{ color: palette.muted }}>
              Ref {sheet.refNumber}
            </p>
          ) : null}
          {sheet.clientName ? (
            <p className="text-sm font-medium">{sheet.clientName}</p>
          ) : null}
        </div>
      </header>

      <div className="px-5 pt-4 pb-3">
        <p className="font-pixel-circle text-2xl tracking-tight" style={{ color: palette.primary }}>
          {sheet.projectName || "Project name"}
        </p>
        <h2 className="mt-1 text-base font-semibold">{sheet.title || "Tracksheet title"}</h2>
        {sheet.description ? (
          <p className="mt-2 max-w-3xl text-sm leading-relaxed whitespace-pre-wrap" style={{ color: palette.muted }}>
            {sheet.description}
          </p>
        ) : null}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr style={{ background: palette.primary, color: palette.primaryText }}>
              {showNo ? <th className="w-16 px-3 py-2 text-center font-mono text-[10px] tracking-[0.14em] uppercase">No.</th> : null}
              <th className="px-3 py-2 text-left font-mono text-[10px] tracking-[0.14em] uppercase">Item</th>
              {showStatus ? <th className="w-40 px-2 py-2 text-center font-mono text-[10px] tracking-[0.14em] uppercase">Status</th> : null}
              {showType ? <th className="w-40 px-2 py-2 text-center font-mono text-[10px] tracking-[0.14em] uppercase">Type</th> : null}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              if (row.kind === "category") {
                return (
                  <tr key={row.category.id} style={{ background: palette.primary, color: palette.primaryText }}>
                    <td colSpan={1 + (showNo ? 1 : 0) + (showStatus ? 1 : 0) + (showType ? 1 : 0)} className="px-3 py-2">
                      <span className="font-semibold">
                        {row.number ? `${row.number}  ${row.category.title || "Category"}` : row.category.title || "Category"}
                      </span>
                    </td>
                  </tr>
                )
              }

              const status = statusSwatch(palette, row.item.status)
              const type = typeSwatch(palette, row.item.type, row.item.customTypeColor)
              const Icon = TYPE_ICONS[row.item.type]
              const shots = showImages ? row.item.images : []

              return (
                <tr key={row.item.id} style={{ background: row.depth % 2 === 0 ? palette.soft : palette.paper }}>
                  {showNo ? (
                    <td className="px-2 py-3 text-center align-top font-mono text-xs font-semibold" style={{ color: palette.primary }}>
                      {row.number}
                    </td>
                  ) : null}
                  <td className="px-3 py-3 align-top" style={{ paddingLeft: 12 + (row.depth - 1) * 16 }}>
                    <p className="font-semibold leading-snug">{row.item.title || "Untitled item"}</p>
                    {row.item.description ? (
                      <p className="mt-1 text-[13px] leading-relaxed whitespace-pre-wrap" style={{ color: palette.muted }}>
                        {row.item.description}
                      </p>
                    ) : null}
                    {shots.length ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {shots.map((src) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img key={src} src={src} alt="" className="h-16 w-24 border object-cover" style={{ borderColor: palette.line }} />
                        ))}
                      </div>
                    ) : null}
                  </td>
                  {showStatus ? (
                    <td className="h-px p-0" style={{ background: status.bg, color: status.fg }}>
                      <div className="flex h-full min-h-16 items-center justify-center px-2 py-3 text-center text-[12px] font-semibold leading-tight">
                        {statusLabel(row.item.status)}
                      </div>
                    </td>
                  ) : null}
                  {showType ? (
                    <td className="h-px p-0" style={{ background: type.bg, color: type.fg }}>
                      <div className="flex h-full min-h-16 flex-col items-center justify-center gap-1 px-2 py-3 text-center">
                        <Icon className="size-4" strokeWidth={2.25} />
                        <span className="text-[12px] font-semibold leading-tight">
                          {typeLabel(row.item.type, row.item.customTypeLabel)}
                        </span>
                      </div>
                    </td>
                  ) : null}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </article>
  )
}

function Logo({ src, alt }: { src: string | null; alt: string }) {
  if (!src) return null
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className="h-10 max-w-28 object-contain" />
  )
}
