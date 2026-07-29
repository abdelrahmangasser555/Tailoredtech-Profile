export type ContactAvailabilityConfig = {
  timezone: string
  timezoneLabel: string
  startHour: number
  endHour: number
  weekdaysOnly?: boolean
}

export type ContactAvailabilityStatus = {
  isOpen: boolean
  statusLabel: string
  detailLabel: string
}

/** Working hours in company timezone (default Dubai UTC+3, 10:00–21:00). */
export function getContactAvailability(
  config: ContactAvailabilityConfig,
  now = new Date()
): ContactAvailabilityStatus {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: config.timezone,
    hour: "numeric",
    hour12: false,
    weekday: "short",
  })
  const parts = formatter.formatToParts(now)
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0)
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? ""
  const isWeekend = weekday === "Sat" || weekday === "Sun"
  const withinHours = hour >= config.startHour && hour < config.endHour
  const isOpen =
    withinHours && !(config.weekdaysOnly && isWeekend)

  const start = `${config.startHour}:00`
  const end = `${config.endHour}:00`

  return {
    isOpen,
    statusLabel: isOpen
      ? "Online, responding now"
      : "Away. We respond next working window",
    detailLabel: `Hours ${start}–${end} (${config.timezoneLabel})`,
  }
}
