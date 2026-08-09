import { NextResponse } from "next/server"
import { FINANCE_COOKIE } from "@/lib/finance/auth"

export async function POST() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set({
    name: FINANCE_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  })
  return response
}
