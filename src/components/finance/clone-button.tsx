"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Copy, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { cloneInvoice, cloneProposal } from "@/lib/finance/clone"
import type { FinanceInvoice, FinanceProposal } from "@/lib/finance/types"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type CloneButtonProps = {
  label?: string
  variant?: "default" | "outline" | "ghost"
  className?: string
}

export function CloneProposalButton({
  proposal,
  label = "Clone",
  variant = "ghost",
  className,
}: CloneButtonProps & { proposal: FinanceProposal }) {
  const router = useRouter()
  const [cloning, setCloning] = useState(false)

  async function clone() {
    if (cloning) return
    setCloning(true)
    try {
      const cloned = cloneProposal(proposal)
      const res = await fetch("/api/finance/proposals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposal: cloned }),
      })
      const data = (await res.json()) as {
        error?: string
        proposal?: FinanceProposal
      }
      if (!res.ok || !data.proposal) {
        toast.error(data.error || "Clone failed")
        return
      }
      toast.success("Proposal cloned")
      router.push(`/finance/proposals/${data.proposal.id}`)
      router.refresh()
    } catch {
      toast.error("Clone failed")
    } finally {
      setCloning(false)
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      className={cn("rounded-none", className)}
      disabled={cloning}
      onClick={() => void clone()}
    >
      {cloning ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Copy className="size-4" />
      )}
      {label}
    </Button>
  )
}

export function CloneInvoiceButton({
  invoice,
  label = "Clone",
  variant = "ghost",
  className,
}: CloneButtonProps & { invoice: FinanceInvoice }) {
  const router = useRouter()
  const [cloning, setCloning] = useState(false)

  async function clone() {
    if (cloning) return
    setCloning(true)
    try {
      const cloned = cloneInvoice(invoice)
      const res = await fetch("/api/finance/invoices", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoice: cloned }),
      })
      const data = (await res.json()) as {
        error?: string
        invoice?: FinanceInvoice
      }
      if (!res.ok || !data.invoice) {
        toast.error(data.error || "Clone failed")
        return
      }
      toast.success("Invoice cloned")
      router.push(`/finance/invoices/${data.invoice.id}`)
      router.refresh()
    } catch {
      toast.error("Clone failed")
    } finally {
      setCloning(false)
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      className={cn("rounded-none", className)}
      disabled={cloning}
      onClick={() => void clone()}
    >
      {cloning ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Copy className="size-4" />
      )}
      {label}
    </Button>
  )
}
