import { Bell, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { quotes, shipments } from "./sample-data"
import { displayFace } from "./theme"
import { BahriMark, NoteBar, PriorityDot, SampleBadge, StagePill } from "./ui"

function AppBar({ title, person }: { title: string; person: string }) {
  return (
    <div className="flex items-center justify-between bg-[#003C71] px-3 py-2 text-white">
      <div className="flex items-center gap-2">
        <BahriMark plate className="h-5 w-5" />
        <span className={cn(displayFace, "text-[12px]")}>{title}</span>
      </div>
      <span className="text-[11px] text-white/80">{person}</span>
    </div>
  )
}

export function DashboardMock({ annotated = false }: { annotated?: boolean }) {
  return (
    <figure className="relative flex h-full min-h-[280px] flex-col overflow-hidden bg-white ring-1 ring-[#003C71]/15">
      <AppBar title="Logistics" person="Hanan Amoudi" />
      <div className="flex items-center justify-between gap-3 border-b border-[#003C71]/10 px-3 py-2">
        <SampleBadge />
        <div className="flex flex-wrap gap-1">
          {["Ready with supplier", "Planning", "Collected", "With agent", "Received"].map(
            (stage) => (
              <span
                key={stage}
                className={cn(
                  "px-1.5 py-0.5 text-[10px] font-medium",
                  stage === "Collected"
                    ? "bg-[#003C71] text-white"
                    : "bg-[#F4F6F8] text-[#003C71]"
                )}
              >
                {stage}
              </span>
            )
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-[12px] text-[#003C71]">
          <thead className="bg-[#F4F6F8] text-[10px] tracking-[0.12em] text-[#5C6B7A] uppercase">
            <tr>
              {["Shipment", "Vessels", "Purchase orders", "Route", "Mode", "Stage", "Priority"].map(
                (col) => (
                  <th key={col} className="px-2.5 py-2 font-semibold">
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {shipments.map((row) => (
              <tr key={row.ref} className="border-t border-[#003C71]/10">
                <td className={cn(displayFace, "px-2.5 py-2 text-[12px]")}>{row.ref}</td>
                <td className="px-2.5 py-2">{row.vessels}</td>
                <td className="px-2.5 py-2">{row.pos}</td>
                <td className="px-2.5 py-2">{row.route}</td>
                <td className="px-2.5 py-2">{row.mode}</td>
                <td className="px-2.5 py-2">
                  <StagePill stage={row.stage} />
                </td>
                <td className="px-2.5 py-2">
                  <PriorityDot priority={row.priority} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {annotated ? (
        <div className="mt-auto">
          <NoteBar
            notes={[
              "Stages show where the shipment is.",
              "One shipment can hold many purchase orders and vessels.",
            ]}
          />
        </div>
      ) : null}
    </figure>
  )
}

const statusRows = [
  { code: "LX", label: "Ready with supplier", place: "Kampen" },
  { code: "OK", label: "Quotation approved", place: "Bahri office" },
  { code: "LA", label: "Collected by GAC", place: "Kampen" },
  { code: "AWB", label: "Departed · 176-44021863", place: "Amsterdam" },
  { code: "Agent", label: "With the destination agent", place: "Singapore" },
]

export function ShipmentDetailMock({ annotated = false }: { annotated?: boolean }) {
  return (
    <figure className="relative flex h-full min-h-[320px] flex-col overflow-hidden bg-white ring-1 ring-[#003C71]/15">
      <AppBar title="Shipment BHR-SG-0142" person="Vendor & Logistics" />
      <div className="border-b border-[#003C71]/10 px-3 py-2">
        <div className="flex items-center justify-between gap-2">
          <SampleBadge />
          <PriorityDot priority="Urgent" />
        </div>
        <p className={cn(displayFace, "mt-1.5 text-[15px] text-[#003C71]")}>
          BAHRI ABHA · PO 662-04155
        </p>
        <p className="text-[12px] text-[#5C6B7A]">
          Wärtsilä · Air · Door-to-port · Kampen → Singapore
        </p>
        <p className="mt-1 text-[11px] text-[#003C71]">
          Next ports: Jeddah, Sohar, Jebel Ali
        </p>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-[1.2fr_0.8fr]">
        <ol className="space-y-1.5 overflow-hidden border-r border-[#003C71]/10 p-3">
          {statusRows.map((step, i) => (
            <li key={step.code} className="flex gap-2">
              <span className="flex flex-col items-center">
                <span
                  className={cn(
                    "grid size-5 place-items-center text-[9px] font-bold",
                    i === statusRows.length - 1
                      ? "bg-[#FF681D] text-[#003C71]"
                      : "bg-[#003C71] text-white"
                  )}
                >
                  {i + 1}
                </span>
                {i < statusRows.length - 1 ? (
                  <span className="mt-1 h-3 w-px bg-[#003C71]/20" />
                ) : null}
              </span>
              <span>
                <span className="block text-[12px] font-medium text-[#003C71]">
                  {step.code} · {step.label}
                </span>
                <span className="block text-[10px] text-[#5C6B7A]">{step.place}</span>
              </span>
            </li>
          ))}
        </ol>
        <div className="space-y-2 p-3 text-[12px] text-[#003C71]">
          <p className={cn(displayFace, "text-[11px] tracking-[0.12em] uppercase")}>
            Costs
          </p>
          {[
            ["Freight forwarder", "USD 1,910 actual"],
            ["Agent", "USD 240 actual"],
            ["Customs and import", "USD 160 actual"],
            ["Final actual", "USD 2,310"],
          ].map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between gap-2 border-b border-[#003C71]/10 pb-1">
              <span className="text-[#5C6B7A]">{label}</span>
              <span className={cn(label === "Final actual" && "font-semibold")}>{value}</span>
            </div>
          ))}
          <p className="text-[10px] leading-snug text-[#5C6B7A]">
            Quoted freight was USD 1,840. The final figure follows the actual invoice.
          </p>
        </div>
      </div>
      {annotated ? (
        <NoteBar
          notes={[
            "Status history records each step and place.",
            "The final cost comes from the actual invoices.",
          ]}
        />
      ) : null}
    </figure>
  )
}

const packingFields = [
  ["Supplier", "Wärtsilä"],
  ["Purchase order", "662-04155"],
  ["Vessel", "BAHRI ABHA"],
  ["Packages", "2"],
  ["Size", "120 × 80 × 75 cm"],
  ["Gross weight", "62 kg"],
  ["Collection", "Kampen, Netherlands"],
  ["Ready for collection", "Yes"],
  ["Lead time", "Changed. Team notified."],
]

export function PackingFormMock({ annotated = false }: { annotated?: boolean }) {
  return (
    <figure className="relative flex h-full flex-col overflow-hidden bg-white ring-1 ring-[#003C71]/15">
      <AppBar title="Packing details" person="Wärtsilä" />
      <div className="flex items-center justify-between px-3 pt-2">
        <SampleBadge />
        <span className="text-[10px] font-medium text-[#5C6B7A]">Supplier</span>
      </div>
      <dl className="px-3 py-2">
        {packingFields.map(([label, value]) => (
          <div
            key={label}
            className="flex items-baseline justify-between gap-3 border-b border-[#003C71]/10 py-1.5"
          >
            <dt className="text-[10px] tracking-[0.08em] text-[#5C6B7A] uppercase">{label}</dt>
            <dd className="text-right text-[12px] text-[#003C71]">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-auto px-3 pt-2 pb-3">
        <div className={cn(displayFace, "bg-[#003C71] px-3 py-2 text-center text-[12px] text-white")}>
          Save packing details
        </div>
      </div>
      {annotated ? (
        <NoteBar notes={["Dimensions, weight, and the collection address."]} />
      ) : null}
    </figure>
  )
}

export function QuoteComparisonMock({
  annotated = false,
  layout = "columns",
}: {
  annotated?: boolean
  layout?: "columns" | "stack"
}) {
  return (
    <figure className="relative flex h-full flex-col overflow-hidden bg-white ring-1 ring-[#003C71]/15">
      <AppBar title="Freight quotations" person="Noor Mohideen" />
      <div className="border-b border-[#003C71]/10 px-3 py-2">
        <div className="flex items-center justify-between gap-2">
          <SampleBadge />
          <span className="text-[10px] font-semibold text-[#003C71]">Awaiting approval</span>
        </div>
        <p className="mt-1 text-[12px] text-[#003C71]">
          {layout === "stack"
            ? "BHR-JD-0208 · Busan → Jeddah · Sea"
            : "BHR-JD-0208 · BAHRI JAZAN, BAHRI HOFUF · Busan → Jeddah · Sea"}
        </p>
      </div>
      <div
        className={cn(
          "grid min-h-0 gap-2 p-3",
          layout === "columns" ? "flex-1 grid-cols-3" : "grid-cols-1 overflow-hidden"
        )}
      >
        {quotes.map((quote) =>
          layout === "stack" ? (
            <div
              key={quote.name}
              className={cn(
                "border px-2 py-1.5",
                quote.state === "selected"
                  ? "border-[#FF681D] bg-[#FFF8F4]"
                  : "border-[#003C71]/15"
              )}
            >
              <div className="flex items-baseline justify-between gap-2">
                <p className={cn(displayFace, "text-[13px]")}>{quote.name}</p>
                <p className="text-[12px] font-semibold">{quote.amount}</p>
              </div>
              <p className="text-[11px] text-[#5C6B7A]">
                {quote.carrier} · {quote.transit} · {quote.basis}
                {quote.state === "selected" ? " · Selected, not awarded" : ""}
              </p>
            </div>
          ) : (
            <div
              key={quote.name}
              className={cn(
                "flex flex-col border p-2.5",
                quote.state === "selected"
                  ? "border-[#FF681D] bg-[#FFF8F4]"
                  : "border-[#003C71]/15"
              )}
            >
              <p className={cn(displayFace, "text-[14px] text-[#003C71]")}>{quote.name}</p>
              <p className="text-[11px] text-[#5C6B7A]">{quote.carrier}</p>
              <dl className="mt-2 space-y-1 text-[11px] text-[#003C71]">
                <div className="flex justify-between gap-2">
                  <dt className="text-[#5C6B7A]">Transit</dt>
                  <dd>{quote.transit}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-[#5C6B7A]">Basis</dt>
                  <dd>{quote.basis}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-[#5C6B7A]">Quoted</dt>
                  <dd className="font-semibold">{quote.amount}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-[#5C6B7A]">Destination</dt>
                  <dd>{quote.destination}</dd>
                </div>
              </dl>
              {quote.state === "selected" ? (
                <p className="mt-auto pt-2 text-[10px] font-semibold text-[#003C71]">
                  Selected. Not awarded yet.
                </p>
              ) : null}
            </div>
          )
        )}
      </div>
      <div className="px-3 pb-3">
        <div className={cn(displayFace, "bg-[#FF681D] px-3 py-2 text-center text-[12px] text-[#003C71]")}>
          Send for approval
        </div>
      </div>
      {annotated ? (
        <NoteBar notes={["Approval is required before the award."]} />
      ) : null}
    </figure>
  )
}

export function QrPhoneMock({
  kind,
  annotated = false,
}: {
  kind: "collection" | "vessel"
  annotated?: boolean
}) {
  const collection = kind === "collection"
  return (
    <figure className="relative mx-auto w-full max-w-[280px]">
      <div className="overflow-hidden border-[6px] border-[#001F3D] bg-white">
        <div className="flex items-center justify-between bg-[#003C71] px-3 py-2 text-white">
          <span className="inline-flex items-center gap-2">
            <BahriMark plate className="h-4 w-4" />
            <span className={cn(displayFace, "text-[12px]")}>
              {collection ? "Collection scan" : "On-board scan"}
            </span>
          </span>
          <span className="text-[10px] text-white/75">Mobile</span>
        </div>
        <div className="space-y-2 p-3 text-[12px] text-[#003C71]">
          <SampleBadge />
          <div className="grid h-16 place-items-center border border-dashed border-[#003C71]/30 bg-[#F4F6F8] text-[10px] tracking-[0.14em] uppercase">
            Package QR
          </div>
          <p className={cn(displayFace, "text-[14px]")}>BAHRI ABHA</p>
          <p>PO 662-04155 · Ship spares in transit</p>
          <p className="text-[#5C6B7A]">
            {collection
              ? "From Wärtsilä to GAC · Kampen · 2 of 2 packages"
              : "From the agent to the vessel · Singapore · 2 of 2 packages"}
          </p>
          <div className="grid grid-cols-3 gap-1 text-center text-[10px] font-semibold">
            {["In order", "Damaged", "Short"].map((label, i) => (
              <span
                key={label}
                className={cn(
                  "border px-1 py-1.5",
                  i === 0
                    ? "border-[#003C71] bg-[#003C71] text-white"
                    : "border-[#003C71]/20"
                )}
              >
                {label}
              </span>
            ))}
          </div>
          <p className="border border-[#003C71]/15 bg-[#F4F6F8] px-2 py-1.5 text-[11px] text-[#5C6B7A]">
            {collection ? "Crates sealed. Photo attached." : "Both packages on board. Photo attached."}
          </p>
          <div className={cn(displayFace, "bg-[#FF681D] px-2 py-2 text-center text-[12px] text-[#003C71]")}>
            {collection ? "Confirm collection · LA" : "Confirm receipt · RV"}
          </div>
        </div>
      </div>
      {annotated ? (
        <NoteBar
          notes={[
            collection
              ? "The scan records time, place, person, photo, and notes."
              : "Damage or a short delivery is flagged on the scan.",
          ]}
        />
      ) : null}
    </figure>
  )
}

const messages = [
  {
    who: "Noor Mohideen",
    text: "Pre-alert sent to the Singapore agent and the Purchase Officer.",
  },
  {
    who: "GAC",
    text: "AWB 176-44021863 uploaded. Collection scan is on the shipment.",
  },
  {
    who: "Wärtsilä",
    text: "Both packages handed over at Kampen.",
  },
]

export function ChatMock({ annotated = false }: { annotated?: boolean }) {
  return (
    <figure className="relative flex h-full min-h-[280px] flex-col overflow-hidden bg-white ring-1 ring-[#003C71]/15">
      <AppBar title="BHR-SG-0142" person="Chat" />
      <div className="border-b border-[#003C71]/10 px-3 py-2">
        <div className="flex items-center justify-between">
          <SampleBadge />
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#003C71]">
            <Bell className="size-3.5" aria-hidden />2 new
          </span>
        </div>
        <ul className="mt-2 space-y-1">
          <li className="bg-[#FFF1EA] px-2 py-1 text-[11px] text-[#003C71]">
            Pre-alert: PO 662-04155 · BAHRI ABHA · Singapore
          </li>
          <li className="bg-[#F4F6F8] px-2 py-1 text-[11px] text-[#003C71]">
            Reminder: BHR-JD-0208 is still with the agent
          </li>
        </ul>
      </div>
      <ul className="space-y-2 p-3">
        {messages.map((message) => (
          <li key={message.who} className="text-[12px]">
            <p className="inline-flex items-center gap-1 font-semibold text-[#003C71]">
              <MessageSquare className="size-3" aria-hidden />
              {message.who}
            </p>
            <p className="mt-0.5 text-[#003C71]/90">{message.text}</p>
          </li>
        ))}
      </ul>
      {annotated ? (
        <NoteBar notes={["Chat and notifications stay on the shipment."]} />
      ) : null}
    </figure>
  )
}
