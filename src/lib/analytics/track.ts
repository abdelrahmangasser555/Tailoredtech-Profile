import posthog from "posthog-js"

/** Central PostHog capture — no-ops when SDK is not loaded. */
export function track(
  event: string,
  properties?: Record<string, string | number | boolean | null | undefined>
) {
  if (typeof window === "undefined") return
  try {
    const cleaned = properties
      ? Object.fromEntries(
          Object.entries(properties).filter(([, v]) => v !== undefined)
        )
      : undefined
    posthog.capture(event, cleaned)
  } catch {
    /* analytics must never break the app */
  }
}

export function trackSolutionClick(opts: {
  solutionId: string
  solutionTitle: string
  source: string
  href: string
}) {
  track("solution_link_clicked", {
    solution_id: opts.solutionId,
    solution_title: opts.solutionTitle,
    source: opts.source,
    href: opts.href,
  })
}
