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

export const moshkaRepoNotes: Record<string, NoteDocument> = {
  "moshka-repo-learn": lesson({
    id: "moshka-repo-learn",
    name: "What you will learn",
    description:
      "Split Harbor into db, repo, service. Pages and routes stay thin. This is how BBS is cut.",
    sections: [
      {
        id: "goal",
        title: "Same product, better folders",
        blocks: [
          beforeYouStart(
            "plan",
            "Split Harbor into route, service, repo, and db folders like production code.",
            "API routes stay thin and Mongo access lives in repo files.",
            ["src/app", "src/repo", "src/service"]
          ),
          ...figureN(
            1,
            "layers",
            "moshka-layers.png",
            "Layer stack",
            `Routes stay thin. Service and repo own the rules and queries. ${figLink(1, "layers")} is the stack you will copy on client repos.`
          ),
          md(
            "g",
            `Right now \`route.ts\` talks to Mongo. That works for a demo. It does not work when you have observations, users, tenants, and three roles.

You will move code into:

- \`src/db\` connection and collection helpers
- \`src/repo\` functions that know Mongo
- \`src/services\` functions that know product rules
- \`src/app\` routes and actions that only call services

The page still uses API, server actions, TanStack Query, and cache. Those do not change. The insides get a spine.`
          ),
          mermaid(
            "f",
            `flowchart TB
  A[app route / action] --> S[service]
  S --> R[repo]
  R --> D[db / Mongo]`,
            "The spine",
            undefined,
            {
              A: "app",
              S: "service",
              R: "repo",
              D: "db",
            }
          ),
          tasks("t", "Start", [
            { id: "mongo", label: "Mongo Harbor GET and POST still work" },
          ]),
        ],
      },
    ],
    explains: [
      explain(
        "app",
        "App",
        "app route / action",
        `Thin. Parses the request, calls a service, returns JSON or redirects.`
      ),
      explain(
        "service",
        "Service",
        "service",
        `Product rules. Trim, require tenant, reject empty text. No Mongo driver.`
      ),
      explain(
        "repo",
        "Repo",
        "repo",
        `Knows Mongo. \`listLogs\`, \`createLog\`. Swap this later for SQL.`
      ),
      explain(
        "db",
        "DB",
        "db / Mongo",
        `Connection helper. Collection names. No \`createLog\` product names.`
      ),
    ],
  }),
  "moshka-repo-why": lesson({
    id: "moshka-repo-why",
    name: "Why pages do not talk to Mongo",
    description: "If the driver is in a component, you cannot reuse it, test it, or swap SQL later.",
    sections: [
      {
        id: "why",
        title: "Three failures",
        blocks: [
          md(
            "m",
            `**1. Secrets leak.** A client component cannot hold \`MONGODB_URI\`. If you import the driver into \`"use client"\`, you are one mistake away from shipping the URI to the browser.

**2. Rules scatter.** "Empty text is invalid" and "tenantId is required" belong in one place. Not in the route AND the action AND a random button.

**3. You cannot see BBS.** BBS has \`src/features\`, \`src/repo\`, \`src/db\`. When Abdelrahman says "add a repo function", this is that sentence.

You already practiced the idea in Client Eyes: one job, one screen. Same for folders.`
          ),
          info(
            "not-overkill",
            "How much is enough",
            "Harbor is small. We still split it so your hands know the path. On a real PR you will not invent a fourth layer."
          ),
          tasks("t", "Check", [
            { id: "say", label: "You can name one reason the page should not import mongodb" },
          ]),
        ],
      },
    ],
  }),
  "moshka-repo-db": lesson({
    id: "moshka-repo-db",
    name: "The db folder",
    description: "Connection only. No product names like createLog.",
    sections: [
      {
        id: "do",
        title: "Move mongo.ts",
        blocks: [
          md(
            "m",
            `Try first: move \`src/lib/mongo.ts\` to \`src/db/mongo.ts\`. Fix imports. Run the app. If it still GET/POSTs, the move worked.

You can also add \`src/db/collections.ts\` so collection names live in one file.`
          ),
          md(
            "p",
            `\`src/db/collections.ts\`:

\`\`\`ts:src/db/collections.ts
export const COLLECTIONS = {
  logs: "logs",
} as const
\`\`\`

\`src/db/mongo.ts\` keeps \`getMongo\` and:

\`\`\`ts:src/db/mongo.ts
import { COLLECTIONS } from "@/db/collections"

export async function getLogsCollection() {
  const client = getMongo()
  await client.connect()
  return client.db("harbor").collection(COLLECTIONS.logs)
}
\`\`\`

BBS keeps schemas next to this. You will see that on the BBS tour.`
          ),
          tasks("t", "Hands-on", [
            { id: "move", label: "Connection code lives under src/db" },
          ]),
        ],
      },
    ],
  }),
  "moshka-repo-repo": lesson({
    id: "moshka-repo-repo",
    name: "The repo layer",
    description: "find, insert. No HTTP. No FormData. No React.",
    sections: [
      {
        id: "do",
        title: "logs.repo.ts",
        blocks: [
          md(
            "m",
            `A repo function takes plain data and returns plain data. It talks to one collection.`
          ),
          md(
            "p",
            `\`src/repo/logs.repo.ts\`:

\`\`\`ts:src/repo/logs.repo.ts
import { getLogsCollection } from "@/db/mongo"

export type HarborLog = {
  _id?: string
  text: string
  tenantId: string
  createdAt: string
}

export async function listLogs(tenantId: string) {
  const col = await getLogsCollection()
  const rows = await col
    .find({ tenantId })
    .sort({ createdAt: -1 })
    .limit(50)
    .toArray()
  return rows.map((row) => ({
    _id: String(row._id),
    text: String(row.text),
    tenantId: String(row.tenantId),
    createdAt: String(row.createdAt),
  }))
}

export async function insertLog(input: Omit<HarborLog, "_id">) {
  const col = await getLogsCollection()
  const result = await col.insertOne(input)
  return { _id: String(result.insertedId), ...input }
}
\`\`\`

No \`Request\`. No \`revalidatePath\`. That is the point.`
          ),
          tasks("t", "Hands-on", [
            { id: "repo", label: "listLogs and insertLog exist and compile" },
          ]),
        ],
      },
    ],
  }),
  "moshka-repo-service": lesson({
    id: "moshka-repo-service",
    name: "The service layer",
    description: "Product rules: zod, tenant, defaults. Calls the repo.",
    sections: [
      {
        id: "do",
        title: "logs.service.ts",
        blocks: [
          md(
            "m",
            `Try first: a \`createLog\` function that parses with Zod, then calls \`insertLog\`. The route should not call Zod itself after this.`
          ),
          md(
            "p",
            `\`src/services/logs.service.ts\`:

\`\`\`ts:src/services/logs.service.ts
import { logInput } from "@/lib/log-schema"
import { insertLog, listLogs } from "@/repo/logs.repo"

const LEARN_TENANT = "learn"

export async function listHarborLogs() {
  return listLogs(LEARN_TENANT)
}

export async function createHarborLog(raw: unknown) {
  const parsed = logInput.safeParse(raw)
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.flatten() }
  }
  const row = await insertLog({
    text: parsed.data.text,
    tenantId: LEARN_TENANT,
    createdAt: new Date().toISOString(),
  })
  return { ok: true as const, row }
}
\`\`\`

Later, \`LEARN_TENANT\` becomes the signed-in tenant. The service is where that swap happens, not in the repo.`
          ),
          tasks("t", "Hands-on", [
            { id: "svc", label: "createHarborLog rejects empty text before insert" },
          ]),
        ],
      },
    ],
  }),
  "moshka-repo-wire": lesson({
    id: "moshka-repo-wire",
    name: "Wire routes and actions",
    description: "GET/POST and the server action only call the service.",
    sections: [
      {
        id: "do",
        title: "Thin app layer",
        blocks: [
          md(
            "p",
            `\`src/app/api/logs/route.ts\`:

\`\`\`ts:src/app/api/logs/route.ts
import { createHarborLog, listHarborLogs } from "@/services/logs.service"

export const dynamic = "force-dynamic"

export async function GET() {
  const logs = await listHarborLogs()
  return Response.json(logs)
}

export async function POST(req: Request) {
  const body = await req.json()
  const result = await createHarborLog(body)
  if (!result.ok) return Response.json({ error: result.error }, { status: 400 })
  return Response.json(result.row)
}
\`\`\`

\`src/app/logs/actions.ts\`:

\`\`\`ts:src/app/logs/actions.ts
"use server"

import { createHarborLog } from "@/services/logs.service"
import { revalidatePath } from "next/cache"

export async function createLog(formData: FormData) {
  const result = await createHarborLog({ text: formData.get("text") })
  if (!result.ok) return result
  revalidatePath("/logs")
  return { ok: true }
}
\`\`\`

TanStack Query still fetches \`/api/logs\`. You did not change the client. That is the win.`
          ),
          md(
            "term",
            `Run this in the terminal:

\`\`\`bash
curl http://localhost:3000/api/logs
curl -X POST http://localhost:3000/api/logs \\
  -H "Content-Type: application/json" \\
  -d '{"text":"From the service layer"}'
\`\`\``
          ),
          tasks("t", "Hands-on", [
            { id: "thin", label: "route.ts has no insertOne in it" },
            { id: "curl", label: "POST still writes to Mongo" },
          ]),
        ],
      },
    ],
  }),
  "moshka-repo-mistakes": lesson({
    id: "moshka-repo-mistakes",
    name: "Mistakes that leak into the UI",
    description: "ObjectId in the client. Mixing Query cache with Next cache. God files.",
    sections: [
      {
        id: "list",
        title: "Watch for these",
        blocks: [
          md(
            "m",
            `**ObjectId.** JSON cannot serialize Mongo's \`ObjectId\` unless you \`String(row._id)\` in the repo. If React warns about a weird object as a key, you leaked a driver type.

**God service.** If \`logs.service.ts\` starts importing React, stop. Services are Node.

**Two writes.** Do not insert in the action AND in the route for the same button. One path.

**Cache.** \`revalidatePath("/logs")\` after a server action. \`invalidateQueries({ queryKey: ["logs"] })\` after a client fetch POST. Do both if both UIs exist.

**Next folder.** SQL Harbor: same layers, Postgres tables instead of documents.`
          ),
          stack(
            "s",
            "Harbor layers now",
            [
              {
                id: "app",
                label: "app",
                explainId: "layer-app",
                items: [
                  { icon: "nextdotjs", label: "route.ts" },
                  { icon: "nextdotjs", label: "actions.ts" },
                ],
              },
              {
                id: "svc",
                label: "services",
                explainId: "layer-svc",
                items: [{ icon: "typescript", label: "logs.service" }],
              },
              {
                id: "repo",
                label: "repo",
                explainId: "layer-repo",
                items: [{ icon: "mongodb", label: "logs.repo" }],
              },
              {
                id: "db",
                label: "db",
                explainId: "layer-db",
                items: [{ icon: "mongodb", label: "mongo.ts" }],
              },
            ],
            [
              { from: "app", to: "svc" },
              { from: "svc", to: "repo" },
              { from: "repo", to: "db" },
            ]
          ),
          tip("n", "Next", "SQL Harbor. Same Next app, tables instead of documents."),
          tasks("t", "Check", [
            { id: "id", label: "API JSON has _id as a string" },
          ]),
        ],
      },
    ],
    explains: [
      explain(
        "layer-app",
        "app",
        "app",
        `\`route.ts\` and \`actions.ts\`. They call the service. That is all.`
      ),
      explain(
        "layer-svc",
        "services",
        "services",
        `Product rules. No React. No second write path.`
      ),
      explain(
        "layer-repo",
        "repo",
        "repo",
        `Mongo functions. Serialize \`_id\` to a string before JSON leaves.`
      ),
      explain(
        "layer-db",
        "db",
        "db",
        `\`mongo.ts\` connection. Collection names. Nothing else.`
      ),
    ],
  }),
}
