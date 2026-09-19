import {
  explain,
  figLink,
  figureN,
  info,
  lesson,
  md,
  mermaid,
  stack,
  tasks,
  tip,
  beforeYouStart,
} from "@/config/moshka-roadmap/helpers"
import type { NoteDocument } from "@/lib/notes-types"

export const moshkaBbsNotes: Record<string, NoteDocument> = {
  "moshka-bbs-learn": lesson({
    id: "moshka-bbs-learn",
    name: "What you will learn",
    description:
      "Bahri BBS is the living example. Folders, request flow, roles, AGENTS.md.",
    sections: [
      {
        id: "goal",
        title: "A real TailoredTech repo",
        blocks: [
          beforeYouStart(
            "plan",
            "Walk a real Bahri BBS repo: folders, flow, roles, AGENTS.md.",
            "You can name the four layers and how a request moves through them.",
            []
          ),
          ...figureN(
            1,
            "bbs-cutaway",
            "moshka-bbs-cutaway.png",
            "BBS rooms",
            `Features, repo, database, and app layers show up in every Bahri BBS repo. ${figLink(1, "bbs-cutaway")} is the cutaway.`
          ),
          md(
            "g",
            `You have already seen TailoredTech projects. Now we name the pattern.

BBS = Behavior-Based Safety for Bahri. Crew files observations. Office reviews. Many roles. Mongo. Next App Router. Feature folders.

You already built a tiny version of this spine in Repo and service.`
          ),
          mermaid(
            "f",
            `flowchart LR
  F[src/features] --> R[src/repo]
  R --> D[src/db]
  A[src/app] --> F`,
            "BBS folders",
            undefined,
            {
              F: "features",
              R: "repo",
              D: "db",
              A: "app",
            }
          ),
          tasks("t", "Start", [
            { id: "open", label: "Abdelrahman shows you the BBS folder list, or you read this tour first" },
          ]),
        ],
      },
    ],
    explains: [
      explain(
        "features",
        "Features",
        "src/features",
        `Product slices: observations, action-items, settings. UI plus the actions for that slice.`
      ),
      explain(
        "repo",
        "Repo",
        "src/repo",
        `Functions that talk to Mongo. No React. No HTML.`
      ),
      explain(
        "db",
        "DB",
        "src/db",
        `Connection, schemas, collection names. No "createObservation" product names.`
      ),
      explain(
        "app",
        "App",
        "src/app",
        `Routes. Crew, office, administration. Thin. They call features.`
      ),
    ],
  }),
  "moshka-bbs-folders": lesson({
    id: "moshka-bbs-folders",
    name: "How the repo is cut",
    description: "features, repo, db, app, components/ui/shared. Not a junk drawer.",
    sections: [
      {
        id: "map",
        title: "Where things live",
        blocks: [
          stack(
            "s",
            "BBS layers",
            [
              {
                id: "app",
                label: "app (routes)",
                explainId: "layer-app",
                items: [
                  { icon: "nextdotjs", label: "crew" },
                  { icon: "nextdotjs", label: "office" },
                  { icon: "nextdotjs", label: "administration" },
                ],
              },
              {
                id: "feat",
                label: "features (product)",
                explainId: "layer-feat",
                items: [
                  { icon: "react", label: "observations" },
                  { icon: "react", label: "action-items" },
                  { icon: "react", label: "settings" },
                ],
              },
              {
                id: "repo",
                label: "repo (data access)",
                explainId: "layer-repo",
                items: [{ icon: "mongodb", label: "observation.repo" }],
              },
              {
                id: "db",
                label: "db (schemas)",
                explainId: "layer-db",
                items: [{ icon: "mongodb", label: "models + schemas" }],
              },
            ],
            [
              { from: "app", to: "feat" },
              { from: "feat", to: "repo" },
              { from: "repo", to: "db" },
            ]
          ),
          md(
            "m",
            `**Do not** put Mongo calls in a random component.

**Do** add a feature folder when the product slice is real (observations, notifications).

Shared UI lives in \`src/components/ui/shared\` so every role looks like one product.

If you are sitting next to the repo, open those four folders before you type.`
          ),
          tasks("t", "Check", [
            { id: "place", label: "You can say where a new observation form would live" },
          ]),
        ],
      },
    ],
    explains: [
      explain(
        "layer-app",
        "app",
        "app (routes)",
        `URL folders. \`/crew\`, \`/office\`, \`/administration\`. Thin pages.`
      ),
      explain(
        "layer-feat",
        "features",
        "features (product)",
        `The observation form lives here, not in a random component under app.`
      ),
      explain(
        "layer-repo",
        "repo",
        "repo (data access)",
        `\`createObservation\`. Mongo only. Called by a feature action.`
      ),
      explain(
        "layer-db",
        "db",
        "db (schemas)",
        `Models and collection helpers. No product sentences.`
      ),
    ],
  }),
  "moshka-bbs-request": lesson({
    id: "moshka-bbs-request",
    name: "A click through the layers",
    description: "Submit observation: page, feature action, service, repo, Mongo.",
    sections: [
      {
        id: "flow",
        title: "Follow one save",
        blocks: [
          mermaid(
            "m",
            `sequenceDiagram
  participant Crew
  participant Page
  participant Action
  participant Repo
  participant Mongo
  Crew->>Page: submit form
  Page->>Action: server action
  Action->>Repo: create observation
  Repo->>Mongo: insert
  Mongo-->>Crew: serial + status`,
            "One save",
            undefined,
            {
              Crew: "seq-crew",
              Page: "seq-page",
              Action: "seq-action",
              Repo: "seq-repo",
              Mongo: "seq-mongo",
            }
          ),
          md(
            "m",
            `This is the same sequence you built for Harbor logs, with more product rules.

BBS also denormalizes counts onto the observation so the log table does not recompute the world.

That is a production trick: store \`safeCount\` on write.

When you debug "save does nothing", walk this diagram. Do not start in a random CSS file.`
          ),
          tasks("t", "Check", [
            { id: "line", label: "You can point at each arrow in the diagram with a folder name" },
          ]),
        ],
      },
    ],
    explains: [
      explain(
        "seq-crew",
        "Crew",
        "Crew",
        `The person on the vessel. They tap submit. They never see Mongo.`
      ),
      explain(
        "seq-page",
        "Page",
        "Page",
        `The form. Calls a server action. No driver import.`
      ),
      explain(
        "seq-action",
        "Action",
        "Action",
        `Feature server action. Validates, then calls the repo.`
      ),
      explain(
        "seq-repo",
        "Repo",
        "Repo",
        `\`createObservation\`. Writes the document. May store \`safeCount\` so the table stays fast.`
      ),
      explain(
        "seq-mongo",
        "Mongo",
        "Mongo",
        `Insert. Returns an id. The UI shows a serial and a status.`
      ),
    ],
  }),
  "moshka-bbs-db": lesson({
    id: "moshka-bbs-db",
    name: "db schemas and the repo",
    description: "Zod or similar at the boundary. Mongo models next to collections.",
    sections: [
      {
        id: "do",
        title: "You already practiced this",
        blocks: [
          md(
            "m",
            `Harbor: \`src/lib/log-schema.ts\` + \`src/repo/logs.repo.ts\` + \`src/db/mongo.ts\`.

BBS: same idea, more files. Observation create validates ICB items, vessel, observer. The repo inserts and may bump counters.

When you add a field, you add it in the schema **and** the type **and** the UI. Missing one of those is a classic bug.

If Abdelrahman opens BBS, ask him to show \`src/db\` and one \`*.repo.ts\` next to your Harbor files.`
          ),
          tasks("t", "Check", [
            { id: "map", label: "You mapped Harbor log-schema to a BBS schema file name" },
          ]),
        ],
      },
    ],
  }),
  "moshka-bbs-roles": lesson({
    id: "moshka-bbs-roles",
    name: "Crew, office, vessel",
    description: "Same product, different nav, different permissions.",
    sections: [
      {
        id: "roles",
        title: "Hats",
        blocks: [
          md(
            "m",
            `**Crew:** signed on a vessel, maybe observer. Phone bottom nav.

**Office:** dense tables, filters, Excel.

**Vessel login:** that ship's window.

**STO/ETS:** specialists with their own shell.

**Super admin:** all tenants.

If you build a button, ask: who sees this?

You faked this with three buttons in Client Eyes.`
          ),
          info(
            "ux",
            "UX",
            "BBS copy is short. No helper essays. You already practiced that in Client Eyes."
          ),
          tasks("t", "Check", [
            { id: "who", label: "You named two things crew must not see" },
          ]),
        ],
      },
    ],
  }),
  "moshka-bbs-tenant": lesson({
    id: "moshka-bbs-tenant",
    name: "tenantId everywhere",
    description: "A missing filter is a data leak. Treat it like a lock.",
    sections: [
      {
        id: "do",
        title: "Every query",
        blocks: [
          md(
            "m",
            `You filtered Harbor logs by tenant. BBS does that on almost every collection.

A find without \`tenantId\` in production is an incident.

Super admin switching tenants is explicit (header or picker). It is never "oops, I logged all companies."

When you write a new repo function, the first argument after the payload is often \`tenantId\`.`
          ),
          tasks("t", "Check", [
            { id: "habit", label: "You can say the first thing a new list query must filter on" },
          ]),
        ],
      },
    ],
  }),
  "moshka-bbs-agents": lesson({
    id: "moshka-bbs-agents",
    name: "AGENTS.md is memory",
    description: "The file the AI must read. You will write rules like this.",
    sections: [
      {
        id: "mem",
        title: "Long term memory",
        blocks: [
          md(
            "m",
            `BBS \`AGENTS.md\` is huge on purpose. Brand tokens, density, observation rules, what not to invent.

When Abdelrahman says "remember this", it goes in that file.

Your job on a team: read AGENTS.md before you type. Add a rule when the user states one.

That is how Cursor stays useful on a 100k line repo.

You already wrote a tiny AGENTS.md in Next Harbor. BBS is that file after two years of client sentences.`
          ),
          tip("n", "Next", "Agency mode: how humans work around that repo."),
          tasks("t", "Check", [
            { id: "rule", label: "You can give one example of a rule that belongs in AGENTS.md" },
          ]),
        ],
      },
    ],
  }),
}
