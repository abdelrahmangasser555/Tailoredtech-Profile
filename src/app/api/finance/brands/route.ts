import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { isFinanceAuthenticated } from "@/lib/finance/auth"
import type { FinanceBrandId, FinanceConfig } from "@/lib/finance/types"

const CONFIG_PATH = path.join(process.cwd(), "src", "config", "finance.json")

export async function PUT(request: Request) {
  if (!(await isFinanceAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = (await request.json()) as {
      brandId?: FinanceBrandId
      logo?: string | null
    }
    if (!body.brandId) {
      return NextResponse.json({ error: "Missing brandId" }, { status: 400 })
    }

    const raw = await fs.readFile(CONFIG_PATH, "utf8")
    const config = JSON.parse(raw) as FinanceConfig
    const index = config.brands.findIndex((b) => b.id === body.brandId)
    if (index < 0) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 })
    }

    config.brands[index] = {
      ...config.brands[index]!,
      logo: body.logo ?? null,
    }
    await fs.writeFile(CONFIG_PATH, `${JSON.stringify(config, null, 2)}\n`, "utf8")
    return NextResponse.json({ ok: true, brand: config.brands[index] })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}
