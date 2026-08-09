import type { Metadata } from "next"
import { isFinanceAuthenticated } from "@/lib/finance/auth"
import { FinancePasswordGate } from "@/components/finance/password-gate"
import { FinanceShell } from "@/components/finance/finance-shell"

export const metadata: Metadata = {
  title: "Finance",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
}

export default async function FinanceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const ok = await isFinanceAuthenticated()
  if (!ok) {
    return <FinancePasswordGate />
  }

  return <FinanceShell>{children}</FinanceShell>
}
