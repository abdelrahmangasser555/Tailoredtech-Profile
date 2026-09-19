import type {
  NoteBlock,
  NoteDocument,
  NoteExplainTerm,
  NoteSection,
  NotesFileRef,
  NotesFolderChat,
  NotesFolderNode,
  NotesStarter,
  NotesTreeNode,
} from "@/lib/notes-types"

export const D = "2026-09-17"
export const V = { sidebarNav: true, compactHero: true, showMeta: false } as const

export const MOSHKA_TALK =
  "You are tutoring Ahmed Tamer (nickname Moshka), 19, cousin of Abdelrahman at TailoredTech. Easy English. Direct. Hands-on. Tell him to try first, then give the full snippet and the exact file path. Label shell commands as run in the terminal. No em dashes or double hyphens as punctuation. Short sentences. Do not force jokes."

export const MOSHKA_LEARNER =
  "Ahmed Tamer (Moshka), 19. Cousin of Abdelrahman (founder of TailoredTech). Tutorials and Scrimba failed for him. He wants fast, hands-on builds, AI in the workflow, and real projects. Goal: in about 6 months he can work on TailoredTech client work with the team."

export function file(id: string, name: string): NotesFileRef {
  return { type: "file", id, name, createdAt: D, updatedAt: D }
}

export function folder(
  id: string,
  name: string,
  children: NotesTreeNode[],
  extra?: Partial<
    Omit<NotesFolderNode, "type" | "id" | "name" | "children" | "createdAt" | "updatedAt">
  >
): NotesFolderNode {
  return {
    type: "folder",
    id,
    name,
    createdAt: D,
    updatedAt: D,
    children,
    ...extra,
  }
}

export function projectChat(
  objective: string,
  prerequisites: string
): NotesFolderChat {
  return {
    extraPrompt: MOSHKA_TALK,
    objective,
    talkStyle: MOSHKA_TALK,
    prerequisites,
    learner: MOSHKA_LEARNER,
  }
}

export function starter(
  id: string,
  label: string,
  file: string,
  description: string
): NotesStarter {
  return {
    id,
    label,
    href: `/notes/moshka/starters/${file}`,
    description,
  }
}

export function explain(
  id: string,
  label: string,
  title: string,
  body: string,
  blocks?: NoteBlock[]
): NoteExplainTerm {
  return { id, label, title, body, blocks }
}

export function lesson(opts: {
  id: string
  name: string
  title?: string
  description: string
  sections: NoteSection[]
  starters?: NotesStarter[]
  explains?: NoteExplainTerm[]
}): NoteDocument {
  return {
    id: opts.id,
    name: opts.name,
    title: opts.title ?? opts.name,
    description: opts.description,
    createdAt: D,
    updatedAt: D,
    enabled: true,
    variants: V,
    starters: opts.starters,
    explains: opts.explains,
    chat: { scopeRootId: "moshka" },
    sections: opts.sections,
  }
}

export function md(id: string, content: string): NoteBlock {
  return { type: "markdown", id, content }
}

export function tip(
  id: string,
  title: string,
  body: string,
  explainId?: string
): NoteBlock {
  return { type: "callout", id, tone: "tip", title, body, explainId }
}

export function info(
  id: string,
  title: string,
  body: string,
  explainId?: string
): NoteBlock {
  return { type: "callout", id, tone: "info", title, body, explainId }
}

export function warn(
  id: string,
  title: string,
  body: string,
  explainId?: string
): NoteBlock {
  return { type: "callout", id, tone: "warn", title, body, explainId }
}

function clockToSeconds(raw: string): number | undefined {
  const t = raw.trim().toLowerCase()
  if (!t || t === "end") return undefined
  if (/^\d+$/.test(t)) return Number(t)
  const parts = t.split(":").map(Number)
  if (parts.some((n) => Number.isNaN(n))) return undefined
  if (parts.length === 3) return parts[0]! * 3600 + parts[1]! * 60 + parts[2]!
  if (parts.length === 2) return parts[0]! * 60 + parts[1]!
  return undefined
}

export function yt(
  id: string,
  url: string,
  title: string,
  caption: string,
  startSeconds?: number,
  endSeconds?: number
): NoteBlock {
  return {
    type: "youtube",
    id,
    url,
    title,
    caption,
    startSeconds,
    endSeconds,
  }
}

/** Long or clipped video. Caption always states Watch from X to Y. */
export function ytWatch(
  id: string,
  url: string,
  title: string,
  from: string,
  to: string,
  why: string
): NoteBlock {
  const range =
    to.toLowerCase() === "end"
      ? `from ${from} to the end`
      : `from ${from} to ${to}`
  return yt(
    id,
    url,
    title,
    `Watch ${range}. ${why}`,
    clockToSeconds(from),
    to.toLowerCase() === "end" ? undefined : clockToSeconds(to)
  )
}

export function mermaid(
  id: string,
  diagram: string,
  title?: string,
  caption?: string,
  nodeExplains?: Record<string, string>
): NoteBlock {
  return { type: "mermaid", id, diagram, title, caption, nodeExplains }
}

export function link(
  id: string,
  href: string,
  label: string,
  description?: string
): NoteBlock {
  return { type: "link", id, href, label, description }
}

export function tasks(
  id: string,
  title: string,
  items: { id: string; label: string }[]
): NoteBlock {
  return {
    type: "tasks",
    id,
    title,
    items: items.map((item) => ({ id: item.id, label: item.label })),
  }
}

export function playground(
  id: string,
  initialCode: string,
  opts?: {
    title?: string
    caption?: string
    language?: string
    expectIncludes?: string
    hint?: string
  }
): NoteBlock {
  return {
    type: "playground",
    id,
    language: opts?.language ?? "html",
    initialCode,
    title: opts?.title,
    caption: opts?.caption,
    expectIncludes: opts?.expectIncludes,
    hint: opts?.hint,
  }
}

export function download(
  id: string,
  files: NotesStarter[],
  title = "Starter zip",
  caption?: string
): NoteBlock {
  return { type: "download", id, files, title, caption }
}

export function illustration(
  id: string,
  component: string,
  title?: string,
  caption?: string,
  props?: Record<string, unknown>
): NoteBlock {
  return { type: "illustration", id, component, title, caption, props }
}

const MOSHKA_IMG = "/notes/moshka/images"

/** Shown under figures; full spec in src/config/moshka-image-prompts.txt */
export const MOSHKA_IMG_CAPTION =
  "Cream + black ink style. Replace PNG in public/notes/moshka/images/ using the prompt file if you want different art."

export type FigureMeta = {
  figureNumber?: number
  figureAnchor?: string
}

export function gallery(
  id: string,
  images: { src: string; label: string }[],
  title?: string,
  caption?: string,
  meta?: FigureMeta
): NoteBlock {
  return {
    type: "gallery",
    id,
    images,
    title,
    caption,
    figureNumber: meta?.figureNumber,
    figureAnchor:
      meta?.figureAnchor ?? (meta?.figureNumber !== undefined ? id : undefined),
  }
}

/** Markdown link to a numbered figure in the same note */
export function figLink(n: number, anchor: string) {
  return `[Figure ${n}](#note-fig-${anchor})`
}

/** Explanation paragraph first, then numbered figure (use figLink in lead text) */
export function figureN(
  n: number,
  anchor: string,
  filename: string,
  label: string,
  lead: string,
  caption?: string
): NoteBlock[] {
  return [
    md(`fig-lead-${anchor}`, lead),
    gallery(
      anchor,
      [{ src: `${MOSHKA_IMG}/${filename}`, label }],
      label,
      caption ?? MOSHKA_IMG_CAPTION,
      { figureNumber: n, figureAnchor: anchor }
    ),
  ]
}

/** Single image from public/notes/moshka/images/ */
export function figure(
  id: string,
  filename: string,
  label: string,
  caption?: string,
  meta?: FigureMeta
): NoteBlock {
  return gallery(
    id,
    [{ src: `${MOSHKA_IMG}/${filename}`, label }],
    label,
    caption ?? MOSHKA_IMG_CAPTION,
    meta
  )
}

/** Line diagram / infographic (same folder + style as figure) */
export function ill(
  id: string,
  filename: string,
  label: string,
  caption?: string
): NoteBlock {
  return figure(id, filename, label, caption)
}

/** Top/bottom or two-panel explainers (same visual system) */
export function meme(
  id: string,
  filename: string,
  label: string,
  caption?: string
): NoteBlock {
  return figure(
    id,
    filename,
    label,
    caption ?? "Meme-style explainer. Same cream + ink look as the other pictures."
  )
}

export function stack(
  id: string,
  title: string,
  layers: {
    id: string
    label: string
    explainId?: string
    items: { icon: string; label: string; explainId?: string }[]
  }[],
  edges?: { from: string; to: string; label?: string }[]
): NoteBlock {
  return { type: "stack", id, title, layers, edges }
}

export const STARTERS = {
  cafe: starter(
    "pixel-cafe",
    "Pixel Cafe zip",
    "pixel-cafe.zip",
    "Tiny cafe menu. HTML, CSS, JS. Open index.html."
  ),
  harbor: starter(
    "harbor-log",
    "Harbor Log zip",
    "harbor-log.zip",
    "Captain diary page. Same skills, different story."
  ),
  score: starter(
    "pixel-scoreboard",
    "Pixel Scoreboard zip",
    "pixel-scoreboard.zip",
    "Click to add points. Same skills, game flavor."
  ),
  port: starter(
    "port-watch",
    "Port Watch zip",
    "port-watch.zip",
    "Dense dashboard skeleton. HTML + CSS grid."
  ),
  next: starter(
    "next-harbor",
    "Next Harbor zip",
    "next-harbor.zip",
    "Minimal Next.js App Router files. No node_modules. Run npm install after unzip."
  ),
}

export const VID = {
  html: "https://www.youtube.com/watch?v=ok-plXXHlWw",
  css: "https://www.youtube.com/watch?v=OEV8gMkCHXQ",
  js: "https://www.youtube.com/watch?v=DHjqpvDnNGE",
  react: "https://www.youtube.com/watch?v=Tn6-PIqc4UM",
  next: "https://www.youtube.com/watch?v=Sklc_fQBmcs",
  tailwind: "https://www.youtube.com/watch?v=mr15Xzb1Ook",
  mongo: "https://www.youtube.com/watch?v=-bt_y4Loofg",
  sql: "https://www.youtube.com/watch?v=zsjvFFKOm3c",
  postgres: "https://www.youtube.com/watch?v=n2Fluyr3lbc",
  supabase: "https://www.youtube.com/watch?v=zBZgdTb-dns",
  docker: "https://www.youtube.com/watch?v=Gjnup-PuquQ",
  aiSdk: "https://www.youtube.com/watch?v=y4IMq43KvRw",
  appRouterMistakes: "https://www.youtube.com/watch?v=RBM03RihZVs",
  htmlBro: "https://www.youtube.com/watch?v=HD13eq_Pmp8",
  cssBro: "https://www.youtube.com/watch?v=wRNinF7YQqQ",
  jsTraversy: "https://www.youtube.com/watch?v=hdI2bqOjy3c",
  htmlCssNinja: "https://www.youtube.com/watch?v=hu-q2zYwEYs",
  reactWds: "https://www.youtube.com/watch?v=hQAHSlTtcmY",
  sqlBro: "https://www.youtube.com/watch?v=5OdVJbNCSso",
  mongoNinja: "https://www.youtube.com/watch?v=ExcRbA7fy_A",
  mongoCompass: "https://www.youtube.com/watch?v=bJSj1a84I20",
  mongoTraversy: "https://www.youtube.com/watch?v=2QQGWYe7IDU",
  dockerNana: "https://www.youtube.com/watch?v=3c-iBn73dDE",
  tailwindTraversy: "https://www.youtube.com/watch?v=dFgzHOX84xQ",
  nextNinja: "https://www.youtube.com/watch?v=A63UxsQsEbU",
  git: "https://www.youtube.com/watch?v=hwP7WQkmECE",
  gitFcc: "https://www.youtube.com/watch?v=RGOj5yH7evk",
  ghCli: "https://www.youtube.com/watch?v=vt7doLGHzOk",
}
