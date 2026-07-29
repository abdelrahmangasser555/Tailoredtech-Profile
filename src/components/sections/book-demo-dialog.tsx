"use client"

import { useState } from "react"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { DemoContactPanel } from "@/components/sections/demo-contact-panel"
import { cn } from "@/lib/utils"

type BookDemoDialogProps = {
  solutionTitle: string
  label: string
  title: string
  subtitle: string
  submitLabel: string
  triggerClassName?: string
  triggerVariant?: "solid" | "outline"
  /** Custom trigger — defaults to labeled button */
  trigger?: React.ReactNode
  /** Controlled open (optional) */
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function BookDemoDialog({
  solutionTitle,
  label,
  title,
  subtitle,
  submitLabel,
  triggerClassName,
  triggerVariant = "solid",
  trigger,
  open: openProp,
  onOpenChange,
}: BookDemoDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const open = openProp ?? uncontrolledOpen
  const setOpen = onOpenChange ?? setUncontrolledOpen
  const [pending, setPending] = useState(false)
  const [sent, setSent] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    await new Promise((r) => setTimeout(r, 700))
    console.info("Demo request:", { solution: solutionTitle, ...data })
    setPending(false)
    setSent(true)
    form.reset()
    toast.success("Demo request received. We'll be in touch shortly.")
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      window.setTimeout(() => setSent(false), 200)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <button
            type="button"
            className={cn(
              "inline-flex h-11 items-center justify-center gap-2 px-5 text-sm font-medium transition",
              triggerVariant === "solid"
                ? "bg-accent text-accent-foreground hover:brightness-95"
                : "border border-white/25 text-white hover:bg-white/5",
              triggerClassName
            )}
          >
            {label}
            <ArrowRight className="size-4" />
          </button>
        )}
      </DialogTrigger>

      <DialogContent
        showCloseButton
        className="max-w-lg gap-0 overflow-hidden rounded-none border-0 bg-black p-0 text-white ring-1 ring-white/15 sm:max-w-lg"
      >
        <div className="border-b border-white/10 px-6 py-5">
          <DialogHeader className="gap-2">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-accent">
              Demo
            </p>
            <DialogTitle className="font-pixel-circle text-2xl font-medium tracking-tight text-white">
              {sent ? "Request received" : title}
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-white/45">
              {sent
                ? "Thanks. We'll follow up within one business day."
                : subtitle}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 py-6">
          {sent ? (
            <div className="flex flex-col items-start gap-4">
              <CheckCircle2 className="size-8 text-accent" />
              <p className="text-sm text-white/55">
                Your demo request for{" "}
                <span className="font-medium text-white">{solutionTitle}</span>{" "}
                is in. Prefer email? Reach us anytime.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <Button
                  type="button"
                  variant="accent"
                  onClick={() => setSent(false)}
                  className="h-10 rounded-none px-4"
                >
                  Book another
                </Button>
                <Button
                  type="button"
                  variant="brandOutline"
                  onClick={() => setOpen(false)}
                  className="h-10 rounded-none"
                >
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-5">
              <input type="hidden" name="solution" value={solutionTitle} />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  id="demo-name"
                  name="name"
                  label="Name"
                  placeholder="Your name"
                  required
                />
                <Field
                  id="demo-email"
                  name="email"
                  label="Work email"
                  type="email"
                  placeholder="you@company.com"
                  required
                />
              </div>
              <Field
                id="demo-company"
                name="company"
                label="Company"
                placeholder="Company name"
              />
              <Field
                id="demo-when"
                name="preferredTime"
                label="Preferred time"
                placeholder="e.g. Tue afternoon GMT+4"
              />
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="demo-message"
                  className="text-xs tracking-wide uppercase text-white/45"
                >
                  What should we cover?
                </Label>
                <Textarea
                  id="demo-message"
                  name="message"
                  rows={3}
                  className="resize-none rounded-none border-0 border-b border-white/20 bg-transparent px-0 text-white placeholder:text-white/25 focus-visible:border-accent focus-visible:ring-0"
                  placeholder="Fleet size, stack, or goals…"
                />
              </div>
              <Button
                type="submit"
                disabled={pending}
                variant="accent"
                className="mt-1 h-11 w-fit rounded-none px-6"
              >
                {pending ? "Sending…" : submitLabel}
                {!pending && <ArrowRight data-icon="inline-end" />}
              </Button>
            </form>
          )}
        </div>

        {!sent && <DemoContactPanel />}
      </DialogContent>
    </Dialog>
  )
}

function Field({
  id,
  name,
  label,
  placeholder,
  required,
  type = "text",
}: {
  id: string
  name: string
  label: string
  placeholder: string
  required?: boolean
  type?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label
        htmlFor={id}
        className="text-xs tracking-wide uppercase text-white/45"
      >
        {label}
      </Label>
      <Input
        id={id}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="h-11 rounded-none border-0 border-b border-white/20 bg-transparent px-0 text-white placeholder:text-white/25 focus-visible:border-accent focus-visible:ring-0"
      />
    </div>
  )
}
