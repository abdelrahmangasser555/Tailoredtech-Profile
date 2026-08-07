import company from "@/config/company.json"
import clients from "@/config/clients.json"
import services from "@/config/services.json"
import presentations from "@/config/presentations.json"
import notes from "@/config/notes.json"
import projects from "@/config/projects.json"
import timeline from "@/config/timeline.json"
import navigation from "@/config/navigation.json"
import theme from "@/config/theme.json"
import hero from "@/config/hero.json"

export type Company = typeof company
export type Clients = typeof clients
export type Services = typeof services
export type ServiceItem = Services["items"][number]
export type ServicePage = ServiceItem["page"]
export type Presentations = typeof presentations
export type PresentationItem = Presentations["items"][number]
export type PresentationPage = PresentationItem["page"]
export type NotesConfigJson = typeof notes
export type Projects = typeof projects
export type Timeline = typeof timeline
export type Navigation = typeof navigation
export type ThemeConfig = typeof theme
export type HeroConfig = typeof hero

export const site = {
  company,
  clients,
  services,
  presentations,
  notes,
  projects,
  timeline,
  navigation,
  theme,
  hero,
} as const

export function getFeaturedClients() {
  return clients.items.filter((c) => c.featured)
}

export function getFeaturedProjects() {
  return projects.items.filter((p) => p.featured)
}

export function getFeaturedServices() {
  return services.items.filter((s) => s.featured)
}

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  return services.items.find((s) => s.id === slug && s.page.enabled)
}

export function getServiceSlugs() {
  return services.items.filter((s) => s.page.enabled).map((s) => s.id)
}

export function getRelatedServices(ids: readonly string[]) {
  return ids
    .map((id) => services.items.find((s) => s.id === id))
    .filter((s): s is ServiceItem => Boolean(s))
}

export function getPresentations() {
  return presentations.items.filter((p) => p.page.enabled)
}

export function getPresentationBySlug(
  slug: string
): PresentationItem | undefined {
  return presentations.items.find((p) => p.id === slug && p.page.enabled)
}

export function getPresentationSlugs() {
  return presentations.items.filter((p) => p.page.enabled).map((p) => p.id)
}
