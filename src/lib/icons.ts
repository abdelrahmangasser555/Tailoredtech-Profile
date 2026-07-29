import {
  Ship,
  Anchor,
  FileText,
  ShieldCheck,
  Database,
  Network,
  ClipboardList,
  Activity,
  FileWarning,
  type LucideIcon,
} from "lucide-react"

const icons: Record<string, LucideIcon> = {
  Ship,
  Anchor,
  FileText,
  ShieldCheck,
  Database,
  Network,
  ClipboardList,
  Activity,
  FileWarning,
}

export function getIcon(name: string): LucideIcon {
  return icons[name] ?? Ship
}
