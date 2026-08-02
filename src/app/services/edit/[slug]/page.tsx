import { notFound, redirect } from "next/navigation"
import { getServiceBySlug, getServiceSlugs } from "@/lib/content"
import { isLocalEditEnabled } from "@/lib/local-edit"
import { ServiceEditShell } from "@/components/editor/service-edit-shell"

type PageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  if (!isLocalEditEnabled()) return []
  return getServiceSlugs().map((slug) => ({ slug }))
}

export default async function ServiceEditPage({ params }: PageProps) {
  if (!isLocalEditEnabled()) {
    redirect("/services")
  }

  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) notFound()

  return <ServiceEditShell service={service} />
}
