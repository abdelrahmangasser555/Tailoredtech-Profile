"use client"

import { useEngagement } from "@/lib/analytics/use-engagement"
import { useSectionFunnel } from "@/lib/analytics/use-section-funnel"

type TrackSolutionProps = {
  solutionId: string
  solutionTitle: string
  sections: { id: string; title: string }[]
}

export function TrackSolution({
  solutionId,
  solutionTitle,
  sections,
}: TrackSolutionProps) {
  const base = {
    solution_id: solutionId,
    solution_title: solutionTitle,
    page: "solution_detail",
  }

  useEngagement("solution_opened", "solution_engagement_ended", base)
  useSectionFunnel("solution", sections, base)

  return null
}
