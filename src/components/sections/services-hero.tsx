"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { ColorPanels } from "@paper-design/shaders-react";
import { GlyphMatrix } from "@/components/ui/glyph-matrix";
import { site } from "@/lib/content";

const EASE = [0.22, 1, 0.36, 1] as const;

const ENGINE_COLORS = ["#D4FF00", "#A8E600", "#3F4A00", "#F0FF99"];

const engineShader = {
  colors: ENGINE_COLORS,
  colorBack: "#ffffff00",
  density: 5.03,
  angle1: 0.68,
  angle2: 0.28,
  length: 1.13,
  edges: true,
  blur: 0.25,
  fadeIn: 0.85,
  fadeOut: 0.3,
  gradient: 0.56,
  speed: 3.2,
  scale: 0.96,
  rotation: 180,
};

const MemoizedColorPanels = React.memo(ColorPanels);

/**
 * Services hero — home branding, dithered pixel heading, vessel-engine visual.
 */
export function ServicesHero() {
  const { company } = site;
  const reduce = useReducedMotion();

  return (
    <section className="relative flex h-svh flex-col overflow-hidden bg-black text-white [--accent:#D4FF00] [--accent-foreground:#0A0A0A] lg:block">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-50"
        style={{
          maskImage:
            "radial-gradient(ellipse 55% 50% at 32% 42%, transparent 0%, rgba(0,0,0,0.3) 45%, black 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 55% 50% at 32% 42%, transparent 0%, rgba(0,0,0,0.3) 45%, black 75%)",
        }}
      >
        <GlyphMatrix
          className="h-full w-full"
          color="#D4FF00"
          cellSize={16}
          mutationRate={0.03}
          interval={110}
          fadeBottom={0.5}
          glyphs="01·•<>/=+*"
        />
      </div>

      <div className="relative z-10 mx-auto grid h-full w-full max-w-7xl items-center gap-8 px-5 pt-28 pb-10 md:px-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-6 lg:px-10 lg:pt-24 lg:pb-16">
        <div className="relative z-20 flex max-w-xl flex-col gap-5 lg:-translate-y-6 lg:gap-6">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="font-mono text-[11px] tracking-[0.24em] uppercase text-accent"
          >
            Platform &amp; services
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.06, ease: EASE }}
            className="font-pixel-circle text-[clamp(2.5rem,6.5vw,4.75rem)] font-medium leading-[1.05] tracking-[-0.04em]"
          >
            Maritime software
            <br />
            <span className="text-accent">for the fleet</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.16, ease: EASE }}
            className="max-w-sm text-sm leading-relaxed text-white/45 md:text-base"
          >
            <span className="font-pixel-circle font-medium text-accent">4</span>{" "}
            focused solution for vessels, ports, and commercial desks.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28, ease: EASE }}
            className="flex flex-wrap gap-3 pt-1"
          >
            <Link
              href="/#contact"
              className="inline-flex h-11 items-center gap-2 bg-accent px-5 text-sm font-medium text-accent-foreground transition hover:brightness-95"
            >
              {company.contact.cta}
              <ArrowUpRight className="size-4" />
            </Link>
            <Link
              href="#fleet-operations"
              className="inline-flex h-11 items-center gap-2 border border-white/25 px-5 text-sm font-medium text-white transition hover:bg-white/5"
            >
              View services
              <ArrowUpRight className="size-4" />
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: EASE }}
          className="relative z-10 mx-auto flex w-full max-w-130 items-center justify-center lg:mx-0 lg:max-w-none lg:justify-self-end"
        >
          <div className="relative aspect-square w-full max-w-[min(88vw,480px)] lg:max-w-[min(46vw,560px)]">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgba(212,255,0,0.12),transparent_68%)]"
            />
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <MemoizedColorPanels
                width={720}
                height={720}
                {...engineShader}
                speed={reduce ? 0 : engineShader.speed}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,transparent_42%,rgba(0,0,0,0.55)_78%,rgba(0,0,0,0.9)_100%)]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
