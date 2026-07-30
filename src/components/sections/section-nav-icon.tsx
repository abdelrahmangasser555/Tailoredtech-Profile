import {
  Anchor,
  ArrowLeftRight,
  BarChart3,
  Binoculars,
  Building2,
  CalendarCheck,
  ClipboardList,
  Database,
  Eye,
  GitBranch,
  HelpCircle,
  Key,
  Layers,
  LayoutGrid,
  LogIn,
  Megaphone,
  Radio,
  Receipt,
  Route,
  ScanEye,
  Server,
  Settings2,
  Shield,
  Ship,
  UserCheck,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react"

/**
 * Curated Lucide icons for isometric section layer nav.
 * Override per section via `icon` in services.json / presentations.json.
 */
export const SECTION_NAV_ICONS: Record<string, LucideIcon> = {
  Anchor,
  ArrowLeftRight,
  BarChart3,
  Binoculars,
  Building2,
  CalendarCheck,
  ClipboardList,
  Database,
  Eye,
  GitBranch,
  HelpCircle,
  Key,
  Layers,
  LayoutGrid,
  LogIn,
  Megaphone,
  Radio,
  Receipt,
  Route,
  ScanEye,
  Server,
  Settings2,
  Shield,
  Ship,
  UserCheck,
  Users,
  UsersRound,
}

/** Sensible default icon name per common section id */
const DEFAULT_ICON_BY_SECTION_ID: Record<string, string> = {
  overview: "LayoutGrid",
  capabilities: "Layers",
  roles: "Users",
  platform: "Server",
  workflows: "GitBranch",
  workflow: "GitBranch",
  observations: "ScanEye",
  analytics: "BarChart3",
  exclusive: "Shield",
  flow: "Route",
  settlement: "Receipt",
  fit: "UserCheck",
  delivery: "CalendarCheck",
  ownership: "Key",
  people: "UsersRound",
  fleet: "Ship",
  icb: "ClipboardList",
  connect: "Radio",
  why: "HelpCircle",
  "sign-on": "LogIn",
  observer: "Binoculars",
  vessel: "Anchor",
  office: "Building2",
  admin: "Settings2",
  migration: "Database",
}

export type SectionNavIconSource = {
  id: string
  icon?: string | null
}

export function getSectionNavIcon(name: string | null | undefined): LucideIcon | null {
  if (!name) return null
  return SECTION_NAV_ICONS[name] ?? null
}

export function resolveSectionNavIcon(section: SectionNavIconSource): LucideIcon {
  const explicit = getSectionNavIcon(section.icon)
  if (explicit) return explicit

  const byId = DEFAULT_ICON_BY_SECTION_ID[section.id]
  if (byId) {
    const resolved = getSectionNavIcon(byId)
    if (resolved) return resolved
  }

  return Layers
}

export const SECTION_NAV_ICON_NAMES = Object.keys(SECTION_NAV_ICONS)
