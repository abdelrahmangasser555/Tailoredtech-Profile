import {
  lesson,
  link,
  md,
  tasks,
  tip,
  VID,
  yt,
  ytWatch,
} from "@/config/moshka-roadmap/helpers"
import type { NoteDocument } from "@/lib/notes-types"

export const moshkaScoreNotes: Record<string, NoteDocument> = {
  "moshka-score-learn": lesson({
    id: "moshka-score-learn",
    name: "What you will learn",
    description: "Two numbers on screen. Buttons change them. Same HTML CSS JS as the cafe.",
    sections: [
      {
        id: "goal",
        title: "The thing you will show",
        blocks: [
          md(
            "g",
            `Home and Away. Plus and minus. Big numbers. Reset. Keyboard shortcuts if you want them.

Pick this if you like games more than menus.`
          ),
          link(
            "pix",
            "https://pixelarticons.com",
            "Pixelarticons",
            "Optional pixel icons later. From Freesets. Not required today."
          ),
          tasks("t", "Start", [{ id: "go", label: "Open Unzip and open" }]),
        ],
      },
    ],
  }),
  "moshka-score-unzip": lesson({
    id: "moshka-score-unzip",
    name: "Unzip and open",
    description: "No install. Open index.html.",
    sections: [
      {
        id: "do",
        title: "Do this now",
        blocks: [
          md("d", `Unzip **Pixel Scoreboard**. Read \`README.md\`. Open \`index.html\`.`),
          md(
            "term",
            `Run this in the terminal:

\`\`\`bash
cd ~/Desktop
unzip ~/Downloads/pixel-scoreboard.zip
cd pixel-scoreboard
ls
\`\`\``
          ),
          tasks("t", "Done when", [{ id: "see", label: "You see two scores" }]),
        ],
      },
    ],
  }),
  "moshka-score-html": lesson({
    id: "moshka-score-html",
    name: "HTML bones",
    description: "Two teams. Rename them.",
    sections: [
      {
        id: "do",
        title: "Name the teams",
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
            "45:59",
            "51:06",
            "Buttons. Plus and minus are just buttons. Stop after this clip."
          ),
          md(
            "m",
            `Try first: in \`index.html\`, rename Home and Away. Keep \`id="home"\`, \`id="away"\`, and the \`data-team\` attributes. JS uses those.`
          ),
          md(
            "p",
            `Paste this \`<main>\` if you broke the ids:

\`\`\`html:index.html
    <main>
      <section>
        <h1 id="home-name">Ahly</h1>
        <p class="score" id="home">0</p>
        <button type="button" data-team="home" data-delta="1">+</button>
        <button type="button" data-team="home" data-delta="-1">-</button>
      </section>
      <section>
        <h1 id="away-name">Zamalek</h1>
        <p class="score" id="away">0</p>
        <button type="button" data-team="away" data-delta="1">+</button>
        <button type="button" data-team="away" data-delta="-1">-</button>
      </section>
    </main>
\`\`\``
          ),
          tasks("t", "Hands-on", [{ id: "names", label: "Team names are yours" }]),
        ],
      },
    ],
  }),
  "moshka-score-css": lesson({
    id: "moshka-score-css",
    name: "Make it look like a match",
    description: "Big numbers. High contrast. Sharp boxes.",
    sections: [
      {
        id: "do",
        title: "Big and readable",
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
            "35:00",
            "50:00",
            "Display and layout. Enough to make two big columns. Stop at 50:00."
          ),
          md(
            "m",
            `Try first: make \`.score\` huge. Two columns. Dark background is ok here. Keep radius 0.`
          ),
          md(
            "p",
            `Full stylesheet you can paste:

\`\`\`css:styles.css
* { box-sizing: border-box; }
body {
  margin: 0;
  min-height: 100vh;
  background: #0a0a0a;
  color: #f4f4f4;
  font-family: ui-sans-serif, system-ui, sans-serif;
}
main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
}
section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  border-right: 1px solid #222;
}
h1 { margin: 0; font-size: 1.25rem; letter-spacing: 0.12em; text-transform: uppercase; }
.score { margin: 0; font-size: 6rem; font-variant-numeric: tabular-nums; }
button {
  border: 1px solid #f4f4f4;
  background: transparent;
  color: #f4f4f4;
  min-width: 3rem;
  padding: 0.4rem 0.8rem;
  cursor: pointer;
}
\`\`\``
          ),
          tasks("t", "Hands-on", [
            { id: "big", label: "Scores are large enough to read from across the room" },
          ]),
        ],
      },
    ],
  }),
  "moshka-score-js": lesson({
    id: "moshka-score-js",
    name: "Plus and minus points",
    description: "Four buttons. Two numbers. No refresh.",
    sections: [
      {
        id: "do",
        title: "Wire the buttons",
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
            "55:00",
            "1:15:00",
            "Events. Each button fires one click. Stop at 1:15:00."
          ),
          md(
            "m",
            `Try first: click +. If nothing happens, open Console and look for errors. \`getElementById("home")\` must match the HTML id.

Minus must not go below 0.`
          ),
          md(
            "p",
            `Replace \`app.js\`:

\`\`\`js:app.js
const scores = { home: 0, away: 0 }

function render() {
  document.getElementById("home").textContent = String(scores.home)
  document.getElementById("away").textContent = String(scores.away)
}

document.querySelectorAll("button[data-team]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const team = btn.dataset.team
    const delta = Number(btn.dataset.delta)
    scores[team] = Math.max(0, scores[team] + delta)
    render()
  })
})
\`\`\``
          ),
          tasks("t", "Hands-on", [
            { id: "plus", label: "Plus works for both teams" },
            { id: "minus", label: "Minus never goes below 0" },
          ]),
        ],
      },
    ],
  }),
  "moshka-score-reset": lesson({
    id: "moshka-score-reset",
    name: "Reset both scores",
    description: "One button. Both numbers go to 0.",
    sections: [
      {
        id: "do",
        title: "Add Reset",
        blocks: [
          md(
            "m",
            `Try first: add a button with \`id="reset"\` outside the two columns. In JS, set both scores to 0 and call \`render()\`.`
          ),
          md(
            "p",
            `HTML after \`</main>\` (before the script tag):

\`\`\`html:index.html
    <button type="button" id="reset">Reset</button>
    <script src="app.js"></script>
\`\`\`

JS at the bottom of \`app.js\`:

\`\`\`js:app.js
document.getElementById("reset").addEventListener("click", () => {
  scores.home = 0
  scores.away = 0
  render()
})
\`\`\`

You may need a little CSS so Reset is visible on the dark page. Put it \`position: fixed; bottom: 1rem; left: 50%; transform: translateX(-50%);\`.`
          ),
          tasks("t", "Hands-on", [{ id: "reset", label: "Reset sets both scores to 0" }]),
        ],
      },
    ],
  }),
  "moshka-score-keyboard": lesson({
    id: "moshka-score-keyboard",
    name: "Keyboard shortcuts",
    description: "A and Z for home. K and M for away. Same functions as the buttons.",
    sections: [
      {
        id: "do",
        title: "Listen on the window",
        blocks: [
          md(
            "m",
            `Try first: \`window.addEventListener("keydown", ...)\`. Map keys to the same \`scores\` object.

If typing in a form, skip this. This page has no form.`
          ),
          md(
            "p",
            `Paste at the bottom of \`app.js\`:

\`\`\`js:app.js
window.addEventListener("keydown", (event) => {
  if (event.key === "a" || event.key === "A") scores.home += 1
  if (event.key === "z" || event.key === "Z") scores.home = Math.max(0, scores.home - 1)
  if (event.key === "k" || event.key === "K") scores.away += 1
  if (event.key === "m" || event.key === "M") scores.away = Math.max(0, scores.away - 1)
  render()
})
\`\`\`

Click the page first so it has focus. Then press A.`
          ),
          tasks("t", "Hands-on", [
            { id: "keys", label: "Keyboard changes scores without clicking" },
          ]),
        ],
      },
    ],
  }),
  "moshka-score-ship": lesson({
    id: "moshka-score-ship",
    name: "Show someone",
    description: "A 3-2 score. Screenshot.",
    sections: [
      {
        id: "show",
        title: "Done",
        blocks: [
          md("m", `Leave it at 3-2. Screenshot. Send.`),
          tip("n", "Next", "Port Watch is the grown-up frontend project."),
          tasks("t", "Done when", [{ id: "shot", label: "Screenshot sent" }]),
        ],
      },
    ],
  }),
}
