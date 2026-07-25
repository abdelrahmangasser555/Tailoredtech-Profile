import { cn } from "@/lib/utils"

type SectionProps = {
  children: React.ReactNode
  className?: string
  id?: string
  tone?: "light" | "dark"
  container?: boolean
}

export function Section({
  children,
  className,
  id,
  tone = "light",
  container = true,
}: SectionProps) {
  return (
    <section
      id={id}
      data-tone={tone}
      className={cn(
        "relative overflow-x-clip overflow-y-visible",
        tone === "dark"
          ? "bg-[var(--section-dark)] text-[oklch(0.96_0.005_100)] [--background:var(--section-dark)] [--foreground:oklch(0.96_0.005_100)] [--muted-foreground:oklch(0.68_0.01_260)] [--border:oklch(1_0_0_/_10%)] [--accent:oklch(0.93_0.21_115)] [--accent-foreground:oklch(0.14_0.02_115)]"
          : "bg-[var(--section-light)] text-foreground",
        className
      )}
    >
      {container ? (
        <div className="relative mx-auto w-full max-w-6xl px-5 py-24 md:px-8 md:py-32">
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  )
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  className?: string
}) {
  return (
    <header className={cn("mb-14 md:mb-20 max-w-3xl", className)}>
      {eyebrow && (
        <p className="mb-4 font-mono text-[11px] tracking-[0.22em] uppercase text-accent">
          {eyebrow}
        </p>
      )}
      <h2 className="font-heading text-4xl font-semibold tracking-tight md:text-5xl lg:text-[3.5rem] leading-[1.05] text-balance">
        {title}
      </h2>
      {description && (
        <p className="mt-5 max-w-md text-base text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
    </header>
  )
}
