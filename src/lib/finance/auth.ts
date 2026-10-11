/**
 * Finance is for local use only — not exposed on Vercel or other production hosts.
 * Active when `next dev` (NODE_ENV=development) or when FINANCE_LOCAL=true (e.g. `next start` on your machine).
 */
export function isFinanceAvailable(): boolean {
  if (process.env.VERCEL === "1") return false
  if (process.env.NODE_ENV === "development") return true
  if (process.env.FINANCE_LOCAL === "true") return true
  return false
}
