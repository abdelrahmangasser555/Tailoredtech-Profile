import {
  download,
  explain,
  figure,
  lesson,
  link,
  md,
  mermaid,
  STARTERS,
  tasks,
  tip,
} from "@/config/moshka-roadmap/helpers"
import type { NoteDocument } from "@/lib/notes-types"

export const moshkaStartNotes: Record<string, NoteDocument> = {
  "moshka-start-here": lesson({
    id: "moshka-start-here",
    name: "Hey Moshka, start here",
    title: "Hey Moshka",
    description:
      "You pick a tiny project, unzip it, change files, and show a result. That is the whole method.",
    sections: [
      {
        id: "why",
        title: "Why this path exists",
        blocks: [
          md(
            "why-md",
            `Abdelrahman is not trying to make you memorize syntax. AI can type. Your job is to **see what is happening**, **change a file**, and **show a result**.

In about 6 months you should be able to sit on a TailoredTech project and help for real: read the folder, ship a small piece, ask a sharp question.

This notes folder is your home. Progress saves on this browser. You can close the tab and come back.

How each lesson works:

1. Read **Before you start** (what you will do, what done looks like).
2. Read any blue **concept** box before code. It defines words (object, class, runtime, etc.).
3. Follow **Step 1, Step 2, …** in order. Do not skip to the last code block.
4. After each step, read **What the new lines mean**. That section explains every new line in plain English.
5. Lime bar on a code line = new or changed line. **Copy all** still gives you the full file.
6. **Try the change yourself first** when the lesson says try first.
7. Terminal blocks: run in your terminal, not in the browser, not in chat.

If a topic feels fast (functions, objects, classes): stop on that step, type the file yourself, run it, then read the line explanations again. One step per sitting is fine.

Videos come in pairs: a short Fireship clip, then a longer sit-down (Bro Code, Traversy, Net Ninja, Web Dev Simplified). The caption always says **Watch from X to Y**. Click a box on a diagram, or a word like [[pick-build]], for more detail.

**Pictures:** line art and memes on cream paper. Same look everywhere so your brain reads the idea, not the colors. Diagrams (mermaid) stay small; big ideas get an image when one glance helps.`
          ),
          figure("welcome", "moshka-welcome.png", "Two builds, one path"),
          mermaid(
            "why-flow",
            `flowchart LR
  P[Pick a first build] --> F[Frontend that looks real]
  F --> J[JavaScript lab]
  J --> G[Ship with Git]
  G --> R[React plus Vite]
  R --> U[UX like a client]
  U --> N[Next.js]
  N --> M[Mongo]
  M --> L[Repo layer]
  L --> S[SQL]
  S --> B[Supabase]
  B --> A[Auth]
  A --> C[Cursor]
  C --> I[AI in the app]
  I --> T[Tests]
  T --> O[Ship]
  O --> E[BBS + agency]`,
            "The road",
            "Projects, in this order. You still pick the first flavor.",
            {
              P: "pick-build",
              F: "frontend",
              J: "js-lab",
              G: "git-ship",
              R: "react-vite",
              U: "ux",
              N: "nextjs",
              M: "mongo",
              L: "repo",
              S: "sql",
              B: "supabase",
              A: "auth",
              C: "cursor",
              I: "ai",
              T: "tests",
              O: "ship",
              E: "bbs",
            }
          ),
          tip(
            "why-tip",
            "How to use this",
            "One lesson is one job. Mark it done when it works on your machine. If a video is long, the caption tells you the exact start and stop. Click this box for the watch rules.",
            "watch-rules"
          ),
        ],
      },
      {
        id: "pick",
        title: "Pick your first build",
        blocks: [
          md(
            "pick-md",
            `Do **one** of these first. Not all three.

1. **Pixel Cafe**: a menu you can click.
2. **Harbor Log**: a captain writes a note.
3. **Pixel Scoreboard**: two teams, plus and minus.

They teach the same thing: files on disk, a page in the browser, a click that changes the page.

After that first build, do **JavaScript lab** (language, Node vs browser, loops, map). Then **01d Ship with Git**. Then Port Watch. Do not stay in 01 forever.`
          ),
          download(
            "pick-zips",
            [STARTERS.cafe, STARTERS.harbor, STARTERS.score],
            "Grab a zip",
            "Tiny. No node_modules. Unzip, open README, then open index.html."
          ),
          tasks("pick-tasks", "Today", [
            { id: "pick-one", label: "Pick cafe, harbor, or scoreboard" },
            { id: "unzip", label: "Unzip it somewhere you will find it" },
            { id: "open-project", label: "Open that project folder in the roadmap" },
          ]),
        ],
      },
      {
        id: "tools",
        title: "Continue, done, ask",
        blocks: [
          md(
            "tools-md",
            `**Continue** on a folder jumps to the last lesson you opened.

**Next** at the bottom marks the lesson done automatically. You can **Undo** if you skipped the hands-on part. Progress lives in this browser only. No login.

The chat on the right is ask mode. Ask "what do I type next" and name the file you have open.`
          ),
          link(
            "tools-roadmap",
            "/notes/moshka/moshka-roadmap",
            "Open the roadmap",
            "Projects live in here. Folders are builds, not school topics."
          ),
        ],
      },
    ],
    explains: [
      explain(
        "watch-rules",
        "Watch rules",
        "How to watch the videos",
        `Every skill lesson has **two** videos.

1. A short Fireship clip. Watch from 0:00 to the end.
2. A longer video (Bro Code, Traversy, Net Ninja, or Web Dev Simplified). The caption says **Watch from X to Y**. Stop at Y even if the video keeps going.

If the long video is 1 hour, you are not meant to finish it in one sitting unless the caption says to the end.`
      ),
      explain(
        "pick-build",
        "First build",
        "Pick a first build",
        `Do **one**: Pixel Cafe, Harbor Log, or Pixel Scoreboard.

They all teach HTML, CSS, and JS. Different story. Unzip, open \`index.html\`, change a file, refresh.`
      ),
      explain(
        "frontend",
        "Frontend",
        "Frontend that looks real",
        `Cafe or Harbor or Score, then **JavaScript lab** (language, Node vs browser), then **01d Ship with Git**, then **Port Watch**.

Port Watch is a dense table. That is closer to client work than a cute menu.`
      ),
      explain(
        "js-lab",
        "JavaScript",
        "JavaScript lab",
        `A list of notes, not a zip. Runtime (Chrome vs Node), how to run \`node hello.js\`, then functions, loops, arrays, \`.map\`, objects, classes.`
      ),
      explain(
        "git-ship",
        "Git",
        "Ship with Git",
        `Folder **01d Ship with Git**. GitHub account, \`git commit\`, push, branches, pull requests, \`gh\`, rebase basics. Put your cafe folder in a real repo.`
      ),
      explain(
        "react-vite",
        "React",
        "React plus Vite",
        `Folder **02b React Harbor**. Create a Vite app, tour \`src/\`, build \`VesselRow\`, learn props and \`useState\`. Not Next.js yet.`
      ),
      explain(
        "ux",
        "UX",
        "UX like a client",
        `The person clicking 80 times a day is not you. Density, roles, drawers. Then you earn Next.js.`
      ),
      explain(
        "nextjs",
        "Next.js",
        "Next.js",
        `TailoredTech's main frontend. App Router, server vs client, API routes, server actions.

Unzip Next Harbor. Install on your machine. Then databases plug into this app.`
      ),
      explain(
        "mongo",
        "Mongo",
        "MongoDB",
        `Documents in collections. Refresh and the log is still there. Atlas or local. Next talks to it through an API and a server action.`
      ),
      explain(
        "repo",
        "Repo layer",
        "Repo and service",
        `Pages do not talk to Mongo. \`src/app\` calls a service. The service calls a repo. The repo talks to the database. Same spine as BBS.`
      ),
      explain(
        "sql",
        "SQL",
        "SQL Harbor",
        `Tables and rows. Postgres. Same Next app, same layers, different driver.`
      ),
      explain(
        "supabase",
        "Supabase",
        "Supabase Harbor",
        `Hosted Postgres plus auth and a dashboard. You still keep \`src/repo\`. You still write SQL.`
      ),
      explain(
        "auth",
        "Auth",
        "Auth",
        `Who is this, which tenant, which role. Clerk or WorkOS or custom. Gates in front of GET and POST.`
      ),
      explain(
        "cursor",
        "Cursor",
        "Cursor",
        `AI in the editor. You write a small prompt, read the diff, run the app. If you cannot explain the change, you do not keep it.`
      ),
      explain(
        "ai",
        "AI in the app",
        "AI in the app",
        `Vercel AI SDK for chat in Next. LangGraph for long backend jobs. Keys stay in \`.env.local\`.`
      ),
      explain(
        "tests",
        "Tests",
        "Tests",
        `Playwright opens the browser and clicks like a person. One path that a client actually uses.`
      ),
      explain(
        "ship",
        "Ship",
        "Ship",
        `Linux, Docker, Vercel, AWS, Azure. Enough to put Harbor somewhere and not panic at a terminal.`
      ),
      explain(
        "bbs",
        "BBS",
        "BBS and agency",
        `A real TailoredTech repo: features, repo, db, tenants. Then how agency work actually feels.`
      ),
    ],
  }),
}
