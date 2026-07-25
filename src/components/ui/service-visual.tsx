import Image from "next/image"
import { getIcon } from "@/lib/icons"
import { cn } from "@/lib/utils"

type ServiceVisualProps = {
  icon?: string
  logo?: string | null
  title: string
  className?: string
  iconClassName?: string
  /** When true, no background — bare icon/logo */
  bare?: boolean
}

/** Renders a service logo when set, otherwise a Lucide icon */
export function ServiceVisual({
  icon,
  logo,
  title,
  className,
  iconClassName,
  bare = true,
}: ServiceVisualProps) {
  if (logo) {
    return (
      <span
        className={cn(
          "relative inline-flex size-6 shrink-0 items-center justify-center overflow-hidden",
          !bare && "size-9 rounded-sm bg-muted",
          className
        )}
      >
        <Image
          src={logo}
          alt=""
          width={24}
          height={24}
          className="object-contain"
        />
        <span className="sr-only">{title}</span>
      </span>
    )
  }

  const Icon = getIcon(icon ?? "Ship")
  return (
    <span
      className={cn(
        "inline-flex size-6 shrink-0 items-center justify-center text-accent",
        !bare &&
          "size-9 rounded-sm bg-[color-mix(in_oklch,var(--accent)_14%,transparent)]",
        className
      )}
    >
      <Icon className={cn("size-4", iconClassName)} strokeWidth={1.75} aria-hidden />
      <span className="sr-only">{title}</span>
    </span>
  )
}
