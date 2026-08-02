import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { isLocalEditEnabled } from "@/lib/local-edit"

type SaveBody = {
  kind: "presentations" | "services"
  id: string
  item: unknown
}

export async function POST(request: Request) {
  if (!isLocalEditEnabled()) {
    return NextResponse.json(
      { error: "Local edit is disabled" },
      { status: 403 }
    )
  }

  let body: SaveBody
  try {
    body = (await request.json()) as SaveBody
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  if (
    !body ||
    (body.kind !== "presentations" && body.kind !== "services") ||
    typeof body.id !== "string" ||
    !body.item ||
    typeof body.item !== "object"
  ) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const fileName =
    body.kind === "presentations" ? "presentations.json" : "services.json"
  const filePath = path.join(process.cwd(), "src", "config", fileName)

  try {
    const raw = await fs.readFile(filePath, "utf8")
    const data = JSON.parse(raw) as { items: Array<{ id: string }> }

    if (!Array.isArray(data.items)) {
      return NextResponse.json(
        { error: "Config missing items array" },
        { status: 500 }
      )
    }

    const index = data.items.findIndex((item) => item.id === body.id)
    if (index === -1) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    const nextItem = body.item as { id: string }
    if (nextItem.id !== body.id) {
      return NextResponse.json(
        { error: "Item id cannot change" },
        { status: 400 }
      )
    }

    if (body.kind === "presentations") {
      ;(nextItem as { updatedAt?: string }).updatedAt = new Date()
        .toISOString()
        .slice(0, 10)
    }

    data.items[index] = nextItem as { id: string }

    await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8")

    return NextResponse.json({ ok: true, item: nextItem })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Save failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
