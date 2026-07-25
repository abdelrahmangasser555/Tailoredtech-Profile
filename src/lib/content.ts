import company from "@/config/company.json"
import clients from "@/config/clients.json"
import services from "@/config/services.json"
import projects from "@/config/projects.json"
import timeline from "@/config/timeline.json"
import navigation from "@/config/navigation.json"
import theme from "@/config/theme.json"

export type Company = typeof company
export type Clients = typeof clients
export type Services = typeof services
export type Projects = typeof projects
export type Timeline = typeof timeline
export type Navigation = typeof navigation
export type ThemeConfig = typeof theme

export const site = {
  company,
  clients,
  services,
  projects,
  timeline,
  navigation,
  theme,
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
