import type { NoteDocument } from "@/lib/notes-types"

const D = "2026-08-07"
const V = { sidebarNav: true, compactHero: true, showMeta: false } as const

export const gradWebNotes: Record<string, NoteDocument> = {
  "grad-web-html-css": {
    id: "grad-web-html-css",
    name: "HTML & CSS skeleton",
    title: "HTML & CSS skeleton",
    description:
      "Structure and style first. This landing shell becomes the React UI later.",
    createdAt: D,
    updatedAt: D,
    enabled: true,
    variants: V,
    sections: [
      {
        id: "html",
        title: "HTML is structure",
        blocks: [
          {
            type: "markdown",
            id: "m1",
            content: `Create a new folder next to \`my-app\`:

\`\`\`bash
mkdir ~/Documents/projects/grad-landing
cd ~/Documents/projects/grad-landing
code .
\`\`\`

Create \`index.html\`:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Grad Portfolio</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <header class="hero">
      <h1>Your Name</h1>
      <p class="tagline">Freelance developer</p>
    </header>
    <main>
      <section id="projects">
        <h2>Projects</h2>
        <div class="grid">
          <article class="card">
            <h3>Fleet dashboard</h3>
            <p>Ops UI for maritime teams.</p>
          </article>
          <article class="card">
            <h3>Booking tool</h3>
            <p>Scheduling for field crews.</p>
          </article>
          <article class="card">
            <h3>Portfolio site</h3>
            <p>This page, rebuilt later in React.</p>
          </article>
        </div>
      </section>
    </main>
    <script src="app.js"></script>
  </body>
</html>
\`\`\`

Open the file in a browser (Live Preview extension, or double-click, or \`npx serve .\`).`,
          },
          {
            type: "link",
            id: "l1",
            href: "https://developer.mozilla.org/en-US/docs/Learn/HTML",
            label: "MDN: Learn HTML",
          },
          {
            type: "link",
            id: "lr1",
            href: "https://roadmap.sh/frontend",
            label: "roadmap.sh Frontend",
            description: "See where HTML and CSS sit on the full frontend path",
          },
          {
            type: "youtube",
            id: "yt1",
            url: "https://www.youtube.com/watch?v=qz0aGYrrlhU",
            title: "HTML crash course (Programming with Mosh)",
          },
          {
            type: "link",
            id: "lcss",
            href: "https://www.youtube.com/watch?v=1Rs2ND1ryYc",
            label: "CSS zero to hero (freeCodeCamp)",
            description: "Optional deeper CSS if layout still feels fuzzy",
          },
        ],
      },
      {
        id: "css",
        title: "CSS is presentation",
        blocks: [
          {
            type: "markdown",
            id: "m2",
            content: `Create \`styles.css\` in the same folder:

\`\`\`css
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: system-ui, sans-serif;
  background: #0a0a0a;
  color: #f5f5f5;
}
.hero {
  padding: 3rem 1.5rem;
  border-bottom: 1px solid #333;
}
h1 { margin: 0 0 0.5rem; font-size: 2.25rem; }
.tagline { margin: 0; color: #aaa; }
#projects { padding: 2rem 1.5rem; }
.grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}
.card {
  border: 1px solid #333;
  padding: 1rem;
}
\`\`\`

**Try this:** change \`background\` to \`#f5f5f5\` and \`color\` to \`#111\`, save, refresh. Instant feedback is the point.

Commit when it looks decent:

\`\`\`bash
git init
git add .
git commit -m "landing skeleton"
\`\`\``,
          },
          {
            type: "link",
            id: "l2",
            href: "https://developer.mozilla.org/en-US/docs/Learn/CSS",
            label: "MDN: Learn CSS",
          },
        ],
      },
    ],
  },

  "grad-web-javascript": {
    id: "grad-web-javascript",
    name: "JavaScript basics",
    title: "JavaScript basics",
    description:
      "Make the landing page react. Same ideas React will automate later.",
    createdAt: D,
    updatedAt: D,
    enabled: true,
    variants: V,
    sections: [
      {
        id: "dom",
        title: "Talk to the page",
        blocks: [
          {
            type: "markdown",
            id: "m1",
            content: `Stay in \`grad-landing\`. Create \`app.js\` (already linked from HTML):

\`\`\`js
const heading = document.querySelector("h1");
heading.textContent = "Your Name · available for hire";

const button = document.createElement("button");
button.textContent = "Toggle theme";
button.style.marginTop = "1rem";
document.querySelector(".hero").appendChild(button);

let dark = true;
button.addEventListener("click", () => {
  dark = !dark;
  document.body.style.background = dark ? "#0a0a0a" : "#f5f5f5";
  document.body.style.color = dark ? "#f5f5f5" : "#111";
});
\`\`\`

**Concept:** JavaScript finds a node, then mutates it. React will do the same work with components and state.`,
          },
          {
            type: "playground",
            id: "p1",
            title: "Run a tiny JS sample",
            language: "javascript",
            initialCode: `const projects = [
  { title: "Fleet dashboard", summary: "Ops UI" },
  { title: "Booking tool", summary: "Scheduling" },
];

for (const p of projects) {
  console.log(p.title + " → " + p.summary);
}

console.log("count", projects.length);`,
            expectIncludes: "Fleet dashboard",
            hint: "Change a title and Run again. Arrays of objects become React lists later.",
            caption: "This runs in the browser sandbox. Same mental model as app.js.",
          },
          {
            type: "youtube",
            id: "yt1",
            url: "https://www.youtube.com/watch?v=hdI2bqOjy3c",
            title: "JavaScript crash course (Traversy Media)",
            caption: "Skim variables, functions, arrays, and the DOM.",
          },
          {
            type: "link",
            id: "ljs",
            href: "https://www.youtube.com/watch?v=PkZNo7MFNFg",
            label: "Optional: full JS beginners course (freeCodeCamp)",
          },
          {
            type: "link",
            id: "l1",
            href: "https://javascript.info/",
            label: "javascript.info",
          },
          {
            type: "link",
            id: "lr1",
            href: "https://roadmap.sh/javascript",
            label: "roadmap.sh JavaScript",
          },
        ],
      },
      {
        id: "fetch",
        title: "Fetch preview",
        blocks: [
          {
            type: "markdown",
            id: "m2",
            content: `Later your Next.js API returns JSON. The shape looks like this:

\`\`\`js
// conceptual: will work once you have /api/projects
fetch("/api/projects")
  .then((r) => r.json())
  .then((data) => console.log(data));
\`\`\`

Flow to remember: **UI ← JSON ← server ← database**.

Commit:

\`\`\`bash
git add app.js
git commit -m "theme toggle"
\`\`\``,
          },
        ],
      },
    ],
  },

  "grad-web-mini-project": {
    id: "grad-web-mini-project",
    name: "Mini landing page",
    title: "Mini landing page project",
    description:
      "Polish grad-landing until it feels like a one-page portfolio. React will rebuild it next.",
    createdAt: D,
    updatedAt: D,
    enabled: true,
    variants: V,
    sections: [
      {
        id: "outline",
        title: "Finish checklist",
        blocks: [
          {
            type: "markdown",
            id: "m1",
            content: `You already have the skeleton. Finish these before React:

| Task | File |
|------|------|
| Real name + tagline | \`index.html\` |
| At least 3 project cards | \`index.html\` |
| Decent spacing on mobile | \`styles.css\` |
| One interactive bit (theme or counter) | \`app.js\` |
| Clean git history | terminal |

Folder should look like:

\`\`\`
grad-landing/
  index.html
  styles.css
  app.js
\`\`\``,
          },
          {
            type: "mermaid",
            id: "mm1",
            title: "Page regions",
            diagram: `flowchart TB
  H[Hero: name + tagline] --> G[Project grid]
  G --> C1[Card]
  G --> C2[Card]
  G --> C3[Card]`,
          },
          {
            type: "callout",
            id: "c1",
            tone: "tip",
            title: "Bridge to React",
            body: "Next folder recreates this same hero + cards layout as components. Keep this folder open for reference while you scaffold Vite.",
          },
          {
            type: "link",
            id: "lr1",
            href: "https://roadmap.sh/frontend",
            label: "roadmap.sh Frontend",
          },
          {
            type: "link",
            id: "l1",
            href: "https://www.freecodecamp.org/learn/2022/responsive-web-design/",
            label: "Optional: freeCodeCamp Responsive Web Design",
          },
        ],
      },
    ],
  },
}
