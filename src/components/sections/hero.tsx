"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Globe3D } from "@/components/ui/3d-globe";
import { GlyphMatrix } from "@/components/ui/glyph-matrix";
import { site, type HeroConfig } from "@/lib/content";

const EASE = [0.22, 1, 0.36, 1] as const;
const BRAND_COLOR = "#D4FF00";
const GREY_COLOR = "#6B7280";

type MorphVariant = HeroConfig["brandMorph"]["variant"];

/**
 * Tailored stays fixed.
 * Morph side cycles configured words (+ optional vessel) with a selectable variant.
 */
function BrandMorph({ config }: { config: HeroConfig["brandMorph"] }) {
  const reduce = useReducedMotion();
  const words = config.words;
  const holdMs = config.holdMs;
  const showVessel = config.showVessel;
  const yoyo = config.yoyo;
  const variant = config.variant;
  const prefix = config.prefix;

  const maxPhase = showVessel ? words.length : Math.max(words.length - 1, 0);
  const [phase, setPhase] = useState(0);
  const dirRef = useRef<1 | -1>(1);

  useEffect(() => {
    if (reduce || words.length === 0) return;

    const id = window.setInterval(() => {
      setPhase((prev) => {
        if (!yoyo) {
          return prev >= maxPhase ? 0 : prev + 1;
        }

        const dir = dirRef.current;
        const next = prev + dir;
        if (next > maxPhase) {
          dirRef.current = -1;
          return Math.max(maxPhase - 1, 0);
        }
        if (next < 0) {
          dirRef.current = 1;
          return Math.min(1, maxPhase);
        }
        return next;
      });
    }, holdMs);

    return () => window.clearInterval(id);
  }, [reduce, holdMs, maxPhase, words.length, yoyo]);

  const vesselPhase = showVessel ? words.length : -1;
  const isVessel = phase === vesselPhase;
  const word = words[Math.min(phase, words.length - 1)] ?? "";

  const longest = useMemo(
    () => words.reduce((a, b) => (b.length > a.length ? b : a), ""),
    [words],
  );

  return (
    <h1
      className="flex min-h-[1.1em] flex-col items-start gap-1 font-display text-[clamp(3.25rem,15vw,5rem)] font-semibold leading-[0.92] tracking-[-0.04em] lg:flex-row lg:flex-nowrap lg:items-center lg:gap-0 lg:whitespace-nowrap lg:text-[clamp(2.4rem,8.4vw,7.25rem)]"
      aria-label={`${prefix}${words[0] ?? ""}`}
    >
      <span className="text-white">{prefix}</span>

      <span
        className={`relative inline-flex h-[1em] min-w-[2.1em] shrink-0 items-center text-accent lg:ml-[0.02em] ${
          variant === "overflow" ? "overflow-hidden" : ""
        }`}
      >
        {variant === "jump" ? (
          <JumpMorph
            word={word}
            longest={longest}
            isVessel={isVessel}
            showVessel={showVessel}
          />
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            {isVessel ? (
              <motion.span
                key="vessel"
                initial={
                  variant === "overflow"
                    ? { opacity: 0, y: "110%" }
                    : { opacity: 0, x: -80 }
                }
                animate={
                  variant === "overflow"
                    ? { opacity: 1, y: "0%" }
                    : { opacity: 1, x: 0 }
                }
                exit={
                  variant === "overflow"
                    ? { opacity: 0, y: "-110%" }
                    : { opacity: 0, x: 36 }
                }
                transition={{ duration: 0.75, ease: EASE }}
                className="absolute inset-y-0 left-0 inline-flex items-center overflow-visible"
              >
                <VesselMark />
              </motion.span>
            ) : (
              <WordMorph key={word} word={word} variant={variant} />
            )}
          </AnimatePresence>
        )}
      </span>
    </h1>
  );
}

function WordMorph({ word, variant }: { word: string; variant: MorphVariant }) {
  if (variant === "overflow") {
    return (
      <motion.span
        className="inline-flex items-baseline overflow-hidden"
        initial={{ opacity: 0, y: "110%" }}
        animate={{ opacity: 1, y: "0%" }}
        exit={{ opacity: 0, y: "-110%" }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <TagOpen />
        <span className="inline-block">{word}</span>
        <TagClose />
      </motion.span>
    );
  }

  // slide (default)
  return (
    <motion.span
      className="inline-flex items-baseline"
      initial={{ opacity: 0, x: -32, filter: "blur(8px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, x: 22, filter: "blur(6px)" }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <TagOpen />
      <span className="inline-block">{word}</span>
      <TagClose />
    </motion.span>
  );
}

/** Brackets stay put; only the inner word jumps. Vessel replaces the whole slot. */
function JumpMorph({
  word,
  longest,
  isVessel,
  showVessel,
}: {
  word: string;
  longest: string;
  isVessel: boolean;
  showVessel: boolean;
}) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      {isVessel && showVessel ? (
        <motion.span
          key="vessel"
          initial={{ opacity: 0, scale: 0.86, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -8 }}
          transition={{ duration: 0.55, ease: EASE }}
          className="absolute inset-y-0 left-0 inline-flex items-center"
        >
          <VesselMark />
        </motion.span>
      ) : (
        <motion.span
          key="tags"
          className="inline-flex items-baseline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <TagOpen />
          <span
            className="relative inline-block overflow-hidden align-baseline"
            style={{ minWidth: `${Math.max(longest.length, 1)}ch` }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={word}
                className="inline-block"
                initial={{ y: "85%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-85%", opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                {word}
              </motion.span>
            </AnimatePresence>
          </span>
          <TagClose />
        </motion.span>
      )}
    </AnimatePresence>
  );
}

function TagOpen() {
  return (
    <span className="mr-[0.06em] font-mono text-[0.85em] font-medium text-accent/75">
      {"<"}
    </span>
  );
}

function TagClose() {
  return (
    <span className="ml-[0.06em] font-mono text-[0.85em] font-medium text-accent/75">
      {" />"}
    </span>
  );
}

/** Detailed vessel — sails with roll, bob, and wake */
function VesselMark() {
  return (
    <motion.svg
      viewBox="0 0 140 56"
      className="h-[0.78em] w-auto overflow-visible"
      fill="currentColor"
      aria-hidden
      animate={{
        x: [0, 16, 0],
        y: [0, -3, 0, 2, 0],
        rotate: [0, -2.8, 1.2, -1.8, 0],
      }}
      transition={{
        duration: 4,
        ease: "easeInOut",
        repeat: Infinity,
      }}
    >
      <motion.path
        d="M4 44c8 2 16-2 24 0s16 2 24 0 16-2 24 0 16 2 24 0 16-2 20 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.2"
        animate={{ x: [0, -10, 0] }}
        transition={{ duration: 2.8, ease: "easeInOut", repeat: Infinity }}
      />

      <motion.g
        animate={{ opacity: [0.12, 0.38, 0.12], x: [0, -10, 0] }}
        transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity }}
      >
        <path
          d="M2 40h16"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.55"
          fill="none"
        />
        <path
          d="M4 44h12"
          stroke="currentColor"
          strokeWidth="1.25"
          opacity="0.35"
          fill="none"
        />
        <path
          d="M6 48h10"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.2"
          fill="none"
        />
      </motion.g>

      <path d="M22 36h88l-10 12H34L22 36Z" opacity="0.35" />
      <path d="M20 28h86l-6 10H30L20 28Z" />
      <path
        d="M28 28h70"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.35"
      />

      <rect x="48" y="14" width="34" height="14" />
      <rect x="52" y="8" width="18" height="6" />
      <g opacity="0.28" fill="#0A0A0A">
        <rect x="54" y="17" width="5" height="4" />
        <rect x="62" y="17" width="5" height="4" />
        <rect x="70" y="17" width="5" height="4" />
      </g>

      <rect x="72" y="2" width="8" height="12" />
      <rect x="72" y="2" width="8" height="2.5" opacity="0.55" />
      <motion.g
        animate={{ y: [0, -6, -10], opacity: [0.35, 0.2, 0] }}
        transition={{ duration: 2.2, ease: "easeOut", repeat: Infinity }}
      >
        <circle cx="76" cy="0" r="2.2" opacity="0.4" />
        <circle cx="79" cy="-3" r="1.6" opacity="0.25" />
      </motion.g>

      <rect x="92" y="10" width="1.5" height="18" opacity="0.75" />
      <path
        d="M93 12h14"
        stroke="currentColor"
        strokeWidth="1.25"
        fill="none"
        opacity="0.55"
      />
      <path
        d="M107 12v6"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.4"
      />

      <path d="M106 28h16l-8 10h-14l6-10Z" />
      <circle cx="114" cy="33" r="1.4" opacity="0.35" fill="#0A0A0A" />
      <rect x="34" y="22" width="10" height="6" opacity="0.55" />
      <rect x="86" y="22" width="8" height="6" opacity="0.45" />
    </motion.svg>
  );
}

function glyphColor(mode: HeroConfig["glyphMatrix"]["color"]) {
  return mode === "grey" ? GREY_COLOR : BRAND_COLOR;
}

export function Hero() {
  const { company, hero } = site
  const reduce = useReducedMotion()
  const { glyphMatrix, brandMorph, globe, description } = hero

  const glyphMask = glyphMatrix.fadeCenter
    ? {
        maskImage:
          "radial-gradient(ellipse 52% 48% at 36% 44%, transparent 0%, rgba(0,0,0,0.35) 42%, black 72%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 52% 48% at 36% 44%, transparent 0%, rgba(0,0,0,0.35) 42%, black 72%)",
      }
    : undefined

  const ctaPrimary = (
    <Link
      href="/#contact"
      className="inline-flex h-11 w-full items-center justify-center gap-2 bg-accent px-5 text-sm font-medium text-accent-foreground transition hover:brightness-95 lg:w-auto"
    >
      {company.contact.cta}
      <ArrowUpRight className="size-4" />
    </Link>
  )

  const ctaSecondary = (
    <Link
      href="/services"
      className="inline-flex h-11 w-full items-center justify-center gap-2 border border-white/25 px-5 text-sm font-medium text-white transition hover:bg-white/5 lg:w-auto"
    >
      Solutions
      <ArrowUpRight className="size-4" />
    </Link>
  )

  return (
    <section className="relative flex h-svh flex-col overflow-hidden bg-black text-white [--accent:#D4FF00] [--accent-foreground:#0A0A0A] lg:block">
      {glyphMatrix.enabled && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            opacity: glyphMatrix.opacity,
            filter: `brightness(${glyphMatrix.brightness}) contrast(${glyphMatrix.contrast})`,
            ...glyphMask,
          }}
        >
          <GlyphMatrix
            className="h-full w-full"
            color={glyphColor(glyphMatrix.color)}
            cellSize={glyphMatrix.cellSize}
            mutationRate={glyphMatrix.mutationRate}
            interval={glyphMatrix.interval}
            fadeBottom={glyphMatrix.fadeBottom}
            glyphs={glyphMatrix.glyphs}
          />
        </div>
      )}

      <div className="relative z-20 flex min-h-0 flex-1 flex-col px-5 pt-24 md:px-8 lg:absolute lg:inset-0 lg:grid lg:h-full lg:w-full lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-2 lg:overflow-visible lg:px-10 lg:pt-14 lg:pb-16">
        <div className="relative z-20 flex flex-col lg:-translate-y-10 xl:-translate-y-12">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <BrandMorph config={brandMorph} />
          </motion.div>

          {description.enabled && (
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
              className="mt-5 hidden max-w-md font-heading text-base font-medium leading-snug tracking-tight text-white/55 lg:block lg:text-lg"
            >
              {description.before}
              <span className="text-accent">{description.count}</span>
              {description.middle}
              <span className="text-accent">{description.word}</span>
            </motion.p>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
          className="mt-auto mb-5 flex w-full flex-col gap-3 lg:hidden"
        >
          {ctaPrimary}
          {ctaSecondary}
        </motion.div>

        {globe.enabled && (
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.22, ease: EASE }}
            className="relative z-10 hidden lg:block lg:h-[min(72vh,620px)] lg:w-[min(60vw,720px)] lg:translate-x-[28%] lg:scale-[1.08] lg:justify-self-end lg:overflow-visible"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-20"
            >
              <div className="absolute inset-y-0 left-0 w-[48%] bg-linear-to-r from-black/55 via-black/18 to-transparent" />
              <div className="absolute inset-y-0 right-0 w-[18%] bg-linear-to-l from-black/35 to-transparent" />
              <div className="absolute inset-x-0 top-0 h-[22%] bg-linear-to-b from-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-[24%] bg-linear-to-t from-black/30 to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_58%_50%,transparent_48%,rgba(0,0,0,0.12)_72%,rgba(0,0,0,0.28)_100%)]" />
            </div>

            <div className="h-full w-full">
              <Globe3D
                markers={globe.markers}
                className="h-full w-full"
                config={{
                  showAtmosphere: globe.showAtmosphere,
                  bumpScale: globe.bumpScale,
                  autoRotateSpeed: reduce ? 0 : globe.autoRotateSpeed,
                  ambientIntensity: globe.ambientIntensity,
                  pointLightIntensity: globe.pointLightIntensity,
                  backgroundColor: null,
                }}
              />
            </div>
          </motion.div>
        )}
      </div>

      {globe.enabled && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
          className="relative z-10 h-[34%] min-h-[200px] w-full shrink-0 overflow-hidden lg:hidden"
        >
          <div className="absolute left-1/2 top-0 w-[130%] max-w-none -translate-x-1/2">
            <Globe3D
              markers={globe.markers}
              className="h-[min(95vw,520px)] w-full"
              config={{
                showAtmosphere: globe.showAtmosphere,
                bumpScale: globe.bumpScale,
                autoRotateSpeed: reduce ? 0 : globe.autoRotateSpeed,
                ambientIntensity: globe.ambientIntensity,
                pointLightIntensity: globe.pointLightIntensity,
                backgroundColor: null,
              }}
            />
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
        className="absolute bottom-8 left-5 z-30 hidden flex-wrap gap-3 md:bottom-10 md:left-8 lg:bottom-10 lg:left-10 lg:flex"
      >
        {ctaPrimary}
        {ctaSecondary}
      </motion.div>
    </section>
  )
}
