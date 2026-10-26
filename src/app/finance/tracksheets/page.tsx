import { getTracksheets } from "@/lib/tracksheets/content"
import { TracksheetsList } from "@/components/finance/tracksheets-list"

export default function FinanceTracksheetsPage() {
  return <TracksheetsList sheets={getTracksheets()} />
}
