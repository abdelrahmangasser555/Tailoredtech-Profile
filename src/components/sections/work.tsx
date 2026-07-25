"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Section } from "@/components/layout/section"
import { TextReveal, Stagger, StaggerItem } from "@/components/motion/reveal"
import { GsapReveal } from "@/components/motion/gsap-reveal"
import { site } from "@/lib/content"

export function Work() {
  const { projects } = site
  const featured = projects.items.filter((p) => p.featured)

  return (
    <Section tone="dark" id="work">
      <GsapReveal>
        <p className="mb-4 font-mono text-[11px] tracking-[0.22em] uppercase text-accent">
          Work
        </p>
        <TextReveal
          text={projects.headline}
          className="font-heading text-4xl md:text-5xl font-semibold tracking-tight"
        />
        <p className="mt-4 max-w-sm text-sm text-white/40">
          {projects.subheadline}
        </p>
      </GsapReveal>

      <Stagger className="mt-16 flex flex-col" stagger={0.1}>
        {featured.map((project) => (
          <StaggerItem key={project.id}>
            <Link
              href={project.href}
              className="group grid gap-4 py-10 md:grid-cols-[8rem_1fr_auto] md:items-end md:gap-10"
            >
              <span className="font-mono text-xs text-white/30">{project.year}</span>
              <div>
                <h3 className="font-heading text-2xl md:text-3xl font-medium tracking-tight text-white transition-colors group-hover:text-accent">
                  {project.title}
                </h3>
                <p className="mt-2 text-sm text-white/40">
                  {project.client}
                  <span className="mx-2 text-white/20">·</span>
                  {project.summary}
                </p>
              </div>
              <ArrowUpRight className="size-5 text-white/25 transition-all group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  )
}
