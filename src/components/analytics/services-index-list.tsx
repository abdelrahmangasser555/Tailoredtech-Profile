"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { ServiceVisual } from "@/components/ui/service-visual"
import { LocalEditLink } from "@/components/editor/local-edit-link"
import { trackSolutionClick } from "@/lib/analytics/track"
import type { site } from "@/lib/content"

type ServiceItem = (typeof site.services.items)[number]

type ServicesIndexListProps = {
  services: ServiceItem[]
  localEdit: boolean
}

export function ServicesIndexList({
  services,
  localEdit,
}: ServicesIndexListProps) {
  function onSolutionClick(service: ServiceItem) {
    trackSolutionClick({
      solutionId: service.id,
      solutionTitle: service.title,
      source: "services_index",
      href: service.href,
    })
  }

  return (
    <div className="flex flex-col">
      {services.map((service, i) => (
        <article
          key={service.id}
          id={service.id}
          className="group relative scroll-mt-28 border-b border-foreground/8 py-12 last:border-b-0 md:py-14"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute -left-1 -top-1 font-pixel-circle text-[clamp(3.5rem,8vw,5rem)] font-medium leading-none text-foreground/[0.06] select-none"
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="relative flex flex-col gap-6 pl-2 md:flex-row md:items-end md:justify-between md:gap-10 md:pl-8">
            <div className="max-w-2xl">
              <div className="mb-4">
                <ServiceVisual
                  icon={service.icon}
                  logo={service.logo}
                  title={service.title}
                  className="size-9 text-accent"
                  iconClassName="size-5"
                />
              </div>
              <h2 className="font-pixel-circle text-2xl font-medium tracking-tight md:text-3xl">
                <Link
                  href={service.href}
                  className="transition hover:text-accent"
                  onClick={() => onSolutionClick(service)}
                >
                  {service.title}
                </Link>
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                {service.description}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              {localEdit ? (
                <LocalEditLink
                  href={`/services/edit/${service.id}`}
                  className="h-11 border-foreground/15 bg-transparent text-foreground/70 hover:border-accent hover:text-accent"
                />
              ) : null}
              <Link
                href={service.href}
                onClick={() => onSolutionClick(service)}
                className="inline-flex h-11 shrink-0 items-center gap-2 border border-foreground/15 px-5 text-sm font-medium transition hover:border-accent hover:text-accent"
              >
                View solution
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
