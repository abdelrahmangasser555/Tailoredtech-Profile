"use client"

import { useEffect, useRef } from "react"
import { track } from "@/lib/analytics/track"

type EngagementProps = Record<string, string | number | boolean | null | undefined>

/**
 * Fires `opened` on mount and `ended` with duration_seconds on unmount / tab close.
 */
export function useEngagement(
  openedEvent: string,
  endedEvent: string,
  properties: EngagementProps
) {
  const startRef = useRef(0)
  const propsRef = useRef(properties)
  propsRef.current = properties
  const endedRef = useRef(false)

  useEffect(() => {
    startRef.current = Date.now()
    endedRef.current = false
    track(openedEvent, propsRef.current)

    function end() {
      if (endedRef.current) return
      endedRef.current = true
      const duration_seconds = Math.max(
        1,
        Math.round((Date.now() - startRef.current) / 1000)
      )
      track(endedEvent, { ...propsRef.current, duration_seconds })
    }

    window.addEventListener("pagehide", end)
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") end()
    })

    return () => {
      window.removeEventListener("pagehide", end)
      end()
    }
  }, [openedEvent, endedEvent])
}
