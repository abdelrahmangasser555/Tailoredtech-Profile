import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { isFinanceAvailable } from "@/lib/finance/auth"
import { FinanceShell } from "@/components/finance/finance-shell"

export const metadata: Metadata = {
  title: "Finance",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
}

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  if (!isFinanceAvailable()) {
    notFound()
  }

  return <FinanceShell>{children}</FinanceShell>
}
