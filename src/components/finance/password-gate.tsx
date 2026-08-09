"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Lock } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function FinancePasswordGate() {
  const router = useRouter()
  const [pin, setPin] = useState("")
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (busy) return
    if (!/^\d{4,8}$/.test(pin)) {
      toast.error("Enter a 4-digit PIN")
      return
    }

    setBusy(true)
    try {
      const res = await fetch("/api/finance/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pin }),
      })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) {
        toast.error(data.error || "Access denied")
        return
      }
      toast.success("Access granted")
      router.refresh()
    } catch {
      toast.error("Could not verify PIN")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-[#050505] px-5 text-[#f5f5f0]">
      <form
        onSubmit={(e) => void submit(e)}
        className="w-full max-w-sm border border-white/10 bg-black/60 p-8"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center border border-white/15">
            <Lock className="size-4 text-white/60" />
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/40">
              Finance
            </p>
            <h1 className="font-pixel-circle text-2xl tracking-tight">Enter PIN</h1>
          </div>
        </div>

        <label className="mb-2 block font-mono text-[10px] tracking-[0.18em] uppercase text-white/35">
          4-digit access code
        </label>
        <Input
          type="password"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={8}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 8))}
          className={cn(
            "h-12 rounded-none border-white/15 bg-white/5 text-center font-mono text-2xl tracking-[0.4em] text-white",
            "placeholder:text-white/20 focus-visible:border-white/40 focus-visible:ring-white/10"
          )}
          placeholder="••••"
          autoFocus
        />

        <Button
          type="submit"
          variant="accent"
          className="mt-6 h-11 w-full rounded-none"
          disabled={busy || pin.length < 4}
        >
          {busy ? <Loader2 className="size-4 animate-spin" /> : null}
          {busy ? "Checking…" : "Unlock"}
        </Button>
      </form>
    </div>
  )
}
