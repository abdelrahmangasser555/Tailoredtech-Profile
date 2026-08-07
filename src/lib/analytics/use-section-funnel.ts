"use client"

import { useEffect, useRef } from "react"
import { track } from "@/lib/analytics/track"

export type FunnelSection = {
  id: string
  title: string
}

type SectionFunnelProps = Record<
  string,
  string | number | boolean | null | undefined
>

/**
 * Fires `section_reached` once per section when it scrolls into view.
 * Use in PostHog funnels: opened → section_1 → section_2 → …
 */
export function useSectionFunnel(
  scope: string,
  sections: FunnelSection[],
  extra?: SectionFunnelProps
) {
  const seenRef = useRef(new Set<string>())
  const extraRef = useRef(extra)
  extraRef.current = extra
  const key = sections.map((s) => s.id).join(",")

  useEffect(() => {
    seenRef.current = new Set()
    const list = sections
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

          const index = list.findIndex((s) => s.id === id)
          const section = list[index]
          if (!section) continue

          track("section_reached", {
            scope,
            section_id: id,
            section_title: section.title,
            section_index: index,
            sections_total: list.length,
            ...extraRef.current,
          })
        }
      },
      { threshold: 0.35, rootMargin: "-8% 0px -8% 0px" }
    )

    for (const node of nodes) observer.observe(node)

    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed by section ids
  }, [scope, key])
}
