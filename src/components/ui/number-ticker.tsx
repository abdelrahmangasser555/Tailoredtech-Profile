"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type NumberTickerMode = "direct" | "full" | "compact";

export type NumberTickerProps = {
  /** Target value. Absolute for `full` / `compact` (e.g. 2e9); display units for `direct` (e.g. 2). */
  to: number;
  /** Start value. Defaults to 0. */
  from?: number;
  /**
   * - `direct` — count `from`→`to`, then append a static `suffix` (0→2 + "B")
   * - `full` — count the absolute number with separators (0→2,000,000,000)
   * - `compact` — count absolute value while the unit letter scales K→M→B
   */
  mode?: NumberTickerMode;
  /** Static suffix for `direct` mode (e.g. "B", "M+", "%"). */
  suffix?: string;
  /** Optional prefix (e.g. "$"). */
  prefix?: string;
  /** Pixel-font "+" after the number / unit (e.g. 2B+). */
  plus?: boolean;
  /** Decimal places for `direct` and while in compact units. Default 0. */
  decimals?: number;
  /** Animation length in seconds. */
  duration?: number;
  /** GSAP ease. */
  ease?: string;
  /** Play once when scrolled into view. */
  once?: boolean;
  /** ScrollTrigger start. */
  start?: string;
  className?: string;
  numberClassName?: string;
  unitClassName?: string;
  prefixClassName?: string;
  plusClassName?: string;
};

type CompactParts = {
  amount: string;
  unit: string;
};

function roundTo(value: number, decimals: number) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function formatAmount(value: number, decimals: number) {
  const rounded = roundTo(value, decimals);
  if (decimals <= 0) {
    return Math.round(rounded).toLocaleString("en-US");
  }
  return rounded.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

function formatFull(value: number) {
  return Math.round(value).toLocaleString("en-US");
}

function formatCompact(value: number, decimals: number): CompactParts {
  const abs = Math.abs(value);
  let divisor = 1;
  let unit = "";

  if (abs >= 1_000_000_000) {
    divisor = 1_000_000_000;
    unit = "B";
  } else if (abs >= 1_000_000) {
    divisor = 1_000_000;
    unit = "M";
  } else if (abs >= 1_000) {
    divisor = 1_000;
    unit = "K";
  }

  let scaled = value / divisor;

  // Promote unit when rounding would land on 1000K / 1000M
  if (unit && roundTo(Math.abs(scaled), decimals) >= 1000) {
    if (unit === "K") {
      divisor = 1_000_000;
      unit = "M";
      scaled = value / divisor;
    } else if (unit === "M") {
      divisor = 1_000_000_000;
      unit = "B";
      scaled = value / divisor;
    }
  }

  return {
    amount: formatAmount(scaled, unit ? decimals : 0),
    unit,
  };
}

function formatParts(
  value: number,
  mode: NumberTickerMode,
  decimals: number,
  suffix: string,
): CompactParts {
  if (mode === "full") {
    return { amount: formatFull(value), unit: "" };
  }
  if (mode === "direct") {
    return {
      amount: formatAmount(value, decimals),
      unit: suffix,
    };
  }
  return formatCompact(value, decimals);
}

/**
 * Scroll-triggered number ticker.
 *
 * @example
 * // 0 → 2B (static letter)
 * <NumberTicker to={2} mode="direct" suffix="B" />
 *
 * @example
 * // 0 → 2,000,000,000
 * <NumberTicker to={2_000_000_000} mode="full" />
 *
 * @example
 * // 0 → 2K → 2M → 2B
 * <NumberTicker to={2_000_000_000} mode="compact" />
 */
export function NumberTicker({
  to,
  from = 0,
  mode = "compact", // direct, full, compact
  suffix = "",
  prefix = "",
  plus = false,
  decimals = mode === "compact" ? 1 : 0,
  duration = 2.4,
  ease = "power3.out",
  once = true,
  start = "top 85%",
  className,
  numberClassName,
  unitClassName,
  prefixClassName,
  plusClassName,
}: NumberTickerProps) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLSpanElement>(null);
  const valueRef = useRef({ current: from });
  const [parts, setParts] = useState<CompactParts>(() =>
    formatParts(reduce ? to : from, mode, decimals, suffix),
  );

  useEffect(() => {
    if (mode !== "direct") return;
    setParts((prev) => ({ ...prev, unit: suffix }));
  }, [mode, suffix]);

  useGSAP(
    () => {
      if (!rootRef.current) return;

      if (reduce) {
        setParts(formatParts(to, mode, decimals, suffix));
        return;
      }

      valueRef.current.current = from;
      setParts(formatParts(from, mode, decimals, suffix));

      const tween = gsap.to(valueRef.current, {
        current: to,
        duration,
        ease,
        paused: true,
        onUpdate: () => {
          setParts(
            formatParts(valueRef.current.current, mode, decimals, suffix),
          );
        },
      });

      const trigger = ScrollTrigger.create({
        trigger: rootRef.current,
        start,
        once,
        onEnter: () => {
          tween.play(0);
        },
      });

      return () => {
        trigger.kill();
        tween.kill();
      };
    },
    {
      scope: rootRef,
      dependencies: [
        to,
        from,
        mode,
        suffix,
        decimals,
        duration,
        ease,
        once,
        start,
        reduce,
      ],
    },
  );

  const ariaValue =
    mode === "direct"
      ? `${prefix}${formatAmount(to, decimals)}${suffix}${plus ? "+" : ""}`
      : mode === "full"
        ? `${prefix}${formatFull(to)}${plus ? "+" : ""}`
        : `${prefix}${formatCompact(to, decimals).amount}${formatCompact(to, decimals).unit}${plus ? "+" : ""}`;

  const showUnit = mode === "direct" ? Boolean(suffix) : Boolean(parts.unit);

  return (
    <span
      ref={rootRef}
      className={cn(
        "inline-flex items-baseline font-pixel-circle font-medium tracking-tight tabular-nums",
        className,
      )}
      aria-label={ariaValue}
    >
      {prefix ? (
        <span className={cn("mr-[0.04em]", prefixClassName)}>{prefix}</span>
      ) : null}

      <span className={cn("inline-flex items-baseline", numberClassName)}>
        <span>{parts.amount}</span>

        {showUnit ? (
          <span
            className={cn(
              "relative ml-[0.06em] inline-flex h-[1em] min-w-[0.7em] items-center overflow-hidden",
              unitClassName,
            )}
            aria-hidden
          >
            {mode === "compact" ? (
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={parts.unit || "none"}
                  initial={{ y: "70%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-70%", opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block font-pixel-circle font-medium tracking-tight"
                >
                  {parts.unit}
                </motion.span>
              </AnimatePresence>
            ) : (
              <span className="inline-block font-pixel-circle font-medium tracking-tight">
                {parts.unit || suffix}
              </span>
            )}
          </span>
        ) : null}

        {plus ? (
          <span
            aria-hidden
            className={cn(
              "ml-[0.02em] inline-block font-pixel-circle font-medium tracking-tight",
              plusClassName,
            )}
          >
            +
          </span>
        ) : null}
      </span>
    </span>
  );
}
