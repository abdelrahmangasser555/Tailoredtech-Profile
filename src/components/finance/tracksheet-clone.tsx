"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Copy, Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { Tracksheet } from "@/lib/tracksheets/types"
import { cloneTracksheet } from "@/lib/tracksheets/clone"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function CloneTracksheetButton({
  sheet,
  label = "Clone",
  variant = "ghost",
  className,
}: {
  sheet: Tracksheet
  label?: string
  variant?: "default" | "outline" | "ghost"
  className?: string
}) {
  const router = useRouter()
  const [cloning, setCloning] = useState(false)

  async function clone() {
    if (cloning) return
    setCloning(true)
    try {
      const next = cloneTracksheet(sheet)
      const res = await fetch("/api/finance/tracksheets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tracksheet: next }),
      })
      const data = (await res.json()) as { error?: string; tracksheet?: Tracksheet }
      if (!res.ok || !data.tracksheet) {
        toast.error(data.error || "Clone failed")
        return
      }
      toast.success("Tracksheet cloned")
      router.push(`/finance/tracksheets/${data.tracksheet.id}`)
      router.refresh()
    } catch {
      toast.error("Clone failed")
    } finally {
      setCloning(false)
    }
  }

  return (
    <Button type="button" variant={variant} className={cn("rounded-none", className)} disabled={cloning} onClick={() => void clone()}>
      {cloning ? <Loader2 className="size-4 animate-spin" /> : <Copy className="size-4" />}
      {label}
    </Button>
  )
}
