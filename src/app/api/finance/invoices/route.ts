import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { isFinanceAuthenticated } from "@/lib/finance/auth"
import type { FinanceConfig, FinanceInvoice } from "@/lib/finance/types"

const CONFIG_PATH = path.join(process.cwd(), "src", "config", "finance.json")

async function readConfig(): Promise<FinanceConfig> {
  const raw = await fs.readFile(CONFIG_PATH, "utf8")
  return JSON.parse(raw) as FinanceConfig
}

async function writeConfig(config: FinanceConfig) {
  await fs.writeFile(CONFIG_PATH, `${JSON.stringify(config, null, 2)}\n`, "utf8")
}

export async function GET() {
  if (!(await isFinanceAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const config = await readConfig()
  return NextResponse.json({
    invoiceFormats: config.invoiceFormats ?? [],
    invoices: config.invoices.filter((i) => i.enabled),
  })
}

export async function PUT(request: Request) {
  if (!(await isFinanceAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = (await request.json()) as {
      invoice?: FinanceInvoice
      deleteId?: string
    }

    const config = await readConfig()
    if (!config.invoiceFormats) config.invoiceFormats = []

    if (body.deleteId) {
      config.invoices = config.invoices.filter((i) => i.id !== body.deleteId)
      await writeConfig(config)
      return NextResponse.json({ ok: true })
    }

    if (!body.invoice?.id) {
      return NextResponse.json({ error: "Missing invoice" }, { status: 400 })
    }

    const invoice: FinanceInvoice = {
      ...body.invoice,
      updatedAt: new Date().toISOString(),
    }

    const index = config.invoices.findIndex((i) => i.id === invoice.id)
    if (index >= 0) {
      config.invoices[index] = {
        ...invoice,
        createdAt: config.invoices[index]!.createdAt,
      }
    } else {
      config.invoices.unshift({
        ...invoice,
        createdAt: invoice.createdAt || new Date().toISOString(),
      })
    }

    await writeConfig(config)
    return NextResponse.json({ ok: true, invoice })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Save failed" }, { status: 500 })
  }
}
