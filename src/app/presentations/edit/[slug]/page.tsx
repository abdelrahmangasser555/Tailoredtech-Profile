import { notFound, redirect } from "next/navigation"
import {
  getPresentationBySlug,
  getPresentationSlugs,
} from "@/lib/content"
import { isLocalEditEnabled } from "@/lib/local-edit"
import { PresentationEditShell } from "@/components/editor/presentation-edit-shell"

type PageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  if (!isLocalEditEnabled()) return []
  return getPresentationSlugs().map((slug) => ({ slug }))
}

export default async function PresentationEditPage({ params }: PageProps) {
  if (!isLocalEditEnabled()) {
    redirect("/presentations")
  }

  const { slug } = await params
  const presentation = getPresentationBySlug(slug)
  if (!presentation) notFound()

  return <PresentationEditShell presentation={presentation} />
}
