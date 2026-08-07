"use client"

import { useEffect, useRef } from "react"
import { track } from "@/lib/analytics/track"
import { useEngagement } from "@/lib/analytics/use-engagement"

type ServiceRef = {
  id: string
  title: string
}

type TrackServicesIndexProps = {
  services: ServiceRef[]
}

/** Time on /services + per-card visibility on the index list. */
export function TrackServicesIndex({ services }: TrackServicesIndexProps) {
  const seenRef = useRef(new Set<string>())

  useEngagement("services_index_opened", "services_index_engagement_ended", {
    page: "services_index",
    solutions_count: services.length,
  })

  useEffect(() => {
    seenRef.current = new Set()
    const key = services.map((s) => s.id).join(",")
    const list = services
    const nodes = list
      .map((s) => document.getElementById(s.id))
      .filter((n): n is HTMLElement => Boolean(n))

    if (nodes.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const id = entry.target.id
          if (seenRef.current.has(id)) continue
          seenRef.current.add(id)
          const service = list.find((s) => s.id === id)
          if (!service) continue
          track("solution_card_viewed", {
            solution_id: service.id,
            solution_title: service.title,
            source: "services_index",
          })
        }
      },
      { threshold: 0.4 }
    )

    for (const node of nodes) observer.observe(node)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed by service ids
  }, [services.map((s) => s.id).join(",")])

  return null
}
