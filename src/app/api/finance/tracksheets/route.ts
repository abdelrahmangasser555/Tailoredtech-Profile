import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { isFinanceAvailable } from "@/lib/finance/auth"
import type { Tracksheet, TracksheetConfig } from "@/lib/tracksheets/types"
import { normalizeTracksheet } from "@/lib/tracksheets/types"

const CONFIG_PATH = path.join(process.cwd(), "src", "config", "tracksheets.json")

async function readConfig(): Promise<TracksheetConfig> {
  const raw = await fs.readFile(CONFIG_PATH, "utf8")
  return JSON.parse(raw) as TracksheetConfig
}

async function writeConfig(config: TracksheetConfig) {
  await fs.writeFile(CONFIG_PATH, `${JSON.stringify(config, null, 2)}\n`, "utf8")
}

export async function GET() {
  if (!isFinanceAvailable()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  const config = await readConfig()
  return NextResponse.json({
    tracksheets: config.tracksheets.filter((sheet) => sheet.enabled).map((sheet) => normalizeTracksheet(sheet)),
  })
}

export async function PUT(request: Request) {
  if (!isFinanceAvailable()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  try {
    const body = (await request.json()) as {
      tracksheet?: Tracksheet
      deleteId?: string
    }
    const config = await readConfig()

    if (body.deleteId) {
      config.tracksheets = config.tracksheets.filter((sheet) => sheet.id !== body.deleteId)
      await writeConfig(config)
      return NextResponse.json({ ok: true })
    }

    if (!body.tracksheet?.id) {
      return NextResponse.json({ error: "Missing tracksheet" }, { status: 400 })
    }

    const tracksheet = normalizeTracksheet({
      ...body.tracksheet,
      updatedAt: new Date().toISOString(),
    })

    const index = config.tracksheets.findIndex((sheet) => sheet.id === tracksheet.id)
    if (index >= 0) {
      config.tracksheets[index] = {
        ...tracksheet,
        createdAt: config.tracksheets[index]!.createdAt,
      }
    } else {
      config.tracksheets.unshift(tracksheet)
    }

    await writeConfig(config)
    return NextResponse.json({ ok: true, tracksheet })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Save failed" }, { status: 500 })
  }
}
