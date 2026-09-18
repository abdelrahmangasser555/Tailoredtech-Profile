"use client"

import { cn } from "@/lib/utils"

type IllusProps = { className?: string }

/** Three starter flavors as sharp pixel-ish cards. Light-safe (no lime). */
export function MoshkaFlavors({ className }: IllusProps) {
  return (
    <svg
      viewBox="0 0 640 220"
      className={cn("w-full text-foreground", className)}
      role="img"
      aria-label="Three starter project flavors"
    >
      <rect width="640" height="220" fill="#f4f1ea" />
      {[
        { x: 24, title: "Cafe", sub: "menu + total", cup: true },
        { x: 228, title: "Harbor", sub: "log lines", cup: false },
        { x: 432, title: "Score", sub: "plus minus", cup: false },
      ].map((c) => (
        <g key={c.title} transform={`translate(${c.x} 28)`}>
          <rect
            width="184"
            height="164"
            fill="#fff"
            stroke="#0a0a0a"
            strokeWidth="2"
          />
          <rect x="0" y="0" width="184" height="10" fill="#0a0a0a" />
          <text
            x="92"
            y="52"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize="18"
            fill="#0a0a0a"
          >
            {c.title}
          </text>
          <text
            x="92"
            y="78"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize="11"
            fill="#666"
          >
            {c.sub}
          </text>
          {c.cup ? (
            <rect x="72" y="100" width="40" height="36" fill="#0a0a0a" />
          ) : c.title === "Harbor" ? (
            <path d="M40 132 L92 96 L144 132 Z" fill="#0a0a0a" />
          ) : (
            <>
              <rect x="52" y="104" width="28" height="28" fill="#0a0a0a" />
              <rect x="104" y="104" width="28" height="28" fill="#0a0a0a" />
            </>
          )}
        </g>
      ))}
    </svg>
  )
}

/** Cursor as a pair of hands on a keyboard, pixel-adjacent. */
export function MoshkaCursorHands({ className }: IllusProps) {
  return (
    <svg
      viewBox="0 0 640 200"
      className={cn("w-full text-foreground", className)}
      role="img"
      aria-label="You steer, Cursor types"
    >
      <rect width="640" height="200" fill="#111" />
      <rect x="80" y="48" width="480" height="104" fill="#1c1c1c" stroke="#d4ff00" strokeWidth="2" />
      <text
        x="320"
        y="88"
        textAnchor="middle"
        fontFamily="ui-monospace, monospace"
        fontSize="14"
        fill="#d4ff00"
      >
        prompt: name the file
      </text>
      <text
        x="320"
        y="118"
        textAnchor="middle"
        fontFamily="ui-monospace, monospace"
        fontSize="12"
        fill="#888"
      >
        you read the diff
      </text>
      <rect x="140" y="160" width="70" height="18" fill="#d4ff00" />
      <rect x="430" y="160" width="70" height="18" fill="#d4ff00" />
    </svg>
  )
}
