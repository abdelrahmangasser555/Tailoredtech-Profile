import type { Metadata } from "next"
import { site, getPresentations } from "@/lib/content"
import { PresentationList } from "@/components/sections/presentation-list"
import { isLocalEditEnabled } from "@/lib/local-edit"

export const metadata: Metadata = {
  title: "Presentations",
  description: site.presentations.subheadline,
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
}

export default function PresentationsIndexPage() {
  const items = getPresentations()

  return (
    <PresentationList
      items={items}
      headline={site.presentations.headline}
      subheadline={site.presentations.subheadline}
      localEdit={isLocalEditEnabled()}
    />
  )
}
