"use client"

import { useEngagement } from "@/lib/analytics/use-engagement"
import { useSectionFunnel } from "@/lib/analytics/use-section-funnel"

const HOME_SECTIONS = [
  { id: "clients", title: "Clients" },
  { id: "solutions", title: "Solutions" },
  { id: "work", title: "Work" },
  { id: "about", title: "About" },
  { id: "contact", title: "Contact" },
]

export function TrackHome() {
  useEngagement("home_opened", "home_engagement_ended", { page: "home" })
  useSectionFunnel("home", HOME_SECTIONS, { page: "home" })
  return null
}
