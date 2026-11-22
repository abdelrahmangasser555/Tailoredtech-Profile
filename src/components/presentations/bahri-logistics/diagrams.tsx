import { cn } from "@/lib/utils"
import {
  mipsSteps,
  moduleSteps,
  qrSteps,
  routes,
  rules,
} from "./sample-data"
import { displayFace } from "./theme"

function StepRow({
  steps,
  tone,
}: {
  steps: readonly string[]
  tone: "navy" | "soft"
}) {
  return (
    <ol className="flex flex-wrap items-center gap-1.5">
      {steps.map((step, index) => (
        <li key={step} className="flex items-center gap-1.5">
          <span
            className={cn(
              displayFace,
              "px-3 py-2 text-[13px] leading-tight",
              tone === "navy"
                ? "bg-[#003C71] text-white"
                : "bg-white text-[#003C71] ring-1 ring-[#003C71]/15"
            )}
          >
            {step}
          </span>
          {index < steps.length - 1 ? (
            <span className="text-[12px] text-[#FF681D]" aria-hidden>
              →
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  )
}

export function BoundaryDiagram() {
  return (
    <figure className="flex h-full flex-col justify-center gap-3 bg-[#F4F6F8] p-4 text-[#003C71]">
      <div>
        <p className={cn(displayFace, "mb-2 text-[11px] tracking-[0.16em] text-[#5C6B7A] uppercase")}>
          MIPS
        </p>
        <StepRow steps={mipsSteps} tone="navy" />
      </div>
      <div className="bg-[#FF681D] px-3 py-2.5 text-[13px] leading-snug font-medium text-[#003C71]">
        Integration at LX, ready with supplier. The shipment appears in the Logistics Module automatically.
      </div>
      <div>
        <p className={cn(displayFace, "mb-2 text-[11px] tracking-[0.16em] text-[#5C6B7A] uppercase")}>
          Logistics Module
        </p>
        <StepRow steps={moduleSteps} tone="soft" />
      </div>
      <div className="bg-[#003C71] px-3 py-2.5 text-[13px] leading-snug text-white">
        Back to MIPS: LA (collection by the freight forwarder), PD (partly delivered), and RV (received) update automatically. The Purchase Officer is notified to close or update the purchase order.
      </div>
    </figure>
  )
}

export function QrChainDiagram() {
  return (
    <figure className="bg-white p-4 text-[#003C71]">
      <ol className="grid gap-2 sm:grid-cols-4">
        {qrSteps.map((step, index) => (
          <li key={step.title} className="relative border border-[#003C71]/15 bg-[#F4F6F8] p-3">
            <span className={cn(displayFace, "text-[12px] text-[#FF681D]")}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className={cn(displayFace, "mt-1 text-[14px]")}>{step.title}</p>
            <p className="mt-1 text-[12px] leading-snug text-[#5C6B7A]">{step.detail}</p>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-[12px] leading-snug text-[#003C71]">
        Every scan records time, place, person, photo, and notes. Damage and a short delivery are flagged.
      </p>
    </figure>
  )
}

export function RoutesDiagram({ compact = false }: { compact?: boolean }) {
  return (
    <figure className={cn("bg-white text-[#003C71]", compact ? "p-2" : "p-4")}>
      <ol className={cn("grid gap-2", compact ? "grid-cols-4" : "sm:grid-cols-2")}>
        {routes.map((route) => (
          <li key={route.name} className="border border-[#003C71]/15 bg-[#F4F6F8] p-2.5">
            <p className={cn(displayFace, "text-[12px]")}>{route.name}</p>
            <p className="mt-1 flex flex-wrap items-center gap-x-1 text-[11px] leading-snug text-[#5C6B7A]">
              {route.steps.map((step, index) => (
                <span key={step} className="inline-flex items-center gap-1">
                  {step}
                  {index < route.steps.length - 1 ? (
                    <span className="text-[#FF681D]" aria-hidden>
                      →
                    </span>
                  ) : null}
                </span>
              ))}
            </p>
          </li>
        ))}
      </ol>
    </figure>
  )
}

export function RuleDiagram({
  ruleId,
}: {
  ruleId: (typeof rules)[number]["id"]
}) {
  const rule = rules.find((item) => item.id === ruleId)
  if (!rule) return null
  return (
    <figure className="flex h-full flex-col bg-white p-3 text-[#003C71] ring-1 ring-[#003C71]/10">
      <p className={cn(displayFace, "text-[11px] tracking-[0.14em] text-[#FF681D] uppercase")}>
        {rule.title}
      </p>
      <p className="mt-2 flex-1 bg-[#F4F6F8] px-2.5 py-2 text-[12px] leading-snug">
        {rule.when}
      </p>
      <p className="py-1 text-center text-[12px] font-semibold text-[#FF681D]" aria-hidden>
        ↓
      </p>
      <p className="bg-[#003C71] px-2.5 py-2 text-[12px] leading-snug text-white">{rule.then}</p>
    </figure>
  )
}

export function EscalationDiagram() {
  const steps = [
    { day: "60 days", who: "Head of O&M Purchasing" },
    { day: "90 days", who: "Director O&M Procurement" },
    { day: "150 days", who: "President" },
  ]
  return (
    <figure className="bg-white p-4 text-[#003C71]">
      <p className={cn(displayFace, "text-[13px]")}>Goods still with an agent</p>
      <ol className="mt-3 grid gap-2 sm:grid-cols-3">
        {steps.map((step) => (
          <li key={step.day} className="bg-[#003C71] px-3 py-3 text-white">
            <p className={cn(displayFace, "text-[18px] text-[#FF681D]")}>{step.day}</p>
            <p className="mt-1 text-[12px] leading-snug">{step.who}</p>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-[12px] leading-snug text-[#5C6B7A]">
        Decide the freight mode, and update the planned port and planned date.
      </p>
    </figure>
  )
}
