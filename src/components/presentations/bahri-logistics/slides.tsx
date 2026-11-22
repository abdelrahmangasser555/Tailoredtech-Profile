import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import {
  BoundaryDiagram,
  QrChainDiagram,
  RoutesDiagram,
  RuleDiagram,
} from "./diagrams"
import {
  ChatMock,
  DashboardMock,
  PackingFormMock,
  QrPhoneMock,
  QuoteComparisonMock,
  ShipmentDetailMock,
} from "./mocks"
import {
  parties,
  questions,
  requirements,
  rules,
  trackedItems,
} from "./sample-data"
import { displayFace } from "./theme"
import { BahriMark, CheckMark } from "./ui"

export type Mode = "deck" | "doc"

const TOTAL = 11

function Logo({
  invert = false,
  mark = false,
  className,
}: {
  invert?: boolean
  mark?: boolean
  className?: string
}) {
  return (
    // Local Bahri SVG. next/image skips SVG unless dangerouslyAllowSVG is set.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={
        mark
          ? "/presentations/bahri-logistics/bahri-mark.svg"
          : "/presentations/bahri-logistics/bahri-lockup.svg"
      }
      alt={mark ? "" : "Bahri"}
      className={cn("w-auto", invert && "brightness-0 invert", className)}
    />
  )
}

function Shell({
  mode,
  index,
  kicker,
  title,
  lede,
  children,
}: {
  mode: Mode
  index: number
  kicker: string
  title: string
  lede?: string
  children: ReactNode
}) {
  const deck = mode === "deck"
  return (
    <article
      className={cn(
        "flex flex-col bg-[#F4F6F8] text-[#003C71]",
        deck ? "h-full overflow-hidden" : "min-h-svh border-b border-[#003C71]/10"
      )}
    >
      <div className="h-[3px] bg-[#FF681D]" />
      <header className={cn(deck ? "px-8 pt-4" : "px-5 pt-5")}>
        <div className="flex items-center justify-between gap-4">
          <Logo className="h-7" />
          <span className={cn(displayFace, "text-[12px] text-[#5C6B7A]")}>
            {String(index).padStart(2, "0")}
          </span>
        </div>
        <p className={cn(displayFace, "mt-3 text-[11px] tracking-[0.16em] text-[#FF681D] uppercase")}>
          {kicker}
        </p>
        <h2 className={cn(displayFace, deck ? "mt-1 text-[30px] leading-none" : "mt-1 text-[26px] leading-tight")}>
          {title}
        </h2>
        {lede ? (
          <p className={cn("mt-1.5 max-w-4xl text-[#5C6B7A]", deck ? "text-[14px]" : "text-[15px] leading-relaxed")}>
            {lede}
          </p>
        ) : null}
      </header>
      <div className={cn("min-h-0 flex-1", deck ? "px-8 py-3" : "px-5 py-4")}>{children}</div>
      <footer
        className={cn(
          "flex items-center justify-between text-[11px] text-[#5C6B7A]",
          deck ? "px-8 pb-3.5" : "px-5 pb-5"
        )}
      >
        <span>Prepared by TailoredTech</span>
        <span>
          {String(index).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
        </span>
      </footer>
    </article>
  )
}

function Cover({ mode }: { mode: Mode }) {
  if (mode === "doc") {
    return (
      <article className="min-h-svh bg-[#F4F6F8] text-[#003C71]">
        <div className="bg-[#003C71] px-5 py-8 text-white">
          <BahriMark plate className="h-14 w-14" />
          <p className={cn(displayFace, "mt-8 text-[12px] tracking-[0.16em] text-[#FF681D] uppercase")}>
            Vendor & Logistics
          </p>
          <h1 className={cn(displayFace, "mt-2 text-[34px] leading-[1.05]")}>
            Bahri Logistics Module
          </h1>
          <p className="mt-2 text-[18px] text-white/80">Walkthrough & Orientation</p>
        </div>
        <div className="px-5 py-6">
          <p className="text-[12px] tracking-[0.14em] text-[#5C6B7A] uppercase">Prepared for</p>
          <p className={cn(displayFace, "mt-2 text-[20px]")}>Hanan Amoudi</p>
          <p className="text-[14px] text-[#5C6B7A]">Sr. Manager, Vendor & Logistics</p>
          <p className={cn(displayFace, "mt-4 text-[20px]")}>Noor Mohideen</p>
          <p className="text-[14px] text-[#5C6B7A]">Vendor & Logistics</p>
          <p className="mt-8 text-[13px] text-[#5C6B7A]">Prepared by TailoredTech</p>
        </div>
      </article>
    )
  }

  return (
    <article className="grid h-full grid-cols-[460px_1fr] bg-white text-[#003C71]">
      <div className="flex flex-col justify-between bg-[#003C71] px-10 py-10 text-white">
        <BahriMark plate className="h-20 w-20" />
        <div>
          <p className={cn(displayFace, "text-[12px] tracking-[0.18em] text-[#FF681D] uppercase")}>
            Vendor & Logistics
          </p>
          <p className="mt-4 text-[13px] text-white/70">Prepared by TailoredTech</p>
        </div>
      </div>
      <div className="flex flex-col justify-between px-12 py-10">
        <Logo className="h-10" />
        <div>
          <h1 className={cn(displayFace, "text-[54px] leading-[0.98]")}>
            Bahri Logistics
            <br />
            Module
          </h1>
          <p className={cn(displayFace, "mt-4 text-[26px] text-[#FF681D]")}>
            Walkthrough & Orientation
          </p>
          <div className="mt-6 h-px w-24 bg-[#003C71]/20" />
          <p className="mt-6 text-[12px] tracking-[0.14em] text-[#5C6B7A] uppercase">Prepared for</p>
          <div className="mt-3 grid grid-cols-2 gap-6">
            <div>
              <p className={cn(displayFace, "text-[18px]")}>Hanan Amoudi</p>
              <p className="text-[13px] text-[#5C6B7A]">Sr. Manager, Vendor & Logistics</p>
            </div>
            <div>
              <p className={cn(displayFace, "text-[18px]")}>Noor Mohideen</p>
              <p className="text-[13px] text-[#5C6B7A]">Vendor & Logistics</p>
            </div>
          </div>
        </div>
        <p className="text-[12px] text-[#5C6B7A]">01 / {String(TOTAL).padStart(2, "0")}</p>
      </div>
    </article>
  )
}

function Overview({ mode }: { mode: Mode }) {
  const deck = mode === "deck"
  return (
    <Shell
      mode={mode}
      index={2}
      kicker="The module"
      title="A web platform and a mobile application"
      lede="The Logistics Module is a cloud-based web platform, plus a mobile application."
    >
      <div className={cn("grid gap-3", deck ? "h-full grid-rows-[auto_minmax(0,1fr)]" : "")}>
        <div className={cn("grid gap-3", deck ? "grid-cols-2" : "grid-cols-1")}>
          <div className="bg-white p-3.5 ring-1 ring-[#003C71]/10">
            <p className={cn(displayFace, "text-[12px] text-[#FF681D]")}>01 · Web platform</p>
            <p className={cn(displayFace, "mt-1 text-[18px]")}>For the Bahri office</p>
            <p className="mt-1 text-[13px] leading-snug text-[#5C6B7A]">
              Shipments, quotations, approvals, costs, documents, chat, and reports.
            </p>
          </div>
          <div className="bg-[#003C71] p-3.5 text-white">
            <p className={cn(displayFace, "text-[12px] text-[#FF681D]")}>02 · Mobile application</p>
            <p className={cn(displayFace, "mt-1 text-[18px]")}>Vessels, agents, freight forwarders</p>
            <p className="mt-1 text-[13px] leading-snug text-white/75">
              QR scans, updates, and notifications.
            </p>
          </div>
        </div>
        <DashboardMock annotated={deck} />
      </div>
    </Shell>
  )
}

function Parties({ mode }: { mode: Mode }) {
  const deck = mode === "deck"
  return (
    <Shell mode={mode} index={3} kicker="People" title="Who uses the module, and for what">
      <ul className={cn("grid gap-2", deck ? "h-full grid-cols-3 grid-rows-3" : "grid-cols-1")}>
        {parties.map((party) => (
          <li key={party.role} className="flex flex-col bg-white px-3 py-2.5 ring-1 ring-[#003C71]/10">
            <p className={cn(displayFace, "text-[14px] leading-tight")}>{party.role}</p>
            <p className="mt-0.5 text-[11px] text-[#5C6B7A]">{party.who}</p>
            <ul className="mt-1.5 space-y-0.5">
              {party.points.map((point) => (
                <li key={point} className="flex gap-1.5 text-[12px] leading-snug">
                  <span className="mt-[7px] size-1 shrink-0 bg-[#FF681D]" aria-hidden />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </Shell>
  )
}

function Tracking({ mode }: { mode: Mode }) {
  const deck = mode === "deck"
  return (
    <Shell
      mode={mode}
      index={4}
      kicker="Tracking"
      title="What each shipment keeps"
      lede="A shipment can group many purchase orders and many vessels."
    >
      <div className={cn("grid gap-2.5", deck ? "h-full grid-rows-[auto_minmax(0,1fr)]" : "")}>
        <ul className="flex flex-wrap gap-1.5">
          {trackedItems.map((item) => (
            <li
              key={item}
              className="inline-flex items-center gap-1.5 bg-white px-2 py-1 text-[11px] ring-1 ring-[#003C71]/10"
            >
              <CheckMark className="size-3.5" />
              {item}
            </li>
          ))}
        </ul>
        <div className={cn("grid gap-2", deck ? "min-h-0 grid-cols-4" : "grid-cols-1")}>
          <PackingFormMock />
          <QuoteComparisonMock layout="stack" />
          <ShipmentDetailMock />
          <ChatMock />
        </div>
      </div>
    </Shell>
  )
}

function Requirements({ mode }: { mode: Mode }) {
  return (
    <Shell
      mode={mode}
      index={5}
      kicker="What the module provides"
      title="Requirements that will be met"
    >
      <ul className={cn("grid gap-2", mode === "deck" ? "h-full grid-cols-2" : "grid-cols-1")}>
        {requirements.map((item) => (
          <li
            key={item}
            className="flex items-center gap-2.5 bg-white px-3 py-2 ring-1 ring-[#003C71]/10"
          >
            <CheckMark />
            <span className="text-[14px] leading-snug">{item}</span>
          </li>
        ))}
      </ul>
    </Shell>
  )
}

function Responsibilities({ mode }: { mode: Mode }) {
  return (
    <Shell
      mode={mode}
      index={6}
      kicker="MIPS and this module"
      title="Where the work sits"
      lede="MIPS keeps the purchase order. The Logistics Module keeps the movement."
    >
      <div className={mode === "deck" ? "h-full" : ""}>
        <BoundaryDiagram />
      </div>
    </Shell>
  )
}

function Qr({ mode }: { mode: Mode }) {
  const deck = mode === "deck"
  return (
    <Shell
      mode={mode}
      index={7}
      kicker="Handover"
      title="QR labels on every package"
      lede="The freight forwarder, the agent, and the vessel each scan at their handover."
    >
      <div className={cn("grid gap-3", deck ? "h-full grid-rows-[auto_minmax(0,1fr)]" : "")}>
        <QrChainDiagram />
        <div className={cn("grid items-end gap-6", deck ? "grid-cols-2 px-16" : "grid-cols-1")}>
          <div>
            <QrPhoneMock kind="collection" />
            <p className="mt-2 text-center text-[12px] text-[#5C6B7A]">
              Collection from the supplier sets LA. Time, place, person, photo, and notes.
            </p>
          </div>
          <div>
            <QrPhoneMock kind="vessel" />
            <p className="mt-2 text-center text-[12px] text-[#5C6B7A]">
              Receipt on board sets RV, or PD when delivery is partial. Damage and short delivery are flagged.
            </p>
          </div>
        </div>
      </div>
    </Shell>
  )
}

function Questions({ mode }: { mode: Mode }) {
  return (
    <Shell
      mode={mode}
      index={8}
      kicker="To confirm with Bahri"
      title="Questions we need answered"
    >
      <ol className={cn("grid gap-2", mode === "deck" ? "h-full grid-cols-2" : "grid-cols-1")}>
        {questions.map((question, index) => (
          <li key={question} className="flex gap-3 bg-white px-3 py-2.5 ring-1 ring-[#003C71]/10">
            <span className={cn(displayFace, "text-[16px] text-[#FF681D]")}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="text-[14px] leading-snug">{question}</p>
          </li>
        ))}
      </ol>
    </Shell>
  )
}

function Constraints({ mode }: { mode: Mode }) {
  const deck = mode === "deck"
  return (
    <Shell
      mode={mode}
      index={9}
      kicker="Rules"
      title="How the module decides"
    >
      <div className={cn("grid gap-2", deck ? "h-full grid-rows-[auto_minmax(0,1fr)]" : "")}>
        <RoutesDiagram compact={deck} />
        <ul className={cn("grid gap-2", deck ? "min-h-0 grid-cols-3" : "grid-cols-1")}>
          {rules.map((rule) => (
            <li key={rule.id} className="min-h-0">
              <RuleDiagram ruleId={rule.id} />
            </li>
          ))}
        </ul>
      </div>
    </Shell>
  )
}

const together = [
  {
    n: "01",
    text: "Side-by-side development, in close collaboration with the Bahri team.",
  },
  {
    n: "02",
    text: "Extensive, iterative development, with regular reviews.",
  },
  {
    n: "03",
    text: "Bahri can request any requirement or change during development, without any commitment.",
  },
  {
    n: "04",
    text: "Our main goal is Bahri's satisfaction, and a product that meets Bahri's operational requirements.",
  },
]

function Together({ mode }: { mode: Mode }) {
  const deck = mode === "deck"
  return (
    <Shell mode={mode} index={10} kicker="Working together" title="How we will build this">
      <ol className={cn("grid gap-2.5", deck ? "h-full grid-cols-2 grid-rows-2" : "grid-cols-1")}>
        {together.map((item) => (
          <li key={item.n} className="flex items-center gap-4 bg-white px-5 py-4 ring-1 ring-[#003C71]/10">
            <span className={cn(displayFace, "text-[28px] text-[#FF681D]")}>{item.n}</span>
            <p className={cn(displayFace, deck ? "text-[22px] leading-snug" : "text-[20px] leading-snug")}>
              {item.text}
            </p>
          </li>
        ))}
      </ol>
    </Shell>
  )
}

const nextSteps = [
  { n: "01", title: "Review", text: "Review this walkthrough with the Vendor & Logistics team." },
  { n: "02", title: "Feedback", text: "Share comments, corrections, and anything to add." },
  { n: "03", title: "Start", text: "Meet to discuss the details and start development." },
]

function NextSteps({ mode }: { mode: Mode }) {
  const deck = mode === "deck"
  return (
    <Shell mode={mode} index={11} kicker="Closing" title="Next steps">
      <div className={cn("grid gap-3", deck ? "h-full grid-rows-[minmax(0,1fr)_auto]" : "")}>
        <ol className={cn("grid gap-3", deck ? "grid-cols-3" : "grid-cols-1")}>
          {nextSteps.map((step) => (
            <li key={step.n} className="flex flex-col justify-center bg-[#003C71] px-5 py-6 text-white">
              <span className={cn(displayFace, "text-[28px] text-[#FF681D]")}>{step.n}</span>
              <p className={cn(displayFace, "mt-3 text-[24px]")}>{step.title}</p>
              <p className="mt-2 text-[15px] leading-snug text-white/80">{step.text}</p>
            </li>
          ))}
        </ol>
        <p className="text-[13px] text-[#5C6B7A]">
          Prepared for Hanan Amoudi and Noor Mohideen, Bahri Vendor & Logistics. Prepared by TailoredTech.
        </p>
      </div>
    </Shell>
  )
}

export const slides: { id: string; label: string; render: (mode: Mode) => React.ReactNode }[] = [
  { id: "cover", label: "Cover", render: (mode) => <Cover mode={mode} /> },
  { id: "overview", label: "Overview", render: (mode) => <Overview mode={mode} /> },
  { id: "parties", label: "Parties", render: (mode) => <Parties mode={mode} /> },
  { id: "tracking", label: "Tracking", render: (mode) => <Tracking mode={mode} /> },
  { id: "requirements", label: "Requirements", render: (mode) => <Requirements mode={mode} /> },
  { id: "responsibilities", label: "MIPS", render: (mode) => <Responsibilities mode={mode} /> },
  { id: "qr", label: "QR flow", render: (mode) => <Qr mode={mode} /> },
  { id: "questions", label: "Questions", render: (mode) => <Questions mode={mode} /> },
  { id: "constraints", label: "Rules", render: (mode) => <Constraints mode={mode} /> },
  { id: "together", label: "Together", render: (mode) => <Together mode={mode} /> },
  { id: "next", label: "Next steps", render: (mode) => <NextSteps mode={mode} /> },
]
