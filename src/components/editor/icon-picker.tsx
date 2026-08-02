"use client"

import { useMemo, useState } from "react"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  SECTION_NAV_ICONS,
  SECTION_NAV_ICON_NAMES,
} from "@/components/sections/section-nav-icon"
import { OUTCOME_ICON_NAMES } from "@/components/sections/outcome-icon"
import { FieldLabel } from "@/components/editor/fields"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

type IconPickerProps = {
  label: string
  value: string | null | undefined
  onChange: (name: string | null) => void
  catalog?: "section" | "outcome" | "all"
  className?: string
}

export function IconPicker({
  label,
  value,
  onChange,
  catalog = "section",
  className,
}: IconPickerProps) {
  const [query, setQuery] = useState("")

  const names = useMemo(() => {
    const set = new Set<string>()
    if (catalog === "section" || catalog === "all") {
      SECTION_NAV_ICON_NAMES.forEach((n) => set.add(n))
    }
    if (catalog === "outcome" || catalog === "all") {
      OUTCOME_ICON_NAMES.forEach((n) => set.add(n))
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [catalog])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return names
    return names.filter((n) => n.toLowerCase().includes(q))
  }, [names, query])

  return (
    <div className={cn("min-w-0", className)}>
      <FieldLabel hint={value || "none"}>{label}</FieldLabel>
      <InputGroup className="mb-2 h-9 rounded-none border-white/15 bg-white/[0.03] has-[[data-slot=input-group-control]:focus-visible]:border-[#D4FF00] has-[[data-slot=input-group-control]:focus-visible]:ring-[#D4FF00]/25">
        <InputGroupAddon>
          <Search className="size-3.5 text-white/35" />
        </InputGroupAddon>
        <InputGroupInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search icons…"
          className="text-sm text-white placeholder:text-white/25"
        />
        {value ? (
          <InputGroupAddon align="inline-end">
            <button
              type="button"
              className="inline-flex size-6 items-center justify-center text-white/40 hover:text-[#D4FF00]"
              onClick={() => onChange(null)}
              aria-label="Clear icon"
            >
              <X className="size-3.5" />
            </button>
          </InputGroupAddon>
        ) : null}
      </InputGroup>

      {/* No inner scrollbar — search filters the wrap grid */}
      <div className="grid grid-cols-7 gap-1 border border-white/10 bg-black/20 p-1.5">
        {filtered.map((name) => {
          const Icon = SECTION_NAV_ICONS[name]
          const active = value === name
          return (
            <button
              key={name}
              type="button"
              title={name}
              onClick={() => onChange(name)}
              className={cn(
                "flex aspect-square items-center justify-center border transition",
                active
                  ? "border-[#D4FF00] bg-[#D4FF00] text-[#0A0A0A]"
                  : "border-transparent text-white/55 hover:border-white/20 hover:bg-white/5 hover:text-white"
              )}
            >
              {Icon ? (
                <Icon className="size-3.5" strokeWidth={2.1} />
              ) : (
                <span className="font-mono text-[7px] leading-none">
                  {name.slice(0, 3)}
                </span>
              )}
            </button>
          )
        })}
        {filtered.length === 0 ? (
          <p className="col-span-full py-3 text-center font-mono text-[10px] text-white/30">
            No icons match
          </p>
        ) : null}
      </div>
    </div>
  )
}
