import {
  explain,
  figLink,
  figureN,
  ill,
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
  beforeYouStart,
  teachStep,
} from "@/config/moshka-roadmap/helpers"
import type { NoteDocument } from "@/lib/notes-types"

export const moshkaHarborNotes: Record<string, NoteDocument> = {
  "moshka-harbor-learn": lesson({
    id: "moshka-harbor-learn",
    name: "What you will learn",
    description:
      "Same skills as Pixel Cafe: HTML, CSS, JS. The story is a captain log.",
    sections: [
      {
        id: "goal",
        title: "The thing you will show",
        blocks: [
          beforeYouStart(
            "plan",
            "Build a captain log: type a note, save it, keep it after refresh with localStorage.",
            "Notes stay on this browser. Later you will use a real database for shared logs.",
            ["index.html", "styles.css", "app.js"]
          ),
          ...figureN(
            1,
            "harbor-goal",
            "moshka-harbor-paper.png",
            "Logbook page",
            `The UI should feel like paper in a browser: form on top, list below. ${figLink(1, "harbor-goal")} is the layout target before you write HTML.`
          ),
          md(
            "g",
            `A page that looks like a logbook. You type a line. You hit save. The line appears in the list. Refresh still shows the lines after you add localStorage.

This is the same muscle as the cafe. Pick this if cafe felt too cute.

**Arc:** save lines in the page (JS) → survive refresh (\`localStorage\`) → later a **real database** so other people and servers see the same logs (Mongo project).`
          ),
          mermaid(
            "flow",
            `flowchart LR
  I[index.html] --> S[styles.css]
  S --> A[app.js]
  A --> L[Notes on the page]`,
            "Same three files",
            undefined,
            {
              I: "html-file",
              S: "css-file",
              A: "js-file",
              L: "notes-list",
            }
          ),
          tasks("t", "Start", [
            { id: "unzip-next", label: "Open Unzip and open next" },
          ]),
        ],
      },
    ],
    explains: [
      explain(
        "html-file",
        "HTML",
        "index.html",
        `Heading, form, list. Keep \`id="form"\`, \`id="text"\`, and \`id="list"\`. JS looks for those.`
      ),
      explain(
        "css-file",
        "CSS",
        "styles.css",
        `Paper color, dashed lines, mono eyebrow. Sharp corners.`
      ),
      explain(
        "js-file",
        "JS",
        "app.js",
        `Submit handler. \`event.preventDefault()\` so the page does not reload. Then a new \`<li>\`.`
      ),
      explain(
        "notes-list",
        "Notes",
        "Notes on the page",
        `The list is empty until you save. Later you keep lines in localStorage so refresh does not wipe them.`
      ),
    ],
  }),
  "moshka-harbor-unzip": lesson({
    id: "moshka-harbor-unzip",
    name: "Unzip and open",
    description: "Files on disk. Page in the browser. No install.",
    sections: [
      {
        id: "do",
        title: "Do this now",
        blocks: [
          ill("unzip", "moshka-unzip.png", "Unzip habit"),
          md(
            "d",
            `Download **Harbor Log zip**. Unzip. Open \`README.md\`. Open \`index.html\` in Chrome.

You should see a heading, a text box, and Save.`
          ),
          md(
            "term",
            `Run this in the terminal:

\`\`\`bash
cd ~/Desktop
unzip ~/Downloads/harbor-log.zip
cd harbor-log
ls
\`\`\`

You should see \`index.html\`, \`styles.css\`, \`app.js\`.`
          ),
          tasks("t", "Done when", [
            { id: "see", label: "Harbor Log is open in the browser" },
          ]),
        ],
      },
    ],
  }),
  "moshka-harbor-html": lesson({
    id: "moshka-harbor-html",
    name: "HTML bones",
    description: "A heading, a list, a form. Change the title of the ship.",
    sections: [
      {
        id: "do",
        title: "Name the vessel",
        blocks: [
          yt(
            "v",
            VID.html,
            "HTML in 100 Seconds (Fireship)",
            "Watch from 0:00 to the end. About 2:33."
          ),
          ytWatch(
            "v-long",
            VID.htmlBro,
            "HTML full course (Bro Code)",
            "23:42",
            "28:18",
            "Lists only. That is the log on the page. Stop after lists."
          ),
          md(
            "m",
            `Try first: open \`index.html\`. Change \`MV Example\` in the \`<h1>\`. Add a \`<p>\` under it with one sentence.

The form must keep \`id="form"\`, \`id="text"\`, and \`id="list"\`. JS looks for those ids.`
          ),
          md(
            "p",
            `If you broke the page, paste this body back:

\`\`\`html:index.html
  <body>
    <header>
      <p class="eyebrow">Vessel</p>
      <h1>MV Red Sea</h1>
      <p>Night orders. Short lines only.</p>
    </header>
    <main>
      <form id="form">
        <input id="text" name="text" placeholder="Left port at 06:00" autocomplete="off" />
        <button type="submit">Save</button>
      </form>
      <ul id="list"></ul>
    </main>
    <script src="app.js"></script>
  </body>
\`\`\``
          ),
          tasks("t", "Hands-on", [
            { id: "name", label: "Ship name changed" },
            { id: "p", label: "A paragraph exists under the title" },
          ]),
        ],
      },
    ],
  }),
  "moshka-harbor-css": lesson({
    id: "moshka-harbor-css",
    name: "Make it feel like a logbook",
    description: "Paper color. Mono timestamps later. Sharp edges.",
    sections: [
      {
        id: "do",
        title: "Paper, not neon",
        blocks: [
          yt(
            "v",
            VID.css,
            "CSS in 100 Seconds (Fireship)",
            "Watch from 0:00 to the end. About 2:20."
          ),
          ytWatch(
            "v-long",
            VID.cssBro,
            "CSS full course (Bro Code)",
            "18:00",
            "35:00",
            "Box model, padding, border. Stop at 35:00. Enough for a paper log."
          ),
          md(
            "m",
            `Try first: open \`styles.css\`. Change the background. Add a dashed line under the title.

Enterprise later is dense and navy. Today is a notebook.`
          ),
          md(
            "p",
            `A full stylesheet you can paste, then tweak one color:

\`\`\`css:styles.css
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: ui-sans-serif, system-ui, sans-serif;
  background: #efe8d8;
  color: #1a140c;
}
header, main { max-width: 32rem; margin: 0 auto; padding: 1.5rem; }
.eyebrow {
  font-family: ui-monospace, monospace;
  font-size: 0.7rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #6b5e4e;
}
h1 {
  margin: 0.3rem 0 0.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px dashed #b9a990;
}
form { display: flex; gap: 0.5rem; }
input { flex: 1; border: 1px solid #1a140c; padding: 0.5rem; background: #fffaf0; }
button { border: 1px solid #1a140c; background: #1a140c; color: #fff; padding: 0.5rem 0.8rem; }
ul { list-style: none; padding: 0; }
li { padding: 0.6rem 0; border-bottom: 1px dashed #d4c4a8; }
\`\`\``
          ),
          tasks("t", "Hands-on", [
            { id: "paper", label: "Background is not default white" },
            { id: "dash", label: "A dashed divider exists" },
          ]),
        ],
      },
    ],
  }),
  "moshka-harbor-js": lesson({
    id: "moshka-harbor-js",
    name: "Save a note",
    description: "Read the input. Push a line into the list. Clear the box.",
    sections: [
      {
        id: "do",
        title: "Type, save, see",
        blocks: [
          beforeYouStart(
            "plan",
            "Wire the form so Save adds a line to the list without reloading the page.",
            "You type text, click Save, see a new line at the top, and the input clears.",
            ["app.js"]
          ),
          yt(
            "v",
            VID.js,
            "JavaScript in 100 Seconds (Fireship)",
            "Watch from 0:00 to the end. About 2 minutes."
          ),
          ytWatch(
            "v-long",
            VID.jsTraversy,
            "JavaScript crash course (Traversy Media)",
            "45:00",
            "1:05:00",
            "Events. This is the form submit. Stop at 1:05:00. Language (loops, map, Node) lives in JavaScript lab, not here."
          ),
          link(
            "js-lab",
            "/notes/moshka/moshka-roadmap/moshka-p-js-lab/moshka-js-learn",
            "JavaScript lab",
            "If functions or arrays still feel new, do that notes list next. This Harbor lesson is only the form."
          ),
          ...figureN(
            1,
            "memory-only",
            "moshka-refresh-wipes-list.png",
            "Refresh wipes the list",
            `Notes live only in RAM until you save them somewhere. Refresh rebuilds the page from HTML, so your \`<li>\` elements vanish. ${figLink(1, "memory-only")} is why the next lesson adds \`localStorage\`.`
          ),
          md(
            "m",
            `Try first: submit the form. If the page reloads, you are missing \`event.preventDefault()\`. That is the whole trick. A form submit reloads unless you stop it.

Open the Console. Log \`input.value\` inside the submit handler.

Save two notes, then refresh. **They disappear.** That is not a bug. You have no persistence yet.`
          ),
          ...teachStep(
            1,
            "Grab the three HTML pieces",
            `Open \`app.js\`. At the top, store references to the form, the text box, and the list. These ids must match \`index.html\` exactly.`,
            "js",
            "app.js",
            `const form = document.getElementById("form")
const input = document.getElementById("text")
const list = document.getElementById("list")
`,
            "1-3"
          ),
          ...teachStep(
            2,
            "Listen for Save (submit)",
            `When the user clicks Save, the form tries to reload the page. **Step 2** adds a listener that stops that reload and runs your code instead.`,
            "js",
            "app.js",
            `const form = document.getElementById("form")
const input = document.getElementById("text")
const list = document.getElementById("list")

form.addEventListener("submit", (event) => {
  event.preventDefault()
})
`,
            "5-7"
          ),
          ...teachStep(
            3,
            "Read the text and skip empty saves",
            `Inside the listener: read \`input.value\`, trim spaces, and return early if the user saved nothing.`,
            "js",
            "app.js",
            `const form = document.getElementById("form")
const input = document.getElementById("text")
const list = document.getElementById("list")

form.addEventListener("submit", (event) => {
  event.preventDefault()
  const text = input.value.trim()
  if (!text) return
})
`,
            "8-9"
          ),
          ...teachStep(
            4,
            "Put the line on the page",
            `Create a new \`<li>\`, set its text, prepend it to the list, then clear the input so you can type the next note.`,
            "js",
            "app.js",
            `const form = document.getElementById("form")
const input = document.getElementById("text")
const list = document.getElementById("list")

form.addEventListener("submit", (event) => {
  event.preventDefault()
  const text = input.value.trim()
  if (!text) return
  const li = document.createElement("li")
  li.textContent = text
  list.prepend(li)
  input.value = ""
})
`,
            "10-14"
          ),
          tasks("t", "Hands-on", [
            { id: "save", label: "Typing a line and saving shows it on the page" },
            { id: "empty", label: "Empty save does nothing" },
          ]),
        ],
      },
    ],
  }),
  "moshka-harbor-persist": lesson({
    id: "moshka-harbor-persist",
    name: "Keep notes after refresh",
    description: "localStorage is a tiny key-value store in the browser. Not a real database.",
    sections: [
      {
        id: "why",
        title: "Why refresh kills the list",
        blocks: [
          ...figureN(
            1,
            "localstorage-drawer",
            "moshka-localstorage.png",
            "localStorage on this computer",
            `\`localStorage\` is a small key-value drawer inside **this browser on this machine**. Refresh can reload the page and still read the drawer. It does **not** share data with your phone, your cousin, or a server. ${figLink(1, "localstorage-drawer")} shows the limit.`
          ),
          md(
            "m",
            `The \`<ul>\` is empty in HTML. JS only adds \`<li>\` in memory until you call \`localStorage.setItem\`. Refresh rebuilds the page from HTML unless you **rehydrate** the list from that drawer on load.

**Not a database:** no queries, no other users, no backup if you clear site data. Mongo Harbor (project 06) fixes the "everyone needs the same logs" problem.`
          ),
          ...figureN(
            2,
            "persistence-ladder",
            "moshka-persistence-ladder.png",
            "Where data can live",
            `Step 1: DOM only (refresh loses it). Step 2: \`localStorage\` (this browser). Step 3: server memory (dies on deploy). Step 4: database (shared, durable). You are on step 2 now. ${figLink(2, "persistence-ladder")} is the whole roadmap.`
          ),
          link(
            "db-later",
            "/notes/moshka/moshka-roadmap/moshka-p06-harbor-api/moshka-api-db-idea",
            "Preview: what a database is",
            "Read this after persist works. Same Harbor story, but logs survive for the whole team."
          ),
        ],
      },
      {
        id: "try",
        title: "Try first",
        blocks: [
          md(
            "t",
            `In the Console:

\`\`\`js
localStorage.setItem("harbor-notes", JSON.stringify(["test line"]))
localStorage.getItem("harbor-notes")
\`\`\`

Refresh. Run \`getItem\` again. The string is still there.`
          ),
        ],
      },
      {
        id: "paste",
        title: "Build app.js with localStorage",
        blocks: [
          beforeYouStart(
            "persist-plan",
            "Save notes as JSON in localStorage, then redraw the list on load and after every save.",
            "Refresh keeps your notes on this browser. Another browser still will not see them.",
            ["app.js"]
          ),
          ...teachStep(
            1,
            "Name the storage key",
            `Keep the form code from the last lesson. Add one constant \`KEY\` so every read/write uses the same drawer name.`,
            "js",
            "app.js",
            `const form = document.getElementById("form")
const input = document.getElementById("text")
const list = document.getElementById("list")
const KEY = "harbor-notes"
`,
            "4"
          ),
          ...teachStep(
            2,
            "readNotes and writeNotes",
            `\`readNotes\` pulls a JSON string from the drawer and turns it into an array. \`writeNotes\` does the reverse. If JSON is broken, return an empty array instead of crashing.`,
            "js",
            "app.js",
            `const form = document.getElementById("form")
const input = document.getElementById("text")
const list = document.getElementById("list")
const KEY = "harbor-notes"

function readNotes() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeNotes(notes) {
  localStorage.setItem(KEY, JSON.stringify(notes))
}
`,
            "6-17"
          ),
          ...teachStep(
            3,
            "render() redraws the list",
            `Clear the \`<ul>\`, loop the saved strings, and append one \`<li>\` per note. You will call this on page load and after each save.`,
            "js",
            "app.js",
            `const form = document.getElementById("form")
const input = document.getElementById("text")
const list = document.getElementById("list")
const KEY = "harbor-notes"

function readNotes() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeNotes(notes) {
  localStorage.setItem(KEY, JSON.stringify(notes))
}

function render() {
  list.innerHTML = ""
  for (const text of readNotes()) {
    const li = document.createElement("li")
    li.textContent = text
    list.append(li)
  }
}
`,
            "19-26"
          ),
          ...teachStep(
            4,
            "Save to storage, then render",
            `On submit: prepend the new text to the array, write the array to localStorage, clear the input, call \`render()\`.`,
            "js",
            "app.js",
            `const form = document.getElementById("form")
const input = document.getElementById("text")
const list = document.getElementById("list")
const KEY = "harbor-notes"

function readNotes() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeNotes(notes) {
  localStorage.setItem(KEY, JSON.stringify(notes))
}

function render() {
  list.innerHTML = ""
  for (const text of readNotes()) {
    const li = document.createElement("li")
    li.textContent = text
    list.append(li)
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault()
  const text = input.value.trim()
  if (!text) return
  const notes = [text, ...readNotes()]
  writeNotes(notes)
  input.value = ""
  render()
})
`,
            "28-36"
          ),
          ...teachStep(
            5,
            "Draw notes when the page opens",
            `Last line: call \`render()\` once at the bottom so old notes show up before you type anything.`,
            "js",
            "app.js",
            `const form = document.getElementById("form")
const input = document.getElementById("text")
const list = document.getElementById("list")
const KEY = "harbor-notes"

function readNotes() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeNotes(notes) {
  localStorage.setItem(KEY, JSON.stringify(notes))
}

function render() {
  list.innerHTML = ""
  for (const text of readNotes()) {
    const li = document.createElement("li")
    li.textContent = text
    list.append(li)
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault()
  const text = input.value.trim()
  if (!text) return
  const notes = [text, ...readNotes()]
  writeNotes(notes)
  input.value = ""
  render()
})

render()
`,
            "38"
          ),
          info(
            "limit",
            "Still not Mongo",
            "Open the site in another browser profile. Your notes will not be there. That gap is why TailoredTech uses databases on Harbor API and BBS."
          ),
          tasks("t", "Hands-on", [
            { id: "keep", label: "Refresh keeps the log lines" },
            { id: "other-browser", label: "You checked another browser and saw notes do not sync" },
          ]),
        ],
      },
    ],
    explains: [
      explain(
        "localstorage",
        "localStorage",
        "Browser drawer",
        `Key-value strings per origin. \`setItem\` / \`getItem\`. Cleared when user wipes site data. Not shared across devices.`
      ),
      explain(
        "database-next",
        "Database",
        "What comes later",
        `A separate program (Mongo, Postgres) keeps rows or documents on disk. Your API reads and writes so every user sees the same data.`
      ),
    ],
  }),
  "moshka-harbor-time": lesson({
    id: "moshka-harbor-time",
    name: "Add a timestamp",
    description: "Each line gets a time. Store objects, not only strings.",
    sections: [
      {
        id: "do",
        title: "Upgrade the shape",
        blocks: [
          md(
            "m",
            `Try first: instead of saving a string, save \`{ text, at: new Date().toISOString() }\`. Render both.

If old data in localStorage is still a list of strings, clear it once in the Console:

\`\`\`js
localStorage.removeItem("harbor-notes")
\`\`\``
          ),
          md(
            "p",
            `Change \`writeNotes\` / \`render\` so each item is an object. Example render:

\`\`\`js:app.js
function render() {
  list.innerHTML = ""
  for (const note of readNotes()) {
    const li = document.createElement("li")
    const time = new Date(note.at).toLocaleString()
    li.textContent = time + "  " + note.text
    list.append(li)
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault()
  const text = input.value.trim()
  if (!text) return
  const notes = [{ text, at: new Date().toISOString() }, ...readNotes()]
  writeNotes(notes)
  input.value = ""
  render()
})
\`\`\`

Keep \`readNotes\` as it was. After a save you should see a time on the left of the line.`
          ),
          tasks("t", "Hands-on", [
            { id: "time", label: "Each saved line shows a time" },
          ]),
        ],
      },
    ],
  }),
  "moshka-harbor-ship": lesson({
    id: "moshka-harbor-ship",
    name: "Show someone",
    description: "Three log lines. Screenshot. Send.",
    sections: [
      {
        id: "show",
        title: "Done",
        blocks: [
          md("m", `Add three fake log lines. Refresh once so they still show. Screenshot. Send to Abdelrahman.`),
          tip(
            "n",
            "Next",
            "Skip the other 01 flavors if this clicked. Port Watch is the next real frontend."
          ),
          tasks("t", "Done when", [{ id: "shot", label: "Screenshot sent" }]),
        ],
      },
    ],
  }),
}
