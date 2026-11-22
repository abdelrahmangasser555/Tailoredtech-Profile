import type { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  getPresentationBySlug,
  getPresentationSlugs,
} from "@/lib/content"
import { PresentationDetail } from "@/components/sections/presentation-detail"
import { LocalEditLink } from "@/components/editor/local-edit-link"
import { isLocalEditEnabled } from "@/lib/local-edit"

type PageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getPresentationSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const presentation = getPresentationBySlug(slug)
  if (!presentation) {
    return {
      title: "Presentation",
      robots: { index: false, follow: false },
    }
  }

  return {
    title: presentation.title,
    description: presentation.page.tagline || presentation.description,
    robots: {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false },
    },
  }
}

export default async function PresentationPage({ params }: PageProps) {
  const { slug } = await params
  const presentation = getPresentationBySlug(slug)

  if (!presentation) {
    notFound()
  }

  const localEdit = isLocalEditEnabled()

  return (
    <>
      {localEdit ? (
        <div className="fixed right-4 bottom-4 z-50 md:right-6 md:bottom-6">
          <LocalEditLink
            href={`/presentations/edit/${presentation.id}`}
            label="Edit presentation"
            className="h-10 border-accent/40 bg-black/80 px-3 shadow-lg backdrop-blur-md"
          />
        </div>
      ) : null}
      <PresentationDetail presentation={presentation} />
    </>
  )
}
