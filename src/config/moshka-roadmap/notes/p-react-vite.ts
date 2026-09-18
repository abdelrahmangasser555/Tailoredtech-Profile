import {
  explain,
  figure,
  info,
  lesson,
  link,
  md,
  mermaid,
  tasks,
  tip,
  VID,
  yt,
  ytWatch,
} from "@/config/moshka-roadmap/helpers"
import type { NoteDocument } from "@/lib/notes-types"

export const moshkaReactNotes: Record<string, NoteDocument> = {
  "moshka-react-learn": lesson({
    id: "moshka-react-learn",
    name: "What you will learn",
    description:
      "A real React app with Vite. Folder tour, components, props, state, and a vessel row you can reuse.",
    sections: [
      {
        id: "goal",
        title: "Why this folder exists",
        blocks: [
          figure(
            "ill",
            "moshka-vite-react-start.png",
            "React Harbor",
            "Generate this image (see moshka-image-prompts.txt). Placeholder until the PNG is in public/notes/moshka/images/."
          ),
          md(
            "g",
            `Port Watch showed you why copying HTML rows hurts. **React Harbor** is where you learn the fix for real.

You will **not** use Next.js yet. You will use **Vite + React + TypeScript**. Same ideas TailoredTech uses inside Next, without the App Router noise on day one.

Every lesson has:

1. Plain words (what and why)
2. One or more **full** copy-paste snippets with the **exact file path** in the fence
3. A try-first line, then paste if stuck`
          ),
          mermaid(
            "flow",
            `flowchart LR
  V[Vite dev server] --> M[main.tsx]
  M --> A[App.tsx]
  A --> C[Components]
  C --> S[useState]`,
            "Files you will touch",
            "Click a box for more detail.",
            {
              V: "vite-dev",
              M: "main-tsx",
              A: "app-tsx",
              C: "components",
              S: "state",
            }
          ),
          tasks("t", "Start", [
            { id: "port", label: "You finished Port Watch (or at least opened the table)" },
            { id: "node", label: "Node 20+ installed (node -v)" },
          ]),
        ],
      },
    ],
    explains: [
      explain(
        "vite-dev",
        "Vite",
        "Vite dev server",
        `Fast refresh. \`npm run dev\` serves your app on localhost (usually 5173). You save a file, the browser updates.`
      ),
      explain(
        "main-tsx",
        "main.tsx",
        "main.tsx",
        `The entry file. It finds \`#root\` in index.html and mounts your React tree.`
      ),
      explain(
        "app-tsx",
        "App.tsx",
        "App.tsx",
        `The top component. Start messy here, split into smaller files as you learn.`
      ),
      explain(
        "components",
        "Components",
        "Components",
        `Functions that return JSX. One vessel row becomes \`<VesselRow />\` instead of copy-paste HTML.`
      ),
      explain(
        "state",
        "State",
        "useState",
        `Data that changes when the user clicks. React re-renders when state updates.`
      ),
    ],
  }),

  "moshka-react-why-vite": lesson({
    id: "moshka-react-why-vite",
    name: "Why Vite, not random tools",
    description: "Vite is the default fast starter. Next Harbor comes later.",
    sections: [
      {
        id: "why",
        title: "Pick one toolchain",
        blocks: [
          md(
            "m",
            `**Vite** = dev server + build tool. **React** = UI library. **TypeScript** = types so you catch typos early.

You are **not** learning Create React App (old). You are **not** learning Next.js in this folder (that is project 04).

TailoredTech ships Next in production. Vite teaches React without routing, server actions, and cache on the same day.`
          ),
          yt(
            "v",
            VID.react,
            "React in 100 Seconds (Fireship)",
            "Watch from 0:00 to the end. About 2 minutes."
          ),
          ytWatch(
            "v-long",
            VID.reactWds,
            "Learn React (Web Dev Simplified)",
            "0:00",
            "12:00",
            "Components and JSX only. Stop at 12:00. You will write the rest in this folder."
          ),
          tasks("t", "Check", [
            { id: "say", label: "You can say: Vite runs the app, React draws the UI" },
          ]),
        ],
      },
    ],
  }),

  "moshka-react-create": lesson({
    id: "moshka-react-create",
    name: "Create the project",
    description: "npm create vite@latest. Choose React and TypeScript.",
    sections: [
      {
        id: "term",
        title: "Run in the terminal",
        blocks: [
          md(
            "m",
            `Make a folder on your Desktop. Name it **react-harbor**. All commands below assume that name.

Try first: run the create command yourself. If the prompts confuse you, read the template lesson next, then come back.`
          ),
          md(
            "cmd",
            `Run this in the terminal:

\`\`\`bash
cd ~/Desktop
npm create vite@latest react-harbor
\`\`\`

When it asks **Select a framework**, choose **React**.

When it asks **Select a variant**, choose **TypeScript**.`
          ),
          md(
            "cmd2",
            `Then install and start:

\`\`\`bash
cd react-harbor
npm install
npm run dev
\`\`\`

Open the URL it prints (usually http://localhost:5173). You should see the Vite + React welcome page.`
          ),
          info(
            "port",
            "Port",
            "If 5173 is busy, Vite picks another port. Use the URL in the terminal. Do not guess."
          ),
          tasks("t", "Done when", [
            { id: "dev", label: "npm run dev runs without an error" },
            { id: "see", label: "A page loads in the browser" },
          ]),
        ],
      },
    ],
  }),

  "moshka-react-template": lesson({
    id: "moshka-react-template",
    name: "Which template to pick",
    description: "React + TypeScript. Not JavaScript, not React Router yet.",
    sections: [
      {
        id: "pick",
        title: "The only choice that matters today",
        blocks: [
          figure(
            "tpl",
            "moshka-vite-template-pick.png",
            "Template picker",
            "Visual of the two prompts: Framework React, Variant TypeScript."
          ),
          md(
            "m",
            `At the prompts:

| Prompt | Pick | Why |
|--------|------|-----|
| Framework | **React** | You are learning React. |
| Variant | **TypeScript** | TailoredTech repos use TS. Catches mistakes early. |

Do **not** pick Svelte, Vue, or Vanilla today.

Do **not** add React Router in the create step. You will add routing in Next Harbor.`
          ),
          tip(
            "ts",
            "TypeScript scares",
            "If a red squiggle appears, read the message. Often it is a typo in a prop name. You can still run the app while you fix types."
          ),
          tasks("t", "Check", [
            { id: "ts", label: "Your folder has .tsx files, not only .jsx" },
          ]),
        ],
      },
    ],
  }),

  "moshka-react-tour": lesson({
    id: "moshka-react-tour",
    name: "Folder tour",
    description: "What each top-level file does before you change anything.",
    sections: [
      {
        id: "map",
        title: "Walk the tree once",
        blocks: [
          figure(
            "tour",
            "moshka-vite-folder-tour.png",
            "Vite folder map",
            "Labeled tree: index.html, src/main.tsx, src/App.tsx, src/App.css, public/."
          ),
          md(
            "m",
            `Open **react-harbor** in your editor. You should see:

**Root**
- \`package.json\` lists dependencies and scripts (\`dev\`, \`build\`).
- \`index.html\` is the single HTML page. It has \`<div id="root"></div>\`.
- \`vite.config.ts\` configures Vite. Leave it alone for now.

**src/**
- \`main.tsx\` mounts React into \`#root\`.
- \`App.tsx\` is your app component.
- \`App.css\` styles \`App.tsx\`.
- \`index.css\` is global styles (often reset + fonts).

**public/**
- Static files served as-is. Put a favicon here later.`
          ),
          md(
            "p",
            `This is the full \`index.html\` after create (yours may match):

\`\`\`html:index.html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>react-harbor</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
\`\`\`

The only line React cares about is \`id="root"\`. The script tag points at \`main.tsx\`.`
          ),
          tasks("t", "Hands-on", [
            { id: "open", label: "You opened each file above once" },
            { id: "root", label: "You found div#root in index.html" },
          ]),
        ],
      },
    ],
  }),

  "moshka-react-main": lesson({
    id: "moshka-react-main",
    name: "main.tsx entry",
    description: "How React attaches to the page.",
    sections: [
      {
        id: "do",
        title: "Read, then replace",
        blocks: [
          md(
            "m",
            `Try first: change the import from \`./App.css\` comment only. Save. The dev server should hot-reload.

**main.tsx** does three jobs: import React, import your App, call \`createRoot\` on \`#root\`.`
          ),
          md(
            "p",
            `Replace all of \`src/main.tsx\` with:

\`\`\`tsx:src/main.tsx
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
\`\`\`

\`document.getElementById("root")!\` means "find #root". The \`!\` tells TypeScript it exists. If you rename the id in HTML, update this line.`
          ),
          tasks("t", "Done when", [
            { id: "run", label: "App still loads after you pasted main.tsx" },
          ]),
        ],
      },
    ],
  }),

  "moshka-react-app": lesson({
    id: "moshka-react-app",
    name: "App.tsx first screen",
    description: "Replace the Vite demo with a harbor title.",
    sections: [
      {
        id: "do",
        title: "Harbor shell",
        blocks: [
          md(
            "m",
            `Try first: delete the Vite logos in \`App.tsx\` and print only \`<h1>Harbor</h1>\`.

Then paste the full file below so you start from a clean layout.`
          ),
          md(
            "p",
            `Replace all of \`src/App.tsx\`:

\`\`\`tsx:src/App.tsx
import "./App.css"

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <p className="eyebrow">Port watch</p>
        <h1>React Harbor</h1>
      </header>
      <main>
        <p>Vessel table goes here next.</p>
      </main>
    </div>
  )
}
\`\`\``
          ),
          md(
            "css",
            `Replace \`src/App.css\` with sharp corners (radius 0):

\`\`\`css:src/App.css
.app {
  max-width: 48rem;
  margin: 0 auto;
  padding: 1.5rem;
}
.app-header {
  border-bottom: 1px dashed #333;
  padding-bottom: 0.75rem;
  margin-bottom: 1rem;
}
.eyebrow {
  font-family: ui-monospace, monospace;
  font-size: 0.7rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #666;
  margin: 0;
}
h1 {
  margin: 0.25rem 0 0;
  font-size: 1.5rem;
}
\`\`\``
          ),
          tasks("t", "Hands-on", [
            { id: "title", label: "You see React Harbor in the browser" },
          ]),
        ],
      },
    ],
  }),

  "moshka-react-component": lesson({
    id: "moshka-react-component",
    name: "Your first component",
    description: "VesselRow.tsx returns one table row as JSX.",
    sections: [
      {
        id: "do",
        title: "Extract a row",
        blocks: [
          md(
            "m",
            `A **component** is a function that returns UI. File name matches the function: \`VesselRow.tsx\` exports \`VesselRow\`.

Try first: create the file empty, export a function that returns \`<tr><td>Test</td></tr>\`, import it in App, put it inside a \`<table>\`.`
          ),
          md(
            "p",
            `Create \`src/VesselRow.tsx\`:

\`\`\`tsx:src/VesselRow.tsx
type VesselRowProps = {
  name: string
  status: string
}

export function VesselRow({ name, status }: VesselRowProps) {
  return (
    <tr>
      <td>{name}</td>
      <td>{status}</td>
    </tr>
  )
}
\`\`\`

Update \`src/App.tsx\` main section:

\`\`\`tsx:src/App.tsx
import "./App.css"
import { VesselRow } from "./VesselRow"

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <p className="eyebrow">Port watch</p>
        <h1>React Harbor</h1>
      </header>
      <main>
        <table>
          <thead>
            <tr>
              <th>Vessel</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <VesselRow name="MV Red Sea" status="Alongside" />
            <VesselRow name="MV Newbuild" status="Inbound" />
          </tbody>
        </table>
      </main>
    </div>
  )
}
\`\`\`

Two rows, one component. That is the Port Watch lesson in React form.`
          ),
          figure(
            "row",
            "moshka-react-vessel-row.png",
            "One component, two rows",
            "Shows one VesselRow component used twice with different props."
          ),
          tasks("t", "Done when", [
            { id: "two", label: "Two vessels show in the table" },
            { id: "file", label: "VesselRow lives in its own file" },
          ]),
        ],
      },
    ],
  }),

  "moshka-react-props": lesson({
    id: "moshka-react-props",
    name: "Props are inputs",
    description: "Parent passes data down. Child does not edit props.",
    sections: [
      {
        id: "do",
        title: "Add ETA",
        blocks: [
          md(
            "m",
            `**Props** are like function arguments. \`name\` and \`status\` are props on \`VesselRow\`.

Try first: add \`eta: string\` to the type and a third \`<td>\`. Pass \`eta="06:00"\` from App.`
          ),
          md(
            "p",
            `Full \`src/VesselRow.tsx\`:

\`\`\`tsx:src/VesselRow.tsx
type VesselRowProps = {
  name: string
  status: string
  eta: string
}

export function VesselRow({ name, status, eta }: VesselRowProps) {
  return (
    <tr>
      <td>{name}</td>
      <td>{status}</td>
      <td>{eta}</td>
    </tr>
  )
}
\`\`\`

Update each \`VesselRow\` in App with an \`eta\` prop. If you forget \`eta\` on one row, TypeScript should complain. That is the point of TS.`
          ),
          tasks("t", "Hands-on", [
            { id: "eta", label: "Every row has an ETA column" },
          ]),
        ],
      },
    ],
  }),

  "moshka-react-state": lesson({
    id: "moshka-react-state",
    name: "useState",
    description: "Filter vessels with a search box. State lives in App.",
    sections: [
      {
        id: "do",
        title: "Search filters rows",
        blocks: [
          md(
            "m",
            `**State** is data that can change. \`useState\` returns a value and a setter.

The list of vessels can live in App as an array. \`search\` state filters which rows render.

Try first: add an \`<input>\` and log \`search\` on every keystroke with \`console.log\`.`
          ),
          md(
            "p",
            `Replace \`src/App.tsx\` with:

\`\`\`tsx:src/App.tsx
import { useState } from "react"
import "./App.css"
import { VesselRow } from "./VesselRow"

const VESSELS = [
  { name: "MV Red Sea", status: "Alongside", eta: "06:00" },
  { name: "MV Newbuild", status: "Inbound", eta: "14:30" },
  { name: "MV Gulf", status: "Departed", eta: "-" },
]

export default function App() {
  const [search, setSearch] = useState("")

  const filtered = VESSELS.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="app">
      <header className="app-header">
        <p className="eyebrow">Port watch</p>
        <h1>React Harbor</h1>
      </header>
      <main>
        <label className="search">
          Search
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Vessel name"
          />
        </label>
        <table>
          <thead>
            <tr>
              <th>Vessel</th>
              <th>Status</th>
              <th>ETA</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((v) => (
              <VesselRow key={v.name} {...v} />
            ))}
          </tbody>
        </table>
      </main>
    </div>
  )
}
\`\`\`

Add to \`App.css\`:

\`\`\`css:src/App.css
.search {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1rem;
  font-size: 0.85rem;
}
.search input {
  border: 1px solid #333;
  padding: 0.4rem 0.5rem;
}
\`\`\``
          ),
          figure(
            "state",
            "moshka-react-use-state.png",
            "Search and state",
            "Input at top, table below, one row hidden when search does not match."
          ),
          tasks("t", "Done when", [
            { id: "filter", label: "Typing hides rows that do not match" },
          ]),
        ],
      },
    ],
  }),

  "moshka-react-ship": lesson({
    id: "moshka-react-ship",
    name: "Show someone",
    description: "Demo the table, search, and explain components vs copy-paste HTML.",
    sections: [
      {
        id: "do",
        title: "Ship it",
        blocks: [
          md(
            "m",
            `Run \`npm run build\` once. It should finish without errors. That proves TypeScript and the bundler are happy.

Show Abdelrahman:

1. \`VesselRow.tsx\` (one row, many uses)
2. \`useState\` search in App
3. How this maps to Port Watch HTML you copied three times

Next folder: **03 Client Eyes** (UX on the static Port Watch) or jump ahead to **04 Next Harbor** when he says you are ready.`
          ),
          link(
            "next",
            "/notes/moshka/moshka-roadmap/moshka-p05-client-eyes",
            "Continue to Client Eyes",
            "UX on the HTML dashboard. React Harbor is done for now."
          ),
          tasks("t", "Done when", [
            { id: "demo", label: "You demoed search + two components files" },
          ]),
        ],
      },
    ],
  }),
}
