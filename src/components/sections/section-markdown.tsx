"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"

type SectionMarkdownProps = {
  content: string
  className?: string
  /** Dark solution/presentation sections vs light surfaces */
  tone?: "dark" | "light"
}

/**
 * Renders section body markdown (headings, lists, links, emphasis).
 * Keeps brand typography: readable sans for body, mono for code.
 */
export function SectionMarkdown({
  content,
  className,
  tone = "dark",
}: SectionMarkdownProps) {
  const dark = tone === "dark"

  return (
    <div
      className={cn(
        "section-md mt-5 max-w-2xl text-base leading-relaxed md:text-[1.05rem]",
        dark ? "text-white/45" : "text-muted-foreground",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => (
            <h3
              className={cn(
                "mt-8 mb-3 font-pixel-circle text-xl font-medium tracking-tight first:mt-0 md:text-2xl",
                dark ? "text-white" : "text-foreground"
              )}
            >
              {children}
            </h3>
          ),
          h3: ({ children }) => (
            <h4
              className={cn(
                "mt-6 mb-2 font-mono text-[11px] tracking-[0.18em] uppercase first:mt-0",
                dark ? "text-accent" : "text-foreground/55"
              )}
            >
              {children}
            </h4>
          ),
          h4: ({ children }) => (
            <h5
              className={cn(
                "mt-5 mb-2 text-sm font-medium first:mt-0",
                dark ? "text-white/80" : "text-foreground"
              )}
            >
              {children}
            </h5>
          ),
          p: ({ children }) => (
            <p className="mt-4 first:mt-0 leading-relaxed">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="mt-4 flex list-none flex-col gap-2.5 first:mt-0 [&_li]:relative [&_li]:pl-4 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.55em] [&_li]:before:size-1.5 [&_li]:before:bg-accent">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mt-4 flex list-decimal flex-col gap-2.5 pl-5 first:mt-0 marker:font-mono marker:text-[11px] marker:text-accent [&_li]:pl-1">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li
              className={cn(
                "text-sm leading-relaxed md:text-[15px]",
                dark ? "text-white/70" : "text-foreground/80"
              )}
            >
              {children}
            </li>
          ),
          strong: ({ children }) => (
            <strong
              className={cn(
                "font-medium",
                dark ? "text-white/85" : "text-foreground"
              )}
            >
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className={dark ? "text-white/60" : "text-foreground/70"}>
              {children}
            </em>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="underline decoration-accent/50 underline-offset-4 transition hover:decoration-accent"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noreferrer" : undefined}
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote
              className={cn(
                "mt-4 border-l-2 pl-4 first:mt-0",
                dark
                  ? "border-accent/50 text-white/55"
                  : "border-foreground/25 text-muted-foreground"
              )}
            >
              {children}
            </blockquote>
          ),
          hr: () => (
            <hr
              className={cn(
                "my-6 border-0 border-t",
                dark ? "border-white/10" : "border-foreground/10"
              )}
            />
          ),
          code: ({ className: codeClass, children }) => {
            const isBlock = Boolean(codeClass)
            if (isBlock) {
              return (
                <code
                  className={cn(
                    "mt-4 block overflow-x-auto border p-3 font-mono text-xs first:mt-0",
                    dark
                      ? "border-white/10 bg-white/[0.03] text-white/70"
                      : "border-foreground/10 bg-foreground/[0.03] text-foreground/80"
                  )}
                >
                  {children}
                </code>
              )
            }
            return (
              <code
                className={cn(
                  "rounded-sm px-1 py-0.5 font-mono text-[0.85em]",
                  dark
                    ? "bg-white/10 text-accent"
                    : "bg-foreground/5 text-foreground"
                )}
              >
                {children}
              </code>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
