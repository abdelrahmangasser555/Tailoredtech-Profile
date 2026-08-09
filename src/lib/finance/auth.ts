import { createHmac, scryptSync, timingSafeEqual, randomBytes } from "crypto"
import { cookies } from "next/headers"

export const FINANCE_COOKIE = "tt_finance_session"
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7 // 7 days

function getPasswordHash(): string | null {
  return process.env.FINANCE_PASSWORD_HASH?.trim() || null
}

function getSessionSecret(): string {
  const secret = process.env.FINANCE_SESSION_SECRET?.trim()
  if (secret) return secret
  // Fallback so local boot still works if only hash is set
  return getPasswordHash() ?? "finance-dev-secret"
}

/** Verify a 4-digit (or longer) PIN against FINANCE_PASSWORD_HASH (salt:hash hex). */
export function verifyFinancePassword(password: string): boolean {
  const stored = getPasswordHash()
  if (!stored) return false

  const [salt, hashHex] = stored.split(":")
  if (!salt || !hashHex) return false

  try {
    const derived = scryptSync(password, salt, 64)
    const expected = Buffer.from(hashHex, "hex")
    if (derived.length !== expected.length) return false
    return timingSafeEqual(derived, expected)
  } catch {
    return false
  }
}

function sign(payload: string): string {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("hex")
}

export function createFinanceSessionToken(): string {
  const exp = Date.now() + SESSION_TTL_MS
  const nonce = randomBytes(8).toString("hex")
  const payload = `${exp}.${nonce}`
  return `${payload}.${sign(payload)}`
}

export function verifyFinanceSessionToken(token: string | undefined | null): boolean {
  if (!token) return false
  const parts = token.split(".")
  if (parts.length !== 3) return false
  const [expStr, nonce, sig] = parts
  if (!expStr || !nonce || !sig) return false

  const payload = `${expStr}.${nonce}`
  const expected = sign(payload)
  try {
    const a = Buffer.from(sig)
    const b = Buffer.from(expected)
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false
  } catch {
    return false
  }

  const exp = Number(expStr)
  if (!Number.isFinite(exp) || Date.now() > exp) return false
  return true
}

export async function isFinanceAuthenticated(): Promise<boolean> {
  const jar = await cookies()
  return verifyFinanceSessionToken(jar.get(FINANCE_COOKIE)?.value)
}

export function financeCookieOptions(token: string) {
  return {
    name: FINANCE_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  }
}
