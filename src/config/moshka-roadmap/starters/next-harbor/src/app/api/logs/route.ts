const logs = [{ id: "1", text: "Left port at 06:00" }]

export async function GET() {
  return Response.json(logs)
}

export async function POST(req: Request) {
  const body = (await req.json()) as { text?: string }
  const text = body.text?.trim()
  if (!text) return Response.json({ error: "text required" }, { status: 400 })
  const row = { id: String(Date.now()), text }
  logs.unshift(row)
  return Response.json(row)
}
