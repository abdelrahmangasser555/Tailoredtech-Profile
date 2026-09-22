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
  concept,
  mermaid,
  teachStep,
  termStep,
  tasks,
  tip,
  VID,
  yt,
  ytWatch,
} from "@/config/moshka-roadmap/helpers"
import type { NoteDocument } from "@/lib/notes-types"

export const moshkaPortNotes: Record<string, NoteDocument> = {
  "moshka-port-learn": lesson({
    id: "moshka-port-learn",
    name: "What you will learn",
    description:
      "A dense operations dashboard. Layout, table markup, Lucide icons, status color, tiny motion.",
    sections: [
      {
        id: "goal",
        title: "Looks like work, not a toy",
        blocks: [
          beforeYouStart(
            "plan",
            "Turn the harbor table into a dense ops-style dashboard with CSS and small JS touches.",
            "A tight header, a full table, icons and status colors that mean something.",
            ["index.html", "styles.css", "app.js"]
          ),
          ...figureN(
            1,
            "port-goal",
            "moshka-port-watch-dense.png",
            "Dense ops board",
            `No hero poster. Header short, table tall. ${figLink(1, "port-goal")} is what office software looks like.`
          ),
          md(
            "g",
            `Port Watch is a fake harbor board: vessels, status, a table.

You already know clicks. Now you learn **layout** and **reuse**.

Libraries you will actually use (from Freesets, not a dump):
- [Lucide](https://lucide.dev) icons
- [AutoAnimate](https://auto-animate.formkit.com) for list motion later
- [Phosphor](https://phosphoricons.com) if Lucide feels thin`
          ),
          mermaid(
            "f",
            `flowchart TB
  L[CSS grid shell] --> T[Table]
  T --> C[Row you copy]
  C --> I[Icons]
  I --> S[Status color]
  S --> M[One motion]`,
            "Order of attack",
            undefined,
            {
              L: "grid-shell",
              T: "table",
              C: "copy-row",
              I: "icons",
              S: "status",
              M: "motion",
            }
          ),
          yt(
            "v",
            VID.tailwind,
            "Tailwind in 100 Seconds (Fireship)",
            "Watch from 0:00 to the end. About 2 minutes. You can stay on plain CSS in this zip."
          ),
          ytWatch(
            "v-long",
            VID.tailwindTraversy,
            "Tailwind crash course (Traversy Media)",
            "0:00",
            "20:00",
            "Utility classes only. Stop at 20:00. Tailwind gets real in Next Harbor."
          ),
          tasks("t", "Start", [{ id: "unzip", label: "Unzip Port Watch and open index.html" }]),
        ],
      },
    ],
    explains: [
      explain(
        "grid-shell",
        "Grid",
        "CSS grid shell",
        `Header, sidebar, main. \`display: grid\`. This is how dense ops pages sit, not a centered card.`
      ),
      explain(
        "table",
        "Table",
        "Table",
        `\`<table>\`, \`<thead>\`, \`<tbody>\`, \`<tr>\`. Vessels are rows. Clients live in tables.`
      ),
      explain(
        "copy-row",
        "Row",
        "Row you copy",
        `Pain on purpose. Duplicate a \`<tr>\`. That pain is why React components exist later.`
      ),
      explain(
        "icons",
        "Icons",
        "Icons",
        `Lucide SVG inline. No rounded neon boxes. Size it. One icon per meaning.`
      ),
      explain(
        "status",
        "Status",
        "Status color",
        `Inbound vs alongside vs departed. Color is a code, not decoration. Keep it readable.`
      ),
      explain(
        "motion",
        "Motion",
        "One motion",
        `One list animation later (AutoAnimate). Not bounce on every button.`
      ),
    ],
  }),
  "moshka-port-unzip": lesson({
    id: "moshka-port-unzip",
    name: "Unzip and open",
    description: "Same zip habit. Open the table in the browser.",
    sections: [
      {
        id: "do",
        title: "Do this now",
        blocks: [
          ill("unzip", "moshka-unzip.png", "Same unzip habit"),
          md(
            "m",
            `Download **Port Watch zip**. Unzip. Open \`index.html\`.

You should see a header and a table of vessels. Click a row. The Console should log the name.`
          ),
          ...termStep(
            1,
            "Unzip in the terminal",
            "Same habit as Cafe and Scoreboard.",
            `cd ~/Desktop
unzip ~/Downloads/port-watch.zip
cd port-watch
ls`
          ),
          tasks("t", "Done when", [
            { id: "see", label: "Table is visible in the browser" },
            { id: "log", label: "Clicking a row logs the vessel name" },
          ]),
        ],
      },
    ],
  }),
  "moshka-port-layout": lesson({
    id: "moshka-port-layout",
    name: "Dense layout",
    description: "Header, table. Everything visible. No giant hero.",
    sections: [
      {
        id: "do",
        title: "Fill the screen with data",
        blocks: [
          beforeYouStart(
            "plan",
            "Tighten the header and table cells so more vessel rows fit on one screen.",
            "Header is a slim bar. Table rows feel like a spreadsheet, not a poster.",
            ["styles.css"]
          ),
          figure("layout", "moshka-port-watch-dense.png", "Short header, big table"),
          concept(
            "dense",
            "Why dense layout?",
            `Office users want **many rows visible** without scrolling.

Big padding and giant titles look like marketing sites. Port Watch should feel like a tool on a desk.`
          ),
          ...teachStep(
            1,
            "Shrink the header",
            `Open \`styles.css\`. Add or update these rules. Refresh after saving.`,
            "css",
            "styles.css",
            `header {
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #ccc;
}
h1 { margin: 0.1rem 0 0; font-size: 1.1rem; }`,
            "1-5",
            `- \`header\` is the top bar with the title.
- Smaller \`padding\` = less wasted vertical space.
- \`h1\` font size \`1.1rem\` keeps the title readable but not loud.
- \`border-bottom\` separates header from the table.`
          ),
          ...teachStep(
            2,
            "Tighter table cells",
            `Append below your header rules. \`th\` is header cells, \`td\` is data cells.`,
            "css",
            "styles.css",
            `header {
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #ccc;
}
h1 { margin: 0.1rem 0 0; font-size: 1.1rem; }
th, td {
  text-align: left;
  padding: 0.35rem 0.85rem;
  border-bottom: 1px solid #ddd;
}`,
            "6-10",
            `- \`text-align: left\` lines labels up like Excel.
- Small \`padding\` on \`th, td\` fits more rows on screen.
- Row borders help the eye scan across columns.`
          ),
          info(
            "bbs",
            "BBS note",
            "Bahri BBS dashboards are data-dense on purpose. Big empty cards look amateur in enterprise."
          ),
          tasks("t", "Hands-on", [
            { id: "header", label: "Header is short, not a poster" },
            { id: "table", label: "You can see at least 6 vessel rows on desktop without scrolling the window" },
          ]),
        ],
      },
    ],
  }),
  "moshka-port-table": lesson({
    id: "moshka-port-table",
    name: "The vessel table",
    description: "thead is labels. tbody is data. One tr is one vessel.",
    sections: [
      {
        id: "do",
        title: "Read the markup",
        blocks: [
          beforeYouStart(
            "plan",
            "Read how a table is built, then add an ETA column on every row.",
            "A new column lines up on header and every vessel row.",
            ["index.html"]
          ),
          ill("cols", "moshka-table-columns.png", "thead vs tbody"),
          concept(
            "table-parts",
            "Table vocabulary",
            `| Tag | Role |
|-----|------|
| \`<table>\` | The whole grid |
| \`<thead>\` | Label row(s) at the top |
| \`<tbody>\` | Data rows |
| \`<tr>\` | One row |
| \`<th>\` | Header cell (column title) |
| \`<td>\` | Data cell |

If you add a \`<th>\` but forget \`<td>\` on one row, every column after it shifts. That is the most common table bug.`
          ),
          ...teachStep(
            1,
            "Minimal table shape",
            `This is the skeleton. Your zip has more columns; the idea is the same.`,
            "html",
            "index.html",
            `<table>
  <thead>
    <tr>
      <th>Vessel</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody id="rows">
    <tr>
      <td>MV Red Sea</td>
      <td>Alongside</td>
    </tr>
  </tbody>
</table>`,
            "1-14",
            `- \`<thead>\` holds column titles (\`Vessel\`, \`Status\`).
- \`<tbody id="rows">\` holds one \`<tr>\` per vessel.
- Each \`<tr>\` must have the **same number** of \`<td>\` cells as there are \`<th>\` headers.`
          ),
          md(
            "m",
            `**Hands-on:** add a column **ETA**. Add one \`<th>ETA</th>\` in the header row. Add one \`<td>\` on **every** vessel row. Refresh and check alignment.`
          ),
          tasks("t", "Hands-on", [
            { id: "col", label: "A new column exists on every row" },
          ]),
        ],
      },
    ],
  }),
  "moshka-port-components": lesson({
    id: "moshka-port-components",
    name: "Repeatable blocks",
    description: "One vessel row. Copy it. Then think: this should become a component later.",
    sections: [
      {
        id: "do",
        title: "Copy, then notice the pain",
        blocks: [
          beforeYouStart(
            "plan",
            "Duplicate one vessel row by hand and change the name.",
            "A second ship appears in the table. You feel why copy-paste hurts.",
            ["index.html"]
          ),
          meme("pain", "moshka-meme-copy-paste.png", "Copy-paste rows"),
          concept(
            "row-copy",
            "Why this hurts",
            `Each \`<tr>\` repeats the same structure. Change the column order once, and you must edit **every** row.

React **components** fix that: write the row once, reuse it with different data. Today you earn the pain so components make sense later.`
          ),
          md(
            "m",
            `**Step 1:** in \`index.html\`, find one vessel \`<tr>\` inside \`<tbody>\`.

**Step 2:** copy the whole \`<tr>...</tr>\` block.

**Step 3:** paste it below the original. Change the vessel name and cells.`
          ),
          ...teachStep(
            1,
            "Example row to copy",
            `Match the number of \`<td>\` cells to your table headers. Adjust text, keep the structure.`,
            "html",
            "index.html",
            `        <tr>
          <td>MV Newbuild</td>
          <td>Inbound</td>
          <td>-</td>
          <td>Watch</td>
        </tr>`,
            "1-6",
            `- One \`<tr>\` = one vessel.
- Each \`<td>\` is one column (name, status, ETA, action, etc.).
- Indentation is for humans; the browser ignores extra spaces.`
          ),
          link(
            "react-folder",
            "/notes/moshka/moshka-roadmap/moshka-p-react-harbor/moshka-react-learn",
            "Open 02b React Harbor",
            "React + Vite + TypeScript lives in its own folder. Do not binge React here. Finish Port Watch, then start React Harbor."
          ),
          info(
            "react-here",
            "React is not here",
            "This lesson is HTML only. Components, props, and useState are in React Harbor with full copy-paste files."
          ),
          tasks("t", "Hands-on", [
            { id: "row", label: "A new vessel row exists with a new name" },
          ]),
        ],
      },
    ],
  }),
  "moshka-port-icons": lesson({
    id: "moshka-port-icons",
    name: "Icons that earn their place",
    description: "Lucide SVGs inline. No rounded neon icon boxes.",
    sections: [
      {
        id: "do",
        title: "Bare icons",
        blocks: [
          link("lucide", "https://lucide.dev", "Lucide icons", "Copy an SVG. Paste it. Size it."),
          md(
            "m",
            `BBS rule you will meet later: do not wrap a decorative icon in a rounded colored box.

Go to lucide.dev, search **ship**, copy the SVG. Paste it next to the title. Set width and height to 16 or 18. Set stroke to currentColor.

Example (paste inside the header, next to the h1):

\`\`\`html:index.html
<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true">
  <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
  <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-8.5-7-8.5 7a11.6 11.6 0 0 0 1.62 6"/>
  <path d="M12 10v4"/>
  <path d="M12 2v3"/>
</svg>
\`\`\`

If the SVG looks wrong, use the one from the Lucide site instead of this sketch. Keep it the text color.`
          ),
          tasks("t", "Hands-on", [
            { id: "icon", label: "One Lucide (or similar) SVG in the header" },
          ]),
        ],
      },
    ],
  }),
  "moshka-port-status": lesson({
    id: "moshka-port-status",
    name: "Status colors that mean something",
    description: "High risk is visible. Low risk is quiet. Color is not decoration.",
    sections: [
      {
        id: "do",
        title: "Class on the cell",
        blocks: [
          md(
            "m",
            `Try first: add \`class="risk high"\` on High cells and a CSS rule that uses a dark red text, not a neon pill.

Office users scan the risk column. If everything is colorful, nothing is.`
          ),
          md(
            "p",
            `CSS to paste at the bottom of \`styles.css\`:

\`\`\`css:styles.css
.risk.high { color: #8b1e1e; font-weight: 600; }
.risk.watch { color: #6b4e16; }
.risk.low { color: #555; }
\`\`\`

HTML example on one cell:

\`\`\`html
<td class="risk high">High</td>
\`\`\`

Do the same for Watch and Low.`
          ),
          tasks("t", "Hands-on", [
            { id: "high", label: "High risk is visually louder than Low" },
          ]),
        ],
      },
    ],
  }),
  "moshka-port-motion": lesson({
    id: "moshka-port-motion",
    name: "Tiny motion",
    description: "One hover or fade. Stop there.",
    sections: [
      {
        id: "do",
        title: "One motion",
        blocks: [
          link(
            "aa",
            "https://auto-animate.formkit.com",
            "AutoAnimate",
            "Optional. CDN script in a static page is enough."
          ),
          md(
            "m",
            `The starter already has \`tbody tr:hover { background: #e8e8e2; }\`. That is enough.

If you want a fade, add:

\`\`\`css:styles.css
tbody tr { transition: background 120ms linear; }
\`\`\`

Do not add particles, glow, or bounce.`
          ),
          tip("n", "Next", "Client Eyes will make this dashboard feel like a paying office."),
          tasks("t", "Hands-on", [
            { id: "fade", label: "Hovering a row has one calm motion" },
            { id: "shot", label: "Screenshot the dense board and send it" },
          ]),
        ],
      },
    ],
  }),
}
