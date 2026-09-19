import {
  explain,
  figLink,
  figureN,
  info,
  lesson,
  link,
  md,
  mermaid,
  tasks,
  tip,
} from "@/config/moshka-roadmap/helpers"
import type { NoteDocument } from "@/lib/notes-types"

export const moshkaUxNotes: Record<string, NoteDocument> = {
  "moshka-ux-learn": lesson({
    id: "moshka-ux-learn",
    name: "What you will learn",
    description:
      "Look at Port Watch like a fleet office, not like a Dribbble shot.",
    sections: [
      {
        id: "goal",
        title: "The client is not you",
        blocks: [
          ...figureN(
            1,
            "ux-roles",
            "moshka-client-hat.png",
            "Who is looking",
            `Crew, office, and admin need different defaults on the same data. ${figLink(1, "ux-roles")} is three hats on one product.`
          ),
          md(
            "g",
            `A Bahri office user opens this 80 times a day. They want density, search, and no cute empty space.

You will change Port Watch to match that. Library from Freesets this week: [Vaul](https://vaul.emilkowal.ski) (drawers), same idea BBS uses on mobile.`
          ),
          mermaid(
            "f",
            `flowchart LR
  C[Client job] --> S[Screen]
  S --> R[Role]
  R --> D[Drawer for details]`,
            "Think in jobs",
            undefined,
            {
              C: "client-job",
              S: "screen",
              R: "role",
              D: "drawer",
            }
          ),
          tasks("t", "Start", [
            { id: "open", label: "Keep Port Watch open beside these notes" },
          ]),
        ],
      },
    ],
    explains: [
      explain(
        "client-job",
        "Job",
        "Client job",
        `Write one sentence: "Find which vessel is delayed." That sentence drives the screen.`
      ),
      explain(
        "screen",
        "Screen",
        "Screen",
        `Dense. Search. No cute empty space. An office user opens this 80 times a day.`
      ),
      explain(
        "role",
        "Role",
        "Role",
        `Crew, office, admin. Same product, different hats. BBS does this with routes.`
      ),
      explain(
        "drawer",
        "Drawer",
        "Drawer for details",
        `Vaul on mobile. Details slide over the table. Do not dump every field in the row.`
      ),
    ],
  }),
  "moshka-ux-client": lesson({
    id: "moshka-ux-client",
    name: "Think like the client",
    description: "Write the job in one sentence before you style.",
    sections: [
      {
        id: "do",
        title: "One sentence",
        blocks: [
          md(
            "m",
            `Try first: write at the top of Port Watch (a tiny muted line is ok):

**Job:** see which vessels are at risk before lunch.

If a decoration does not help that job, delete it.`
          ),
          md(
            "p",
            `HTML under the h1:

\`\`\`html:index.html
      <p class="job">Job: see which vessels are at risk before lunch.</p>
\`\`\`

CSS:

\`\`\`css:styles.css
.job {
  margin: 0.25rem 0 0;
  font-size: 0.8rem;
  color: #666;
}
\`\`\``
          ),
          info(
            "bbs",
            "BBS",
            "Observation logs exist so office can act. Not so the UI looks fancy."
          ),
          tasks("t", "Hands-on", [
            { id: "job", label: "Job sentence is visible on the dashboard" },
            { id: "cut", label: "You deleted one decoration that did not help" },
          ]),
        ],
      },
    ],
  }),
  "moshka-ux-density": lesson({
    id: "moshka-ux-density",
    name: "Enterprise density",
    description: "Smaller padding. More rows. Short labels.",
    sections: [
      {
        id: "do",
        title: "Tighten it",
        blocks: [
          md(
            "m",
            `Try first: cut padding in half. Shorten column names. Show status as a short word, not a paragraph.

No helper essays under titles.

Example tight cells:

\`\`\`css:styles.css
th, td { padding: 0.28rem 0.7rem; font-size: 0.85rem; }
\`\`\``
          ),
          tasks("t", "Hands-on", [
            { id: "pad", label: "Padding is tighter than yesterday" },
            { id: "labels", label: "Labels are 1 or 2 words" },
          ]),
        ],
      },
    ],
  }),
  "moshka-ux-search": lesson({
    id: "moshka-ux-search",
    name: "Search the table",
    description: "Office users filter. A text box that hides rows is enough.",
    sections: [
      {
        id: "do",
        title: "Filter by vessel name",
        blocks: [
          md(
            "m",
            `Try first: add \`<input id="q" placeholder="Filter vessels" />\` above the table. On \`input\`, loop rows and hide the ones that do not match.`
          ),
          md(
            "p",
            `HTML above the table:

\`\`\`html:index.html
    <input id="q" type="search" placeholder="Filter vessels" autocomplete="off" />
\`\`\`

JS in \`app.js\` (keep the row click listener):

\`\`\`js:app.js
const q = document.getElementById("q")
q.addEventListener("input", () => {
  const needle = q.value.trim().toLowerCase()
  document.querySelectorAll("#rows tr").forEach((row) => {
    const name = row.cells[0].textContent.toLowerCase()
    row.hidden = needle ? !name.includes(needle) : false
  })
})
\`\`\`

Type "Red". Only matching vessels stay.`
          ),
          tasks("t", "Hands-on", [
            { id: "filter", label: "Typing hides rows that do not match" },
          ]),
        ],
      },
    ],
  }),
  "moshka-ux-roles": lesson({
    id: "moshka-ux-roles",
    name: "Different people, different screens",
    description: "Crew, office, admin. Fake it with three buttons.",
    sections: [
      {
        id: "do",
        title: "Three hats",
        blocks: [
          md(
            "m",
            `Try first: add three buttons: Crew, Office, Admin.

Crew sees only one vessel row. Office sees the table. Admin shows a fake Users line.

This is BBS in miniature: \`/crew\`, \`/office\`, \`/administration\`.`
          ),
          mermaid(
            "r",
            `flowchart TB
  U[Person] --> C[Crew: my vessel]
  U --> O[Office: all logs]
  U --> A[Admin: users and settings]`,
            "Three hats",
            undefined,
            {
              U: "person",
              C: "crew",
              O: "office",
              A: "admin",
            }
          ),
          md(
            "p",
            `HTML:

\`\`\`html:index.html
    <div id="roles">
      <button type="button" data-role="crew">Crew</button>
      <button type="button" data-role="office">Office</button>
      <button type="button" data-role="admin">Admin</button>
    </div>
    <p id="admin-line" hidden>Users: 12 (fake)</p>
\`\`\`

JS:

\`\`\`js:app.js
const adminLine = document.getElementById("admin-line")
document.getElementById("roles").addEventListener("click", (event) => {
  const btn = event.target.closest("button[data-role]")
  if (!btn) return
  const role = btn.dataset.role
  const rows = [...document.querySelectorAll("#rows tr")]
  rows.forEach((row, i) => {
    row.hidden = role === "crew" ? i !== 0 : false
  })
  adminLine.hidden = role !== "admin"
})
\`\`\``
          ),
          tasks("t", "Hands-on", [
            { id: "btns", label: "Three role buttons change what is on screen" },
          ]),
        ],
      },
    ],
    explains: [
      explain(
        "person",
        "Person",
        "Person",
        `One human. The app asks which hat they wear today.`
      ),
      explain(
        "crew",
        "Crew",
        "Crew",
        `My vessel only. Less chrome. Bigger tap targets. This is \`/crew\` in BBS.`
      ),
      explain(
        "office",
        "Office",
        "Office",
        `The full table. Search. Density. This is \`/office\` in BBS.`
      ),
      explain(
        "admin",
        "Admin",
        "Admin",
        `Users and settings. Fake a Users line today. This is \`/administration\` in BBS.`
      ),
    ],
  }),
  "moshka-ux-drawers": lesson({
    id: "moshka-ux-drawers",
    name: "Drawers not popups",
    description: "Click a row. Details slide from the side. The table stays.",
    sections: [
      {
        id: "do",
        title: "Row opens detail",
        blocks: [
          link("vaul", "https://vaul.emilkowal.ski", "Vaul", "Drawer pattern. Read the idea even if you stay on plain CSS."),
          md(
            "m",
            `Try first: click a vessel row. Show a side panel with name, status, and a fake comment.

On a narrow window, the panel can be full width. BBS uses drawers on phones so thumbs can reach.`
          ),
          md(
            "p",
            `HTML before \`</body>\`:

\`\`\`html:index.html
    <aside id="drawer" hidden>
      <p class="eyebrow">Vessel</p>
      <h2 id="drawer-title">—</h2>
      <p id="drawer-status"></p>
      <button type="button" id="drawer-close">Close</button>
    </aside>
\`\`\`

CSS:

\`\`\`css:styles.css
#drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: min(22rem, 100%);
  height: 100%;
  background: #fff;
  border-left: 1px solid #ccc;
  padding: 1rem;
}
\`\`\`

JS (replace the console.log click):

\`\`\`js:app.js
const drawer = document.getElementById("drawer")
document.getElementById("rows").addEventListener("click", (event) => {
  const row = event.target.closest("tr")
  if (!row) return
  document.getElementById("drawer-title").textContent = row.cells[0].textContent
  document.getElementById("drawer-status").textContent = row.cells[1].textContent
  drawer.hidden = false
})
document.getElementById("drawer-close").addEventListener("click", () => {
  drawer.hidden = true
})
\`\`\``
          ),
          tasks("t", "Hands-on", [
            { id: "drawer", label: "Clicking a row opens details without leaving the page" },
          ]),
        ],
      },
    ],
  }),
  "moshka-ux-empty": lesson({
    id: "moshka-ux-empty",
    name: "Empty states that still work",
    description: "Search with no matches still tells the user what to do.",
    sections: [
      {
        id: "do",
        title: "No rows left",
        blocks: [
          md(
            "m",
            `Try first: type a filter that matches nothing. The table should not go blank with no explanation.

Add a line under the table: \`No vessels match.\` Hide it when there is at least one visible row.`
          ),
          md(
            "p",
            `HTML:

\`\`\`html:index.html
    <p id="empty" hidden>No vessels match this filter.</p>
\`\`\`

At the end of your filter listener:

\`\`\`js:app.js
const visible = [...document.querySelectorAll("#rows tr")].filter((row) => !row.hidden)
document.getElementById("empty").hidden = visible.length > 0
\`\`\``
          ),
          tip("n", "Next", "Next Harbor: same product, App Router, then real databases."),
          tasks("t", "Hands-on", [
            { id: "empty", label: "A no-match filter shows an empty message" },
          ]),
        ],
      },
    ],
  }),
}
