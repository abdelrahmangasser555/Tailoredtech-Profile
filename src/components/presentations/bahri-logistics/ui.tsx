import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { INK, MUTED, NAVY, ORANGE, displayFace } from "./theme"

export function SampleBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center bg-[#FFF1EA] px-1.5 py-0.5 text-[10px] font-semibold tracking-[0.14em] text-[#003C71] uppercase",
        className
      )}
    >
      Sample screen
    </span>
  )
}

export function CheckMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "grid size-[18px] shrink-0 place-items-center bg-[#FF681D] text-[#003C71]",
        className
      )}
      aria-hidden
    >
      <Check className="size-3" strokeWidth={3} />
    </span>
  )
}

export function NoteBar({ notes }: { notes: string[] }) {
  if (notes.length === 0) return null
  return (
    <div className="border-t border-[#FF681D]/50 bg-[#FFF8F4] px-3 py-2">
      {notes.map((note) => (
        <p key={note} className="text-[12px] leading-snug font-medium text-[#003C71]">
          <span className="mr-1.5 text-[#FF681D]" aria-hidden>
            →
          </span>
          {note}
        </p>
      ))}
    </div>
  )
}

export function StagePill({ stage }: { stage: string }) {
  const active = stage === "Collected" || stage === "With agent"
  return (
    <span
      className={cn(
        "inline-flex px-1.5 py-0.5 text-[11px] font-medium",
        active ? "bg-[#003C71] text-white" : "bg-[#E7EEF5] text-[#003C71]"
      )}
    >
      {stage}
    </span>
  )
}

export function PriorityDot({ priority }: { priority: string }) {
  const urgent = priority === "Urgent"
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#003C71]">
      <span
        className={cn("size-1.5", urgent ? "bg-[#FF681D]" : "bg-[#A8A8AA]")}
        aria-hidden
      />
      {priority}
    </span>
  )
}

export function ArrowDown() {
  return (
    <span className="flex justify-center py-1 text-[12px] font-semibold text-[#FF681D]" aria-hidden>
      ↓
    </span>
  )
}

export function SectionLabel({ children }: { children: string }) {
  return (
    <p
      className={cn(displayFace, "text-[11px] tracking-[0.16em] uppercase")}
      style={{ color: ORANGE }}
    >
      {children}
    </p>
  )
}

export const mutedStyle = { color: MUTED }
export const navyStyle = { color: NAVY }
export const inkStyle = { color: INK }
