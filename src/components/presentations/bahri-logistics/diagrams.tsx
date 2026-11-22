import {
  ArrowLeftRight,
  BadgeCheck,
  CircleDollarSign,
  FileText,
  MessagesSquare,
  Package,
  Scale,
  ScrollText,
  Search,
  Ship,
  Truck,
  UserCheck,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { qrSteps, routes, rules } from "./sample-data"
import { displayFace } from "./theme"

const mipsLane: { label: string; Icon: LucideIcon }[] = [
  { label: "Requisition", Icon: FileText },
  { label: "Enquiry", Icon: Search },
  { label: "Supplier quotations", Icon: MessagesSquare },
  { label: "Supplier selection", Icon: UserCheck },
  { label: "Purchase order", Icon: ScrollText },
  { label: "Order confirmation", Icon: BadgeCheck },
]

const moduleLane: { label: string; Icon: LucideIcon }[] = [
  { label: "Packing details", Icon: Package },
  { label: "Quotations and award", Icon: Scale },
  { label: "Collection", Icon: Truck },
  { label: "Handovers", Icon: ArrowLeftRight },
  { label: "Delivery", Icon: Ship },
  { label: "Costs", Icon: CircleDollarSign },
]

function Lane({
  name,
  tone,
  steps,
}: {
  name: string
  tone: "navy" | "white"
  steps: { label: string; Icon: LucideIcon }[]
}) {
  return (
    <div className="grid min-h-0 flex-1 gap-2 lg:grid-cols-[9.5rem_minmax(0,1fr)]">
      <div
        className={cn(
          "flex items-center px-3 py-2",
          tone === "navy" ? "bg-[#003C71] text-white" : "bg-white text-[#003C71] ring-1 ring-[#003C71]/15"
        )}
      >
        <p className={cn(displayFace, "text-[13px] tracking-[0.12em] uppercase")}>{name}</p>
      </div>
      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {steps.map((step, index) => (
          <li
            key={step.label}
            className="relative flex flex-col justify-center gap-1.5 bg-white px-2.5 py-3 ring-1 ring-[#003C71]/12"
          >
            <step.Icon className="size-4 text-[#003C71]" aria-hidden />
            <span className="text-[12px] leading-tight font-medium text-[#003C71]">{step.label}</span>
            {index < steps.length - 1 ? (
              <span className="absolute top-2 right-1.5 hidden text-[11px] text-[#FF681D] lg:inline" aria-hidden>
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  )
}

export function BoundaryDiagram() {
  return (
    <figure className="flex h-full flex-col gap-2.5 text-[#003C71] lg:min-h-0">
      <Lane name="MIPS" tone="navy" steps={mipsLane} />
      <div className="flex items-center gap-3 bg-[#FF681D] px-4 py-3 text-[#003C71]">
        <span className={cn(displayFace, "grid size-11 shrink-0 place-items-center bg-white text-[16px]")}>
          LX
        </span>
        <div>
          <p className={cn(displayFace, "text-[11px] tracking-[0.14em] uppercase")}>Integration</p>
          <p className="mt-0.5 text-[14px] leading-snug font-medium">
            When the purchase order reaches LX, ready with supplier, the shipment appears in the Logistics Module automatically.
          </p>
        </div>
      </div>
      <Lane name="Logistics Module" tone="white" steps={moduleLane} />
      <div className="bg-[#003C71] px-4 py-3 text-white">
        <p className={cn(displayFace, "text-[11px] tracking-[0.14em] text-[#FF681D] uppercase")}>
          Back to MIPS
        </p>
        <ul className="mt-2 grid gap-2 sm:grid-cols-3">
          {[
            ["LA", "Collection by the freight forwarder"],
            ["PD", "Partly delivered"],
            ["RV", "Received"],
          ].map(([code, label]) => (
            <li key={code} className="bg-white/10 px-3 py-2">
              <span className={cn(displayFace, "text-[14px] text-[#FF681D]")}>{code}</span>
              <span className="mt-0.5 block text-[12px] leading-snug">{label}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[13px] leading-snug text-white/85">
          These statuses update automatically. The Purchase Officer is notified to close or update the purchase order.
        </p>
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
