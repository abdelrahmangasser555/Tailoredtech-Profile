import { emptyTracksheet } from "@/lib/tracksheets/types"
import { TracksheetEditor } from "@/components/finance/tracksheet-editor"

export default function FinanceTracksheetNewPage() {
  return <TracksheetEditor initial={emptyTracksheet()} isNew />
}
