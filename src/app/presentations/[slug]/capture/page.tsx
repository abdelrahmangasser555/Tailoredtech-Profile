import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BahriLogisticsCaptureBoard } from "@/components/presentations/bahri-logistics/capture-board"

type PageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return [{ slug: "bahri-logistics" }]
}

export const metadata: Metadata = {
  title: "Bahri Logistics assets",
  robots: { index: false, follow: false },
}

export default async function BahriLogisticsCapturePage({ params }: PageProps) {
  const { slug } = await params
  if (slug !== "bahri-logistics") notFound()
  return <BahriLogisticsCaptureBoard />
}
