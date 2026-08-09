import { NextResponse } from "next/server"
import {
  createFinanceSessionToken,
  financeCookieOptions,
  verifyFinancePassword,
} from "@/lib/finance/auth"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { password?: string }
    const password = String(body.password ?? "").trim()

    if (!/^\d{4,8}$/.test(password)) {
      return NextResponse.json(
        { error: "Enter a valid numeric PIN" },
        { status: 400 }
      )
    }

    if (!process.env.FINANCE_PASSWORD_HASH) {
      return NextResponse.json(
        { error: "Finance access is not configured" },
        { status: 503 }
      )
    }

    if (!verifyFinancePassword(password)) {
      return NextResponse.json({ error: "Incorrect PIN" }, { status: 401 })
    }

    const token = createFinanceSessionToken()
    const response = NextResponse.json({ ok: true })
    response.cookies.set(financeCookieOptions(token))
    return response
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
