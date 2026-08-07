import type { NoteDocument } from "@/lib/notes-types"

const D = "2026-08-07"
const V = { sidebarNav: true, compactHero: true, showMeta: false } as const

export const gradStructureNotes: Record<string, NoteDocument> = {
  "grad-structure-features": {
    id: "grad-structure-features",
    name: "Feature folders",
    title: "Feature folders",
    description:
      "Group by product area. Portfolio code lives together, not scattered by file type.",
    createdAt: D,
    updatedAt: D,
    enabled: true,
    variants: V,
    sections: [
      {
        id: "why",
        title: "Why features",
        blocks: [
          {
            type: "markdown",
            id: "m1",
            content: `You built \`grad-portfolio\` with components at the top level. That works for a small app. The grad repo grows many product areas, so we group by **feature**.

Avoid dumping every component into one giant folder.

Prefer:

\`\`\`
src/features/portfolio/
  components/
  hooks/
  config/
\`\`\`

Everything for portfolio stays together. Delete the feature and you delete one tree.

Shared domain logic that is not UI lives under \`src/modules/\` (example: \`workspace-profile\`).`,
          },
          {
            type: "mermaid",
            id: "mm1",
            diagram: `flowchart TB
  subgraph features [src/features]
    P[portfolio]
    A[ai-chat]
  end
  subgraph modules [src/modules]
    WP[workspace-profile]
  end
  P --> WP
  A --> WP`,
          },
          {
            type: "callout",
            id: "c1",
            tone: "tip",
            title: "Continuity",
            body: "Mentally move your Hero and ProjectCard into features/portfolio/components. That is the direction the real repo takes.",
          },
        ],
      },
    ],
  },

  "grad-structure-layers": {
    id: "grad-structure-layers",
    name: "Components, hooks, utils, actions",
    title: "Components, hooks, utils, actions",
    description:
      "What belongs in each folder inside a feature and next to the API.",
    createdAt: D,
    updatedAt: D,
    enabled: true,
    variants: V,
    sections: [
      {
        id: "table",
        title: "Layer guide",
        blocks: [
          {
            type: "markdown",
            id: "m1",
            content: `| Folder | Holds | Example |
|--------|-------|---------|
| \`components/\` | UI only, no direct DB | \`portfolio-page.tsx\`, block variants |
| \`hooks/\` | TanStack Query wrappers | \`useWorkspaceProfile(id)\` |
| \`utils/\` | Pure helpers | format dates, map DTO to view model |
| \`config/\` | Registries, constants | \`portfolio-blocks.config.ts\` |
| \`app/api/\` | HTTP boundary | session check, call service |
| \`modules/*/service\` | Rules + orchestration | patch profile, emit events |
| \`modules/*/repo\` | Mongo queries only | \`findOne({ workspaceId })\` |

**Server Actions** (optional): functions marked \`'use server'\` that forms can call. Same idea as a route handler, colocated with the feature when it helps.

**Rule of thumb:** if it needs \`request\` / status codes, it is a route. If it needs business rules, it is a service. If it is a query, it is a repo. If it paints pixels, it is a component.`,
          },
          {
            type: "callout",
            id: "c1",
            tone: "info",
            title: "Grad project rule",
            body: "PortfolioPage only composes blocks from the registry. Rendering logic does not live in the page file itself.",
          },
        ],
      },
    ],
  },

  "grad-structure-tour": {
    id: "grad-structure-tour",
    name: "Grad repo tour",
    title: "Grad repo tour",
    description:
      "Map of grad-fullstack: portfolio UI, workspace-profile module, AI pipeline overview.",
    createdAt: D,
    updatedAt: D,
    enabled: true,
    variants: V,
    sections: [
      {
        id: "portfolio",
        title: "Portfolio path",
        blocks: [
          {
            type: "markdown",
            id: "m1",
            content: `From \`docs/portfolio.md\`, the live path is:

\`\`\`
MongoDB WorkspaceProfile document
  → modules/workspace-profile/workspace-profile.repo.ts
  → modules/workspace-profile/workspace-profile.service.ts
  → app/api/workspaces/[workspaceId]/portfolio/...
  → features/portfolio/hooks/
  → features/portfolio/components/portfolio-page.tsx
  → config/portfolio-blocks.config.ts
  → components/blocks/*
\`\`\`

\`PortfolioPage\` reads \`profile.layout.sections\`, looks up the matching block variant in \`portfolioBlockRegistry\`, and renders visible sections in order.`,
          },
          {
            type: "mermaid",
            id: "mm1",
            title: "Portfolio data flow",
            diagram: `flowchart LR
  DB[(MongoDB)] --> Repo[repo]
  Repo --> Svc[service]
  Svc --> API[API route]
  API --> Hook[useWorkspaceProfile]
  Hook --> Page[PortfolioPage]
  Page --> Block[Block component]`,
          },
        ],
      },
      {
        id: "ai",
        title: "AI chat overview",
        blocks: [
          {
            type: "markdown",
            id: "m2",
            content: `From \`docs/main_ai/01-architecture-overview.md\`:

1. Client posts to \`app/api/ai/workspace-chat/route.ts\`
2. Context is assembled (history, system prompt, tools, billing)
3. Vercel AI SDK \`streamText\` streams the reply
4. Tools run server-side
5. Tools do **not** mutate UI directly
6. Events go through \`dispatchAIEvent\` → \`AIEventBridge\` → TanStack cache / Zustand

You do not implement this on day one. Know it sits above the same portfolio data you already understand.`,
          },
          {
            type: "link",
            id: "l1",
            href: "https://sdk.vercel.ai/docs",
            label: "Vercel AI SDK docs",
          },
          {
            type: "link",
            id: "lr1",
            href: "https://roadmap.sh/fullstack",
            label: "roadmap.sh Full-stack",
            description: "Zoom out: see how this repo maps onto a full-stack path",
          },
          {
            type: "callout",
            id: "c1",
            tone: "tip",
            title: "Next lesson",
            body: "Open the Portfolio feature deep dive for APIs, hooks, block variants, and how to add a new block.",
          },
        ],
      },
    ],
  },

  "grad-structure-portfolio": {
    id: "grad-structure-portfolio",
    name: "Portfolio feature deep dive",
    title: "Portfolio feature deep dive",
    description:
      "Detailed map from docs/portfolio.md: schema slices, APIs, hooks, block registry, layout.",
    createdAt: D,
    updatedAt: D,
    enabled: true,
    variants: V,
    sections: [
      {
        id: "schema",
        title: "What a profile stores",
        blocks: [
          {
            type: "markdown",
            id: "m1",
            content: `The document type is \`WorkspaceProfileDTO\` in \`workspace-profile.types.ts\`.

Top-level fields you will touch often:

| Field | Role |
|-------|------|
| \`hero\` | Name, headline, bio, rates, social links |
| \`branding\` | Palette, style chips, narrative |
| \`projects\` | Proof cards (up to 24) |
| \`skills\` | Skills with proficiency |
| \`workHistory\` / \`education\` | Timeline entries |
| \`analytics\` | Credibility + benchmarks |
| \`layout\` | Section order, visibility, variants |
| \`aiMetadata\` | AI insights summary |
| \`settings\` | Theme + public page flags |

This is the same "projects array" idea from your learning app, expanded into a full identity document.`,
          },
        ],
      },
      {
        id: "api",
        title: "API surface",
        blocks: [
          {
            type: "markdown",
            id: "m2",
            content: `All routes need a Clerk session and workspace membership.

| Method | Path | Purpose |
|--------|------|---------|
| GET | \`/api/workspaces/[workspaceId]/portfolio\` | Full profile |
| PATCH | same | Partial update |
| GET/POST | \`.../portfolio/projects\` | List / add projects |
| GET | \`.../portfolio/skills\` | Skills slice |
| GET | \`.../portfolio/analytics\` | Analytics slice |
| PATCH | \`.../portfolio/branding\` | Branding only |
| PATCH | \`.../portfolio/layout\` | Order / visibility / variant |

Hooks in \`features/portfolio/hooks/\`:

- \`useWorkspaceProfile(id)\` fetches the DTO
- \`useUpdateWorkspaceProfile(id)\` PATCHes and invalidates query keys

Query keys live in \`src/lib/query/query-keys.ts\` (factory pattern, never hand-written arrays).`,
          },
        ],
      },
      {
        id: "blocks",
        title: "Block system",
        blocks: [
          {
            type: "markdown",
            id: "m3",
            content: `Every visible section in \`profile.layout.sections\` is a **block component**.

Shared props:

\`\`\`ts
type PortfolioBlockProps = {
  profile: WorkspaceProfileDTO;
  canEdit?: boolean;
  onSave: (input: WorkspaceProfileUpdateInput) => Promise<void>;
};
\`\`\`

Registry (simplified) in \`portfolio-blocks.config.ts\`:

\`\`\`ts
portfolioBlockRegistry = {
  hero: [HeroIdentitySplit, HeroEditorialCentered],
  branding: [BrandingPaletteGrid, BrandingCompactStrip],
  projects: [ProjectsScrollRail, ProjectsMasonryGrid],
  skills: [SkillsCategoryPills, SkillsProficiencyBars],
  // work_history, education, analytics, insights...
}
\`\`\`

\`layout.sections[n].variant\` picks which component renders. Invalid variants fall back to the first registered entry.

**Adding a new block variant**
1. Create \`features/portfolio/components/blocks/<section>-<variant>.tsx\`
2. Implement \`PortfolioBlockProps\`
3. Register it in the config array
4. Set the variant via layout PATCH or the AI tool \`updatePortfolioLayout\`

Empty data should show grey structural fallbacks from \`block-utils.tsx\`, never fake placeholder content.`,
          },
          {
            type: "mermaid",
            id: "mm1",
            title: "Layout → registry → block",
            diagram: `flowchart LR
  L[layout.sections] --> P[PortfolioPage]
  P --> R[portfolioBlockRegistry]
  R --> B[Block component]
  B --> U[block-utils fallbacks]`,
          },
        ],
      },
      {
        id: "ai-tools",
        title: "AI tools on portfolio",
        blocks: [
          {
            type: "markdown",
            id: "m4",
            content: `Registered in \`src/lib/ai/tool-registry.ts\`. Write tools emit \`SYNC_WORKSPACE_PROFILE\` so the UI refreshes.

| Tool | Op | Job |
|------|----|-----|
| \`getWorkspaceProfile\` | read | Load full profile into AI context |
| \`getWorkspaceProjects\` | read | Projects rail |
| \`getWorkspaceSkills\` | read | Skills slice |
| \`updateWorkspaceProfile\` | write | Patch hero, branding, skills, etc. |
| \`addWorkspaceProject\` | write | Append a proof card |
| \`updatePortfolioLayout\` | write | Reorder / toggle / change variant |
| \`updateBrandingProfile\` | write | Palette and narrative |

\`executionContext\` (\`workspaceId\`, \`modelId\`) is injected server-side. Clients never pass it.`,
          },
          {
            type: "callout",
            id: "c1",
            tone: "tip",
            title: "You finished the path",
            body: "Reopen Jump here (the project) when you clone the real repo. Use this note as the map while you explore files.",
          },
          {
            type: "link",
            id: "l1",
            href: "/notes/grad-project-roadmap/grad-jump-project",
            label: "Back to Jump here (the project)",
          },
        ],
      },
    ],
  },
}
