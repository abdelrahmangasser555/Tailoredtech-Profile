import type { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  getPresentationBySlug,
  getPresentationSlugs,
} from "@/lib/content"
import { PresentationDetail } from "@/components/sections/presentation-detail"

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

  return <PresentationDetail presentation={presentation} />
}
