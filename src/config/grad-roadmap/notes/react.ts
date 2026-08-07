import type { NoteDocument } from "@/lib/notes-types"

const D = "2026-08-07"
const V = { sidebarNav: true, compactHero: true, showMeta: false } as const

export const gradReactNotes: Record<string, NoteDocument> = {
  "grad-react-concepts": {
    id: "grad-react-concepts",
    name: "Mental model",
    title: "React mental model",
    description:
      "Same landing page idea, but with components, props, and state instead of manual DOM edits.",
    createdAt: D,
    updatedAt: D,
    enabled: true,
    variants: V,
    sections: [
      {
        id: "model",
        title: "Three ideas",
        blocks: [
          {
            type: "markdown",
            id: "m1",
            content: `In \`grad-landing\` you changed the page with \`querySelector\` and listeners. React flips that: you describe the UI as functions, and React updates the DOM for you.

| Concept | Meaning | Landing equivalent |
|---------|---------|--------------------|
| Component | Reusable UI function | A card block |
| Props | Inputs from parent | Card title text |
| State | Memory inside a component | Your theme toggle boolean |

When state changes, React re-renders what depends on it.`,
          },
          {
            type: "mermaid",
            id: "mm1",
            diagram: `flowchart TB
  App --> Hero
  App --> ProjectList
  ProjectList --> Card1[ProjectCard]
  ProjectList --> Card2[ProjectCard]`,
          },
          {
            type: "playground",
            id: "p1",
            title: "Props as plain data",
            language: "javascript",
            initialCode: `function ProjectCard(props) {
  return props.title + ": " + props.summary;
}

const cards = [
  { title: "Fleet dashboard", summary: "Ops UI" },
  { title: "Booking tool", summary: "Scheduling" },
];

for (const card of cards) {
  console.log(ProjectCard(card));
}`,
            expectIncludes: "Fleet dashboard",
            hint: "This is not JSX yet. It shows the idea: a function turns props into UI text.",
          },
          {
            type: "link",
            id: "l1",
            href: "https://react.dev/learn",
            label: "React docs: Learn React",
            description: "Read Your first component and Adding Interactivity",
          },
          {
            type: "link",
            id: "lr1",
            href: "https://roadmap.sh/react",
            label: "roadmap.sh React",
          },
          {
            type: "youtube",
            id: "yt1",
            url: "https://www.youtube.com/watch?v=Tn6-PIqc4UM",
            title: "React in 100 seconds (Fireship)",
          },
          {
            type: "link",
            id: "lyt2",
            href: "https://www.youtube.com/watch?v=w7ejDZ8SWv8",
            label: "React crash course (Traversy Media)",
            description: "Build a small app if you want a longer hands-on pass",
          },
          {
            type: "link",
            id: "lyt3",
            href: "https://www.youtube.com/watch?v=SqcY0GlETPk",
            label: "React tutorial for beginners (Mosh)",
          },
        ],
      },
    ],
  },

  "grad-react-scaffold": {
    id: "grad-react-scaffold",
    name: "Scaffold the app",
    title: "Scaffold the React app",
    description:
      "Create grad-app with Vite. This project carries into Next.js later.",
    createdAt: D,
    updatedAt: D,
    enabled: true,
    variants: V,
    sections: [
      {
        id: "create",
        title: "Create project",
        blocks: [
          {
            type: "markdown",
            id: "m1",
            content: `From \`Documents/projects\` (Node must work from the tools lessons):

\`\`\`bash
npm create vite@latest grad-app -- --template react-ts
cd grad-app
npm install
npm run dev
\`\`\`

Open \`http://localhost:5173\`. Vite reloads when you save.

**File map:**

\`\`\`
grad-app/
  src/
    main.tsx      mounts <App /> into #root
    App.tsx       start editing here
    index.css
  package.json
\`\`\`

Keep \`grad-landing\` open in another window as the design reference.`,
          },
          {
            type: "terminal",
            id: "t1",
            scenario: "npm-scaffold",
            title: "Practice the scaffold commands",
          },
          {
            type: "callout",
            id: "c1",
            tone: "tip",
            title: "Continuity",
            body: "grad-app is your main project now. The next two lessons fill it with Hero and ProjectCard matching your landing page.",
          },
        ],
      },
    ],
  },

  "grad-react-build-ui": {
    id: "grad-react-build-ui",
    name: "Build the UI",
    title: "Build the portfolio UI",
    description:
      "Recreate the landing hero and cards as components. Paste snippets into the right files.",
    createdAt: D,
    updatedAt: D,
    enabled: true,
    variants: V,
    sections: [
      {
        id: "hero",
        title: "Hero component",
        blocks: [
          {
            type: "markdown",
            id: "m1",
            content: `**Create** \`src/components/Hero.tsx\`:

\`\`\`tsx
type HeroProps = {
  name: string;
  tagline: string;
};

export function Hero({ name, tagline }: HeroProps) {
  return (
    <header className="hero">
      <h1>{name}</h1>
      <p>{tagline}</p>
    </header>
  );
}
\`\`\`

**Replace** the default content of \`src/App.tsx\`:

\`\`\`tsx
import { Hero } from "./components/Hero";

export default function App() {
  return (
    <main>
      <Hero name="Your Name" tagline="Full-stack freelancer" />
    </main>
  );
}
\`\`\`

**What happened:** \`App\` composes \`Hero\`. Props flow downward. Same words as your HTML landing, now reusable.`,
          },
        ],
      },
      {
        id: "cards",
        title: "Project cards from data",
        blocks: [
          {
            type: "markdown",
            id: "m2",
            content: `**Create** \`src/data/projects.ts\`:

\`\`\`ts
export const projects = [
  { id: "1", title: "Fleet dashboard", summary: "Ops UI for maritime teams." },
  { id: "2", title: "Booking tool", summary: "Scheduling for field crews." },
  { id: "3", title: "Portfolio site", summary: "This UI, rebuilt in React." },
];
\`\`\`

**Create** \`src/components/ProjectCard.tsx\`:

\`\`\`tsx
type ProjectCardProps = {
  title: string;
  summary: string;
};

export function ProjectCard({ title, summary }: ProjectCardProps) {
  return (
    <article className="card">
      <h3>{title}</h3>
      <p>{summary}</p>
    </article>
  );
}
\`\`\`

**Update** \`App.tsx\` to map the list:

\`\`\`tsx
import { Hero } from "./components/Hero";
import { ProjectCard } from "./components/ProjectCard";
import { projects } from "./data/projects";

export default function App() {
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

**Try:** change one title in \`projects.ts\` only. The card updates. You did not edit \`ProjectCard\`.

Copy styles from \`grad-landing/styles.css\` into \`src/index.css\` so it looks familiar.`,
          },
          {
            type: "callout",
            id: "c1",
            tone: "tip",
            title: "AI writes syntax",
            body: "Ask AI to generate the files if you want. Your job: check the paths, imports, and that the data file feeds the list.",
          },
        ],
      },
    ],
  },

  "grad-react-data": {
    id: "grad-react-data",
    name: "State & data flow",
    title: "State & data flow",
    description:
      "Add a theme toggle with useState. Prep for fetching from Next APIs.",
    createdAt: D,
    updatedAt: D,
    enabled: true,
    variants: V,
    sections: [
      {
        id: "state",
        title: "Local state",
        blocks: [
          {
            type: "markdown",
            id: "m1",
            content: `You already built a theme toggle in plain JS. In React it becomes state in \`App.tsx\`:

\`\`\`tsx
import { useState } from "react";

export default function App() {
  const [dark, setDark] = useState(true);

  return (
    <main style={{
      background: dark ? "#0a0a0a" : "#f5f5f5",
      color: dark ? "#f5f5f5" : "#111",
      minHeight: "100vh",
    }}>
      <button type="button" onClick={() => setDark((d) => !d)}>
        Toggle theme
      </button>
      {/* Hero + cards here */}
    </main>
  );
}
\`\`\`

**Rule:** state lives in the lowest common parent that needs it. Children get values through props.`,
          },
          {
            type: "playground",
            id: "p1",
            title: "State as a value that changes",
            language: "javascript",
            initialCode: `let dark = true;

function toggle() {
  dark = !dark;
  console.log("dark is now", dark);
}

toggle();
toggle();
toggle();`,
            expectIncludes: "dark is now",
            hint: "useState is this idea plus re-render. Run and watch the flips.",
          },
          {
            type: "mermaid",
            id: "mm1",
            title: "Data flow",
            diagram: `flowchart BT
  API["API / DB later"] --> App
  App -->|props| List
  App -->|state| Toolbar
  Toolbar -->|setState| App`,
          },
          {
            type: "link",
            id: "l1",
            href: "https://react.dev/learn/sharing-state-between-components",
            label: "React docs: Sharing state",
          },
          {
            type: "callout",
            id: "c1",
            tone: "info",
            title: "Next folder",
            body: "Next.js keeps these components and adds file-based routes plus API handlers so projects can come from a server instead of a local array.",
          },
        ],
      },
    ],
  },
}
