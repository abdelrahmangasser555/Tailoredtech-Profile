import { notFound } from "next/navigation"
import { getTracksheetById } from "@/lib/tracksheets/content"
import { TracksheetEditor } from "@/components/finance/tracksheet-editor"

export default async function FinanceTracksheetEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const sheet = getTracksheetById(id)
  if (!sheet) notFound()
  return <TracksheetEditor initial={sheet} />
}
