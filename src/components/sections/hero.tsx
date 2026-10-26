"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { GlyphMatrix } from "@/components/ui/glyph-matrix";
import { SolutionHeroVisual } from "@/components/sections/solution-hero-visual";
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
      className="flex min-h-[1.1em] w-full max-w-full flex-col items-center gap-1 text-center font-pixel-circle text-[clamp(2.8rem,14vw,5.5rem)] font-medium leading-[0.92] tracking-[-0.04em] lg:w-auto lg:flex-row lg:flex-nowrap lg:items-center lg:justify-center lg:gap-0 lg:whitespace-nowrap lg:text-[clamp(2.5rem,6.4vw,6rem)]"
      aria-label={`${prefix}${words[0] ?? ""}`}
    >
      <span className="text-white">{prefix}</span>

      <span
        className={`relative inline-flex h-[1em] min-w-[2.1em] shrink-0 items-center justify-center text-accent lg:ml-[0.02em] lg:justify-center ${
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

const VESSEL_DOT = 2;
const VESSEL_DOT_R = 0.88;

type VesselDot = { x: number; y: number; opacity: number };

function vesselXY(col: number, row: number): Pick<VesselDot, "x" | "y"> {
  return {
    x: col * VESSEL_DOT + VESSEL_DOT_R,
    y: row * VESSEL_DOT + VESSEL_DOT_R,
  };
}

function vesselRect(
  col: number,
  row: number,
  width: number,
  height: number,
  opacity = 1,
  skip = new Set<string>(),
): VesselDot[] {
  const dots: VesselDot[] = [];
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const key = `${col + x},${row + y}`;
      if (skip.has(key)) continue;
      dots.push({ ...vesselXY(col + x, row + y), opacity });
    }
  }
  return dots;
}

function vesselHullRow(
  row: number,
  left: number,
  right: number,
  opacity = 1,
): VesselDot[] {
  const dots: VesselDot[] = [];
  for (let col = left; col <= right; col += 1) {
    dots.push({ ...vesselXY(col, row), opacity });
  }
  return dots;
}

function vesselPoints(
  coords: ReadonlyArray<readonly [number, number]>,
  opacity = 1,
): VesselDot[] {
  return coords.map(([col, row]) => ({ ...vesselXY(col, row), opacity }));
}

function vesselFrame(
  col: number,
  row: number,
  width: number,
  height: number,
  opacity = 1,
): VesselDot[] {
  const dots: VesselDot[] = [];
  for (let x = 0; x < width; x += 1) {
    dots.push({ ...vesselXY(col + x, row), opacity });
    dots.push({ ...vesselXY(col + x, row + height - 1), opacity });
  }
  for (let y = 1; y < height - 1; y += 1) {
    dots.push({ ...vesselXY(col, row + y), opacity });
    dots.push({ ...vesselXY(col + width - 1, row + y), opacity });
  }
  return dots;
}

/** High-detail dot-matrix container ship */
function buildVesselHullDots(): VesselDot[] {
  const dots: VesselDot[] = [];
  const skip = new Set<string>();

  // Bridge window cutouts
  [
  [47, 10], [48, 10], [49, 10],
  [51, 10], [52, 10], [53, 10],
  [55, 10], [56, 10], [57, 10],
  [48, 7], [49, 7], [52, 7], [53, 7],
  [55, 7], [56, 7],
  ].forEach(([c, r]) => skip.add(`${c},${r}`));

  // 7 container stacks × 4 tiers
  const containerCols = [5, 10, 15, 20, 25, 30, 35];
  const containerRows = [4, 6, 8, 10];

  containerCols.forEach((col, stackIdx) => {
    containerRows.forEach((row, tierIdx) => {
      const tone = (stackIdx + tierIdx) % 2 === 0 ? 1 : 0.82;
      dots.push(...vesselRect(col, row, 4, 2, tone));
      // Vertical container seam
      dots.push({ ...vesselXY(col + 2, row), opacity: tone * 0.45 });
      dots.push({ ...vesselXY(col + 2, row + 1), opacity: tone * 0.45 });
      // Horizontal lid line
      dots.push({ ...vesselXY(col, row), opacity: tone * 0.6 });
      dots.push({ ...vesselXY(col + 1, row), opacity: tone * 0.6 });
      dots.push({ ...vesselXY(col + 2, row), opacity: tone * 0.6 });
      dots.push({ ...vesselXY(col + 3, row), opacity: tone * 0.6 });
    });
    // Stack corner accents
    dots.push({ ...vesselXY(col, containerRows[0]), opacity: 0.55 });
    dots.push({ ...vesselXY(col + 3, containerRows[0]), opacity: 0.55 });
  });

  // Aft superstructure — bridge house, wings, nav deck
  dots.push(...vesselRect(44, 6, 16, 10, 1, skip));
  dots.push(...vesselRect(46, 4, 12, 2, 0.92));
  dots.push(...vesselRect(48, 2, 8, 2, 0.88));
  dots.push(...vesselFrame(44, 6, 16, 10, 0.42));

  // Bridge wing platforms
  dots.push(...vesselHullRow(12, 42, 43, 0.9));
  dots.push(...vesselHullRow(12, 60, 61, 0.9));
  dots.push(...vesselPoints([[42, 11], [61, 11]], 0.75));

  // Funnel + cap stripe
  dots.push(...vesselRect(50, 0, 4, 4, 1));
  dots.push(...vesselRect(50, 0, 4, 1, 0.5));
  dots.push(...vesselRect(50, 2, 4, 1, 0.38));

  // Radar mast + antenna
  dots.push(...vesselPoints([[52, 0], [52, 1], [52, 2], [52, 3]], 0.95));
  dots.push(...vesselHullRow(0, 53, 55, 0.7));
  dots.push({ ...vesselXY(54, 1), opacity: 0.55 });

  // Lifeboat davits
  dots.push(...vesselPoints([[45, 8], [46, 8], [59, 8], [60, 8]], 0.65));
  dots.push(...vesselRect(44, 9, 2, 1, 0.55));
  dots.push(...vesselRect(58, 9, 2, 1, 0.55));

  // Deck equipment between containers and bridge
  dots.push(...vesselRect(40, 11, 3, 2, 0.72));
  dots.push(...vesselPoints([[41, 10], [42, 10]], 0.5));

  // Deck railing
  dots.push(...vesselHullRow(13, 4, 61, 0.55));

  // Main hull — layered plating
  dots.push(...vesselHullRow(14, 3, 58, 1));
  dots.push(...vesselHullRow(15, 2, 59, 1));
  dots.push(...vesselHullRow(16, 1, 60, 0.96));
  dots.push(...vesselHullRow(17, 1, 60, 0.88));
  dots.push(...vesselHullRow(18, 2, 58, 0.72));

  // Hull strakes / plate lines
  [15, 17].forEach((row) => {
    for (let col = 5; col <= 55; col += 4) {
      dots.push({ ...vesselXY(col, row), opacity: 0.35 });
    }
  });

  // Keel + bilge shadow
  dots.push(...vesselHullRow(19, 4, 54, 0.34));
  dots.push(...vesselPoints([[3, 16], [3, 17], [3, 18]], 0.5));

  // Bow flare — stepped cutwater
  dots.push(...vesselHullRow(15, 60, 63, 0.9));
  dots.push(...vesselHullRow(16, 61, 65, 0.78));
  dots.push(...vesselHullRow(17, 62, 67, 0.62));
  dots.push(...vesselHullRow(18, 63, 68, 0.48));
  dots.push(...vesselPoints([[64, 15], [66, 16], [67, 17]], 0.4));

  // Bulbous bow
  dots.push(...vesselPoints([[65, 19], [66, 19], [67, 19], [66, 20]], 0.3));

  // Stern block + propeller hint
  dots.push(...vesselRect(2, 14, 3, 5, 0.92));
  dots.push(...vesselPoints([[1, 16], [1, 19]], 0.28));
  dots.push({ ...vesselXY(0, 17), opacity: 0.4 });

  // Anchor + hawse
  dots.push({ ...vesselXY(64, 16), opacity: 0.38 });
  dots.push({ ...vesselXY(63, 15), opacity: 0.28 });
  dots.push(...vesselHullRow(14, 62, 63, 0.45));

  return dots;
}

function buildVesselWakeDots(): VesselDot[] {
  const dots: VesselDot[] = [];

  // Wake trails
  dots.push(
    ...vesselPoints(
      [
        [0, 18], [2, 18], [4, 18],
        [1, 19], [3, 19], [5, 19],
        [0, 20], [2, 20], [4, 20], [6, 20],
        [1, 21], [3, 21], [5, 21],
      ],
      0.32,
    ),
  );

  // Waterline ripple
  for (let col = 8; col <= 58; col += 3) {
    dots.push({ ...vesselXY(col, 20), opacity: 0.18 });
  }

  return dots;
}

const VESSEL_HULL_DOTS = buildVesselHullDots();
const VESSEL_WAKE_DOTS = buildVesselWakeDots();
const VESSEL_WIDTH = 70 * VESSEL_DOT;
const VESSEL_HEIGHT = 23 * VESSEL_DOT;

/** Container cargo ship — dot-matrix silhouette (font-pixel-circle style) */
function VesselMark() {
  return (
    <motion.svg
      viewBox={`0 0 ${VESSEL_WIDTH} ${VESSEL_HEIGHT}`}
      className="h-[0.88em] w-auto overflow-visible"
      fill="currentColor"
      aria-hidden
      animate={{
        x: [0, 14, 0],
        y: [0, -2.5, 0, 1.5, 0],
        rotate: [0, -1.8, 0.8, -1.2, 0],
      }}
      transition={{
        duration: 4.2,
        ease: "easeInOut",
        repeat: Infinity,
      }}
    >
      <motion.g
        animate={{ opacity: [0.12, 0.38, 0.12], x: [0, -5, 0] }}
        transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity }}
      >
        {VESSEL_WAKE_DOTS.map((dot, index) => (
          <circle
            key={`wake-${index}`}
            cx={dot.x}
            cy={dot.y}
            r={VESSEL_DOT_R * 0.8}
            opacity={dot.opacity}
          />
        ))}
      </motion.g>

      {VESSEL_HULL_DOTS.map((dot, index) => (
        <circle
          key={`hull-${index}`}
          cx={dot.x}
          cy={dot.y}
          r={VESSEL_DOT_R}
          opacity={dot.opacity}
        />
      ))}

      <motion.g
        animate={{ y: [0, -2.5, -6], opacity: [0.5, 0.24, 0] }}
        transition={{ duration: 2.2, ease: "easeOut", repeat: Infinity }}
      >
        {vesselPoints([[51, -0.5], [52, -1.2], [53, -0.4]], 0.45).map(
          (dot, index) => (
            <circle
              key={`smoke-${index}`}
              cx={dot.x}
              cy={dot.y}
              r={VESSEL_DOT_R * (index === 1 ? 0.75 : 0.9)}
              opacity={dot.opacity}
            />
          ),
        )}
      </motion.g>
    </motion.svg>
  );
}

function glyphColor(mode: string) {
  return mode === "grey" ? GREY_COLOR : BRAND_COLOR;
}

function EngineMark({ reduce }: { reduce: boolean }) {
  return (
    <SolutionHeroVisual
      kind="engine"
      reduce={reduce}
      className="relative h-full w-full"
    />
  );
}

export function Hero() {
  const { company, hero } = site;
  const reduce = useReducedMotion();
  const { glyphMatrix, brandMorph, description } = hero;

  const ctaPrimary = (
    <Link
      href="/#contact"
      className="inline-flex h-11 w-full items-center justify-center gap-2 bg-accent px-5 text-sm font-medium text-accent-foreground transition hover:brightness-95 lg:w-auto"
    >
      {company.contact.cta}
      <ArrowUpRight className="size-4" />
    </Link>
  );

  const ctaSecondary = (
    <Link
      href="/services"
      className="inline-flex h-11 w-full items-center justify-center gap-2 border border-white/25 px-5 text-sm font-medium text-white transition hover:bg-white/5 lg:w-auto"
    >
      Solutions
      <ArrowUpRight className="size-4" />
    </Link>
  );

  return (
    <section className="relative flex h-svh flex-col overflow-hidden bg-black text-white [--accent:#D4FF00] [--accent-foreground:#0A0A0A] lg:block">
      {glyphMatrix.enabled && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            opacity: glyphMatrix.opacity,
            filter: `brightness(${glyphMatrix.brightness}) contrast(${glyphMatrix.contrast})`,
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

      <div className="relative z-20 flex min-h-0 flex-1 flex-col px-5 pt-24 md:px-8 lg:absolute lg:inset-0 lg:grid lg:h-full lg:w-full lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-center lg:gap-6 lg:overflow-visible lg:px-12 lg:pt-16 lg:pb-16">
        <div className="relative z-20 flex w-full min-w-0 flex-col items-center px-1 text-center lg:translate-x-8 lg:justify-self-center lg:px-4">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <BrandMorph config={brandMorph} />
          </motion.div>

          {description.enabled && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.22, ease: EASE }}
              className="font-flash mx-auto mt-4 w-full min-w-0 max-w-xl text-center text-xl leading-snug font-semibold tracking-[-0.03em] text-balance text-white sm:text-[1.55rem] lg:mt-5"
            >
              <span className="text-white/80">{description.before}</span>
              <span className="text-accent [text-shadow:0_0_22px_rgba(212,255,0,0.28)]">
                {description.emphasis}
              </span>
              <span className="text-white/80">{description.after}</span>
            </motion.p>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.18, ease: EASE }}
          className="relative z-10 mx-auto mt-4 aspect-square w-[min(46vw,200px)] lg:mt-0 lg:w-full lg:max-w-[min(46vw,560px)] lg:justify-self-end"
        >
          <EngineMark reduce={!!reduce} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
          className="mt-auto mb-5 flex w-full flex-col gap-3 lg:hidden"
        >
          {ctaPrimary}
          {ctaSecondary}
        </motion.div>
      </div>

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
  );
}
