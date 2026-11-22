import type { ReactNode } from "react"
import {
  BoundaryDiagram,
  EscalationDiagram,
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
import { rules } from "./sample-data"
import { bahriBody, bahriDisplay } from "./theme"

const captures: { id: string; width: number; node: ReactNode }[] = [
  { id: "mock-dashboard", width: 1280, node: <DashboardMock annotated /> },
  { id: "mock-shipment-detail", width: 980, node: <ShipmentDetailMock annotated /> },
  { id: "mock-packing-form", width: 460, node: <PackingFormMock annotated /> },
  {
    id: "mock-quote-comparison",
    width: 1100,
    node: <QuoteComparisonMock annotated layout="columns" />,
  },
  { id: "mock-qr-collection", width: 420, node: <QrPhoneMock kind="collection" annotated /> },
  { id: "mock-qr-vessel", width: 420, node: <QrPhoneMock kind="vessel" annotated /> },
  { id: "mock-chat-notifications", width: 520, node: <ChatMock annotated /> },
  { id: "diagram-mips-boundary", width: 1280, node: <BoundaryDiagram /> },
  { id: "diagram-qr-chain", width: 1200, node: <QrChainDiagram /> },
  { id: "diagram-routes", width: 1100, node: <RoutesDiagram /> },
  { id: "diagram-escalation", width: 980, node: <EscalationDiagram /> },
  ...rules.map((rule) => ({
    id: `diagram-rule-${rule.id}`,
    width: 420,
    node: <RuleDiagram ruleId={rule.id} />,
  })),
]

export function BahriLogisticsCaptureBoard() {
  return (
    <div className={`${bahriBody.className} ${bahriBody.variable} ${bahriDisplay.variable} bg-white`}>
      <div className="mx-auto flex w-fit flex-col gap-16 py-16">
        {captures.map((capture) => (
          <div key={capture.id} data-capture={capture.id} className="bg-white p-8" style={{ width: capture.width }}>
            {capture.node}
          </div>
        ))}
      </div>
    </div>
  )
}

export const captureIds = captures.map((capture) => capture.id)
