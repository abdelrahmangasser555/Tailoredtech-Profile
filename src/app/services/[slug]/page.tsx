import type { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  getServiceBySlug,
  getServiceSlugs,
} from "@/lib/content"
import { SolutionDetail } from "@/components/sections/solution-detail"
import { JsonLd } from "@/components/seo/json-ld"
import {
  buildBreadcrumbJsonLd,
  buildSoftwareApplicationJsonLd,
  buildSolutionMetadata,
} from "@/lib/seo"

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

  return buildSolutionMetadata(service)
}

export default async function SolutionPage({ params }: PageProps) {
  const { slug } = await params
  const service = getServiceBySlug(slug)

  if (!service) {
    notFound()
  }

  const breadcrumb = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Solutions", path: "/services" },
    { name: service.title, path: service.href },
  ])

  return (
    <>
      <JsonLd
        data={[
          breadcrumb,
          buildSoftwareApplicationJsonLd(service),
        ]}
      />
      <SolutionDetail service={service} />
    </>
  )
}
