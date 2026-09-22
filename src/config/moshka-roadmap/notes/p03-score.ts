import {
  beforeYouStart,
  concept,
  figLink,
  figureN,
  ill,
  lesson,
  link,
  md,
  tasks,
  teachStep,
  termStep,
  tip,
  VID,
  watchPair,
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
          beforeYouStart(
            "plan",
            "Build a two-team scoreboard: big numbers, plus and minus, optional reset.",
            "Home and Away scores change when you click buttons.",
            ["index.html", "styles.css", "app.js"]
          ),
          ...figureN(
            1,
            "score-goal",
            "moshka-score-big.png",
            "Big score numbers",
            `The scoreboard is two huge numbers and clear buttons. ${figLink(1, "score-goal")} is the visual priority before you touch CSS.`
          ),
          md(
            "g",
            `Home and Away. Plus and minus. Big numbers. Reset. Keyboard shortcuts if you want them.

Pick this if you like games more than menus.

You already did Pixel Cafe: three files, browser only, no npm. Same rhythm here, but we go **one small step at a time** in each lesson.`
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
          beforeYouStart(
            "plan",
            "Unzip the starter zip and open the page in Chrome.",
            "You see two scores at 0 and plus/minus buttons.",
            ["index.html"]
          ),
          ill("unzip", "moshka-unzip.png", "Unzip habit"),
          md("d", `Unzip **Pixel Scoreboard**. Read \`README.md\` in the folder.`),
          ...termStep(
            1,
            "Unzip in the terminal",
            "These commands go in the terminal app, not in the browser Console.",
            `cd ~/Desktop
unzip ~/Downloads/pixel-scoreboard.zip
cd pixel-scoreboard
ls`
          ),
          concept(
            "open-html",
            "How to open the page",
            `Double-click \`index.html\` or drag it into Chrome.

The address bar should start with \`file://\`. That is fine for this project. You are not running a server yet.`
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
          beforeYouStart(
            "plan",
            "Understand the scoreboard HTML, then rename the teams without breaking ids.",
            "Your team names show on screen. Plus/minus still work.",
            ["index.html"]
          ),
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
          concept(
            "html-ids",
            "Why ids matter",
            `**id** is a unique name on one element. JavaScript will look up \`home\` and \`away\` to change the score text.

If you rename the visible team title, that is fine. If you change \`id="home"\` or \`data-team="home"\`, the buttons stop working until you fix JS too.`
          ),
          md(
            "m",
            `**Try first:** in \`index.html\`, change only the text inside \`<h1 id="home-name">\` and \`<h1 id="away-name">\`. Refresh. Scores should still work.`
          ),
          ...teachStep(
            1,
            "Read one team column",
            `Each team is a \`<section>\`. The score is a \`<p>\` with an id. Buttons carry \`data-team\` and \`data-delta\` for JS.`,
            "html",
            "index.html",
            `      <section>
        <h1 id="home-name">Home</h1>
        <p class="score" id="home">0</p>
        <button type="button" data-team="home" data-delta="1">+</button>
        <button type="button" data-team="home" data-delta="-1">-</button>
      </section>`,
            "1-6",
            `- \`<h1 id="home-name">\` is the team label you can rename freely.
- \`<p id="home">\` is the **number** JS updates. Keep \`id="home"\`.
- \`data-team="home"\` tells JS which score object to change.
- \`data-delta="1"\` means add 1 on click. \`-1\` means subtract 1.
- \`type="button"\` stops the button from submitting a form (good habit).`
          ),
          ...teachStep(
            2,
            "Full main block (only if you broke ids)",
            `Paste this whole \`<main>\` only if plus/minus stopped working. Then rename Ahly/Zamalek again.`,
            "html",
            "index.html",
            `    <main>
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
    </main>`,
            "1-16",
            `- Two \`<section>\` blocks side by side in the file (CSS will put them in columns later).
- Mirror structure for away: \`id="away"\`, \`data-team="away"\`.
- Every \`data-team\` value must match an \`id\` on a score \`<p>\`.`
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
          beforeYouStart(
            "plan",
            "Build the stylesheet in layers: page background, two columns, huge scores, button style.",
            "Scores are huge. Two columns fill the screen. Sharp corners (no pills).",
            ["styles.css"]
          ),
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
          concept(
            "css-role",
            "What CSS does here",
            `HTML already has the teams and buttons. **CSS** only changes look: colors, size, layout.

You will replace or grow \`styles.css\` step by step. After each step, refresh the browser to see the change.`
          ),
          ...teachStep(
            1,
            "Page background and box sizing",
            `\`*\` means "every element". \`box-sizing: border-box\` makes width math easier when you add borders later.`,
            "css",
            "styles.css",
            `* { box-sizing: border-box; }
body {
  margin: 0;
  min-height: 100vh;
  background: #0a0a0a;
  color: #f4f4f4;
  font-family: ui-sans-serif, system-ui, sans-serif;
}`,
            "1-8",
            `- \`margin: 0\` removes default body gap so the dark background touches the edges.
- \`min-height: 100vh\` = at least full window height (\`vh\` = viewport height).
- \`#0a0a0a\` is near-black background. \`#f4f4f4\` is light text.`
          ),
          ...teachStep(
            2,
            "Two columns with grid",
            `\`display: grid\` with two equal columns splits Home and Away.`,
            "css",
            "styles.css",
            `* { box-sizing: border-box; }
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
}`,
            "9-22",
            `- \`main\` is the wrapper around both teams in HTML.
- \`1fr 1fr\` = two columns, equal width.
- \`section\` uses flex to center the score and buttons in each half.
- \`border-right\` draws a line between the teams.`
          ),
          ...teachStep(
            3,
            "Huge score numbers and buttons",
            `\`.score\` targets the \`<p class="score">\` elements. Big font = stadium feel.`,
            "css",
            "styles.css",
            `* { box-sizing: border-box; }
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
}`,
            "23-32",
            `- \`6rem\` makes the score very large. \`tabular-nums\` keeps digits aligned when the score changes.
- Buttons stay sharp (no \`border-radius\`). \`cursor: pointer\` shows a hand on hover.
- If something looks wrong, compare your HTML \`class="score"\` with this selector.`
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
          beforeYouStart(
            "plan",
            "Build app.js in small pieces: memory for scores, a render function, then click listeners.",
            "Plus and minus work for both teams. Scores never go below 0.",
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
            "55:00",
            "1:15:00",
            "Events. Each button fires one click. Stop at 1:15:00. Loops and map are in JavaScript lab."
          ),
          link(
            "js-lab",
            "/notes/moshka/moshka-roadmap/moshka-p-js-lab/moshka-js-learn",
            "JavaScript lab",
            "Language notes. This scoreboard lesson is only plus and minus clicks."
          ),
          ...watchPair(
            {
              blockId: "v-ev",
              url: VID.jsEventsWds,
              title: "Learn JavaScript event listeners (Web Dev Simplified)",
              caption: "About 18 minutes. Matches addEventListener in app.js.",
            },
            {
              blockId: "v-ev-long",
              url: VID.jsTraversy,
              title: "JavaScript crash course (Traversy Media)",
              from: "55:00",
              to: "1:05:00",
              why: "DOM events and listeners again from another angle.",
            }
          ),
          concept(
            "scores-obj",
            "One object, two keys",
            `\`scores\` is an **object** with \`home\` and \`away\` numbers inside.

When a button clicks, you change \`scores.home\` or \`scores.away\`, then **render** pushes those numbers back into the HTML.`
          ),
          ...teachStep(
            1,
            "Remember both scores in memory",
            `Start with this line only in \`app.js\`. Refresh: numbers stay 0 until we wire buttons.`,
            "js",
            "app.js",
            `const scores = { home: 0, away: 0 }`,
            "1",
            `- \`const\` means you will not replace the whole \`scores\` object later (you will change properties inside it).
- \`home: 0\` and \`away: 0\` are **properties** (fields) on the object.
- This is the cafe \`total\` idea, but two teams at once.`
          ),
          ...teachStep(
            2,
            "render updates the page",
            `JS holds the truth in \`scores\`. The \`<p id="home">\` text must match. \`render\` copies memory to the screen.`,
            "js",
            "app.js",
            `const scores = { home: 0, away: 0 }

function render() {
  document.getElementById("home").textContent = String(scores.home)
  document.getElementById("away").textContent = String(scores.away)
}`,
            "3-6",
            `- \`function render()\` groups the update logic so you call one name after every click.
- \`getElementById("home")\` finds the score \`<p>\` from HTML. The string must match \`id="home"\`.
- \`.textContent\` sets the visible number.
- \`String(...)\` turns the number into text for the page (safe habit).`
          ),
          ...teachStep(
            3,
            "Listen to every score button",
            `\`querySelectorAll\` finds all buttons with \`data-team\`. \`forEach\` attaches one listener each.`,
            "js",
            "app.js",
            `const scores = { home: 0, away: 0 }

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
})`,
            "8-15",
            `- \`button[data-team]\` = only buttons that have a \`data-team\` attribute (not Reset later).
- \`addEventListener("click", ...)\` runs the arrow function when that button is clicked.
- \`btn.dataset.team\` reads \`data-team="home"\` as the string \`"home"\`.
- \`Number(btn.dataset.delta)\` turns \`"1"\` or \`"-1"\` into real math.
- \`scores[team]\` uses the team name as a key: \`scores["home"]\` or \`scores.home\`.
- \`Math.max(0, ...)\` means minus never goes below zero.
- \`render()\` refreshes both numbers on screen after each click.`
          ),
          tip(
            "debug",
            "If nothing happens",
            "Open Console (F12). Red text often means a typo in an id. \`getElementById\` returns null if the id is wrong."
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
          beforeYouStart(
            "plan",
            "Add a Reset button in HTML, then wire it in JS without breaking the four score buttons.",
            "One click sets home and away back to 0.",
            ["index.html", "app.js"]
          ),
          ...teachStep(
            1,
            "Reset button in HTML",
            `Put this **after** \`</main>\`, **before** \`<script src="app.js">\`. No \`data-team\` on Reset.`,
            "html",
            "index.html",
            `    <button type="button" id="reset">Reset</button>
    <script src="app.js"></script>`,
            "1-2",
            `- \`id="reset"\` lets JS find this one button.
- Reset is outside the grid so it can sit at the bottom of the page.
- Score buttons still use \`data-team\`. Reset does not, so your \`querySelectorAll\` ignores it.`
          ),
          ...teachStep(
            2,
            "Reset handler in app.js",
            `Append at the **bottom** of \`app.js\`. Keep your score button code above this.`,
            "js",
            "app.js",
            `document.getElementById("reset").addEventListener("click", () => {
  scores.home = 0
  scores.away = 0
  render()
})`,
            "1-5",
            `- Same pattern as cafe Clear: set memory to zero, then update the page.
- \`scores.home\` and \`scores.away\` must match the object you built earlier.
- \`render()\` must already exist above this block.`
          ),
          md(
            "css-reset",
            `Optional CSS so Reset is visible on the dark page:

\`\`\`css:styles.css
#reset {
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
}
\`\`\`

\`fixed\` pins it to the window. \`translateX(-50%)\` centers it.`
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
          beforeYouStart(
            "plan",
            "Listen for key presses on the whole window and change the same scores object.",
            "A/Z and K/M change scores like the buttons.",
            ["app.js"]
          ),
          concept(
            "focus",
            "Click the page first",
            `The browser only sends keys to the focused thing. Click the scoreboard background once before testing keys.

This page has no text inputs, so keys go to the window listener.`
          ),
          ...teachStep(
            1,
            "keydown on window",
            `Append at the bottom of \`app.js\`. Each \`if\` checks one key. Call \`render()\` once at the end.`,
            "js",
            "app.js",
            `window.addEventListener("keydown", (event) => {
  if (event.key === "a" || event.key === "A") scores.home += 1
  if (event.key === "z" || event.key === "Z") scores.home = Math.max(0, scores.home - 1)
  if (event.key === "k" || event.key === "K") scores.away += 1
  if (event.key === "m" || event.key === "M") scores.away = Math.max(0, scores.away - 1)
  render()
})`,
            "1-7",
            `- \`window\` = the whole browser tab. Keys work even if you did not click a button.
- \`event.key\` is the letter pressed. We check both lower and upper case.
- \`+= 1\` is the same as \`scores.home = scores.home + 1\`.
- Same \`Math.max(0, ...)\` rule as the minus buttons.
- One \`render()\` after all checks updates the screen once per key press.`
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
