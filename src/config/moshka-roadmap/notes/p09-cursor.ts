import {
  explain,
  figLink,
  figureN,
  illustration,
  info,
  lesson,
  link,
  md,
  mermaid,
  tasks,
  tip,
  beforeYouStart,
} from "@/config/moshka-roadmap/helpers"
import type { NoteDocument } from "@/lib/notes-types"

export const moshkaCursorNotes: Record<string, NoteDocument> = {
  "moshka-cursor-learn": lesson({
    id: "moshka-cursor-learn",
    name: "What you will learn",
    description: "Install Cursor. Write a tight prompt. Review every diff. Use it every day.",
    sections: [
      {
        id: "goal",
        title: "AI is a junior pair, not a boss",
        blocks: [
          beforeYouStart(
            "plan",
            "Install Cursor, write tight prompts, and review every change before you keep it.",
            "You ran the app after an agent edit and understood the diff.",
            []
          ),
          ...figureN(
            1,
            "cursor-ui",
            "moshka-cursor-install.png",
            "Editor plus agent",
            `Code on the left, agent on the right. You still approve every edit. ${figLink(1, "cursor-ui")} is the layout to learn.`
          ),
          md(
            "g",
            `Abdelrahman ships with Cursor. You will too.

Rules:
1. You open the folder
2. You say the file path
3. You read the diff
4. You run the app

If you cannot explain the change, you do not keep it.`
          ),
          illustration(
            "ill",
            "moshka-cursor-hands",
            "Hold the wheel",
            "Cursor types. You steer."
          ),
          mermaid(
            "f",
            `flowchart LR
  O[Open repo] --> P[Small prompt]
  P --> D[Read diff]
  D --> R[Run]
  R --> G[Git commit]`,
            "You steer",
            undefined,
            {
              O: "open-repo",
              P: "prompt",
              D: "diff",
              R: "run",
              G: "commit",
            }
          ),
          tasks("t", "Start", [{ id: "ready", label: "Next Harbor folder exists on disk" }]),
        ],
      },
    ],
    explains: [
      explain(
        "open-repo",
        "Repo",
        "Open repo",
        `Open the Harbor folder in Cursor. The AI only sees what you opened.`
      ),
      explain(
        "prompt",
        "Prompt",
        "Small prompt",
        `Name the file. Name the change. One job. "Add a heading on /about" beats "make the app better".`
      ),
      explain(
        "diff",
        "Diff",
        "Read diff",
        `If you cannot explain the red and green, you do not keep it.`
      ),
      explain(
        "run",
        "Run",
        "Run",
        `\`npm run dev\`. Click the page. A diff that does not run is not done.`
      ),
      explain(
        "commit",
        "Git",
        "Git commit",
        `Small commits. A sentence that a teammate can read. You will practice this on real PRs.`
      ),
    ],
  }),
  "moshka-cursor-install": lesson({
    id: "moshka-cursor-install",
    name: "Install Cursor",
    description: "Download. Sign in. Open the Harbor folder. That is the whole lesson.",
    sections: [
      {
        id: "do",
        title: "By the hand",
        blocks: [
          link("c", "https://cursor.com", "cursor.com", "Download for your OS. Install. Open it."),
          md(
            "m",
            `1. Go to cursor.com. Download.
2. Install like any editor.
3. File → Open Folder → your Next Harbor folder.
4. You should see \`src/app/page.tsx\` in the sidebar.

Optional: import VS Code settings if it asks.

You can keep VS Code. Cursor is VS Code plus the agent.

There is no official 90 second install video that stays current. Follow the site.`
          ),
          md(
            "term",
            `After Cursor is open, still run the app from a terminal:

\`\`\`bash
cd ~/Desktop/next-harbor
npm run dev
\`\`\`

The agent does not replace that.`
          ),
          info(
            "models",
            "Models",
            "Use the default agent first. Do not hunt models. Prompt quality beats model hopping."
          ),
          tasks("t", "Hands-on", [
            { id: "open", label: "Harbor is open in Cursor" },
            { id: "file", label: "You clicked page.tsx and saw the code" },
          ]),
        ],
      },
    ],
  }),
  "moshka-cursor-prompt": lesson({
    id: "moshka-cursor-prompt",
    name: "Write a real prompt",
    description: "Path, goal, constraint, how you will check. Four lines.",
    sections: [
      {
        id: "do",
        title: "The four line prompt",
        blocks: [
          md(
            "m",
            `Bad: "make it better"

Good (paste this, then change the name):

\`\`\`
In src/app/page.tsx, add a heading that says Harbor.
Do not change any other files.
Keep corners sharp. No new libraries.
I will check by opening http://localhost:3000.
\`\`\`

Always name the file. Always say what not to do. Always say how you will check.`
          ),
          tasks("t", "Hands-on", [
            { id: "prompt", label: "You ran a four-line prompt and the heading appeared" },
            { id: "read", label: "You read the diff before accepting" },
          ]),
        ],
      },
    ],
  }),
  "moshka-cursor-project": lesson({
    id: "moshka-cursor-project",
    name: "Start a project with AI",
    description: "New feature = new prompt with folder contract. Not 'build my app'.",
    sections: [
      {
        id: "do",
        title: "One feature",
        blocks: [
          md(
            "m",
            `Prompt:

\`\`\`
Add a client component at src/components/role-switch.tsx.
It has three buttons: Crew, Office, Admin.
Clicking one calls onChange(role).
Use it from src/app/page.tsx.
Do not add CSS libraries.
\`\`\`

If it creates 12 files, reject and tighten.`
          ),
          tip(
            "agents",
            "AGENTS.md later",
            "BBS has a long AGENTS.md so the agent remembers rules. You will read that in the BBS tour."
          ),
          tasks("t", "Hands-on", [
            { id: "feat", label: "Role switch exists and you can explain each file" },
          ]),
        ],
      },
    ],
  }),
  "moshka-cursor-review": lesson({
    id: "moshka-cursor-review",
    name: "Read the diff",
    description: "Accept is a commit you have to live with. Read it like a PR.",
    sections: [
      {
        id: "do",
        title: "Checklist",
        blocks: [
          md(
            "m",
            `Before you click keep:

1. Did it touch files you did not name?
2. Did it add a dependency you did not ask for?
3. Did it rewrite working code "for style"?
4. Can you run the app and click the path?

If yes to 1-3, reject. Prompt again, smaller.

Use git to see what changed.`
          ),
          md(
            "term",
            `Run this in the terminal:

\`\`\`bash
cd ~/Desktop/next-harbor
git status
git diff
\`\`\`

If the folder is not a git repo yet:

\`\`\`bash
cd ~/Desktop/next-harbor
git init
git add .
git commit -m "harbor before cursor experiment"
\`\`\`

Then you can always undo.`
          ),
          tasks("t", "Hands-on", [
            { id: "diff", label: "You ran git diff after an agent edit" },
          ]),
        ],
      },
    ],
  }),
  "moshka-cursor-rules": lesson({
    id: "moshka-cursor-rules",
    name: "Rules files",
    description: "A short AGENTS.md or Cursor rule so the agent stops inventing purple rounded UI.",
    sections: [
      {
        id: "do",
        title: "Write four rules",
        blocks: [
          md(
            "m",
            `Create \`AGENTS.md\` in Next Harbor (or \`.cursor/rules\` if you already use that). Keep it short.`
          ),
          md(
            "p",
            `\`AGENTS.md\`:

\`\`\`md:AGENTS.md
# Harbor

- App Router. Server Components by default.
- Do not put Mongo or Postgres in client components.
- Radius 0. No purple. No glow.
- Mutations go through src/services, then src/repo.
\`\`\`

Then prompt: "Read AGENTS.md. Add a muted line under the heading on src/app/page.tsx. No other files."

If it still adds a gradient, the rule is not in context. @ mention the file.`
          ),
          tasks("t", "Hands-on", [
            { id: "rules", label: "AGENTS.md exists and you referenced it in a prompt" },
          ]),
        ],
      },
    ],
  }),
  "moshka-cursor-daily": lesson({
    id: "moshka-cursor-daily",
    name: "Daily AI workflow",
    description: "Plan, small diff, run, commit. Repeat. Ask mode vs agent.",
    sections: [
      {
        id: "do",
        title: "A normal day",
        blocks: [
          md(
            "m",
            `1. Write the next tiny goal in chat.
2. Agent edits.
3. You run the app and click.
4. You commit with a short message.

Ask mode (this notes chat, or Cursor ask): questions. Agent mode: file changes.

Never paste secrets. Never accept a giant rewrite of files you do not own.

On TailoredTech work you will also get Linear tickets. One ticket, one small PR.`
          ),
          md(
            "term",
            `Run this in the terminal:

\`\`\`bash
cd ~/Desktop/next-harbor
npm run dev
\`\`\`

Keep it running while the agent works so you can refresh.`
          ),
          tip("n", "Next", "Talking app: put a chatbot in Harbor with the Vercel AI SDK."),
          tasks("t", "Hands-on", [
            { id: "commit", label: "You made a git commit of a small Cursor change" },
          ]),
        ],
      },
    ],
  }),
}
