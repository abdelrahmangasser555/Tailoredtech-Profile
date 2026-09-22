import {
  beforeYouStart,
  concept,
  explain,
  figLink,
  figureN,
  info,
  lesson,
  link,
  md,
  mermaid,
  playground,
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

export const moshkaJsNotes: Record<string, NoteDocument> = {
  "moshka-js-learn": lesson({
    id: "moshka-js-learn",
    name: "What this folder is",
    description:
      "JavaScript as a language. Not a cafe zip. Browser vs Node, then functions, loops, map, classes.",
    sections: [
      {
        id: "goal",
        title: "A notes list, not a project",
        blocks: [
          beforeYouStart(
            "plan",
            "Read these lessons in order. Type small files in a folder called js-lab. Run some in the browser Console, some with Node.",
            "You can say what a runtime is, run node hello.js, and write a function, a loop, and a map.",
            ["~/Desktop/js-lab/"]
          ),
          md(
            "g",
            `Pixel Cafe showed JS **inside a page**. This folder is the language itself.

Projects later assume you know:

- variables and functions
- if and loops
- arrays, \`.map\`, objects
- how Node is not the same as Chrome

Do this after one first-build (Cafe, Harbor, or Score). Do it **before** React Harbor if \`.map\` still feels like magic.

This folder is notes only. No zip. Projects stay about the page you are building.`
          ),
          mermaid(
            "flow",
            `flowchart LR
  L[Language] --> R[Runtime]
  R --> B[Browser]
  R --> N[Node]
  L --> F[Functions]
  L --> A[Arrays map]
  L --> C[Classes]`,
            "The map",
            "Same JS text. Two places it can run."
          ),
          tasks("t", "Start", [
            { id: "folder", label: "Create ~/Desktop/js-lab on disk" },
            { id: "next", label: "Open What JavaScript is" },
          ]),
          link(
            "cafe",
            "/notes/moshka/moshka-roadmap/moshka-p01-pixel-cafe/moshka-cafe-js",
            "Back to cafe clicks",
            "If you have not wired Pixel Cafe yet, do that first. This folder is the language, not the page."
          ),
          link(
            "wds",
            "https://www.youtube.com/@WebDevSimplified",
            "Web Dev Simplified (YouTube)",
            "Kyle Cook. Best long clips for DOM, events, arrays, promises, React hooks, and Playwright in this roadmap."
          ),
          ...watchPair(
            {
              blockId: "v-road",
              url: VID.js,
              title: "JavaScript in 100 Seconds (Fireship)",
            },
            {
              blockId: "v-road-wds",
              url: VID.jsRoadmapWds,
              title: "How to learn JavaScript (Web Dev Simplified)",
              from: "0:00",
              to: "8:00",
              why: "What order to learn topics in. Stop after the variables and types section.",
            }
          ),
        ],
      },
    ],
  }),

  "moshka-js-what": lesson({
    id: "moshka-js-what",
    name: "What JavaScript is",
    description: "A language that tells a computer what to do, line by line.",
    sections: [
      {
        id: "idea",
        title: "The idea",
        blocks: [
          ...watchPair(
            {
              blockId: "v",
              url: VID.js,
              title: "JavaScript in 100 Seconds (Fireship)",
            },
            {
              blockId: "v-wds",
              url: VID.jsRoadmapWds,
              title: "How to learn JavaScript (Web Dev Simplified)",
              from: "0:00",
              to: "5:00",
              why: "Why JS exists on the web. Stop when he opens the code editor.",
            }
          ),
          md(
            "m",
            `**HTML** is boxes on the page. **CSS** is how they look. **JavaScript** is the instructions: add a number, hide a row, save a note.

A **program** is a list of those instructions. The computer does them in order, unless you tell it to skip or repeat.

Example in plain words:

1. Remember the total as 0.
2. When Add is clicked, add 18 to the total.
3. Show the new total on the page.

That is the cafe. Same language works in a terminal with Node, with no page at all.`
          ),
          info(
            "not-java",
            "Not Java",
            "JavaScript is not Java. Different language. The names are an old accident."
          ),
          tasks("t", "Check", [
            { id: "say", label: "You can say HTML vs CSS vs JS in one sentence each" },
          ]),
        ],
      },
    ],
  }),

  "moshka-js-runtime": lesson({
    id: "moshka-js-runtime",
    name: "What a runtime is",
    description: "JS is text. A runtime is the program that reads that text and runs it.",
    sections: [
      {
        id: "idea",
        title: "Language vs engine",
        blocks: [
          ...figureN(
            1,
            "runtime",
            "moshka-js-runtime.png",
            "One language, two runtimes",
            `JavaScript is the language. Chrome and Node are two machines that can run it. ${figLink(1, "runtime")} is that split.`
          ),
          md(
            "m",
            `A **runtime** (also called an engine plus extra tools) is what actually **runs** your file.

| Word | Meaning |
|------|---------|
| Language | The rules and words (\`let\`, \`function\`, \`if\`) |
| Runtime | The program that executes those rules |
| Browser runtime | Chrome (V8 engine) plus the page, \`document\`, clicks |
| Node runtime | Node.js (also V8) plus files, terminal, no page |

Same sentence \`console.log("hi")\` works in **both**.

\`document.getElementById("total")\` works **only in the browser**. There is no HTML document in Node.

\`fs.readFile\` (read a file from disk) works **only in Node**. The browser is not allowed to open random files on your computer.

People also say **running time**. Two meanings:

1. **Runtime** (this lesson): the program that runs your JS (Chrome or Node).
2. **How long it takes**: a slow loop vs a fast one. Not the topic here.

When a note says runtime, it means meaning 1.`
          ),
          mermaid(
            "cmp",
            `flowchart TB
  JS[Your .js file]
  JS --> CH[Chrome runtime]
  JS --> ND[Node runtime]
  CH --> DOM[page, buttons, localStorage]
  ND --> DISK[files, npm, servers]`,
            "Where code can go",
            "Same .js file. Two machines. Different extra tools.",
            {
              JS: "v8",
              CH: "v8",
              ND: "v8",
            }
          ),
          ...watchPair(
            {
              blockId: "v-rt",
              url: VID.js,
              title: "JavaScript in 100 Seconds (Fireship)",
              caption: "Quick reminder of what JS does. Watch from 0:00 to the end.",
            },
            {
              blockId: "v-rt-wds",
              url: VID.jsRoadmapWds,
              title: "How to learn JavaScript (Web Dev Simplified)",
              from: "5:00",
              to: "9:00",
              why: "Browser vs editor. Same language, different places it runs.",
            }
          ),
          tasks("t", "Check", [
            { id: "say", label: "You can say: JS is the language, Node and Chrome are runtimes" },
          ]),
        ],
      },
    ],
    explains: [
      explain(
        "v8",
        "V8",
        "V8",
        `The engine inside Chrome and Node that compiles JS to machine code. You do not install V8 yourself. You install Chrome or Node.`
      ),
    ],
  }),

  "moshka-js-browser": lesson({
    id: "moshka-js-browser",
    name: "JS in the browser",
    description: "The Console is a tiny Node-like box inside Chrome. The page is extra.",
    sections: [
      {
        id: "do",
        title: "Use the Console",
        blocks: [
          beforeYouStart(
            "plan",
            "Open Chrome DevTools Console and run one line of JS with no files.",
            "You see hi printed. You know F12 / right click Inspect.",
            []
          ),
          ...watchPair(
            {
              blockId: "v-dom",
              url: VID.jsDomWds,
              title: "Learn DOM manipulation (Web Dev Simplified)",
              caption: "About 18 minutes. Watch from 0:00 to the end if you have time.",
            },
            {
              blockId: "v-dom-long",
              url: VID.jsDomTraverseWds,
              title: "Learn DOM traversal (Web Dev Simplified)",
              from: "0:00",
              to: "10:00",
              why: "getElementById and moving in the tree. Pairs with cafe and scoreboard.",
            }
          ),
          ...figureN(
            1,
            "page",
            "moshka-page-loads.png",
            "The page loads JS",
            `Cafe loads \`app.js\` from HTML. Console is the same language without a file. ${figLink(1, "page")} is the file path.`
          ),
          md(
            "m",
            `**Step 1.** Open Chrome. Right click the page, **Inspect**, click **Console**.

**Step 2.** Type this and press Enter:

\`\`\`js
console.log("hi")
\`\`\`

You should see \`hi\`. That is JS running **inside the browser runtime**.

**Step 3.** Try:

\`\`\`js
document.body.style.background = "black"
\`\`\`

The page changes. Node cannot do this. There is no \`document\` in Node.`
          ),
          tip(
            "cafe",
            "Cafe link",
            "Pixel Cafe app.js is this same Console language, saved in a file and loaded by a script tag."
          ),
          tasks("t", "Hands-on", [
            { id: "hi", label: "console.log printed hi in Chrome" },
            { id: "bg", label: "You changed the page background from the Console" },
          ]),
        ],
      },
    ],
  }),

  "moshka-js-node": lesson({
    id: "moshka-js-node",
    name: "Install Node and run a file",
    description: "node is a command. It reads a .js file and runs it in the terminal.",
    sections: [
      {
        id: "install",
        title: "Is Node already there?",
        blocks: [
          beforeYouStart(
            "plan",
            "Check node --version. If missing, install Node LTS. Then run a hello.js file from the terminal.",
            "The terminal prints Hello from Node.",
            ["~/Desktop/js-lab/hello.js"]
          ),
          ytWatch(
            "v-node",
            VID.jsTraversy,
            "JavaScript crash course (Traversy Media)",
            "0:00",
            "8:00",
            "What Node is and running a file. Stop when he leaves setup."
          ),
          link(
            "node",
            "https://nodejs.org/en/learn/getting-started/introduction-to-nodejs",
            "Node.js: introduction",
            "Official short read if video feels fast."
          ),
          ...figureN(
            1,
            "run",
            "moshka-js-node-run.png",
            "node hello.js",
            `You type a command. Node reads the file. Output is text, not a website. ${figLink(1, "run")} is the loop.`
          ),
          ...termStep(
            1,
            "Check the version",
            "Run this in your terminal (not in Chrome, not in chat).",
            `node --version`
          ),
          md(
            "if-missing",
            `If you see **command not found**:

1. Go to https://nodejs.org
2. Download **LTS** (the recommended one)
3. Install. Close the terminal. Open a **new** terminal.
4. Run \`node --version\` again. You want something like \`v22.x.x\`.

npm comes with Node. You will use npm in Vite and Next later.`
          ),
        ],
      },
      {
        id: "file",
        title: "First Node file",
        blocks: [
          ...teachStep(
            2,
            "Create hello.js",
            `Make the folder, then this file. \`console.log\` prints a line in the terminal.`,
            "js",
            "hello.js",
            `console.log("Hello from Node")
`,
            "1"
          ),
          ...termStep(
            3,
            "Run it",
            "cd into the folder. node plus the file name. You should see Hello from Node.",
            `mkdir -p ~/Desktop/js-lab
cd ~/Desktop/js-lab
# after you saved hello.js:
node hello.js`
          ),
          md(
            "fail",
            `**If it fails:** you are in the wrong folder, or the file name is \`Hello.js\` with a capital H. \`ls\` should show \`hello.js\`.`
          ),
          info(
            "no-html",
            "No browser",
            "Do not open hello.js by double-clicking. That is not how Node works. Always: terminal, then node filename.js."
          ),
          tasks("t", "Done when", [
            { id: "ver", label: "node --version prints a version" },
            { id: "run", label: "node hello.js prints Hello from Node" },
          ]),
        ],
      },
    ],
  }),

  "moshka-js-values": lesson({
    id: "moshka-js-values",
    name: "Values, let, and const",
    description: "A value is a piece of data. let can change. const cannot be reassigned.",
    sections: [
      {
        id: "do",
        title: "Names for data",
        blocks: [
          beforeYouStart(
            "plan",
            "Write a tiny file that stores a number and a string, then print them.",
            "You know let vs const, and string vs number.",
            ["~/Desktop/js-lab/values.js"]
          ),
          ...watchPair(
            {
              blockId: "v-val",
              url: VID.js,
              title: "JavaScript in 100 Seconds (Fireship)",
            },
            {
              blockId: "v-val-wds",
              url: VID.jsRoadmapWds,
              title: "How to learn JavaScript (Web Dev Simplified)",
              from: "6:00",
              to: "11:00",
              why: "Variables, let, const, and types. Stop after the types overview.",
            }
          ),
          md(
            "m",
            `**Types you will use all week:**

| Type | Example | Use |
|------|---------|-----|
| string | \`"MV Red Sea"\` | Names, text |
| number | \`18\` | Prices, counts |
| boolean | \`true\` / \`false\` | Yes or no |
| undefined | (empty) | Forgot to set |
| null | \`null\` | Empty on purpose |`
          ),
          concept(
            "let-const",
            "let vs const",
            `**const** = the name will always point at the same value (for strings and numbers you do not reassign).

**let** = the value inside the name may change (cafe total going up).

Use \`const\` unless you need to reassign. Never use \`var\` in new code.`
          ),
          ...teachStep(
            1,
            "const for things that stay",
            `\`const\` means: this name will not get a new value. Use it by default.`,
            "js",
            "values.js",
            `const drink = "Espresso"
const price = 18
console.log(drink, price)
`,
            "1-3",
            `- \`"Espresso"\` is a **string** (text in quotes).
- \`18\` is a **number** (no quotes).
- \`console.log(drink, price)\` prints both, separated by a space in the terminal.`
          ),
          ...teachStep(
            2,
            "let when the number will change",
            `Cafe total changes. That is \`let\`. The line \`total = total + price\` **reassigns** the variable.`,
            "js",
            "values.js",
            `const drink = "Espresso"
const price = 18
let total = 0
total = total + price
console.log(drink, total)
`,
            "3-5",
            `- \`let total = 0\` starts the bill at zero.
- \`total = total + price\` means: read old total, add price, store back in \`total\`.
- Final \`console.log\` should show Espresso and 18.`
          ),
          md(
            "run",
            `Run: \`node values.js\`

**Quotes:** \`"18"\` is text. \`18\` is a number. Cafe used \`Number(...)\` to turn the HTML string into math.

**Template strings** use backticks. \`\${drink} costs \${price}\` inserts values. You will see this in React labels.`
          ),
          playground(
            "play",
            `let total = 0
total = total + 18
total = total + 12
console.log(total)`,
            {
              language: "js",
              title: "Try here",
              caption: "Should print 30. Then run the same idea in values.js with Node.",
              expectIncludes: "30",
              hint: "Add 18 then 12, then log total.",
            }
          ),
          tasks("t", "Hands-on", [
            { id: "file", label: "node values.js prints a drink and a total" },
          ]),
        ],
      },
    ],
  }),

  "moshka-js-functions": lesson({
    id: "moshka-js-functions",
    name: "Functions",
    description: "A named recipe. You call it. It can take inputs and return a result.",
    sections: [
      {
        id: "do",
        title: "Write, call, return",
        blocks: [
          beforeYouStart(
            "plan",
            "Write addPrice that takes a number and returns the new total. Call it twice.",
            "You can explain parameter vs argument, and return vs console.log.",
            ["~/Desktop/js-lab/fn.js"]
          ),
          md(
            "why",
            `Without functions you copy the same lines. With functions you name the idea once.

**Parameter** = the name inside the recipe (\`price\`).
**Argument** = the real value you pass (\`18\`).`
          ),
          concept(
            "fn-idea",
            "What is a function?",
            `A **function** is a small named machine. You give it inputs. It can give you an output back.

You **call** it by writing its name with parentheses: \`addPrice(total, 18)\`.

Without functions you would copy the same math everywhere. One typo breaks everything.`
          ),
          ...teachStep(
            1,
            "Write the recipe (function declaration)",
            `Start with only the function. Do not run anything yet. Read the names inside the parentheses.`,
            "js",
            "fn.js",
            `function addPrice(total, price) {
  return total + price
}
`,
            "1-3",
            `- \`function addPrice\` creates a machine named **addPrice**.
- \`(total, price)\` are **parameters**: placeholder names for numbers you will pass later.
- \`return total + price\` means: add them, then **send that number back** to whoever called the function.
- \`return\` stops the function right there. Lines after \`return\` in the same block do not run.`
          ),
          ...teachStep(
            2,
            "Call it twice",
            `Now use the function. \`total\` is a **variable** that holds the running sum, like the cafe total.`,
            "js",
            "fn.js",
            `function addPrice(total, price) {
  return total + price
}

let total = 0
total = addPrice(total, 18)
total = addPrice(total, 12)
console.log(total)
`,
            "5-8",
            `- \`let total = 0\` starts the cafe bill at zero.
- \`addPrice(total, 18)\` passes **arguments** \`0\` and \`18\`. The function returns \`18\`. You store that in \`total\`.
- Second call: \`addPrice(18, 12)\` returns \`30\`.
- \`console.log(total)\` prints \`30\` in the terminal. It does **not** change \`total\`; it only shows it.`
          ),
          ...teachStep(
            3,
            "Arrow function (same idea, shorter spelling)",
            `React code uses this shape a lot. It is still a function. The name is \`addPriceArrow\`.`,
            "js",
            "fn.js",
            `function addPrice(total, price) {
  return total + price
}

const addPriceArrow = (total, price) => total + price

let total = 0
total = addPrice(total, 18)
total = addPriceArrow(total, 12)
console.log(total)
`,
            "5",
            `- \`const addPriceArrow = ...\` stores the function in a name (like a variable, but the value is a function).
- \`(total, price) => total + price\` is shorthand: when the body is one expression, JS returns it automatically.
- Line 9 calls the arrow the same way you called \`addPrice\`.`
          ),
          ...teachStep(
            4,
            "Pass a function into another function (callback)",
            `This feels weird at first. You are not calling \`shout\` yourself inside \`twice\`. You hand \`shout\` to \`twice\`, and \`twice\` calls it.`,
            "js",
            "fn.js",
            `function addPrice(total, price) {
  return total + price
}

const addPriceArrow = (total, price) => total + price

let total = 0
total = addPrice(total, 18)
total = addPriceArrow(total, 12)
console.log(total)

function shout(name) {
  return name.toUpperCase()
}

function twice(fn, value) {
  return fn(fn(value))
}

console.log(twice(shout, "ok"))
`,
            "12-21",
            `- \`shout\` turns text into UPPERCASE.
- \`twice(fn, value)\`: \`fn\` is a **parameter that holds a function** (not a number).
- Inside \`twice\`, \`fn(value)\` runs \`shout("ok")\` → \`"OK"\`.
- Then \`fn(...)\` runs again on \`"OK"\` → still \`"OK"\`.
- \`twice(shout, "ok")\` passes the function **without** \`()\` after \`shout\`. You pass the recipe, not the result.
- Button \`addEventListener\` and \`.map()\` use this same idea: you pass a function, something else calls it later. That passed function is called a **callback**.`
          ),
          md(
            "cb",
            `\`twice(shout, "ok")\` means: run \`shout\` on \`"ok"\`, then run \`shout\` on that result. Output: \`OK\`.

When you write \`prices.map((price) => price * 2)\`, the arrow is the callback. \`map\` calls it for each item.`
          ),
          ytWatch(
            "v-long",
            VID.jsTraversy,
            "JavaScript crash course (Traversy Media)",
            "0:00",
            "25:00",
            "Variables and functions. Stop at 25:00."
          ),
          ytWatch(
            "v-cb",
            VID.jsEventsWds,
            "Learn JavaScript event listeners (Web Dev Simplified)",
            "0:00",
            "12:00",
            "Callbacks and functions passed around. Same idea as button listeners in Cafe."
          ),
          tasks("t", "Hands-on", [
            { id: "run", label: "node fn.js prints 30 then OK" },
            { id: "say", label: "You can say what return does, and what a callback is" },
          ]),
        ],
      },
    ],
  }),

  "moshka-js-if": lesson({
    id: "moshka-js-if",
    name: "if and else",
    description: "Skip or take a branch. Comparisons are === not =.",
    sections: [
      {
        id: "do",
        title: "Decisions",
        blocks: [
          beforeYouStart(
            "plan",
            "Write a status check: if Alongside print one thing, else print another.",
            "You used === and you know = assigns, === compares.",
            ["~/Desktop/js-lab/if.js"]
          ),
          ytWatch(
            "v-if",
            VID.jsTraversy,
            "JavaScript crash course (Traversy Media)",
            "40:00",
            "48:00",
            "if, else, and comparisons. Stop after the if/else examples."
          ),
          ...teachStep(
            1,
            "Compare with ===",
            `\`=\` puts a value in a name. \`===\` asks: are these the same? Always use \`===\` in this course, not \`==\`.`,
            "js",
            "if.js",
            `const status = "Alongside"

if (status === "Alongside") {
  console.log("Ship is at berth")
} else {
  console.log("Ship is not at berth")
}
`,
            "1-7"
          ),
          md(
            "more",
            `**else if** chains more tests:

\`\`\`js:if.js
if (status === "Alongside") {
  console.log("berth")
} else if (status === "Inbound") {
  console.log("coming in")
} else {
  console.log("other")
}
\`\`\`

Empty string \`""\`, \`0\`, \`null\`, \`undefined\` are **falsy**. An if on them skips the block. That is why cafe checks \`if (!text) return\`.`
          ),
          tasks("t", "Hands-on", [
            { id: "run", label: "Change status and run node if.js twice" },
          ]),
        ],
      },
    ],
  }),

  "moshka-js-loops": lesson({
    id: "moshka-js-loops",
    name: "Loops",
    description: "Repeat work. for, for...of, and while.",
    sections: [
      {
        id: "do",
        title: "Repeat without copy-paste",
        blocks: [
          beforeYouStart(
            "plan",
            "Print each vessel name with a for...of loop. Then see a classic for with an index.",
            "You can write for...of from memory.",
            ["~/Desktop/js-lab/loops.js"]
          ),
          ...teachStep(
            1,
            "for...of (use this first)",
            `Each round, \`name\` is the next string. This is the loop you want for lists.`,
            "js",
            "loops.js",
            `const names = ["MV Red Sea", "MV Newbuild", "MV Harbor"]

for (const name of names) {
  console.log(name)
}
`,
            "1-5"
          ),
          ...teachStep(
            2,
            "Classic for (when you need the index)",
            `\`i\` is 0, then 1, then 2. \`names.length\` is how many items. React keys sometimes need an id, not the index, but you should still read this loop.`,
            "js",
            "loops.js",
            `const names = ["MV Red Sea", "MV Newbuild", "MV Harbor"]

for (const name of names) {
  console.log(name)
}

for (let i = 0; i < names.length; i = i + 1) {
  console.log(i, names[i])
}
`,
            "7-9"
          ),
          md(
            "while",
            `**while** repeats until a condition is false. Easy to loop forever. Prefer \`for...of\` unless you have a reason.

\`\`\`js
let n = 3
while (n > 0) {
  console.log(n)
  n = n - 1
}
\`\`\`

**break** leaves the loop now. **continue** skips to the next round.

\`forEach\` looks like map but returns nothing. Use it only to print or to do a side effect. Use \`map\` when you want a new array. Use \`for...of\` when you need \`break\`.`
          ),
          ytWatch(
            "v-long",
            VID.jsTraversy,
            "JavaScript crash course (Traversy Media)",
            "25:00",
            "40:00",
            "Arrays and loops. Stop at 40:00."
          ),
          tasks("t", "Hands-on", [
            { id: "of", label: "node loops.js prints three names then index lines" },
          ]),
        ],
      },
    ],
  }),

  "moshka-js-arrays": lesson({
    id: "moshka-js-arrays",
    name: "Arrays",
    description: "A list. Index starts at 0. push adds at the end.",
    sections: [
      {
        id: "do",
        title: "A list of things",
        blocks: [
          beforeYouStart(
            "plan",
            "Build a small array, read index 0, push one more item, print length.",
            "You know [0] is the first item, not [1].",
            ["~/Desktop/js-lab/arrays.js"]
          ),
          ytWatch(
            "v-arr",
            VID.jsTraversy,
            "JavaScript crash course (Traversy Media)",
            "25:00",
            "35:00",
            "Arrays, push, and length. Stop before map if you are tired."
          ),
          ...teachStep(
            1,
            "Create and read",
            `Square brackets. First item is index 0. Harbor notes were an array of strings in localStorage.`,
            "js",
            "arrays.js",
            `const notes = ["left berth", "tug booked"]
console.log(notes[0])
console.log(notes.length)
`,
            "1-3"
          ),
          ...teachStep(
            2,
            "push adds one item",
            `\`push\` changes the array. That is why we used \`let\` for total, but arrays declared with \`const\` can still be mutated (the name still points at the same list).`,
            "js",
            "arrays.js",
            `const notes = ["left berth", "tug booked"]
console.log(notes[0])
console.log(notes.length)
notes.push("pilot on board")
console.log(notes)
`,
            "4-5"
          ),
          tasks("t", "Hands-on", [
            { id: "len", label: "After push, length is 3" },
          ]),
        ],
      },
    ],
  }),

  "moshka-js-map": lesson({
    id: "moshka-js-map",
    name: "map, filter, find",
    description: "Turn a list into a new list. React Harbor uses map for table rows.",
    sections: [
      {
        id: "do",
        title: "New array from old array",
        blocks: [
          beforeYouStart(
            "plan",
            "Use map to double numbers, filter to keep some, find to get one.",
            "You can say map returns a new array the same length.",
            ["~/Desktop/js-lab/map.js"]
          ),
          ...figureN(
            1,
            "map",
            "moshka-js-map.png",
            "map in, map out",
            `Each item goes through a function. You get a new array. The old array stays. ${figLink(1, "map")} is the picture.`
          ),
          ...watchPair(
            {
              blockId: "v-map",
              url: VID.jsArraysWds,
              title: "8 JavaScript array methods (Web Dev Simplified)",
              caption: "Full video is fine. map, filter, and reduce are the stars for React Harbor.",
            },
            {
              blockId: "v-map-long",
              url: VID.jsTraversy,
              title: "JavaScript crash course (Traversy Media)",
              from: "35:00",
              to: "45:00",
              why: "Second pass on map and filter with different examples.",
            }
          ),
          ...teachStep(
            1,
            "map: one output per input",
            `The function runs once per item. Return the new value. React does \`vessels.map((v) => <VesselRow ... />)\` with this same idea.`,
            "js",
            "map.js",
            `const prices = [18, 12, 10]
const doubled = prices.map((price) => price * 2)
console.log(doubled)
`,
            "1-3"
          ),
          ...teachStep(
            2,
            "filter: keep some",
            `Return true to keep. Return false to drop. Search boxes are filter.`,
            "js",
            "map.js",
            `const prices = [18, 12, 10]
const doubled = prices.map((price) => price * 2)
console.log(doubled)

const cheap = prices.filter((price) => price < 15)
console.log(cheap)
`,
            "5-6"
          ),
          ...teachStep(
            3,
            "find: first match",
            `Stops at the first item that matches. If none match, you get \`undefined\`.`,
            "js",
            "map.js",
            `const prices = [18, 12, 10]
const doubled = prices.map((price) => price * 2)
console.log(doubled)

const cheap = prices.filter((price) => price < 15)
console.log(cheap)

const twelve = prices.find((price) => price === 12)
console.log(twelve)
`,
            "8-9"
          ),
          md(
            "foreach",
            `**map vs filter vs find vs forEach**

| Tool | Returns | Length |
|------|---------|--------|
| \`map\` | new array | same as input |
| \`filter\` | new array | same or shorter |
| \`find\` | one item or \`undefined\` | not an array |
| \`forEach\` | \`undefined\` | do not use for building lists |

React Harbor uses \`map\` because it needs one row per vessel.`
          ),
          playground(
            "play",
            `const names = ["Red Sea", "Newbuild"]
const labels = names.map((n) => "MV " + n)
console.log(labels)`,
            {
              language: "js",
              title: "map names",
              expectIncludes: "MV",
              hint: "map should prefix MV ",
            }
          ),
          tasks("t", "Hands-on", [
            { id: "map", label: "node map.js shows doubled, cheap, and 12" },
          ]),
        ],
      },
    ],
  }),

  "moshka-js-objects": lesson({
    id: "moshka-js-objects",
    name: "Objects",
    description: "A bag of named fields. Vessel is name plus status, not two loose variables.",
    sections: [
      {
        id: "do",
        title: "Named fields",
        blocks: [
          beforeYouStart(
            "plan",
            "Make a vessel object, read .name, nest it in an array.",
            "You used dot notation and you know JSON looks like this.",
            ["~/Desktop/js-lab/obj.js"]
          ),
          ...watchPair(
            {
              blockId: "v-obj",
              url: VID.jsRefValueWds,
              title: "Reference vs value (Web Dev Simplified)",
              caption: "Watch from 0:00 to the end. Explains why objects behave differently from numbers.",
            },
            {
              blockId: "v-obj-long",
              url: VID.jsTraversy,
              title: "JavaScript crash course (Traversy Media)",
              from: "48:00",
              to: "55:00",
              why: "Objects and JSON-shaped data. Stop at 55:00.",
            }
          ),
          concept(
            "obj-idea",
            "What is an object?",
            `An **object** groups related facts under one name.

Instead of three separate variables (\`vesselName\`, \`vesselStatus\`, \`vesselEta\`), you keep one **vessel** with **properties** (fields): \`name\`, \`status\`, \`eta\`.

You read a property with a dot: \`vessel.name\`.`
          ),
          ...teachStep(
            1,
            "Create one vessel object",
            `Curly braces \`{ }\` mean "object". Each line is \`key: value\`. Keys are names you pick. Values can be strings, numbers, or more objects later.`,
            "js",
            "obj.js",
            `const vessel = {
  name: "MV Red Sea",
  status: "Alongside",
  eta: "06:00",
}
`,
            "1-5",
            `- \`const vessel\` = one object stored in the name **vessel**.
- \`name:\` is a **property name** (also called a key).
- \`"MV Red Sea"\` is the **value** (a string).
- Commas between properties. No comma after the last one (both styles work; stay consistent).`
          ),
          ...teachStep(
            2,
            "Read properties with dot and brackets",
            `Two ways to read the same field. Dot is normal. Brackets help when the key name is in a variable (later).`,
            "js",
            "obj.js",
            `const vessel = {
  name: "MV Red Sea",
  status: "Alongside",
  eta: "06:00",
}

console.log(vessel.name)
console.log(vessel["status"])
`,
            "7-8",
            `- \`vessel.name\` means: go into \`vessel\`, get the \`name\` field.
- \`vessel["status"]\` does the same for \`status\`. The quotes are required inside \`[]\`.
- Harbor notes used \`{ text, at }\` objects the same way for each saved note.`
          ),
          ...teachStep(
            3,
            "List of objects (a fleet)",
            `An **array** can hold objects. Each item is one row in a table. React Harbor will \`.map()\` over an array like this.`,
            "js",
            "obj.js",
            `const vessel = {
  name: "MV Red Sea",
  status: "Alongside",
  eta: "06:00",
}

console.log(vessel.name)
console.log(vessel["status"])

const fleet = [
  vessel,
  { name: "MV Newbuild", status: "Inbound", eta: "14:30" },
]

for (const v of fleet) {
  console.log(v.name, v.status)
}
`,
            "10-18",
            `- \`fleet\` is an array \`[ ... ]\` with two objects inside.
- First item is the **same** \`vessel\` object from above (not a copy).
- Second item is a **new** object written inline.
- \`for (const v of fleet)\` loops each object. \`v\` is one vessel per round.
- \`console.log(v.name, v.status)\` prints two columns of text per ship.`
          ),
          ...teachStep(
            4,
            "Pull fields out (destructure)",
            `Shorthand for "copy these properties into their own variables". Same values as \`vessel.name\`, less typing.`,
            "js",
            "obj.js",
            `const vessel = {
  name: "MV Red Sea",
  status: "Alongside",
  eta: "06:00",
}

const { name, status } = vessel
console.log(name, status)
`,
            "7-8",
            `- \`const { name, status } = vessel\` creates variables \`name\` and \`status\` from the object.
- You can now use \`name\` instead of \`vessel.name\`.
- React components often write \`function VesselRow({ name, status })\` in the parameter list. That is destructuring in the function head.`
          ),
          tasks("t", "Hands-on", [
            { id: "run", label: "node obj.js prints two vessel lines then name and status" },
          ]),
        ],
      },
    ],
  }),

  "moshka-js-classes": lesson({
    id: "moshka-js-classes",
    name: "Classes",
    description: "A template for objects with the same fields and functions (methods).",
    sections: [
      {
        id: "do",
        title: "constructor and methods",
        blocks: [
          beforeYouStart(
            "plan",
            "Write a tiny Counter class, then a Vessel class with constructor arguments.",
            "You can say class vs one object literal, and what this means.",
            ["~/Desktop/js-lab/class.js", "~/Desktop/js-lab/vessel.js"]
          ),
          ...watchPair(
            {
              blockId: "v-cls",
              url: VID.jsClassesShort,
              title: "Learn JavaScript classes in 6 minutes",
              caption: "Fast syntax tour. Watch from 0:00 to the end.",
            },
            {
              blockId: "v-cls-wds",
              url: VID.jsCalculatorWds,
              title: "Build a calculator with JavaScript (Web Dev Simplified)",
              from: "0:00",
              to: "20:00",
              why: "Real project that uses ES6 classes. Stop after the class is introduced if you only want OOP vocabulary today.",
            }
          ),
          link(
            "mdn-class",
            "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_classes",
            "MDN: Using classes",
            "Official reference after the videos."
          ),
          concept(
            "oop-words",
            "OOP words (read once)",
            `**OOP** means Object-Oriented Programming. You bundle **data** and **behavior** together.

| Word | Plain meaning |
|------|----------------|
| **class** | Blueprint / stamp (the recipe) |
| **instance** | One real object built from that stamp |
| **property** | Data on the instance (\`total\`, \`name\`) |
| **method** | A function on the instance (\`add\`, \`describe\`) |
| **constructor** | Special method that runs when you write \`new ClassName()\` |
| **this** | "This specific instance I am building right now" |

An **object literal** \`{ name: "MV Red Sea" }\` is one bag you write by hand. A **class** helps you make many similar bags with shared methods.

React UI uses **function components**, not classes. You still meet classes in Node, APIs, and older code. Learn the words here so nothing sounds like magic later.`
          ),
          concept(
            "this-word",
            "What does this mean?",
            `\`this\` always points at **the current instance**.

When \`cafe.add(18)\` runs, inside \`add\`, \`this\` is the **cafe** counter object. So \`this.total\` is **cafe's** total, not some global number.

If you had two counters, \`this\` keeps each one's data separate.`
          ),
          ...teachStep(
            1,
            "Declare an empty class shell",
            `The word \`class\` starts a blueprint. \`Counter\` is the name you choose. The body is empty for now.`,
            "js",
            "class.js",
            `class Counter {
}
`,
            "1-2",
            `- \`class Counter\` does not create an object yet. It only defines a template.
- You will add constructor and methods inside the braces in the next steps.`
          ),
          ...teachStep(
            2,
            "constructor sets starting data",
            `\`constructor\` runs automatically when you write \`new Counter()\`.`,
            "js",
            "class.js",
            `class Counter {
  constructor() {
    this.total = 0
  }
}
`,
            "2-4",
            `- \`constructor()\` is a special method name. JS looks for it on \`new\`.
- \`this.total = 0\` creates a **property** named \`total\` on **this** instance and sets it to \`0\`.
- Every new counter will start at zero.`
          ),
          ...teachStep(
            3,
            "add method (behavior)",
            `Methods look like functions inside the class. They use \`this\` to touch this instance's data.`,
            "js",
            "class.js",
            `class Counter {
  constructor() {
    this.total = 0
  }

  add(price) {
    this.total = this.total + price
  }
}
`,
            "6-8",
            `- \`add(price)\` is a **method**: a function on each counter.
- \`price\` is a parameter (the drink price you pass in).
- \`this.total = this.total + price\` reads the old total, adds \`price\`, saves back on **this** counter only.`
          ),
          ...teachStep(
            4,
            "reset method",
            `Same pattern: a method that changes \`this.total\`.`,
            "js",
            "class.js",
            `class Counter {
  constructor() {
    this.total = 0
  }

  add(price) {
    this.total = this.total + price
  }

  reset() {
    this.total = 0
  }
}
`,
            "10-12",
            `- \`reset()\` takes no parameters.
- It sets \`this.total\` back to \`0\`, like the cafe Clear button.`
          ),
          ...teachStep(
            5,
            "new creates an instance",
            `\`new Counter()\` builds one real counter. You call methods with a dot.`,
            "js",
            "class.js",
            `class Counter {
  constructor() {
    this.total = 0
  }

  add(price) {
    this.total = this.total + price
  }

  reset() {
    this.total = 0
  }
}

const cafe = new Counter()
cafe.add(18)
cafe.add(12)
console.log(cafe.total)
cafe.reset()
console.log(cafe.total)
`,
            "14-21",
            `- \`new Counter()\` runs \`constructor\`, then gives you an **instance** stored in \`cafe\`.
- \`cafe.add(18)\` calls the method on **that** instance.
- \`console.log(cafe.total)\` reads the property (prints \`30\`).
- \`cafe.reset()\` then \`console.log\` again should print \`0\`.
- Save this file as \`class.js\` and run \`node class.js\` in the terminal.`
          ),
          ...teachStep(
            6,
            "Vessel class with constructor arguments",
            `Open a **new** file \`vessel.js\`. The constructor can take values so each ship has its own name.`,
            "js",
            "vessel.js",
            `class Vessel {
  constructor(name, status) {
    this.name = name
    this.status = status
  }
}
`,
            "1-6",
            `- \`constructor(name, status)\` receives two arguments when you call \`new Vessel("...", "...")\`.
- \`this.name = name\` stores the first argument on the instance.
- \`this.status = status\` stores the second.
- \`name\` on the right is the parameter. \`this.name\` is the property on the object.`
          ),
          ...teachStep(
            7,
            "describe method returns text",
            `Methods can \`return\` a string, like a function.`,
            "js",
            "vessel.js",
            `class Vessel {
  constructor(name, status) {
    this.name = name
    this.status = status
  }

  describe() {
    return this.name + " is " + this.status
  }
}
`,
            "8-10",
            `- \`describe()\` builds one sentence from \`this.name\` and \`this.status\`.
- \`+\` joins strings. Spaces in \`" is "\` keep it readable.
- Callers will use \`a.describe()\` to get the string back.`
          ),
          ...teachStep(
            8,
            "Two instances, same class",
            `One blueprint, two ships. Each has its own \`this.name\`.`,
            "js",
            "vessel.js",
            `class Vessel {
  constructor(name, status) {
    this.name = name
    this.status = status
  }

  describe() {
    return this.name + " is " + this.status
  }
}

const a = new Vessel("MV Red Sea", "Alongside")
const b = new Vessel("MV Newbuild", "Inbound")
console.log(a.describe())
console.log(b.describe())
`,
            "12-17",
            `- \`new Vessel(...)\` twice makes **two instances**: \`a\` and \`b\`.
- Same class, different data inside each.
- \`a.describe()\` and \`b.describe()\` print two different lines.
- Run \`node vessel.js\` when done.`
          ),
          md(
            "vs-obj",
            `**Recap:** object literal = one-off bag. **class** = stamp + \`new\` for many bags with shared methods.

**React:** you will write \`function VesselRow(props)\` instead of \`class Vessel\`. Props are like constructor arguments passed from the parent. The mental model (data + display) is the same.`
          ),
          tasks("t", "Hands-on", [
            { id: "counter", label: "node class.js prints 30 then 0" },
            { id: "vessel", label: "node vessel.js prints two describe lines" },
          ]),
        ],
      },
    ],
  }),

  "moshka-js-errors": lesson({
    id: "moshka-js-errors",
    name: "Errors and try/catch",
    description: "Read the red text. Fix the first line. try/catch for JSON.parse.",
    sections: [
      {
        id: "do",
        title: "When it blows up",
        blocks: [
          ytWatch(
            "v-err",
            VID.jsTraversy,
            "JavaScript crash course (Traversy Media)",
            "1:15:00",
            "1:25:00",
            "Common errors and debugging mindset. Stop when he moves to a new topic."
          ),
          ...figureN(
            1,
            "console",
            "moshka-meme-white-screen.png",
            "Read the console",
            `White screen in React is often a thrown error. Same habit here: read the first red line. ${figLink(1, "console")}.`
          ),
          md(
            "m",
            `Common ones:

| Message | Meaning |
|---------|---------|
| is not defined | Typo, or forgot to declare |
| Cannot read properties of null | \`getElementById\` found nothing. Wrong id. |
| Unexpected token | JSON.parse on bad text. Harbor persist used try/catch for this. |
| EADDRINUSE | Later, with Vite: port already in use |`
          ),
          ...teachStep(
            1,
            "try/catch around JSON",
            `If parse fails, return a fallback. Do not crash the whole page.`,
            "js",
            "safe.js",
            `function readNotes(raw) {
  try {
    return JSON.parse(raw)
  } catch {
    return []
  }
}

console.log(readNotes('["ok"]'))
console.log(readNotes("not json"))
`,
            "1-10"
          ),
          tasks("t", "Hands-on", [
            { id: "run", label: "node safe.js prints an array then []" },
          ]),
        ],
      },
    ],
  }),

  "moshka-js-async": lesson({
    id: "moshka-js-async",
    name: "async in one page",
    description: "Some work is later: fetch, timers. Promise and async/await.",
    sections: [
      {
        id: "idea",
        title: "Now vs later",
        blocks: [
          beforeYouStart(
            "plan",
            "Read this so fetch in Next Harbor is not a surprise. Run a tiny timeout example in Node.",
            "You can say async means we wait without freezing the whole program.",
            ["~/Desktop/js-lab/async.js"]
          ),
          ...watchPair(
            {
              blockId: "v-prom",
              url: VID.jsPromisesWds,
              title: "JavaScript promises in 10 minutes (Web Dev Simplified)",
            },
            {
              blockId: "v-async-wds",
              url: VID.jsAsyncWds,
              title: "JavaScript async await (Web Dev Simplified)",
              from: "0:00",
              to: "12:00",
              why: "Readable waiting. Stop after the first async function example.",
            }
          ),
          yt(
            "v-fetch",
            VID.jsFetchWds,
            "Learn fetch API in 6 minutes (Web Dev Simplified)",
            "Watch from 0:00 to the end. Save for Next Harbor APIs."
          ),
          md(
            "m",
            `\`console.log(1)\` is **now**. Loading a URL is **later**. JS does not freeze the whole app while waiting. It uses a **Promise**: a value that arrives in the future.

**async/await** is the readable way to wait:

\`\`\`js
async function load() {
  const res = await fetch("https://example.com")
  const text = await res.text()
  console.log(text.slice(0, 40))
}
\`\`\`

\`fetch\` exists in modern Node and in the browser. You will use it in Next Harbor for APIs.`
          ),
          concept(
            "async-idea",
            "Sync vs later",
            `**Synchronous** code runs top to bottom, one line at a time, right now.

**Asynchronous** code schedules work for later (network, timer). JS keeps going while it waits.

That is why fetch and timers do not freeze the whole page.`
          ),
          ...teachStep(
            1,
            "setTimeout is later",
            `Run \`node async.js\`. Watch the order: A, C, then B after a short pause.`,
            "js",
            "async.js",
            `console.log("A")
setTimeout(() => {
  console.log("B later")
}, 200)
console.log("C")
`,
            "1-5",
            `- Line 1 runs immediately: prints \`A\`.
- \`setTimeout\` **schedules** a function for 200 ms later. It does not wait here.
- Line 5 runs immediately: prints \`C\`.
- Then the timer fires and prints \`B later\`.
- Order on screen: A, C, B. Order in the file: A, setTimeout, C.`
          ),
          tip(
            "later",
            "Deep async later",
            "Do not binge Promises today. When an API lesson uses await, come back to this page."
          ),
          tasks("t", "Hands-on", [
            { id: "run", label: "node async.js prints A, C, then B later" },
          ]),
        ],
      },
    ],
  }),
}
