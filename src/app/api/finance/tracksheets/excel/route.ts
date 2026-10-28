import { NextResponse } from "next/server"
import { isFinanceAvailable } from "@/lib/finance/auth"
import { buildTracksheetXlsx } from "@/lib/tracksheets/excel"
import { normalizeTracksheet } from "@/lib/tracksheets/types"
import type { Tracksheet } from "@/lib/tracksheets/types"

export async function POST(request: Request) {
  if (!isFinanceAvailable()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  try {
    const body = (await request.json()) as {
      tracksheet?: Tracksheet
      images?: Record<string, string>
    }
    if (!body.tracksheet) {
      return NextResponse.json({ error: "Missing tracksheet" }, { status: 400 })
    }

    const sheet = normalizeTracksheet(body.tracksheet)
    const buffer = await buildTracksheetXlsx(sheet, body.images ?? {})
    const filename = `${(sheet.refNumber || sheet.title || sheet.id)
      .replace(/[^a-zA-Z0-9-_]+/g, "-")
      .replace(/^-|-$/g, "") || "tracksheet"}.xlsx`

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Excel export failed" }, { status: 500 })
  }
}
