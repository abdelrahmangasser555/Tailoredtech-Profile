"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/finance", label: "Overview", exact: true },
  { href: "/finance/proposals", label: "Proposals" },
  { href: "/finance/invoices", label: "Invoices" },
] as const

export function FinanceShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  async function logout() {
    await fetch("/api/finance/logout", { method: "POST" })
    router.refresh()
  }

  return (
    <div className="min-h-svh bg-[var(--section-light,#f7f7f2)] text-foreground">
      <header className="border-b border-foreground/10 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <div className="flex items-center gap-6 md:gap-8">
            <Link href="/finance" className="shrink-0">
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-foreground/40">
                Module
              </p>
              <p className="font-pixel-circle text-lg tracking-tight">Finance</p>
            </Link>
            <nav className="flex items-center gap-1">
              {NAV.map((item) => {
                const active = item.exact
                  ? pathname === item.href
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-3 py-2 font-mono text-[11px] tracking-[0.14em] uppercase transition",
                      active
                        ? "bg-foreground text-background"
                        : "text-foreground/50 hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
          <button
            type="button"
            onClick={() => void logout()}
            className="inline-flex cursor-pointer items-center gap-2 font-mono text-[10px] tracking-[0.16em] uppercase text-foreground/45 transition hover:text-foreground"
          >
            <LogOut className="size-3.5" />
            Lock
          </button>
        </div>
      </header>
      <div className="mx-auto w-full max-w-6xl px-5 py-10 md:px-8 md:py-14">
        {children}
      </div>
    </div>
  )
}
