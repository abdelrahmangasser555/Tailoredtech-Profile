import ExcelJS from "exceljs"
import type { Tracksheet } from "@/lib/tracksheets/types"
import { columnCount, flattenTracksheet } from "@/lib/tracksheets/numbering"
import {
  getPalette,
  statusLabel,
  statusSwatch,
  typeLabel,
  typeSwatch,
} from "@/lib/tracksheets/palettes"

function argb(hex: string) {
  const h = hex.replace("#", "").slice(0, 6)
  return `FF${h.toUpperCase()}`
}

function solid(hex: string): ExcelJS.Fill {
  return { type: "pattern", pattern: "solid", fgColor: { argb: argb(hex) } }
}

function thin(hex: string): Partial<ExcelJS.Borders> {
  const border: ExcelJS.Border = { style: "thin", color: { argb: argb(hex) } }
  return { top: border, left: border, bottom: border, right: border }
}

function dataUrlParts(dataUrl: string): { base64: string; extension: "png" | "jpeg" } | null {
  const match = dataUrl.match(/^data:image\/(png|jpeg|jpg);base64,(.+)$/i)
  if (!match) return null
  const extension = match[1]!.toLowerCase() === "png" ? "png" : "jpeg"
  return { base64: match[2]!, extension }
}

export async function buildTracksheetXlsx(
  sheet: Tracksheet,
  images: Record<string, string>
): Promise<Buffer> {
  const palette = getPalette(sheet.paletteId)
  const cols = Math.max(columnCount(sheet), 1)
  const showNo = sheet.numbering.enabled
  const showStatus = sheet.columns.status
  const showType = sheet.columns.type
  const showImages = sheet.columns.images

  const workbook = new ExcelJS.Workbook()
  workbook.creator = "TailoredTech"
  workbook.created = new Date(sheet.createdAt)
  const ws = workbook.addWorksheet("Tracksheet", {
    views: [{ showGridLines: false }],
    pageSetup: {
      orientation: "landscape",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
      paperSize: 9,
      margins: { left: 0.4, right: 0.4, top: 0.45, bottom: 0.45, header: 0.2, footer: 0.2 },
    },
  })

  const widths: number[] = []
  if (showNo) widths.push(16)
  widths.push(62)
  if (showStatus) widths.push(26)
  if (showType) widths.push(26)
  widths.forEach((width, index) => {
    ws.getColumn(index + 1).width = width
  })

  const itemCol = showNo ? 2 : 1

  ws.mergeCells(1, 1, 1, cols)
  const banner = ws.getRow(1)
  banner.height = 28
  banner.getCell(1).value = "Partners"
  banner.getCell(1).font = { name: "Calibri", size: 10, bold: true, color: { argb: argb(palette.muted) } }
  banner.getCell(1).alignment = { vertical: "middle" }

  const logoRow = ws.getRow(2)
  logoRow.height = 58
  ws.mergeCells(2, 1, 2, cols)
  let logoCol = 0
  for (const path of [sheet.vendorLogo, sheet.clientLogo]) {
    if (!path) continue
    const parsed = images[path] ? dataUrlParts(images[path]!) : null
    if (!parsed) continue
    const imageId = workbook.addImage({ base64: parsed.base64, extension: parsed.extension })
    ws.addImage(imageId, {
      tl: { col: logoCol, row: 1.15 },
      ext: { width: 92, height: 42 },
    })
    logoCol += 1.6
  }

  const writeLine = (
    rowNumber: number,
    value: string,
    opts: { size: number; bold?: boolean; color: string; height: number }
  ) => {
    ws.mergeCells(rowNumber, 1, rowNumber, cols)
    const row = ws.getRow(rowNumber)
    row.height = opts.height
    const cell = row.getCell(1)
    cell.value = value
    cell.font = {
      name: "Calibri",
      size: opts.size,
      bold: !!opts.bold,
      color: { argb: argb(opts.color) },
    }
    cell.alignment = { vertical: "middle", wrapText: true }
  }

  writeLine(3, sheet.projectName || "Project", {
    size: 20,
    bold: true,
    color: palette.primary,
    height: 28,
  })
  writeLine(4, sheet.title || "Tracksheet", {
    size: 13,
    bold: true,
    color: palette.ink,
    height: 20,
  })
  writeLine(5, sheet.description || "", {
    size: 11,
    color: palette.muted,
    height: sheet.description ? 32 : 8,
  })

  ws.mergeCells(6, 1, 6, cols)
  const meta = ws.getRow(6)
  meta.height = 18
  const metaBits = [
    sheet.clientName ? `Client  ${sheet.clientName}` : "",
    sheet.refNumber ? `Ref  ${sheet.refNumber}` : "",
  ].filter(Boolean)
  meta.getCell(1).value = metaBits.join("     ")
  meta.getCell(1).font = { name: "Calibri", size: 10, color: { argb: argb(palette.ink) } }

  const headerRowIndex = 8
  const headers: string[] = []
  if (showNo) headers.push("No.")
  headers.push("Item")
  if (showStatus) headers.push("Status")
  if (showType) headers.push("Type")
  const header = ws.getRow(headerRowIndex)
  header.height = 22
  headers.forEach((label, index) => {
    const cell = header.getCell(index + 1)
    cell.value = label
    cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: argb(palette.primaryText) } }
    cell.fill = solid(palette.primary)
    cell.alignment = { vertical: "middle", horizontal: index === 0 && showNo ? "center" : "left" }
  })

  let rowIndex = headerRowIndex + 1
  for (const row of flattenTracksheet(sheet)) {
    if (row.kind === "category") {
      ws.mergeCells(rowIndex, 1, rowIndex, cols)
      const excelRow = ws.getRow(rowIndex)
      excelRow.height = 22
      const cell = excelRow.getCell(1)
      cell.value = row.number ? `${row.number}   ${row.category.title}` : row.category.title
      cell.font = { name: "Calibri", size: 12, bold: true, color: { argb: argb(palette.primaryText) } }
      cell.fill = solid(palette.primary)
      cell.alignment = { vertical: "middle" }
      rowIndex += 1
      continue
    }

    const excelRow = ws.getRow(rowIndex)
    const description = row.item.description.trim()
    excelRow.height = description ? 36 : 22
    let col = 1
    if (showNo) {
      const cell = excelRow.getCell(col)
      cell.value = row.number
      cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: argb(palette.primary) } }
      cell.alignment = { vertical: "top", horizontal: "center" }
      cell.border = thin(palette.line)
      cell.fill = solid(palette.paper)
      col += 1
    }

    const itemCell = excelRow.getCell(col)
    const rich: ExcelJS.RichText[] = [
      {
        font: { name: "Calibri", size: 12, bold: true, color: { argb: argb(palette.ink) } },
        text: row.item.title || "Untitled",
      },
    ]
    if (description) {
      rich.push({
        font: { name: "Calibri", size: 10, color: { argb: argb(palette.muted) } },
        text: `\n${description}`,
      })
    }
    itemCell.value = { richText: rich }
    itemCell.alignment = { vertical: "top", wrapText: true, indent: Math.max(0, row.depth - 1) }
    itemCell.border = thin(palette.line)
    itemCell.fill = solid(row.depth % 2 === 0 ? palette.soft : palette.paper)
    col += 1

    if (showStatus) {
      const swatch = statusSwatch(palette, row.item.status)
      const cell = excelRow.getCell(col)
      cell.value = statusLabel(row.item.status)
      cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: argb(swatch.fg) } }
      cell.fill = solid(swatch.bg)
      cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true }
      cell.border = thin(swatch.bg)
      col += 1
    }

    if (showType) {
      const swatch = typeSwatch(palette, row.item.type, row.item.customTypeColor)
      const cell = excelRow.getCell(col)
      cell.value = typeLabel(row.item.type, row.item.customTypeLabel)
      cell.font = { name: "Calibri", size: 10, bold: true, color: { argb: argb(swatch.fg) } }
      cell.fill = solid(swatch.bg)
      cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true }
      cell.border = thin(swatch.bg)
    }

    rowIndex += 1

    if (showImages && row.item.images.length) {
      const imageRow = ws.getRow(rowIndex)
      imageRow.height = 78
      ws.mergeCells(rowIndex, 1, rowIndex, cols)
      const holder = imageRow.getCell(1)
      holder.fill = solid(palette.paper)
      holder.border = thin(palette.line)
      let imageCol = itemCol - 1 + Math.max(0, row.depth - 1) * 0.15
      for (const path of row.item.images) {
        const parsed = images[path] ? dataUrlParts(images[path]!) : null
        if (!parsed) continue
        const imageId = workbook.addImage({ base64: parsed.base64, extension: parsed.extension })
        ws.addImage(imageId, {
          tl: { col: imageCol, row: rowIndex - 1 + 0.15 },
          ext: { width: 110, height: 64 },
        })
        imageCol += 1.7
      }
      rowIndex += 1
    }
  }

  ws.autoFilter = undefined
  const buffer = await workbook.xlsx.writeBuffer()
  return Buffer.from(buffer)
}
