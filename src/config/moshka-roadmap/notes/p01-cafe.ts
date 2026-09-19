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
  mermaid,
  tasks,
  tip,
  VID,
  yt,
  ytWatch,
} from "@/config/moshka-roadmap/helpers"
import type { NoteDocument } from "@/lib/notes-types"

export const moshkaCafeNotes: Record<string, NoteDocument> = {
  "moshka-cafe-learn": lesson({
    id: "moshka-cafe-learn",
    name: "What you will learn",
    description:
      "You will ship a cafe menu page. HTML for structure, CSS for look, JS for clicks.",
    sections: [
      {
        id: "goal",
        title: "The thing you will show",
        blocks: [
          ...figureN(
            1,
            "cafe-goal",
            "moshka-three-files.png",
            "Three files",
            `You will ship HTML, CSS, and JS as separate files. ${figLink(1, "cafe-goal")} is the split you will live in all week.`
          ),
          md(
            "g",
            `By the last lesson you have a page with drinks, a total, and a click that adds a drink. You can also clear the total.

Three files. That is a real product. Small. Yours.

You will not install npm for this project. The browser reads the files directly.`
          ),
          mermaid(
            "flow",
            `flowchart TD
  H[index.html structure] --> C[styles.css look]
  C --> J[app.js clicks]
  J --> B[Open in browser]`,
            "Files you will touch",
            undefined,
            {
              H: "html-file",
              C: "css-file",
              J: "js-file",
              B: "browser-open",
            }
          ),
          link(
            "mdn",
            "https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Your_first_website",
            "MDN: your first website",
            "Official backup if a lesson feels thin. Do the zip first."
          ),
          tasks("t", "Before you unzip", [
            { id: "watch-later", label: "Skim the MDN link. Do not binge." },
            { id: "next", label: "Open Unzip and open" },
          ]),
        ],
      },
    ],
    explains: [
      explain(
        "html-file",
        "HTML",
        "index.html",
        `The bones. Headings, list, buttons. The browser reads this first.

It loads CSS with \`<link rel="stylesheet" href="styles.css" />\` and JS with \`<script src="app.js"></script>\`.`
      ),
      explain(
        "css-file",
        "CSS",
        "styles.css",
        `The paint. Colors, space, fonts. If this file is missing or renamed, the page still works, it just looks broken.`
      ),
      explain(
        "js-file",
        "JS",
        "app.js",
        `The click. It finds buttons, reads \`data-price\`, updates the total. Without it, the page is a poster.`
      ),
      explain(
        "browser-open",
        "Browser",
        "Open in the browser",
        `Double-click \`index.html\` or drag it into Chrome. No \`npm\`. Refresh after every save.`
      ),
    ],
  }),

  "moshka-cafe-unzip": lesson({
    id: "moshka-cafe-unzip",
    name: "Unzip and open",
    description: "Get the files on disk and see the page. No npm. No install.",
    sections: [
      {
        id: "do",
        title: "Download and unzip",
        blocks: [
          ill("unzip", "moshka-unzip.png", "Unzip = three files"),
          md(
            "d",
            `1. Download **Pixel Cafe zip** from the folder page (or the download block on this project).
2. Put it on your Desktop so you can find it.
3. Unzip it. You should get a folder with \`index.html\`, \`styles.css\`, \`app.js\`, and \`README.md\`.

If you like the terminal, run this after the zip is in Downloads:`
          ),
          md(
            "term",
            `Run this in the terminal:

\`\`\`bash
cd ~/Desktop
unzip ~/Downloads/pixel-cafe.zip
cd pixel-cafe
ls
\`\`\`

On Windows PowerShell:

\`\`\`bash
cd $HOME\\Desktop
Expand-Archive $HOME\\Downloads\\pixel-cafe.zip -DestinationPath .\\pixel-cafe
cd pixel-cafe
dir
\`\`\`

You should see \`index.html\`, \`styles.css\`, \`app.js\`.`
          ),
        ],
      },
      {
        id: "open",
        title: "Open the page",
        blocks: [
          md(
            "o",
            `Open \`README.md\` in any editor. Then double-click \`index.html\`, or drag it into Chrome.

You should see a short cafe menu and a total of 0.

You do **not** run \`npm install\` here. There is no \`package.json\`.`
          ),
          tip(
            "editor",
            "Editor",
            "VS Code is fine for this project. Cursor comes later on purpose. Learn the files first."
          ),
          tasks("t", "Done when", [
            { id: "see", label: "You see the cafe page in a browser" },
            { id: "files", label: "You can point at index.html, styles.css, app.js" },
          ]),
        ],
      },
    ],
  }),

  "moshka-cafe-files": lesson({
    id: "moshka-cafe-files",
    name: "What each file is for",
    description: "HTML is the bones. CSS is the paint. JS is the click. They stay in separate files on purpose.",
    sections: [
      {
        id: "map",
        title: "Three jobs",
        blocks: [
          ...figureN(
            1,
            "three-files",
            "moshka-three-files.png",
            "Three files",
            `Each file has one job. HTML lists what exists, CSS paints it, JS reacts to clicks. ${figLink(1, "three-files")} shows the split.`
          ),
          md(
            "m",
            `Open all three files side by side.

**index.html** says what exists: heading, list, buttons.

**styles.css** says how it looks: colors, spacing, fonts.

**app.js** says what happens on a click: add a price, update the total.`
          ),
          md(
            "load",
            `The HTML file loads the other two. These lines must stay in \`index.html\` (paths must match your file names):

\`\`\`html:index.html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Pixel Cafe</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <!-- menu markup lives here -->
    <script src="app.js"></script>
  </body>
</html>
\`\`\`

**What each line does:**
- \`<link rel="stylesheet" href="styles.css" />\` asks the browser to download paint rules.
- \`<script src="app.js"></script>\` runs your click logic after the HTML exists.
- The script at the **bottom** of \`<body>\` is on purpose: buttons exist before JS runs.`
          ),
          ...figureN(
            2,
            "page-loads",
            "moshka-page-loads.png",
            "How the page loads",
            `The browser reads \`index.html\` first, then downloads CSS and JS in order. If a path is wrong, one layer goes missing. ${figLink(2, "page-loads")} is the load order.`
          ),
          tasks("t", "Hands-on", [
            { id: "break", label: "Rename styles.css, refresh, see it break, rename it back" },
            { id: "script", label: "You found the script tag that loads app.js" },
          ]),
        ],
      },
    ],
    explains: [
      explain(
        "html-file",
        "HTML",
        "index.html",
        `Lists the heading, drinks, and buttons. It also points at the CSS and JS files. If those names are wrong, paint or clicks vanish.`
      ),
      explain(
        "css-file",
        "CSS",
        "styles.css",
        `Only look. Rename this file without changing the \`href\` and the page goes ugly. That is a useful bug.`
      ),
      explain(
        "js-file",
        "JS",
        "app.js",
        `Loaded at the bottom of the HTML. If the script tag is missing, Add does nothing.`
      ),
      explain(
        "browser-open",
        "Chrome",
        "Chrome",
        `Refresh after every save. If you still see the old page, you are looking at a different file on disk.`
      ),
    ],
  }),

  "moshka-cafe-html": lesson({
    id: "moshka-cafe-html",
    name: "HTML bones",
    description: "Tags are boxes. Change the menu items. Watch the page change.",
    sections: [
      {
        id: "watch",
        title: "Short, then long",
        blocks: [
          yt(
            "v",
            VID.html,
            "HTML in 100 Seconds (Fireship)",
            "Watch from 0:00 to the end. About 2:33. Whole short video."
          ),
          ytWatch(
            "v-long",
            VID.htmlBro,
            "HTML full course (Bro Code)",
            "0:00",
            "12:41",
            "Intro, tags, and links. Stop when he starts lists. You will use lists in Harbor."
          ),
        ],
      },
      {
        id: "try",
        title: "Try first",
        blocks: [
          ill("bones", "moshka-html-bones.png", "HTML = boxes"),
          md(
            "m",
            `Open \`index.html\`. Find a drink name. Change **Espresso** to something you drink. Save. Refresh the browser.

Then add a third \`<li>\` with a name, a price, and an Add button.

Do that before you paste anything. If the new row has no button, the JS will ignore it. Look at how the first two rows are written.`
          ),
        ],
      },
      {
        id: "paste",
        title: "If you get stuck, paste this",
        blocks: [
          md(
            "p",
            `Replace the whole \`<ul id="menu">...</ul>\` block in \`index.html\` with this. Keep the rest of the file.

\`\`\`html:index.html
      <ul id="menu">
        <li>
          <span>Espresso</span>
          <span>18</span>
          <button type="button" data-price="18">Add</button>
        </li>
        <li>
          <span>Qahwa</span>
          <span>12</span>
          <button type="button" data-price="12">Add</button>
        </li>
        <li>
          <span>Mint tea</span>
          <span>10</span>
          <button type="button" data-price="10">Add</button>
        </li>
      </ul>
\`\`\`

HTML does not style. It only says what exists: heading, list, button.`
          ),
          tasks("t", "Hands-on", [
            { id: "rename", label: "Rename one drink in index.html" },
            { id: "add", label: "A third drink shows in the browser" },
          ]),
        ],
      },
    ],
  }),

  "moshka-cafe-html-ids": lesson({
    id: "moshka-cafe-html-ids",
    name: "ids, buttons, data attributes",
    description: "JS finds things by id. Prices live on the button so HTML can describe data.",
    sections: [
      {
        id: "why",
        title: "Why the button has data-price",
        blocks: [
          yt(
            "v",
            VID.html,
            "HTML in 100 Seconds (Fireship)",
            "Watch from 0:00 to the end if you skipped it. About 2:33."
          ),
          ytWatch(
            "v-long",
            VID.htmlBro,
            "HTML full course (Bro Code)",
            "45:59",
            "51:06",
            "Buttons only. Stop after buttons. Skip the rest of the hour for now."
          ),
          md(
            "m",
            `Look at this button:

\`\`\`html
<button type="button" data-price="18">Add</button>
\`\`\`

\`type="button"\` stops the browser from treating it like a form submit.

\`data-price="18"\` is a custom attribute. JavaScript reads it as \`btn.dataset.price\`.

The total lives in:

\`\`\`html
<strong id="total">0</strong>
\`\`\`

\`id="total"\` must be unique. JS uses \`document.getElementById("total")\`. If you change the id and forget JS, the total never updates.`
          ),
        ],
      },
      {
        id: "try",
        title: "Try first",
        blocks: [
          md(
            "t",
            `Change one price in two places: the visible number **and** \`data-price\`. Refresh. Add that drink. The total should match the new price.

If you only change the visible span, the button still adds 18. That is the lesson: the click reads \`data-price\`, not the text.`
          ),
          tasks("t", "Hands-on", [
            { id: "both", label: "You changed a price in the span and on data-price" },
            { id: "id", label: "You can point at id=total in the HTML" },
          ]),
        ],
      },
    ],
  }),

  "moshka-cafe-css": lesson({
    id: "moshka-cafe-css",
    name: "Make it look like a cafe",
    description: "CSS paints the boxes. Sharp corners. No purple glow.",
    sections: [
      {
        id: "watch",
        title: "Paint the boxes",
        blocks: [
          ill("paint", "moshka-css-paint.png", "CSS paints HTML"),
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
            "0:00",
            "18:00",
            "Selectors, colors, and fonts. Stop before the long layout section."
          ),
          md(
            "m",
            `Open \`styles.css\`. Try first: change the body background, then the title size.

TailoredTech pages are sharp (radius 0). Keep corners square. Black, cream, maybe a warm brown. Not lime on white.`
          ),
          info(
            "brand",
            "Taste",
            "A cafe can be warm. Save the loud accent color for dark screens later."
          ),
        ],
      },
      {
        id: "paste",
        title: "A full stylesheet you can paste",
        blocks: [
          md(
            "p",
            `If your file is a mess, replace all of \`styles.css\` with this. Then change one color yourself so it is not a blind paste.

\`\`\`css:styles.css
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: ui-sans-serif, system-ui, sans-serif;
  background: #f4f1ea;
  color: #0a0a0a;
}
header, main { max-width: 28rem; margin: 0 auto; padding: 1.5rem; }
.eyebrow {
  font-family: ui-monospace, monospace;
  font-size: 0.7rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #666;
}
h1 { margin: 0.3rem 0 0; font-size: 2rem; }
ul { list-style: none; padding: 0; }
li {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px dashed #ccc;
}
button {
  border: 1px solid #0a0a0a;
  background: #0a0a0a;
  color: #fff;
  padding: 0.35rem 0.7rem;
  cursor: pointer;
}
.total { font-size: 1.25rem; }
\`\`\``
          ),
          tasks("t", "Hands-on", [
            { id: "color", label: "Change one color in styles.css" },
            { id: "space", label: "Change padding on the menu list" },
          ]),
        ],
      },
    ],
  }),

  "moshka-cafe-css-hover": lesson({
    id: "moshka-cafe-css-hover",
    name: "Hover and the box model",
    description: "Padding is inside. Margin is outside. Hover tells the user the button is alive.",
    sections: [
      {
        id: "box",
        title: "Box model in one minute",
        blocks: [
          md(
            "m",
            `Every box has content, padding, border, then margin.

\`box-sizing: border-box\` (already in the starter) means padding counts inside the width. That is what you want almost always.

Try first: add this at the bottom of \`styles.css\`. If you already have a \`button:hover\` rule, skip to the task.

\`\`\`css:styles.css
button:hover {
  background: #333;
}
button:active {
  background: #000;
}
li:hover {
  background: #efeae0;
}
\`\`\`

Refresh. Hover a row. Hover a button. That is enough motion for this page.`
          ),
          tasks("t", "Hands-on", [
            { id: "hover", label: "Buttons change color on hover" },
            { id: "box", label: "You can say padding vs margin out loud" },
          ]),
        ],
      },
    ],
  }),

  "moshka-cafe-js": lesson({
    id: "moshka-cafe-js",
    name: "Clicks and totals",
    description: "JavaScript listens. A click adds a drink to a total.",
    sections: [
      {
        id: "watch",
        title: "Make a click do work",
        blocks: [
          ill("click", "moshka-js-click.png", "Click updates total"),
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
            "0:00",
            "25:00",
            "Variables and functions. Stop at 25:00. DOM and events come in Harbor and Score."
          ),
        ],
      },
      {
        id: "try",
        title: "Try first",
        blocks: [
          md(
            "m",
            `Open \`app.js\`. Read it once without changing it.

Then in Chrome: right click the page → Inspect → Console. Type:

\`\`\`js
document.getElementById("total")
\`\`\`

You should see the strong tag. If you see \`null\`, the id in HTML does not match.

Try: add \`console.log("clicked", btn.dataset.price)\` inside the click listener. Click a drink. The console should print the price.`
          ),
        ],
      },
      {
        id: "paste",
        title: "Working app.js",
        blocks: [
          md(
            "p",
            `If clicks do nothing, replace all of \`app.js\` with this.

\`\`\`js:app.js
let total = 0
const label = document.getElementById("total")

document.querySelectorAll("button[data-price]").forEach((btn) => {
  btn.addEventListener("click", () => {
    total += Number(btn.dataset.price)
    label.textContent = String(total)
  })
})
\`\`\`

What this does:

1. \`total\` lives in memory. Refresh sets it back to 0. That is normal for now.
2. \`querySelectorAll("button[data-price]")\` finds every Add button.
3. \`Number(...)\` turns \`"18"\` into \`18\`. Without it, you get \`"018"\` string concat.

Open the page. Add espresso. Total should become 18. Add qahwa. Total 30.`
          ),
          tasks("t", "Hands-on", [
            { id: "click", label: "Clicking a drink changes the total on the page" },
            { id: "two", label: "Two different drinks add two different prices" },
          ]),
        ],
      },
    ],
  }),

  "moshka-cafe-js-clear": lesson({
    id: "moshka-cafe-js-clear",
    name: "Clear the total",
    description: "A second button sets total back to 0. Same file, new listener.",
    sections: [
      {
        id: "try",
        title: "Try first",
        blocks: [
          md(
            "m",
            `Add a Clear button in \`index.html\` under the total, **without** \`data-price\`. Give it \`id="clear"\`.

Then in \`app.js\`, listen to that button and set \`total = 0\` and update the label.

Try that yourself. If you put \`data-price\` on Clear, it will add a drink instead.`
          ),
        ],
      },
      {
        id: "paste",
        title: "HTML plus JS",
        blocks: [
          md(
            "p",
            `In \`index.html\`, right after the total paragraph, add:

\`\`\`html:index.html
      <p class="total">Total: <strong id="total">0</strong></p>
      <button type="button" id="clear">Clear</button>
\`\`\`

Then append this at the bottom of \`app.js\` (keep the add-to-total code above it):

\`\`\`js:app.js
document.getElementById("clear").addEventListener("click", () => {
  total = 0
  label.textContent = "0"
})
\`\`\`

Add two drinks. Click Clear. Total is 0.`
          ),
          tasks("t", "Hands-on", [
            { id: "clear", label: "Clear sets the total back to 0" },
          ]),
        ],
      },
    ],
  }),

  "moshka-cafe-ship": lesson({
    id: "moshka-cafe-ship",
    name: "Show someone",
    description: "If nobody sees it, it is homework. Send a screenshot.",
    sections: [
      {
        id: "show",
        title: "Ship the tiny thing",
        blocks: [
          md(
            "m",
            `Open the page. Add two drinks. Screenshot the total.

Send it to Abdelrahman. That is the finish line for this project.

Optional: zip your folder (not node_modules, you have none) and keep it.`
          ),
          md(
            "term",
            `Run this in the terminal if you want a backup zip:

\`\`\`bash
cd ~/Desktop
zip -r pixel-cafe-done.zip pixel-cafe
\`\`\``
          ),
          tip(
            "next",
            "Next",
            "Skip the other 01 flavors unless you want extra reps. Go to Port Watch when this feels easy."
          ),
          tasks("t", "Done when", [
            { id: "shot", label: "Screenshot sent" },
            { id: "mark", label: "Mark this lesson done" },
          ]),
        ],
      },
    ],
  }),
}
