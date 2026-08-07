import type { NoteDocument } from "@/lib/notes-types"

const D = "2026-08-07"
const V = { sidebarNav: true, compactHero: true, showMeta: false } as const

export const gradNextNotes: Record<string, NoteDocument> = {
  "grad-next-why": {
    id: "grad-next-why",
    name: "Why Next.js",
    title: "Why Next.js",
    description:
      "Your React UI needs routes and an API. The grad repo uses Next for both.",
    createdAt: D,
    updatedAt: D,
    enabled: true,
    variants: V,
    sections: [
      {
        id: "why",
        title: "What you gain",
        blocks: [
          {
            type: "markdown",
            id: "m1",
            content: `You have a working Vite React portfolio in \`grad-app\`. That is client-only. The real grad project needs:

- Pages at real URLs (\`/portfolio\`, \`/workspaces/...\`)
- Server code that talks to MongoDB
- One deployable app

| Vite React | Next.js |
|------------|---------|
| Client SPA | Server + client components |
| Separate backend usually | \`app/api\` route handlers |
| Manual router library | Folders become routes |

**Grad project uses Next.js.** Your React components move into \`src/features/...\` later. First, understand App Router.`,
          },
          {
            type: "link",
            id: "l1",
            href: "https://nextjs.org/learn",
            label: "Next.js Learn course",
            description: "Free interactive chapters. Do the App Router parts.",
          },
          {
            type: "link",
            id: "lr1",
            href: "https://roadmap.sh/nextjs",
            label: "roadmap.sh Next.js",
          },
          {
            type: "youtube",
            id: "yt1",
            url: "https://www.youtube.com/watch?v=__mSgDEOyv8",
            title: "Next.js 13 basics (Beyond Fireship)",
            caption: "App Router overview. Pair with the official Learn course.",
          },
          {
            type: "link",
            id: "lyt2",
            href: "https://www.youtube.com/watch?v=Sklc_fQBmcs",
            label: "Next.js in 100 seconds + beginner tutorial (Fireship)",
          },
          {
            type: "link",
            id: "lyt3",
            href: "https://www.youtube.com/watch?v=lkjrUW8fI40",
            label: "Next.js 14 full course (optional project)",
            description: "Longer build if you want extra practice after the notes path",
          },
        ],
      },
    ],
  },

  "grad-next-app-router": {
    id: "grad-next-app-router",
    name: "App Router tour",
    title: "App Router tour",
    description:
      "Scaffold Next, then move Hero and ProjectCard into the app folder.",
    createdAt: D,
    updatedAt: D,
    enabled: true,
    variants: V,
    sections: [
      {
        id: "map",
        title: "Create the Next app",
        blocks: [
          {
            type: "markdown",
            id: "m1",
            content: `From \`Documents/projects\`:

\`\`\`bash
npx create-next-app@latest grad-portfolio --ts --tailwind --app --src-dir --eslint --no-turbopack
cd grad-portfolio
npm run dev
\`\`\`

Open \`http://localhost:3000\`.

**Folder map:**

\`\`\`
src/app/
  layout.tsx     shell (fonts, html body)
  page.tsx       route /
  globals.css
\`\`\`

A file named \`page.tsx\` is a route. Everything else is a normal module.`,
          },
          {
            type: "mermaid",
            id: "mm1",
            diagram: `flowchart LR
  L[layout.tsx] --> P["page.tsx (/)"]
  L --> PF["portfolio/page.tsx"]
  PF --> C[features or components]`,
          },
          {
            type: "link",
            id: "l1",
            href: "https://nextjs.org/docs/app",
            label: "Next.js App Router docs",
          },
        ],
      },
      {
        id: "move",
        title: "Move your React UI in",
        blocks: [
          {
            type: "markdown",
            id: "m2",
            content: `1. Copy \`Hero.tsx\`, \`ProjectCard.tsx\`, and \`projects.ts\` from \`grad-app/src\` into \`grad-portfolio/src/components\` (and \`src/data\`)
2. Import them in \`src/app/page.tsx\`
3. Add \`"use client"\` at the top of \`page.tsx\` if you keep the theme \`useState\` there (or keep page as server and put the toggle in a small client child)

Example server page with static data:

\`\`\`tsx
import { Hero } from "@/components/Hero";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/data/projects";

export default function HomePage() {
  return (
    <main>
      <Hero name="Your Name" tagline="Full-stack freelancer" />
      <section>
        <h2>Projects</h2>
        {projects.map((p) => (
          <ProjectCard key={p.id} title={p.title} summary={p.summary} />
        ))}
      </section>
    </main>
  );
}
\`\`\`

Same UI as Vite, now at \`/\` inside Next.`,
          },
          {
            type: "callout",
            id: "c1",
            tone: "tip",
            title: "Continuity",
            body: "grad-portfolio is now your main folder. Next lesson adds /api/projects so the list can come from the server.",
          },
        ],
      },
    ],
  },

  "grad-next-api": {
    id: "grad-next-api",
    name: "API routes & data",
    title: "API routes & data",
    description:
      "Add a route handler, fetch it from the UI, then connect Mongo in the next folder.",
    createdAt: D,
    updatedAt: D,
    enabled: true,
    variants: V,
    sections: [
      {
        id: "route",
        title: "First API route",
        blocks: [
          {
            type: "markdown",
            id: "m1",
            content: `**Create** \`src/app/api/projects/route.ts\`:

\`\`\`ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    { id: "1", title: "Fleet dashboard", summary: "Maritime ops UI" },
    { id: "2", title: "Booking tool", summary: "Field scheduling" },
  ]);
}
\`\`\`

Visit \`http://localhost:3000/api/projects\` in the browser. You should see JSON.

**Create** a client list component \`src/components/ProjectList.tsx\`:

\`\`\`tsx
"use client";

import { useEffect, useState } from "react";
import { ProjectCard } from "./ProjectCard";

type Project = { id: string; title: string; summary: string };

export function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then(setProjects);
  }, []);

  return (
    <section>
      <h2>Projects</h2>
      {projects.map((p) => (
        <ProjectCard key={p.id} title={p.title} summary={p.summary} />
      ))}
    </section>
  );
}
\`\`\`

Use \`<ProjectList />\` from \`page.tsx\` instead of the local array.

**Flow:** Browser → Next route handler → JSON → React list.`,
          },
          {
            type: "mermaid",
            id: "mm1",
            diagram: `sequenceDiagram
  participant UI as React UI
  participant API as app/api/route.ts
  participant DB as MongoDB next lesson
  UI->>API: GET /api/projects
  API->>DB: find()
  DB-->>API: documents
  API-->>UI: JSON`,
          },
          {
            type: "link",
            id: "l1",
            href: "https://nextjs.org/docs/app/building-your-application/routing/route-handlers",
            label: "Route Handlers in the Next.js docs",
          },
        ],
      },
    ],
  },
}
