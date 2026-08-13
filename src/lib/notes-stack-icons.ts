/**
 * Canonical stack-icon slugs for notes. Keep this file free of React so
 * chatbot tools (server) can list valid names.
 *
 * Aliases are normalized (lowercase, no punctuation) → canonical slug.
 */
export const STACK_ICON_SLUGS = [
  "html5",
  "css",
  "javascript",
  "typescript",
  "react",
  "nodedotjs",
  "nextdotjs",
  "git",
  "github",
  "docker",
  "python",
  "go",
  "postgresql",
  "mongodb",
  "mysql",
  "sqlite",
  "redis",
  "prisma",
  "express",
  "graphql",
  "tailwindcss",
  "vercel",
  "azure",
  "azuredevops",
  "aws",
  "googlecloud",
  "kubernetes",
  "linux",
  "nginx",
  "cloudflare",
  "firebase",
  "supabase",
] as const

export type StackIconSlug = (typeof STACK_ICON_SLUGS)[number]

/** Normalized alias → canonical slug used in the icon map. */
export const STACK_ICON_ALIASES: Record<string, StackIconSlug> = {
  html: "html5",
  html5: "html5",
  css: "css",
  css3: "css",
  js: "javascript",
  javascript: "javascript",
  ts: "typescript",
  typescript: "typescript",
  react: "react",
  reactjs: "react",
  node: "nodedotjs",
  nodejs: "nodedotjs",
  nodedotjs: "nodedotjs",
  next: "nextdotjs",
  nextjs: "nextdotjs",
  nextdotjs: "nextdotjs",
  git: "git",
  github: "github",
  docker: "docker",
  python: "python",
  go: "go",
  golang: "go",
  postgres: "postgresql",
  postgresql: "postgresql",
  mongo: "mongodb",
  mongodb: "mongodb",
  mongodbcompass: "mongodb",
  mongoose: "mongodb",
  mysql: "mysql",
  sqlite: "sqlite",
  redis: "redis",
  prisma: "prisma",
  express: "express",
  expressjs: "express",
  graphql: "graphql",
  tailwind: "tailwindcss",
  tailwindcss: "tailwindcss",
  vercel: "vercel",
  azure: "azure",
  msazure: "azure",
  microsoftazure: "azure",
  microsoft: "azure",
  azurecloud: "azure",
  azuredevops: "azuredevops",
  aws: "aws",
  amazon: "aws",
  amazonaws: "aws",
  amazonwebservices: "aws",
  gcp: "googlecloud",
  googlecloud: "googlecloud",
  google: "googlecloud",
  k8s: "kubernetes",
  kubernetes: "kubernetes",
  linux: "linux",
  nginx: "nginx",
  cloudflare: "cloudflare",
  firebase: "firebase",
  supabase: "supabase",
}

export function normalizeStackIconKey(raw: string): string {
  return raw.trim().toLowerCase().replace(/^si/, "").replace(/[^a-z0-9]/g, "")
}

export function resolveStackIconSlug(raw: string): StackIconSlug | null {
  const key = normalizeStackIconKey(raw)
  if (!key) return null
  const aliased = STACK_ICON_ALIASES[key]
  if (aliased) return aliased
  if ((STACK_ICON_SLUGS as readonly string[]).includes(key)) {
    return key as StackIconSlug
  }
  return null
}

export const STACK_ICON_HINT = STACK_ICON_SLUGS.join(", ")
