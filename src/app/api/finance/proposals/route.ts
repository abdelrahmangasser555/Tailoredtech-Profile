import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { isFinanceAuthenticated } from "@/lib/finance/auth"
import type { FinanceConfig, FinanceProposal } from "@/lib/finance/types"

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
    brands: config.brands,
    formats: config.formats,
    proposals: config.proposals.filter((p) => p.enabled),
    invoices: config.invoices.filter((i) => i.enabled),
  })
}

export async function PUT(request: Request) {
  if (!(await isFinanceAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = (await request.json()) as {
      proposal?: FinanceProposal
      deleteId?: string
    }

    const config = await readConfig()

    if (body.deleteId) {
      config.proposals = config.proposals.filter((p) => p.id !== body.deleteId)
      await writeConfig(config)
      return NextResponse.json({ ok: true })
    }

    if (!body.proposal?.id) {
      return NextResponse.json({ error: "Missing proposal" }, { status: 400 })
    }

    const proposal: FinanceProposal = {
      ...body.proposal,
      updatedAt: new Date().toISOString(),
    }

    const index = config.proposals.findIndex((p) => p.id === proposal.id)
    if (index >= 0) {
      config.proposals[index] = {
        ...proposal,
        createdAt: config.proposals[index]!.createdAt,
      }
    } else {
      config.proposals.unshift({
        ...proposal,
        createdAt: proposal.createdAt || new Date().toISOString(),
      })
    }

    await writeConfig(config)
    return NextResponse.json({ ok: true, proposal })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Save failed" }, { status: 500 })
  }
}
