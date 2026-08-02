import type { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  getServiceBySlug,
  getServiceSlugs,
} from "@/lib/content"
import { SolutionDetail } from "@/components/sections/solution-detail"
import { LocalEditLink } from "@/components/editor/local-edit-link"
import { JsonLd } from "@/components/seo/json-ld"
import { isLocalEditEnabled } from "@/lib/local-edit"
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

  const localEdit = isLocalEditEnabled()

  return (
    <>
      <JsonLd
        data={[
          breadcrumb,
          buildSoftwareApplicationJsonLd(service),
        ]}
      />
      {localEdit ? (
        <div className="fixed right-4 bottom-4 z-50 md:right-6 md:bottom-6">
          <LocalEditLink
            href={`/services/edit/${service.id}`}
            label="Edit solution"
            className="h-10 border-accent/40 bg-black/80 px-3 shadow-lg backdrop-blur-md"
          />
        </div>
      ) : null}
      <SolutionDetail service={service} />
    </>
  )
}
