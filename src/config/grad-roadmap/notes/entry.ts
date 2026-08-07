import type { NoteDocument } from "@/lib/notes-types"

const D = "2026-08-07"
const V = { sidebarNav: true, compactHero: true, showMeta: false } as const

export const gradEntryNotes: Record<string, NoteDocument> = {
  "grad-start-beginner": {
    id: "grad-start-beginner",
    name: "Start here (beginner)",
    title: "Start here (beginner)",
    description:
      "Zero to the grad codebase. Follow lessons in order. Each one builds on the last.",
    createdAt: D,
    updatedAt: D,
    enabled: true,
    variants: V,
    sections: [
      {
        id: "story",
        title: "The story you are building",
        blocks: [
          {
            type: "markdown",
            id: "m1",
            content: `You are building a **freelancer portfolio app** in small steps.

1. Install your tools (VS Code + Node)
2. Save work with Git and put it on GitHub
3. Shape a simple page with HTML, CSS, and JS
4. Rebuild that page in React
5. Move it into Next.js (routing + API)
6. Store data in MongoDB
7. Learn how the real grad repo is structured

You do **not** need to memorize syntax. AI can write code. Your job is to understand **where files live**, **what each layer does**, and **how data moves**.`,
          },
          {
            type: "mermaid",
            id: "mm1",
            title: "Continuous path",
            diagram: `flowchart LR
  T[Tools] --> G[Git]
  G --> W[HTML CSS JS]
  W --> R[React]
  R --> N[Next.js]
  N --> M[MongoDB]
  M --> S[Codebase]
  S --> P[Grad project]`,
          },
          {
            type: "callout",
            id: "c1",
            tone: "tip",
            title: "How to study",
            body: "Keep Next at the bottom of each lesson. Run real commands on your machine. Use the interactive terminals and editors inside the notes. When something breaks, fix it before moving on.",
          },
          {
            type: "link",
            id: "lr1",
            href: "https://roadmap.sh/fullstack",
            label: "roadmap.sh Full-stack",
            description: "Visual path for the whole stack you are learning",
          },
          {
            type: "link",
            id: "lr2",
            href: "https://roadmap.sh/frontend",
            label: "roadmap.sh Frontend",
            description: "HTML, CSS, JS, React track",
          },
          {
            type: "link",
            id: "lr3",
            href: "https://roadmap.sh/backend",
            label: "roadmap.sh Backend",
            description: "APIs, databases, Node side of the stack",
          },
        ],
      },
      {
        id: "first",
        title: "First step",
        blocks: [
          {
            type: "markdown",
            id: "m2",
            content: `Open the next lesson and install VS Code. After that, install Node. Then continue into Git.

If a lesson says "from last time", it means you should still have that folder open from the previous lesson.`,
          },
          {
            type: "link",
            id: "l1",
            href: "/notes/grad-project-roadmap/grad-00-tools/grad-vscode-setup",
            label: "Next: Install VS Code",
            description: "Editor setup for beginners",
          },
        ],
      },
    ],
  },

  "grad-start-intermediate": {
    id: "grad-start-intermediate",
    name: "Start here (intermediate)",
    title: "Start here (intermediate)",
    description:
      "Skip early web basics if you already know them. Still skim GitHub and tools if needed.",
    createdAt: D,
    updatedAt: D,
    enabled: true,
    variants: { sidebarNav: false, compactHero: true, showMeta: false },
    sections: [
      {
        id: "skip",
        title: "Recommended path",
        blocks: [
          {
            type: "markdown",
            id: "m1",
            content: `**If you use Git daily:** skip folder \`01\` except GitHub account setup if you need it.

**If HTML / CSS / JS feel easy:** skip folder \`02\`.

**Start here instead:** [03 · React · Mental model](/notes/grad-project-roadmap/grad-03-react/grad-react-concepts)

Already comfortable with React? Jump to [04 · Next.js](/notes/grad-project-roadmap/grad-04-nextjs/grad-next-why), then MongoDB, then the codebase structure lessons that explain the real grad repo.`,
          },
          {
            type: "link",
            id: "lr1",
            href: "https://roadmap.sh/fullstack",
            label: "roadmap.sh Full-stack",
          },
          {
            type: "link",
            id: "lr2",
            href: "https://roadmap.sh/react",
            label: "roadmap.sh React",
          },
          {
            type: "callout",
            id: "c1",
            tone: "info",
            title: "Continuity still matters",
            body: "Even if you skip, the React project you scaffold becomes the Next.js app, which then talks to MongoDB. Keep one project folder the whole way when possible.",
          },
        ],
      },
    ],
  },

  "grad-jump-project": {
    id: "grad-jump-project",
    name: "Jump here (the project)",
    title: "Jump here (the grad project)",
    description:
      "Map of the real codebase. Best after folder 06, or when you need orientation now.",
    createdAt: D,
    updatedAt: D,
    enabled: true,
    variants: V,
    sections: [
      {
        id: "when",
        title: "What this app is",
        blocks: [
          {
            type: "markdown",
            id: "m1",
            content: `The grad app is a **Next.js full-stack workspace**. Freelancers and agencies use it as a live identity layer: portfolio, branding, projects, skills, and AI tools that can read and write that data.

Three surfaces you will hear about a lot:

| Area | Role |
|------|------|
| \`features/portfolio\` | UI: page, blocks, hooks |
| \`modules/workspace-profile\` | Data: repo + service + types |
| \`app/api/.../portfolio\` | HTTP boundary for the UI |

AI chat sits on top of the same profile data. Tools never mutate the UI directly. They emit events that refresh the cache.`,
          },
          {
            type: "stack",
            id: "s1",
            title: "Stack in the repo",
            layers: [
              {
                id: "ui",
                label: "UI",
                items: [
                  { icon: "siNextdotjs", label: "Next.js App Router" },
                  { icon: "siReact", label: "React" },
                  { icon: "siTailwindcss", label: "Tailwind" },
                ],
              },
              {
                id: "data",
                label: "Data",
                items: [
                  { icon: "siMongodb", label: "MongoDB" },
                  { icon: "siTypescript", label: "Typed DTOs" },
                ],
              },
            ],
            edges: [{ from: "ui", to: "data", label: "API + hooks" }],
          },
        ],
      },
      {
        id: "docs",
        title: "Where to read next",
        blocks: [
          {
            type: "link",
            id: "l1",
            href: "/notes/grad-project-roadmap/grad-06-structure/grad-structure-tour",
            label: "Grad repo tour",
            description: "Folder map and data flow",
          },
          {
            type: "link",
            id: "l2",
            href: "/notes/grad-project-roadmap/grad-06-structure/grad-structure-portfolio",
            label: "Portfolio feature deep dive",
            description: "Blocks, layout, APIs, hooks from docs/portfolio.md",
          },
          {
            type: "link",
            id: "lr1",
            href: "https://roadmap.sh/fullstack",
            label: "roadmap.sh Full-stack",
          },
          {
            type: "callout",
            id: "c1",
            tone: "tip",
            title: "Local docs",
            body: "In the grad-fullstack repo open docs/portfolio.md and docs/main_ai/01-architecture-overview.md. These notes mirror that map in shorter form.",
          },
        ],
      },
    ],
  },

  "grad-vscode-setup": {
    id: "grad-vscode-setup",
    name: "Install VS Code",
    title: "Install VS Code",
    description:
      "Your editor for the whole roadmap. Install it before Git and Node lessons.",
    createdAt: D,
    updatedAt: D,
    enabled: true,
    variants: V,
    sections: [
      {
        id: "what",
        title: "Why VS Code",
        blocks: [
          {
            type: "markdown",
            id: "m1",
            content: `VS Code is a free editor from Microsoft. You will open project folders in it, edit files, run the integrated terminal, and use Git from the sidebar.

You do not need every feature on day one. You need:

1. Open a folder
2. Edit a file and save
3. Open the terminal inside the editor
4. Install a couple of extensions`,
          },
        ],
      },
      {
        id: "install",
        title: "Install",
        blocks: [
          {
            type: "link",
            id: "l1",
            href: "https://code.visualstudio.com/download",
            label: "Download Visual Studio Code",
            description: "Pick Windows, macOS, or Linux",
          },
          {
            type: "markdown",
            id: "m2",
            content: `**Windows**
1. Run the installer
2. Keep defaults
3. Check "Add to PATH" if shown
4. Open VS Code from the Start menu

**macOS**
1. Open the \`.dmg\`
2. Drag VS Code into Applications
3. Open it once from Applications

**Linux**
Follow the install page for your distro, or use the \`.deb\` / \`.rpm\` from the download page.`,
          },
          {
            type: "youtube",
            id: "yt1",
            url: "https://www.youtube.com/watch?v=f8_uF_IDV50",
            title: "VS Code official beginner tutorial (15 min)",
            caption: "From the VS Code team. Pause when they open a folder and do the same.",
          },
          {
            type: "link",
            id: "l2",
            href: "https://www.youtube.com/watch?v=WPqXP_kLzpo",
            label: "Optional: freeCodeCamp VS Code crash course",
            description: "Longer walkthrough if you want more depth",
          },
        ],
      },
      {
        id: "first-hour",
        title: "First 10 minutes inside VS Code",
        blocks: [
          {
            type: "markdown",
            id: "m3",
            content: `1. **File → Open Folder** and pick (or create) \`Documents/projects\`
2. Create a file \`hello.txt\`, type anything, save with \`Ctrl+S\` / \`Cmd+S\`
3. Open terminal: **Terminal → New Terminal** (or \`Ctrl+\` \` \`)
4. In that terminal type \`node -v\` later (after Node install). For now type \`pwd\` or \`cd\` to get comfortable.

**Extensions to install now** (Extensions icon in the left bar):

| Extension | Why |
|-----------|-----|
| ESLint | Catches JS / TS mistakes |
| Prettier | Formats code consistently |
| Tailwind CSS IntelliSense | Useful once you hit React / Next |

Search the name → Install → reload if asked.`,
          },
          {
            type: "callout",
            id: "c1",
            tone: "tip",
            title: "Done when",
            body: "You can open a folder, edit a file, and open the integrated terminal. Next lesson installs Node so those terminal commands become useful.",
          },
        ],
      },
    ],
  },

  "grad-node-setup": {
    id: "grad-node-setup",
    name: "Install Node.js",
    title: "Install Node.js",
    description:
      "Node runs JavaScript outside the browser. npm comes with it. Needed for React and Next.",
    createdAt: D,
    updatedAt: D,
    enabled: true,
    variants: V,
    sections: [
      {
        id: "install",
        title: "Install LTS",
        blocks: [
          {
            type: "markdown",
            id: "m1",
            content: `In the last lesson you opened VS Code. Keep it open. Install Node next so the terminal can run \`npm\` commands.`,
          },
          {
            type: "link",
            id: "l1",
            href: "https://nodejs.org/",
            label: "nodejs.org",
            description: "Download the LTS version (recommended)",
          },
          {
            type: "markdown",
            id: "m2",
            content: `1. Download **LTS** (Long Term Support)
2. Run the installer (leave PATH options checked)
3. Close and reopen the VS Code terminal
4. Run:

\`\`\`bash
node -v
npm -v
\`\`\`

You should see version numbers like \`v22.x\` and \`10.x\`. If the command is not found, reboot once or reopen the terminal.`,
          },
          {
            type: "callout",
            id: "c1",
            tone: "info",
            title: "Continuity",
            body: "From here on, every scaffold command (Vite, Next, npm install) assumes Node works in your VS Code terminal.",
          },
          {
            type: "link",
            id: "lr1",
            href: "https://roadmap.sh/nodejs",
            label: "roadmap.sh Node.js",
            description: "Optional map of Node topics beyond this install",
          },
          {
            type: "youtube",
            id: "yt1",
            url: "https://www.youtube.com/watch?v=Oe421EPjeBE",
            title: "Node.js and Express (freeCodeCamp)",
            caption: "Optional later. For now you only need node -v and npm -v working.",
          },
          {
            type: "link",
            id: "l2",
            href: "/notes/grad-project-roadmap/grad-01-git/grad-git-overview",
            label: "Next: What Git does",
          },
        ],
      },
    ],
  },
}
