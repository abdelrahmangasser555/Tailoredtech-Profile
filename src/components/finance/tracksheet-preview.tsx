import type { Tracksheet } from "@/lib/tracksheets/types"
import { flattenTracksheet, tableColumnCount } from "@/lib/tracksheets/numbering"
import { formatTargetDate } from "@/lib/tracksheets/format"
import {
  getPalette,
  statusLabel,
  statusSwatch,
  typeLabel,
} from "@/lib/tracksheets/palettes"
import { TracksheetDecorLayer } from "@/components/finance/tracksheet-decor"
import { TracksheetFootnote } from "@/components/finance/tracksheet-footnote"

export function TracksheetPreview({ sheet }: { sheet: Tracksheet }) {
  const palette = getPalette(sheet.paletteId)
  const rows = flattenTracksheet(sheet)
  const colSpan = tableColumnCount(sheet)
  const showNo = sheet.numbering.enabled
  const showStatus = sheet.columns.status
  const showType = sheet.columns.type
  const showImages = sheet.columns.images
  const showTarget = sheet.columns.targetDate
  const itemLabel = sheet.display.itemColumnLabel || "Items"
  const footnote = sheet.display.footnote
  const showFootnoteBefore = footnote.enabled && footnote.position === "before"
  const showFootnoteAfter = footnote.enabled && footnote.position === "after"
  const tableBorders = sheet.display.tableBorders
  const cellBorder = tableBorders ? { border: `1px solid ${palette.line}` } : undefined

  const table = (
    <div className="overflow-x-auto">
      <table
        className="w-full border-collapse text-sm"
        style={tableBorders ? { border: `1px solid ${palette.line}` } : undefined}
      >
        <thead>
          <tr style={{ background: palette.primary, color: palette.primaryText }}>
            {showNo ? (
              <th
                className="w-16 px-3 py-2 text-center font-mono text-[10px] tracking-[0.14em] uppercase"
                style={cellBorder}
              >
                No.
              </th>
            ) : null}
            <th
              className="px-3 py-2 text-left font-mono text-[10px] tracking-[0.14em] uppercase"
              style={cellBorder}
            >
              {itemLabel}
            </th>
            {showTarget ? (
              <th
                className="w-28 px-2 py-2 text-center font-mono text-[10px] tracking-[0.14em] uppercase"
                style={cellBorder}
              >
                Target date
              </th>
            ) : null}
            {showStatus ? (
              <th
                className="w-40 px-2 py-2 text-center font-mono text-[10px] tracking-[0.14em] uppercase"
                style={cellBorder}
              >
                Status
              </th>
            ) : null}
            {showType ? (
              <th
                className="w-40 px-2 py-2 text-center font-mono text-[10px] tracking-[0.14em] uppercase"
                style={cellBorder}
              >
                Type
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            if (row.kind === "category") {
              return (
                <tr key={row.category.id} style={{ background: palette.primary, color: palette.primaryText }}>
                  <td colSpan={colSpan} className="px-3 py-2" style={cellBorder}>
                    <span className="font-semibold">
                      {row.number
                        ? `${row.number}  ${row.category.title || "Category"}`
                        : row.category.title || "Category"}
                    </span>
                  </td>
                </tr>
              )
            }

            const status = statusSwatch(palette, row.item.status)
            const rowBg = row.depth % 2 === 0 ? palette.soft : palette.paper
            const shots = showImages ? row.item.images : []

            return (
              <tr key={row.item.id} style={{ background: row.depth % 2 === 0 ? palette.soft : palette.paper }}>
                {showNo ? (
                  <td
                    className="px-2 py-3 text-center align-top font-mono text-xs font-semibold"
                    style={{ color: palette.primary, ...cellBorder }}
                  >
                    {row.number}
                  </td>
                ) : null}
                <td
                  className="px-3 py-3 align-top"
                  style={{ paddingLeft: 12 + (row.depth - 1) * 16, ...cellBorder }}
                >
                  <p className="font-semibold leading-snug">{row.item.title || "Untitled item"}</p>
                  {row.item.description ? (
                    <p
                      className="mt-1 text-[13px] leading-relaxed whitespace-pre-wrap"
                      style={{ color: palette.muted }}
                    >
                      {row.item.description}
                    </p>
                  ) : null}
                  {shots.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {shots.map((src) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={src}
                          src={src}
                          alt=""
                          className="h-16 w-24 border object-cover"
                          style={{ borderColor: palette.line }}
                        />
                      ))}
                    </div>
                  ) : null}
                </td>
                {showTarget ? (
                  <td
                    className="px-2 py-3 text-center align-top text-xs font-medium"
                    style={{ color: palette.ink, ...cellBorder }}
                  >
                    {formatTargetDate(row.item.targetDate) || "—"}
                  </td>
                ) : null}
                {showStatus ? (
                  <td className="h-px p-0" style={{ background: status.bg, color: status.fg, ...cellBorder }}>
                    <div className="flex h-full min-h-16 items-center justify-center px-2 py-3 text-center text-[12px] font-semibold leading-tight">
                      {statusLabel(row.item.status)}
                    </div>
                  </td>
                ) : null}
                {showType ? (
                  <td
                    className="h-px p-0"
                    style={{ background: rowBg, color: palette.ink, ...cellBorder }}
                  >
                    <div className="flex h-full min-h-16 items-center justify-center px-2 py-3 text-center">
                      <span className="text-[12px] font-medium leading-tight">
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
  )

  return (
    <article
      className="relative overflow-hidden border text-left"
      style={{ background: palette.paper, borderColor: palette.line, color: palette.ink }}
    >
      <TracksheetDecorLayer decor={sheet.display.decor} />
      <header
        className="relative z-10 flex w-full items-start justify-between gap-4 px-5 py-4"
        style={{ borderBottom: `1px solid ${palette.line}` }}
      >
        <Logo src={sheet.clientLogo} alt="Client" />
        <div className="flex flex-col items-end gap-2">
          {sheet.refNumber || sheet.clientName ? (
            <div className="text-right">
              {sheet.refNumber ? (
                <p className="font-mono text-[10px] tracking-[0.16em] uppercase" style={{ color: palette.muted }}>
                  Ref {sheet.refNumber}
                </p>
              ) : null}
              {sheet.clientName ? <p className="text-sm font-medium">{sheet.clientName}</p> : null}
            </div>
          ) : null}
          <Logo src={sheet.vendorLogo} alt="Vendor" />
        </div>
      </header>

      <div className="relative z-10 px-5 pt-4 pb-3">
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

      {showFootnoteBefore ? (
        <TracksheetFootnote markdown={footnote.markdown} muted={palette.muted} ink={palette.ink} />
      ) : null}

      <div className="relative z-10">{table}</div>

      {showFootnoteAfter ? (
        <TracksheetFootnote markdown={footnote.markdown} muted={palette.muted} ink={palette.ink} />
      ) : null}
    </article>
  )
}

function Logo({ src, alt }: { src: string | null; alt: string }) {
  if (!src) return null
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className="h-14 max-w-[9.5rem] object-contain sm:h-16 sm:max-w-44" />
  )
}
