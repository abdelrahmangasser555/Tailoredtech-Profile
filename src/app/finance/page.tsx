import Link from "next/link"
import { FileText, Receipt } from "lucide-react"
import { getInvoices, getProposals } from "@/lib/finance/content"

export default function FinanceHomePage() {
  const proposals = getProposals()
  const invoices = getInvoices()

  return (
    <div>
      <p className="mb-2 font-mono text-[11px] tracking-[0.2em] uppercase text-foreground/40">
        Overview
      </p>
      <h1 className="font-pixel-circle text-3xl tracking-tight md:text-4xl">
        Finance
      </h1>
      <p className="mt-2 max-w-xl text-sm text-foreground/55">
        Internal proposals and invoices. Password-gated. Not indexed.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link
          href="/finance/proposals"
          className="group border border-foreground/10 bg-white p-6 transition hover:border-foreground/25"
        >
          <FileText className="mb-4 size-6 text-foreground/40 transition group-hover:text-foreground" />
          <h2 className="font-pixel-circle text-xl tracking-tight">Proposals</h2>
          <p className="mt-2 text-sm text-foreground/50">
            Build branded one-page proposals and download as PDF.
          </p>
          <p className="mt-4 font-mono text-[11px] tracking-[0.14em] uppercase text-foreground/35">
            {proposals.length} active
          </p>
        </Link>

        <Link
          href="/finance/invoices"
          className="group border border-foreground/10 bg-white p-6 transition hover:border-foreground/25"
        >
          <Receipt className="mb-4 size-6 text-foreground/40 transition group-hover:text-foreground" />
          <h2 className="font-pixel-circle text-xl tracking-tight">Invoices</h2>
          <p className="mt-2 text-sm text-foreground/50">
            Coming next. Structure is ready in config.
          </p>
          <p className="mt-4 font-mono text-[11px] tracking-[0.14em] uppercase text-foreground/35">
            {invoices.length} active
          </p>
        </Link>
      </div>
    </div>
  )
}
