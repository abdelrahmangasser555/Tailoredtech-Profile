import type { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  getServiceBySlug,
  getServiceSlugs,
  site,
} from "@/lib/content"
import { SolutionDetail } from "@/components/sections/solution-detail"

type PageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getServiceSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) {
    return { title: "Solution" }
  }

  const title = `${service.title} | Maritime Software Solutions`
  const description = service.page.tagline || service.description

  return {
    title,
    description,
    keywords: [
      service.title,
      "maritime software solutions",
      "maritime custom software",
      site.company.name,
    ],
    alternates: { canonical: service.href },
    openGraph: {
      title: `${service.title} | TailoredTech`,
      description,
    },
  }
}

export default async function SolutionPage({ params }: PageProps) {
  const { slug } = await params
  const service = getServiceBySlug(slug)

  if (!service) {
    notFound()
  }

  return <SolutionDetail service={service} />
}
