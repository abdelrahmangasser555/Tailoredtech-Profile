import {
  Ship,
  Anchor,
  FileText,
  ShieldCheck,
  Database,
  Network,
  type LucideIcon,
} from "lucide-react"

const icons: Record<string, LucideIcon> = {
  Ship,
  Anchor,
  FileText,
  ShieldCheck,
  Database,
  Network,
}

export function getIcon(name: string): LucideIcon {
  return icons[name] ?? Ship
}
