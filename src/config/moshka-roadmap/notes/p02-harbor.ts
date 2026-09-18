import {
  explain,
  lesson,
  md,
  mermaid,
  tasks,
  tip,
  VID,
  yt,
  ytWatch,
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
          md(
            "g",
            `A page that looks like a logbook. You type a line. You hit save. The line appears in the list. Refresh still shows the lines after you add localStorage.

This is the same muscle as the cafe. Pick this if cafe felt too cute.`
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
            "DOM and events. This is the form submit. Stop at 1:05:00."
          ),
          md(
            "m",
            `Try first: submit the form. If the page reloads, you are missing \`event.preventDefault()\`. That is the whole trick. A form submit reloads unless you stop it.

Open the Console. Log \`input.value\` inside the submit handler.`
          ),
          md(
            "p",
            `Replace all of \`app.js\` if save does not work:

\`\`\`js:app.js
const form = document.getElementById("form")
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
\`\`\`

Empty save should do nothing. A real line should appear at the top of the list.`
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
          md(
            "m",
            `The \`<ul>\` is empty in HTML. JS only adds \`<li>\` in memory. Refresh rebuilds the page from HTML. The lines are gone.

\`localStorage\` saves a string on this computer, this browser. It is good for a toy log. It is not Mongo. Other people cannot see it.`
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
        title: "Full app.js with persist",
        blocks: [
          md(
            "p",
            `Replace \`app.js\`:

\`\`\`js:app.js
const form = document.getElementById("form")
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
\`\`\`

Save two lines. Refresh. They should still be there.`
          ),
          tasks("t", "Hands-on", [
            { id: "keep", label: "Refresh keeps the log lines" },
          ]),
        ],
      },
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
