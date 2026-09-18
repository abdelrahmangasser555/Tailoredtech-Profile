import {
  explain,
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

export const moshkaApiNotes: Record<string, NoteDocument> = {
  "moshka-api-learn": lesson({
    id: "moshka-api-learn",
    name: "What you will learn",
    description:
      "MongoDB with Next.js: driver, API routes, server actions, TanStack Query, caching.",
    sections: [
      {
        id: "goal",
        title: "Refresh and it is still there",
        blocks: [
          md(
            "g",
            `Until now the page forgets when the server restarts. Mongo remembers.

You will:
1. Know what a database is
2. Put Mongo on Atlas (or local)
3. Connect from Next.js
4. GET and POST through an API route
5. Save through a server action
6. List with TanStack Query
7. Validate with Zod
8. Index and skip cache for user data`
          ),
          mermaid(
            "f",
            `flowchart LR
  P[Page] --> Q[TanStack Query]
  Q --> A[API route]
  F[Form] --> S[Server action]
  A --> R[repo later]
  S --> R
  A --> M[Mongo]
  S --> M`,
            "How data moves",
            undefined,
            {
              P: "page",
              Q: "tanstack",
              A: "api-route",
              F: "form",
              S: "action",
              R: "repo-later",
              M: "mongo",
            }
          ),
          link(
            "atlas",
            "https://www.mongodb.com/docs/atlas/getting-started/",
            "MongoDB Atlas getting started",
            "Official. Free cluster is fine."
          ),
          tasks("t", "Start", [
            { id: "next", label: "Next Harbor still runs with npm run dev" },
          ]),
        ],
      },
    ],
    explains: [
      explain(
        "page",
        "Page",
        "Page",
        `A React page. It should not open a Mongo connection. It asks Query or submits a form.`
      ),
      explain(
        "tanstack",
        "Query",
        "TanStack Query",
        `GET the list. Cache it. After a save, invalidate so the list refreshes.`
      ),
      explain(
        "api-route",
        "API",
        "API route",
        `\`src/app/api/logs/route.ts\`. GET returns JSON. POST inserts. Runs on the server.`
      ),
      explain(
        "form",
        "Form",
        "Form",
        `The captain types a line. Submit does not dump Mongo in the browser. It hits a server action.`
      ),
      explain(
        "action",
        "Action",
        "Server action",
        `A function that runs on the server. Saves a log. Then you tell Query to refetch.`
      ),
      explain(
        "repo-later",
        "Repo",
        "repo later",
        `This project still talks to Mongo from the route. The next project extracts \`src/repo\`.`
      ),
      explain(
        "mongo",
        "Mongo",
        "Mongo",
        `Documents in a collection. Refresh and they are still there. Atlas or local.`
      ),
    ],
  }),
  "moshka-api-db-idea": lesson({
    id: "moshka-api-db-idea",
    name: "What a database even is",
    description: "A program that stores data with rules. Not a vibe. Not localStorage.",
    sections: [
      {
        id: "idea",
        title: "Why the page is not enough",
        blocks: [
          md(
            "m",
            `The browser dies. The laptop sleeps. A second user needs the same logs.

**localStorage**: one browser, one computer. Good for a toy.

**Memory array in route.ts**: gone when the server restarts.

**Database**: a process that keeps documents (or rows) on disk, answers queries, handles many users.

SQL: tables and joins. Mongo: documents in collections. TailoredTech uses Mongo a lot because an observation is nested (ICB items, comments). You will still learn SQL. Both exist on real clients.`
          ),
          mermaid(
            "cmp",
            `flowchart TB
  subgraph sql [SQL]
    T[rows in tables]
  end
  subgraph mongo [Mongo]
    D[documents in collections]
  end`,
            "Two shapes",
            undefined,
            {
              T: "sql-rows",
              D: "mongo-docs",
            }
          ),
          tasks("t", "Check", [
            { id: "say", label: "You can say why refresh killed Harbor Log before persist, and why a memory array dies on restart" },
          ]),
        ],
      },
    ],
    explains: [
      explain(
        "sql-rows",
        "SQL",
        "rows in tables",
        `A table is a grid. A row is one log. Columns are the fields. Joins stitch tables by keys.`
      ),
      explain(
        "mongo-docs",
        "Mongo",
        "documents in collections",
        `A document is JSON. Nested fields are normal. TailoredTech likes this for observations with nested items.`
      ),
    ],
  }),
  "moshka-api-mongo": lesson({
    id: "moshka-api-mongo",
    name: "Documents and collections",
    description: "A document is JSON. A collection is a pile of documents. A database holds collections.",
    sections: [
      {
        id: "do",
        title: "The shape",
        blocks: [
          yt(
            "v",
            VID.mongo,
            "MongoDB in 100 Seconds (Fireship)",
            "Watch from 0:00 to the end. About 2 minutes."
          ),
          ytWatch(
            "v-long",
            VID.mongoTraversy,
            "MongoDB crash course (Traversy Media)",
            "0:00",
            "end",
            "Atlas, documents, and CRUD. Whole video is about 27 minutes. Sit for this one."
          ),
          md(
            "m",
            `Harbor log as a document:

\`\`\`json
{
  "_id": "66f000000000000000000001",
  "text": "Left port at 06:00",
  "tenantId": "bahri",
  "createdAt": "2026-09-17T08:00:00.000Z"
}
\`\`\`

\`_id\` is added by Mongo if you do not set it.

A **collection** named \`logs\` holds many of these.

You query with filters: \`{ tenantId: "bahri" }\`. That is the wall between companies.`
          ),
          link(
            "docs",
            "https://www.mongodb.com/docs/manual/crud/",
            "MongoDB CRUD docs",
            "Official insert / find."
          ),
          tasks("t", "Check", [
            { id: "words", label: "You can say document, collection, database" },
          ]),
        ],
      },
    ],
  }),
  "moshka-api-atlas": lesson({
    id: "moshka-api-atlas",
    name: "Atlas and Compass",
    description: "Create a free cluster. Copy the URI. Insert one document by hand.",
    sections: [
      {
        id: "atlas",
        title: "Cloud cluster",
        blocks: [
          link(
            "reg",
            "https://www.mongodb.com/cloud/atlas/register",
            "MongoDB Atlas register",
            "Free M0 is enough."
          ),
          md(
            "m",
            `1. Create a free M0 cluster.
2. Database Access: a user and a password you will not lose.
3. Network Access: your IP, or 0.0.0.0/0 for learning only.
4. Connect → Drivers → copy the connection string.

It looks like:

\`\`\`
mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/harbor?retryWrites=true&w=majority
\`\`\`

The database name can be in the path (\`/harbor\`) or you pick it in code.`
          ),
          link(
            "compass",
            "https://www.mongodb.com/products/tools/compass",
            "MongoDB Compass",
            "GUI. Paste the URI. Connect."
          ),
          ytWatch(
            "v-compass",
            VID.mongoCompass,
            "Using MongoDB Compass (Net Ninja)",
            "0:00",
            "end",
            "Watch from 0:00 to the end. About 10 minutes. Create a database, a collection, insert a document."
          ),
        ],
      },
      {
        id: "insert",
        title: "Insert by hand",
        blocks: [
          md(
            "m",
            `In Compass: create database \`harbor\`, collection \`logs\`. Insert:

\`\`\`json
{
  "text": "Left port at 06:00",
  "tenantId": "learn",
  "createdAt": "2026-09-17T08:00:00.000Z"
}
\`\`\`

Look at it. That is your log. Next.js will do this from code next.`
          ),
          tasks("t", "Hands-on", [
            { id: "cluster", label: "Atlas cluster exists" },
            { id: "insert", label: "Compass shows one document in harbor.logs" },
          ]),
        ],
      },
    ],
  }),
  "moshka-api-connect": lesson({
    id: "moshka-api-connect",
    name: "Connect from Next.js",
    description: "One client. Reuse it. URI stays in .env.local.",
    sections: [
      {
        id: "env",
        title: "Secret on disk",
        blocks: [
          md(
            "m",
            `In the Next Harbor folder, create \`.env.local\` (never commit it).`
          ),
          md(
            "p",
            `\`\`\`txt:.env.local
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/harbor?retryWrites=true&w=majority
\`\`\`

Restart \`npm run dev\` after you change env files.`
          ),
          info(
            "env",
            "Secrets",
            "If you paste the URI in chat or GitHub, rotate the password in Atlas."
          ),
        ],
      },
      {
        id: "client",
        title: "The driver",
        blocks: [
          md(
            "term",
            `Run this in the terminal:

\`\`\`bash
cd ~/Desktop/next-harbor
npm install mongodb
\`\`\``
          ),
          md(
            "p",
            `\`src/lib/mongo.ts\`:

\`\`\`ts:src/lib/mongo.ts
import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI
if (!uri) throw new Error("MONGODB_URI is missing")

const globalForMongo = globalThis as unknown as { _mongo?: MongoClient }

export function getMongo() {
  if (!globalForMongo._mongo) {
    globalForMongo._mongo = new MongoClient(uri)
  }
  return globalForMongo._mongo
}

export async function getLogsCollection() {
  const client = getMongo()
  await client.connect()
  return client.db("harbor").collection("logs")
}
\`\`\`

We stash the client on \`globalThis\` so hot reload does not open 40 connections.

This file is **server only**. Do not import it from a \`"use client"\` file.`
          ),
          tasks("t", "Hands-on", [
            { id: "env", label: ".env.local exists and is not in git" },
            { id: "file", label: "src/lib/mongo.ts is on disk" },
          ]),
        ],
      },
    ],
  }),
  "moshka-api-routes": lesson({
    id: "moshka-api-routes",
    name: "API GET and POST",
    description: "Replace the memory array with Mongo find and insertOne.",
    sections: [
      {
        id: "do",
        title: "Route talks to Mongo",
        blocks: [
          md(
            "m",
            `Try first: in \`src/app/api/logs/route.ts\`, call \`getLogsCollection()\`, \`find({}).sort({ createdAt: -1 }).toArray()\` on GET, \`insertOne\` on POST.

Then hit it with curl.`
          ),
          md(
            "p",
            `Replace \`src/app/api/logs/route.ts\`:

\`\`\`ts:src/app/api/logs/route.ts
import { getLogsCollection } from "@/lib/mongo"

export const dynamic = "force-dynamic"

export async function GET() {
  const col = await getLogsCollection()
  const logs = await col
    .find({})
    .sort({ createdAt: -1 })
    .limit(50)
    .toArray()
  return Response.json(logs)
}

export async function POST(req: Request) {
  const body = (await req.json()) as { text?: string }
  const text = body.text?.trim()
  if (!text) return Response.json({ error: "text required" }, { status: 400 })
  const col = await getLogsCollection()
  const doc = {
    text,
    tenantId: "learn",
    createdAt: new Date().toISOString(),
  }
  const result = await col.insertOne(doc)
  return Response.json({ _id: result.insertedId, ...doc })
}
\`\`\``
          ),
          md(
            "term",
            `Run this in the terminal:

\`\`\`bash
curl -X POST http://localhost:3000/api/logs \\
  -H "Content-Type: application/json" \\
  -d '{"text":"Alongside berth B12"}'
curl http://localhost:3000/api/logs
\`\`\`

Then refresh Compass. The new document should be there. Restart \`npm run dev\` and GET again. Still there.`
          ),
          tasks("t", "Hands-on", [
            { id: "post", label: "A POST creates a Mongo document" },
            { id: "get", label: "Restart still returns the logs" },
          ]),
        ],
      },
    ],
  }),
  "moshka-api-actions": lesson({
    id: "moshka-api-actions",
    name: "Save with a server action",
    description: "Same insert, called from a form. revalidatePath after write.",
    sections: [
      {
        id: "do",
        title: "Form on /logs",
        blocks: [
          md(
            "m",
            `Try first: point yesterday's \`createLog\` action at Mongo instead of \`memoryLogs\`.`
          ),
          md(
            "p",
            `\`src/app/logs/actions.ts\`:

\`\`\`ts:src/app/logs/actions.ts
"use server"

import { getLogsCollection } from "@/lib/mongo"
import { revalidatePath } from "next/cache"

export async function createLog(formData: FormData) {
  const text = String(formData.get("text") ?? "").trim()
  if (!text) return { error: "text required" }
  const col = await getLogsCollection()
  await col.insertOne({
    text,
    tenantId: "learn",
    createdAt: new Date().toISOString(),
  })
  revalidatePath("/logs")
  return { ok: true }
}
\`\`\`

A server page can still load logs with the collection directly. Or keep the list on the client with Query. Both are valid. Do not import \`getLogsCollection\` in a client component.`
          ),
          tasks("t", "Hands-on", [
            { id: "form", label: "The /logs form inserts a Mongo document" },
          ]),
        ],
      },
    ],
  }),
  "moshka-api-query": lesson({
    id: "moshka-api-query",
    name: "TanStack Query on real data",
    description: "queryFn hits /api/logs. After save, invalidate.",
    sections: [
      {
        id: "do",
        title: "Client list, server source",
        blocks: [
          md(
            "m",
            `Keep \`LogList\` from Next Harbor. \`queryFn\` stays \`fetch("/api/logs")\`. Mongo is behind the route. Query does not know Mongo exists. That is good.

On save from the client:

\`\`\`tsx
"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

export function AddLog() {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: async (text: string) => {
      const res = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })
      if (!res.ok) throw new Error("save failed")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logs"] })
    },
  })
  return (
    <button type="button" onClick={() => mutation.mutate("Watch on deck")}>
      Add sample log
    </button>
  )
}
\`\`\`

\`staleTime\` can be a few seconds. Do not set a huge staleTime on live ops data.`
          ),
          tasks("t", "Hands-on", [
            { id: "inv", label: "After POST, the list refetches and shows the new line" },
          ]),
        ],
      },
    ],
  }),
  "moshka-api-zod": lesson({
    id: "moshka-api-zod",
    name: "Check the shape before you save",
    description: "Zod is a bouncer. Bad JSON does not enter Mongo.",
    sections: [
      {
        id: "do",
        title: "Parse first",
        blocks: [
          link("zod", "https://zod.dev", "Zod", "From Freesets libraries. TailoredTech uses it on APIs."),
          md(
            "term",
            `Run this in the terminal:

\`\`\`bash
cd ~/Desktop/next-harbor
npm install zod
\`\`\``
          ),
          md(
            "p",
            `\`src/lib/log-schema.ts\`:

\`\`\`ts:src/lib/log-schema.ts
import { z } from "zod"

export const logInput = z.object({
  text: z.string().trim().min(1).max(280),
})
\`\`\`

In POST, **try first** to call \`logInput.parse(body)\`. If it throws, return 400.

Paste into the route:

\`\`\`ts
import { logInput } from "@/lib/log-schema"

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = logInput.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const col = await getLogsCollection()
  const doc = {
    text: parsed.data.text,
    tenantId: "learn",
    createdAt: new Date().toISOString(),
  }
  const result = await col.insertOne(doc)
  return Response.json({ _id: result.insertedId, ...doc })
}
\`\`\`

Empty text returns 400. Nothing saved. BBS does the same idea with schemas in \`src/db/schemas\`.`
          ),
          tasks("t", "Hands-on", [
            { id: "empty", label: "Empty text returns an error, nothing saved" },
          ]),
        ],
      },
    ],
  }),
  "moshka-api-indexes": lesson({
    id: "moshka-api-indexes",
    name: "Find fast, cache correctly",
    description: "Index tenantId + createdAt. Never cache personal logs as static HTML.",
    sections: [
      {
        id: "idx",
        title: "Index",
        blocks: [
          md(
            "m",
            `In Compass, or from a one-off script, create:

\`\`\`js
db.logs.createIndex({ tenantId: 1, createdAt: -1 })
\`\`\`

Every query you run in production should be able to use an index. \`find({})\` on a huge collection is a future incident.`
          ),
        ],
      },
      {
        id: "cache",
        title: "Cache",
        blocks: [
          md(
            "m",
            `You already set \`export const dynamic = "force-dynamic"\` on the route. Keep it.

Server fetch of logs:

\`\`\`ts
await fetch("/api/logs", { cache: "no-store" })
\`\`\`

TanStack Query: \`queryKey: ["logs", tenantId]\` so tenants do not share a client cache.

Next: **Repo and service**. Stop importing Mongo from the page. That is how BBS stays readable.`
          ),
          tip("n", "Next", "Repo and service: db, repo, service folders."),
          tasks("t", "Hands-on", [
            { id: "dynamic", label: "Logs are not a cached static page" },
          ]),
        ],
      },
    ],
  }),
}
