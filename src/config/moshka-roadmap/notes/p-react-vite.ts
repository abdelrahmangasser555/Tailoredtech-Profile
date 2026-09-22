import {
  explain,
  figLink,
  figure,
  figureN,
  ill,
  info,
  lesson,
  link,
  md,
  meme,
  beforeYouStart,
  teachStep,
  mermaid,
  tasks,
  tip,
  VID,
  watchPair,
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
          beforeYouStart(
            "plan",
            "Create a Vite + React + TypeScript app and build a reusable vessel row with props and state.",
            "Table filters when you type in search. Components live in separate files.",
            ["src/App.tsx", "src/VesselRow.tsx"]
          ),
          figure("ill", "moshka-vite-react-start.png", "React Harbor"),
          meme("copy", "moshka-meme-copy-paste.png", "Why React exists"),
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
          ...watchPair(
            {
              blockId: "v-learn",
              url: VID.react,
              title: "React in 100 Seconds (Fireship)",
            },
            {
              blockId: "v-learn-wds",
              url: VID.reactWds,
              title: "Learn React (Web Dev Simplified)",
              from: "0:00",
              to: "15:00",
              why: "Components and JSX. Stop before hooks if this is your first pass.",
            }
          ),
          link(
            "wds",
            "https://www.youtube.com/@WebDevSimplified",
            "Web Dev Simplified on YouTube",
            "Use his hooks videos when you hit useState and useEffect in this folder."
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
          meme("vite", "moshka-meme-vite-not-next.png", "Vite now, Next later"),
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
          md(
            "compare",
            `| Tool | What it does | When Moshka uses it |
|------|----------------|---------------------|
| Vite | Dev server + build | This folder |
| React | UI components | This folder + Next Harbor |
| Next.js | Framework on top of React | Project 04 |
| npm | Installs packages | Every Node project |

**JSX** looks like HTML inside JavaScript. The browser does not understand JSX. Vite compiles it to JavaScript before the browser runs it.`
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
      {
        id: "pkg",
        title: "What got created",
        blocks: [
          figure(
            "pkg-fig",
            "moshka-react-package-json.png",
            "package.json",
            "Scripts you will run every day."
          ),
          md(
            "pkg",
            `Open \`package.json\`. The important parts today:

\`\`\`json:package.json
{
  "name": "react-harbor",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "~5.7.0",
    "vite": "^6.0.0"
  }
}
\`\`\`

Version numbers on your machine may differ. That is fine.

- \`npm run dev\` → \`vite\` → local URL
- \`npm run build\` → typecheck + production bundle (run before you ship)
- \`npm run preview\` → serves the built folder to see production output`
          ),
          tip(
            "node-modules",
            "node_modules",
            "Never edit files inside node_modules. Never commit that folder. If install breaks, delete node_modules and package-lock.json, then npm install again."
          ),
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
          md(
            "vite",
            `Default \`vite.config.ts\` (you do not need to edit yet):

\`\`\`ts:vite.config.ts
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
})
\`\`\`

The React plugin is what compiles JSX. Without it, \`.tsx\` files would not run.`
          ),
          tasks("t", "Hands-on", [
            { id: "open", label: "You opened each file above once" },
            { id: "root", label: "You found div#root in index.html" },
          ]),
        ],
      },
    ],
  }),

  "moshka-react-jsx": lesson({
    id: "moshka-react-jsx",
    name: "JSX rules",
    description: "className, one parent, fragments, and why JSX is not HTML.",
    sections: [
      {
        id: "rules",
        title: "HTML habits that break in React",
        blocks: [
          ...watchPair(
            {
              blockId: "v-jsx",
              url: VID.react,
              title: "React in 100 Seconds (Fireship)",
            },
            {
              blockId: "v-jsx-wds",
              url: VID.reactWds,
              title: "Learn React (Web Dev Simplified)",
              from: "8:00",
              to: "18:00",
              why: "JSX rules and className. Stop when he starts a new big topic.",
            }
          ),
          figure("jsx-fig", "moshka-react-jsx.png", "JSX vs HTML"),
          meme("jsx-meme", "moshka-meme-jsx-class.png", "Not class"),
          md(
            "m",
            `JSX **looks** like HTML. It is **JavaScript**. The rules below save you hours of red screens.

| HTML habit | In React JSX |
|------------|----------------|
| \`class="foo"\` | \`className="foo"\` |
| \`for="x"\` on label | \`htmlFor="x"\` |
| Self-closing optional | \`<img />\` and \`<input />\` must close |
| Multiple roots | **One** parent per \`return\` (use a \`<div>\` or \`<>\`) |`
          ),
          md(
            "ex",
            `Try first: in \`App.tsx\`, wrap everything in an extra \`<div>\` and remove it. See the error when you return two siblings without a wrapper.

**Fragment** (no extra div on the page):

\`\`\`tsx
export default function App() {
  return (
    <>
      <header>React Harbor</header>
      <main>Table here</main>
    </>
  )
}
\`\`\`

\`<>\` is shorthand for \`React.Fragment\`. Use it when you need two top-level tags without a wrapper box.`
          ),
          md(
            "curlies",
            `Curly braces \`{ }\` mean "JavaScript goes here":

\`\`\`tsx
const name = "MV Red Sea"
return <h1>{name}</h1>
\`\`\`

Inside JSX, \`{v.name}\` prints a variable. \`{2 + 2}\` prints 4. You will use this for props and lists.`
          ),
          tasks("t", "Check", [
            { id: "class", label: "You used className at least once" },
            { id: "frag", label: "You know what <> is for" },
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
          beforeYouStart(
            "main-plan",
            "Edit main.tsx so React mounts your App into the #root div in index.html.",
            "The dev server shows your App with no red errors in the Console.",
            ["src/main.tsx"]
          ),
          ...teachStep(
            1,
            "Imports",
            `These lines load React, the DOM helper, global CSS, and your App component.`,
            "tsx",
            "src/main.tsx",
            `import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
`,
            "1-4"
          ),
          ...teachStep(
            2,
            "Mount App on #root",
            `\`createRoot\` finds \`#root\` in \`index.html\` and renders \`<App />\` inside \`StrictMode\` (extra dev checks).`,
            "tsx",
            "src/main.tsx",
            `import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
`,
            "6-10"
          ),
          md(
            "root-note",
            `The \`!\` after \`getElementById("root")\` tells TypeScript the element exists. If you rename the id in HTML, change this line too.`
          ),
          md(
            "strict",
            `\`StrictMode\` runs extra checks in development. It does not change production builds. Leave it on while learning.

If the screen is blank after paste:
1. Open DevTools → Console
2. Read the first red error
3. Often it is a typo in \`App.tsx\` or a missing import`
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
          beforeYouStart(
            "app-plan",
            "Replace the Vite demo with a simple harbor header and a placeholder main area.",
            "Page title React Harbor, sharp layout, room for the vessel table next lesson.",
            ["src/App.tsx", "src/App.css"]
          ),
          ...teachStep(
            1,
            "App shell in App.tsx",
            `One parent \`div\`, header with eyebrow + title, main for table later.`,
            "tsx",
            "src/App.tsx",
            `import "./App.css"

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
`,
            "1-16"
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
          md(
            "global",
            `Set a clean base in \`src/index.css\` (global):

\`\`\`css:src/index.css
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  font-family: ui-sans-serif, system-ui, sans-serif;
  background: #f6f4ef;
  color: #0a0a0a;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  text-align: left;
  padding: 0.35rem 0.5rem;
  border-bottom: 1px solid #ccc;
}
\`\`\`

Global = every component sees these rules. \`App.css\` = only classes you use in App.`
          ),
          tasks("t", "Hands-on", [
            { id: "title", label: "You see React Harbor in the browser" },
            { id: "css", label: "index.css and App.css both exist" },
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

Two rows, one component. That is the Port Watch lesson in React form.

**Export styles you will see:**
- \`export function VesselRow\` → import as \`import { VesselRow } from "./VesselRow"\`
- \`export default function App\` → import as \`import App from "./App"\`

Default export = one main thing per file (App). Named export = many helpers per file (VesselRow, StatusBadge later).`
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
          ...watchPair(
            {
              blockId: "v-props",
              url: VID.react,
              title: "React in 100 Seconds (Fireship)",
            },
            {
              blockId: "v-props-wds",
              url: VID.reactWds,
              title: "Learn React (Web Dev Simplified)",
              from: "15:00",
              to: "28:00",
              why: "Props and passing data into components. Stop when he starts state.",
            }
          ),
          meme("props", "moshka-meme-props.png", "Props go down"),
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

Update each \`VesselRow\` in App with an \`eta\` prop. If you forget \`eta\` on one row, TypeScript should complain. That is the point of TS.

Example rows in App:

\`\`\`tsx:src/App.tsx
<VesselRow name="MV Red Sea" status="Alongside" eta="06:00" />
<VesselRow name="MV Newbuild" status="Inbound" eta="14:30" />
\`\`\`

**Rule:** props flow **down** only. \`VesselRow\` must not change \`name\` by reassigning props. If the child needs to edit data, lift state up (next lessons).`
          ),
          info(
            "readonly",
            "Props are read-only",
            "Treat props like function arguments. Parent owns the truth. Child displays it."
          ),
          tasks("t", "Hands-on", [
            { id: "eta", label: "Every row has an ETA column" },
            { id: "ts-err", label: "You saw a TS error when eta was missing on one row" },
          ]),
        ],
      },
    ],
  }),

  "moshka-react-events": lesson({
    id: "moshka-react-events",
    name: "Events and handlers",
    description: "onClick, onChange, and controlled inputs.",
    sections: [
      {
        id: "do",
        title: "Clicks that do work",
        blocks: [
          ...watchPair(
            {
              blockId: "v-ev",
              url: VID.jsEventsWds,
              title: "Learn JavaScript event listeners (Web Dev Simplified)",
              caption: "DOM events first. React onClick is the same idea with different spelling.",
            },
            {
              blockId: "v-ev-react",
              url: VID.reactWds,
              title: "Learn React (Web Dev Simplified)",
              from: "28:00",
              to: "38:00",
              why: "React event handlers. Stop if he jumps to a new project.",
            }
          ),
          figure("ev", "moshka-react-events.png", "Event flow"),
          meme("controlled", "moshka-meme-controlled-input.png", "Controlled input"),
          md(
            "m",
            `In HTML you wrote \`button.addEventListener("click", ...)\`. In React you write \`onClick\` on the element.

Handler names are **camelCase**: \`onClick\`, \`onChange\`, \`onSubmit\`. Pass a **function**, not a string.`
          ),
          md(
            "ex",
            `Add a Clear search button next to your input in \`App.tsx\`:

\`\`\`tsx:src/App.tsx
<button type="button" onClick={() => setSearch("")}>
  Clear
</button>
\`\`\`

Put it inside the \`.search\` label block after the input.

**Controlled input** (you already use this for search):

\`\`\`tsx
<input
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>
\`\`\`

React owns \`value\`. The browser does not own it. That is why \`value\` + \`onChange\` must stay paired.`
          ),
          md(
            "css-btn",
            `Style the button in \`App.css\`:

\`\`\`css:src/App.css
.search button {
  margin-top: 0.35rem;
  align-self: flex-start;
  border: 1px solid #333;
  background: #0a0a0a;
  color: #f6f4ef;
  padding: 0.35rem 0.6rem;
  cursor: pointer;
}
\`\`\``
          ),
          tasks("t", "Hands-on", [
            { id: "clear", label: "Clear empties the search and shows all rows again" },
          ]),
        ],
      },
    ],
  }),

  "moshka-react-list-keys": lesson({
    id: "moshka-react-list-keys",
    name: "Lists and keys",
    description: "map() over data. Why key matters.",
    sections: [
      {
        id: "do",
        title: "From three copy-pastes to one map",
        blocks: [
          ...watchPair(
            {
              blockId: "v-map",
              url: VID.jsArraysWds,
              title: "8 JavaScript array methods (Web Dev Simplified)",
              caption: "Focus on map. Same tool you use for vessel rows.",
            },
            {
              blockId: "v-map-react",
              url: VID.reactWds,
              title: "Learn React (Web Dev Simplified)",
              from: "50:00",
              to: "1:00:00",
              why: "Lists in React if he covers map and keys in this range. Skip if tired.",
            }
          ),
          link(
            "js-map-note",
            "/notes/moshka/moshka-roadmap/moshka-p-js-lab/moshka-js-map",
            "JavaScript lab: map",
            "Language lesson if map still feels like magic."
          ),
          meme("key", "moshka-meme-key.png", "Do not forget key"),
          md(
            "m",
            `You already wrote:

\`\`\`tsx
{filtered.map((v) => (
  <VesselRow key={v.name} {...v} />
))}
\`\`\`

**map** turns an array into JSX. **key** tells React which row is which when the list changes.

Try first: reorder \`VESSELS\` in the array. Save. Order on screen should match.

Bad key: \`key={Math.random()}\` on every render. React forgets which row is which. Use a stable id (vessel name is ok for this demo).`
          ),
          md(
            "type",
            `Shared type for vessel data. Create \`src/types.ts\`:

\`\`\`ts:src/types.ts
export type Vessel = {
  name: string
  status: string
  eta: string
}
\`\`\`

Update \`VesselRow.tsx\` to import the type:

\`\`\`tsx:src/VesselRow.tsx
import type { Vessel } from "./types"

type VesselRowProps = Vessel

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

In App:

\`\`\`tsx:src/App.tsx
import type { Vessel } from "./types"

const VESSELS: Vessel[] = [
  { name: "MV Red Sea", status: "Alongside", eta: "06:00" },
  ...
]
\`\`\`

Types live in one file so Next Harbor later can reuse the same shape.`
          ),
          tasks("t", "Check", [
            { id: "types", label: "types.ts exists" },
            { id: "map", label: "You can explain what key= does in one sentence" },
          ]),
        ],
      },
    ],
  }),

  "moshka-react-status": lesson({
    id: "moshka-react-status",
    name: "StatusBadge component",
    description: "Small component for Alongside / Inbound / Departed colors.",
    sections: [
      {
        id: "do",
        title: "Color with meaning",
        blocks: [
          ill("badges", "moshka-react-status-badge.png", "Status badges"),
          md(
            "m",
            `Port Watch used status colors. Extract a **StatusBadge** so \`VesselRow\` stays a row, not a color chart.

Try first: add a \`<span className="badge">\` in the status cell before you paste the full component.`
          ),
          md(
            "badge",
            `Create \`src/StatusBadge.tsx\`:

\`\`\`tsx:src/StatusBadge.tsx
type StatusBadgeProps = {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const tone =
    status === "Alongside"
      ? "alongside"
      : status === "Inbound"
        ? "inbound"
        : "other"

  return <span className={\`badge badge-\${tone}\`}>{status}</span>
}
\`\`\`

Update \`VesselRow.tsx\` status cell:

\`\`\`tsx:src/VesselRow.tsx
import { StatusBadge } from "./StatusBadge"

// inside return:
<td><StatusBadge status={status} /></td>
\`\`\`

Add to \`App.css\`:

\`\`\`css:src/App.css
.badge {
  font-family: ui-monospace, monospace;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.15rem 0.35rem;
  border: 1px solid #333;
}
.badge-alongside {
  background: #e8f0e8;
}
.badge-inbound {
  background: #e8ecf4;
}
.badge-other {
  background: #eee;
}
\`\`\`

No lime on white. Grey and navy-friendly tints only.`
          ),
          tasks("t", "Hands-on", [
            { id: "badge", label: "Status shows inside a badge span" },
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
          ...watchPair(
            {
              blockId: "v-state",
              url: VID.reactUseStateWds,
              title: "Learn useState in 15 minutes (Web Dev Simplified)",
            },
            {
              blockId: "v-state-long",
              url: VID.reactWds,
              title: "Learn React (Web Dev Simplified)",
              from: "38:00",
              to: "50:00",
              why: "State in a bigger example. Optional second pass.",
            }
          ),
          yt(
            "v-effect-later",
            VID.reactUseEffectWds,
            "Learn useEffect in 13 minutes (Web Dev Simplified)",
            "Watch later when Next Harbor loads data from an API. Not required for search filter today."
          ),
          meme("state", "moshka-meme-usestate.png", "Before and after useState"),
          figure("state-fig", "moshka-react-use-state.png", "Filter with search"),
          ...figureN(
            1,
            "state-refresh",
            "moshka-react-state-refresh.png",
            "useState vs refresh",
            `\`useState\` lives in memory while the app runs. Full page refresh clears it, same as Harbor before \`localStorage\`. Saved logs need \`localStorage\`, a server, or a database. ${figLink(1, "state-refresh")} connects the dots.`
          ),
          md(
            "m",
            `**State** is data that can change. \`useState\` returns a value and a setter.

The list of vessels can live in App as an array. \`search\` state filters which rows render.

**Persist later:** UI state (open drawer, search text) can stay in React. **Server data** (logs, vessels from API) belongs in the database and flows through fetch or TanStack Query in Next Harbor.

Try first: add an \`<input>\` and log \`search\` on every keystroke with \`console.log\`.`
          ),
          info(
            "persist-hint",
            "Harbor flashback",
            "You fixed refresh with localStorage in Harbor Log. React state is the same RAM problem until you load from an API backed by Mongo."
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
          md(
            "lift",
            `**Lifting state** preview: search lives in App because App owns the table and the input. If search lived inside \`VesselRow\`, each row would have its own box. Wrong.

Later in Next Harbor you will lift fetch logic the same way: page owns data, child components display it.`
          ),
          tasks("t", "Done when", [
            { id: "filter", label: "Typing hides rows that do not match" },
            { id: "lift", label: "You can say why search state is in App not VesselRow" },
          ]),
        ],
      },
    ],
  }),

  "moshka-react-errors": lesson({
    id: "moshka-react-errors",
    name: "When the screen goes white",
    description: "Read the Console. Fix the first error only.",
    sections: [
      {
        id: "do",
        title: "Common mistakes",
        blocks: [
          meme("white", "moshka-meme-white-screen.png", "Read the console"),
          md(
            "m",
            `Open DevTools → **Console** (Chrome: right click → Inspect → Console).

| Error vibe | Usual fix |
|------------|-----------|
| Cannot find module | Wrong import path. Check \`./VesselRow\` vs \`./VesselRow.tsx\` |
| X is not defined | Missing import or typo in name |
| Objects are not valid as a React child | You tried to render an object. Render \`v.name\`, not \`v\` |
| Each child in a list should have a unique key | Add \`key=\` to mapped rows |
| Too many re-renders | You called setState during render. Move it to onClick/onChange |

Fix **one** error. Save. Read the next. Do not panic-refresh.`
          ),
          md(
            "term",
            `Run a production check before you demo:

\`\`\`bash
cd ~/Desktop/react-harbor
npm run build
\`\`\`

If build fails, TypeScript is telling you something the dev server hid. Read the file path in the error.`
          ),
          tasks("t", "Hands-on", [
            { id: "break", label: "You broke App on purpose, read Console, fixed it" },
          ]),
        ],
      },
    ],
  }),

  "moshka-react-devtools": lesson({
    id: "moshka-react-devtools",
    name: "React DevTools",
    description: "See the component tree like the DOM tree.",
    sections: [
      {
        id: "do",
        title: "Install once",
        blocks: [
          md(
            "m",
            `Install **React Developer Tools** extension for Chrome or Firefox.

With \`npm run dev\` running, open DevTools → **Components** tab.

You should see:
- \`App\`
  - \`header\`
  - \`main\`
    - \`input\`
    - \`table\`
      - \`VesselRow\` (one per row)

Click a \`VesselRow\`. Right panel shows **props**: name, status, eta.

Try first: change a prop in DevTools (temporary). It resets on reload. This proves props are inputs.`
          ),
          tip(
            "dt",
            "Use it on TailoredTech",
            "On a real repo, DevTools shows which component re-rendered. You will use this when a button does nothing."
          ),
          tasks("t", "Done when", [
            { id: "see", label: "You found VesselRow in the Components tree" },
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

Show Abdelrahman your **react-harbor** folder:

1. \`package.json\` scripts
2. \`src/types.ts\`, \`VesselRow.tsx\`, \`StatusBadge.tsx\`, \`App.tsx\`
3. Search + Clear button + filtered map
4. \`npm run build\` success
5. How this maps to Port Watch HTML you copied three times

**File tree you should have:**

\`\`\`text
react-harbor/
  index.html
  package.json
  vite.config.ts
  src/
    main.tsx
    App.tsx
    App.css
    index.css
    types.ts
    VesselRow.tsx
    StatusBadge.tsx
\`\`\`

Next folder: **03 Client Eyes** (UX on the static Port Watch) or **04 Next Harbor** when he says you are ready.`
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
