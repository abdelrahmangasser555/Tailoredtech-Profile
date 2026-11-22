export const shipments = [
  {
    ref: "BHR-SG-0142",
    vessels: "BAHRI ABHA",
    pos: "662-04155",
    route: "Kampen → Singapore",
    mode: "Air",
    stage: "Collected",
    priority: "Urgent",
  },
  {
    ref: "BHR-JD-0208",
    vessels: "BAHRI JAZAN, BAHRI HOFUF",
    pos: "3 purchase orders",
    route: "Busan → Jeddah",
    mode: "Sea",
    stage: "With agent",
    priority: "Normal",
  },
  {
    ref: "BHR-SH-0177",
    vessels: "BAHRI HOFUF",
    pos: "662-04088",
    route: "Rotterdam → Sohar",
    mode: "Courier",
    priority: "Urgent",
    stage: "Planning",
  },
  {
    ref: "BHR-JB-0094",
    vessels: "BAHRI ABHA, BAHRI JAZAN",
    pos: "6 purchase orders",
    route: "Shanghai → Jebel Ali",
    mode: "Sea",
    stage: "Ready with supplier",
    priority: "Normal",
  },
] as const

export const quotes = [
  {
    name: "GAC",
    carrier: "HMM",
    transit: "18 days",
    basis: "per CBM",
    amount: "USD 2,840",
    destination: "Not included",
    state: "selected" as const,
  },
  {
    name: "DBS",
    carrier: "CMA CGM",
    transit: "21 days",
    basis: "per CBM",
    amount: "USD 3,110",
    destination: "Included",
    state: "received" as const,
  },
  {
    name: "Allcargo",
    carrier: "Hapag-Lloyd",
    transit: "16 days",
    basis: "All in",
    amount: "USD 3,450",
    destination: "Not included",
    state: "received" as const,
  },
] as const

export const trackedItems = [
  "Purchase order and vessel",
  "Supplier readiness (LX)",
  "Packing, dimensions, and weight",
  "Lead time and changes",
  "Freight forwarder quotations",
  "Mode: sea, air, courier, road",
  "Route, including via a hub",
  "Planned port, date, and next ports",
  "Each custody handover",
  "Forwarder, agent, and customs costs",
  "Final cost from actual invoices",
  "AWB and proof of delivery",
  "Status history",
  "Reminders",
  "Audit trail and chat",
] as const

export const parties = [
  {
    role: "Purchase Officer",
    who: "Bahri office",
    points: [
      "Owns the purchase order in MIPS",
      "Receives the pre-alert",
      "Notified to close or update the PO",
      "Asked when other fleets can ship together",
    ],
  },
  {
    role: "Vendor & Logistics",
    who: "Hanan Amoudi, Noor Mohideen",
    points: [
      "Chooses mode, route, and consolidation",
      "Runs quotations, approval, and award",
      "Follows collection through to delivery",
      "Holds documents, costs, and the pre-alert",
    ],
  },
  {
    role: "Suppliers",
    who: "Pre-registered vendors",
    points: [
      "Confirms readiness and packing details",
      "Sends dimensions, weight, and collection address",
      "Reports a lead-time change",
      "Prints the QR label and hands over the goods",
    ],
  },
  {
    role: "Freight forwarders",
    who: "Pre-registered",
    points: [
      "Submits a quotation, or is instructed on a contract rate",
      "Collects from the supplier and handles export formalities",
      "Scans the QR code at collection",
      "Uploads the AWB and updates the movement",
    ],
  },
  {
    role: "Agents and hub",
    who: "Origin, destination, and hub",
    points: [
      "Stores and consolidates goods at the hub",
      "Clears import and records local charges",
      "Scans on receipt from the freight forwarder",
      "Hands the goods to the vessel",
    ],
  },
  {
    role: "Vessel",
    who: "Master and crew",
    points: [
      "Sees incoming shipments for the vessel",
      "Scans the QR code when goods come on board",
      "Reports damage or a short delivery",
    ],
  },
  {
    role: "Vessel Superintendent",
    who: "Fleet",
    points: [
      "Views shipments for the fleet",
      "Can request air freight",
      "Confirms the destination when needed",
    ],
  },
  {
    role: "Finance",
    who: "Needs proof of delivery",
    points: [
      "Uses the handover record to settle invoices",
      "Sees the final actual cost",
    ],
  },
  {
    role: "Management",
    who: "Escalation when goods sit with an agent",
    points: [
      "60 days: Head of O&M Purchasing",
      "90 days: Director O&M Procurement",
      "150 days: President",
      "Decide the mode and update planned port and date",
    ],
  },
] as const

export const requirements = [
  "Courier when the shipment is 75 kg or under",
  "Consolidation with other fleets on the same route",
  "A contract rate skips freight forwarder quotations",
  "Approval is recorded before the award",
  "Pre-alert to the destination agent and the Purchase Officer",
  "Final cost is taken from the actual invoices",
  "Reminders when a follow-up is due",
  "Escalation when goods stay with an agent past 60, 90, and 150 days",
  "An audit record of changes, scans, approvals, and messages",
  "A chat room on every shipment",
  "Reports and dashboards for the open movements",
  "A mobile application for scans, updates, and notifications",
  "Email and in-app notifications",
  "Access set by role",
] as const

export const questions = [
  "What do the statuses LT, LF, and PO mean, and who sets each one?",
  "Please confirm what O, OX, and DA mean, and who sets each one.",
  "Does logistics start automatically when a purchase order reaches LX (ready with supplier)?",
  "Should the Logistics Module update statuses in MIPS automatically?",
  "Which hubs and agents are in use, and which freight forwarders have a contract rate?",
  "Who approves logistics spend, and what are the limits?",
  "Where do the vessel’s next ports come from?",
  "Can the crew scan QR codes on board?",
  "How should suppliers sign in? Is vendor.bahri.sa the right place?",
  "What are the requirements for hosting, security, and sign-in?",
] as const

export const rules = [
  {
    id: "courier",
    title: "Courier",
    when: "75 kg or under, or the shipment is urgent",
    then: "Use courier. At 75 kg or under, courier is preferred.",
  },
  {
    id: "contract",
    title: "Contract rate",
    when: "A contract rate is already in place",
    then: "Skip quotations. Instruct that freight forwarder.",
  },
  {
    id: "consolidate",
    title: "Consolidation",
    when: "Other fleets have orders on the same route",
    then: "Group them into one shipment.",
  },
  {
    id: "lead",
    title: "Lead time",
    when: "The supplier changes the lead time",
    then: "Re-plan the shipment and notify the people involved.",
  },
  {
    id: "partial",
    title: "Partial delivery",
    when: "Only part of the order is received on board",
    then: "Mark PD, partly delivered. Keep the balance open.",
  },
  {
    id: "reroute",
    title: "Re-routing",
    when: "A supplier quote carries a conflict-zone clause",
    then: "Re-route, for example around Hormuz, the Red Sea, or Suez.",
  },
  {
    id: "approval",
    title: "Approval",
    when: "Quotations are in and one is selected",
    then: "Record approval first. Then award.",
  },
  {
    id: "escalation",
    title: "With an agent",
    when: "Goods remain with an agent",
    then: "60, 90, then 150 days. Escalate and update the plan.",
  },
  {
    id: "scope",
    title: "Which orders",
    when: "The purchase order is a service, with nothing to move",
    then: "Leave it out. Only orders that need logistics are included.",
  },
] as const

export const routes = [
  {
    name: "Door-to-door",
    steps: ["Supplier", "Freight forwarder", "Vessel"],
  },
  {
    name: "Door-to-port",
    steps: ["Supplier", "Freight forwarder", "Port", "Agent", "Vessel"],
  },
  {
    name: "To an agent",
    steps: ["Supplier", "Agent", "Vessel"],
  },
  {
    name: "Via a hub",
    steps: ["Supplier", "Hub", "Onward", "Vessel"],
  },
] as const

export const qrSteps = [
  {
    title: "QR label",
    detail: "Each package is labelled. Vessel, PO, and ship spares in transit.",
  },
  {
    title: "Freight forwarder",
    detail: "Scans on collection from the supplier. Status becomes LA.",
  },
  {
    title: "Agent",
    detail: "Scans on receipt from the freight forwarder.",
  },
  {
    title: "Vessel",
    detail: "Scans when goods come on board. Status becomes RV or PD.",
  },
] as const

export const mipsSteps = [
  "Requisition",
  "Enquiry",
  "Supplier quotations",
  "Supplier selection",
  "Purchase order",
  "Order confirmation",
] as const

export const moduleSteps = [
  "Packing details",
  "Quotations and award",
  "Collection",
  "Handovers",
  "Delivery",
  "Costs",
] as const
