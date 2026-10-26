export function formatTargetDate(value: string): string {
  const raw = value.trim()
  if (!raw) return ""
  const date = raw.includes("T") ? new Date(raw) : new Date(`${raw}T12:00:00`)
  if (Number.isNaN(date.getTime())) return raw
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
}

/** Lightweight markdown to plain lines for PDF and Excel footnotes. */
export function footnotePlainLines(markdown: string): string[] {
  return markdown
    .split(/\r?\n/)
    .map((line) =>
      line
        .replace(/^#{1,6}\s+/, "")
        .replace(/\*\*([^*]+)\*\*/g, "$1")
        .replace(/\*([^*]+)\*/g, "$1")
        .replace(/^[-*]\s+/, "• ")
        .trim()
    )
    .filter(Boolean)
}
