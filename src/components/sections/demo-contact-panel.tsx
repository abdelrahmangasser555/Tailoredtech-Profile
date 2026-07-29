"use client"

import { useEffect, useState } from "react"
import { Mail, Phone } from "lucide-react"
import { site } from "@/lib/content"
import {
  getContactAvailability,
  type ContactAvailabilityStatus,
} from "@/lib/contact-availability"
import { cn } from "@/lib/utils"

export function DemoContactPanel({ className }: { className?: string }) {
  const { contact } = site.company
  const availabilityConfig = contact.availability
  const [status, setStatus] = useState<ContactAvailabilityStatus | null>(null)

  useEffect(() => {
    if (!availabilityConfig) return

    const tick = () =>
      setStatus(getContactAvailability(availabilityConfig))

    tick()
    const id = window.setInterval(tick, 60_000)
    return () => window.clearInterval(id)
  }, [availabilityConfig])

  return (
    <div
      className={cn(
        "border-t border-white/10 bg-white/[0.03] px-6 py-4",
        className
      )}
    >
      {status && (
        <div className="mb-3 flex items-start gap-2.5">
          <span
            aria-hidden
            className={cn(
              "mt-1.5 size-2 shrink-0",
              status.isOpen ? "bg-accent" : "bg-white/30"
            )}
          />
          <div>
            <p
              className={cn(
                "text-sm font-medium",
                status.isOpen ? "text-accent" : "text-white/70"
              )}
            >
              {status.statusLabel}
            </p>
            <p className="mt-0.5 font-mono text-[10px] tracking-[0.16em] uppercase text-white/40">
              {status.detailLabel}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 text-sm">
        <a
          href={`mailto:${contact.email}`}
          className="inline-flex items-center gap-2 text-white/55 transition hover:text-accent"
        >
          <Mail className="size-3.5 shrink-0" />
          {contact.email}
        </a>
        {contact.phone ? (
          <a
            href={`tel:${contact.phone.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-2 text-white/55 transition hover:text-accent"
          >
            <Phone className="size-3.5 shrink-0" />
            {contact.phone}
          </a>
        ) : null}
        {contact.city ? (
          <p className="text-xs text-white/35">{contact.city}</p>
        ) : null}
      </div>
    </div>
  )
}
