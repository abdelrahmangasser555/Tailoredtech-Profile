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

export const moshkaSqlNotes: Record<string, NoteDocument> = {
  "moshka-sql-learn": lesson({
    id: "moshka-sql-learn",
    name: "What you will learn",
    description:
      "Postgres tables with Next.js: schema, queries, API, server actions, TanStack Query, cache.",
    sections: [
      {
        id: "goal",
        title: "Same Harbor, tables",
        blocks: [
          md(
            "g",
            `Mongo was documents. SQL is rows in tables. TailoredTech still meets SQL on clients (reports, finance, some Azure shops).

You will run Postgres, create a \`logs\` table, talk to it from Next with \`pg\`, keep the repo/service split, and wire Query plus cache the same way as Mongo.`
          ),
          mermaid(
            "f",
            `flowchart LR
  P[Page / Query] --> A[API]
  F[Form] --> S[Action]
  A --> V[service]
  S --> V
  V --> R[repo]
  R --> PG[Postgres]`,
            "Same spine, SQL at the bottom",
            undefined,
            {
              P: "page-query",
              A: "api",
              F: "form",
              S: "action",
              V: "service",
              R: "repo",
              PG: "postgres",
            }
          ),
          tasks("t", "Start", [
            { id: "layers", label: "You still have src/repo and src/services from the last project" },
          ]),
        ],
      },
    ],
    explains: [
      explain(
        "page-query",
        "Page",
        "Page / Query",
        `The page still uses TanStack Query. It does not know if the rows live in Mongo or Postgres.`
      ),
      explain(
        "api",
        "API",
        "API",
        `GET JSON. Same URL shape as Mongo Harbor. The driver changes behind the service.`
      ),
      explain(
        "form",
        "Form",
        "Form",
        `Submit still hits a server action. The captain does not write SQL in the browser.`
      ),
      explain(
        "action",
        "Action",
        "Action",
        `Server only. Calls the service. The service does not care which page submitted.`
      ),
      explain(
        "service",
        "Service",
        "service",
        `Product rules: trim text, require tenant. Then call the repo.`
      ),
      explain(
        "repo",
        "Repo",
        "repo",
        `SQL lives here. \`INSERT\`, \`SELECT\`. Swap Mongo for \`pg\` without rewriting the page.`
      ),
      explain(
        "postgres",
        "Postgres",
        "Postgres",
        `Tables, rows, types. Run it in Docker for this project. Neon is fine if Docker is blocked.`
      ),
    ],
  }),
  "moshka-sql-what": lesson({
    id: "moshka-sql-what",
    name: "Tables, rows, joins",
    description: "A table is a grid. A row is one log. A join connects tables by keys.",
    sections: [
      {
        id: "do",
        title: "SQL in a short video",
        blocks: [
          yt(
            "v",
            VID.sql,
            "SQL Explained in 100 Seconds (Fireship)",
            "Watch from 0:00 to the end. About 2 minutes."
          ),
          ytWatch(
            "v-long",
            VID.sqlBro,
            "SQL full course (Bro Code)",
            "0:00",
            "45:00",
            "Intro, tables, and SELECT. Stop at 45:00. The rest of the course is extra for later."
          ),
          md(
            "m",
            `Harbor in SQL:

\`\`\`sql
CREATE TABLE logs (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
);
\`\`\`

Each line is a **column**. Each saved log is a **row**.

A join (later, not today): \`users\` has \`id\`. \`logs.user_id\` points at it. SQL stitches them.

Mongo would nest the user inside the log. SQL prefers two tables. Neither is magic. Pick what the client already has, or what the shape of the data wants.`
          ),
          tasks("t", "Check", [
            { id: "row", label: "You can say table, row, column, primary key" },
          ]),
        ],
      },
    ],
  }),
  "moshka-sql-postgres": lesson({
    id: "moshka-sql-postgres",
    name: "Run Postgres",
    description: "Docker is the least painful local install. Neon is fine if Docker is blocked.",
    sections: [
      {
        id: "watch",
        title: "What Postgres is",
        blocks: [
          yt(
            "v",
            VID.postgres,
            "PostgreSQL in 100 Seconds (Fireship)",
            "Watch from 0:00 to the end. About 2:37."
          ),
          ytWatch(
            "v-long",
            VID.sqlBro,
            "SQL full course (Bro Code)",
            "45:00",
            "1:10:00",
            "INSERT and the rest of basic CRUD. Stop at 1:10:00. You will run the same ideas against Postgres."
          ),
          link(
            "pg",
            "https://www.postgresql.org/download/",
            "Postgres downloads",
            "Official. Prefer Docker for this lesson."
          ),
        ],
      },
      {
        id: "docker",
        title: "Docker command",
        blocks: [
          md(
            "m",
            `Install Docker Desktop if you do not have it. Then run Postgres.`
          ),
          md(
            "term",
            `Run this in the terminal:

\`\`\`bash
docker run --name harbor-pg -e POSTGRES_PASSWORD=harbor -e POSTGRES_DB=harbor -p 5432:5432 -d postgres:16
\`\`\`

Check it:

\`\`\`bash
docker ps
\`\`\`

You should see \`harbor-pg\` running.

If Docker is not an option, create a free database on https://neon.tech and use that connection string instead.`
          ),
          info(
            "port",
            "Port 5432",
            "If something else uses 5432, change \`-p 5433:5432\` and put 5433 in the URL."
          ),
          tasks("t", "Hands-on", [
            { id: "up", label: "Postgres is running (docker ps or Neon dashboard)" },
          ]),
        ],
      },
    ],
  }),
  "moshka-sql-schema": lesson({
    id: "moshka-sql-schema",
    name: "Create the logs table",
    description: "One CREATE TABLE. Then INSERT and SELECT by hand.",
    sections: [
      {
        id: "do",
        title: "psql inside the container",
        blocks: [
          md(
            "term",
            `Run this in the terminal:

\`\`\`bash
docker exec -it harbor-pg psql -U postgres -d harbor
\`\`\`

You should see a \`harbor=#\` prompt. Then paste (this is still the terminal, inside psql):

\`\`\`sql
CREATE TABLE logs (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX logs_tenant_created ON logs (tenant_id, created_at DESC);

INSERT INTO logs (id, text, tenant_id)
VALUES ('1', 'Left port at 06:00', 'learn');

SELECT * FROM logs;
\`\`\`

Type \`\\q\` to leave psql.`
          ),
          md(
            "m",
            `If you use Neon, open the SQL editor in the dashboard and run the same \`CREATE TABLE\` / \`INSERT\` / \`SELECT\`.`
          ),
          tasks("t", "Hands-on", [
            { id: "select", label: "SELECT shows the sample row" },
          ]),
        ],
      },
    ],
  }),
  "moshka-sql-connect": lesson({
    id: "moshka-sql-connect",
    name: "Connect from Next.js",
    description: "pg Pool. DATABASE_URL in .env.local. Server only.",
    sections: [
      {
        id: "do",
        title: "Pool",
        blocks: [
          md(
            "term",
            `Run this in the terminal:

\`\`\`bash
cd ~/Desktop/next-harbor
npm install pg
npm install -D @types/pg
\`\`\``
          ),
          md(
            "p",
            `Add to \`.env.local\`:

\`\`\`txt:.env.local
DATABASE_URL=postgres://postgres:harbor@localhost:5432/harbor
\`\`\`

Neon URLs look different. Paste the one they give you.

\`src/db/postgres.ts\`:

\`\`\`ts:src/db/postgres.ts
import { Pool } from "pg"

const url = process.env.DATABASE_URL
if (!url) throw new Error("DATABASE_URL is missing")

const globalForPg = globalThis as unknown as { _pg?: Pool }

export function getPool() {
  if (!globalForPg._pg) {
    globalForPg._pg = new Pool({ connectionString: url })
  }
  return globalForPg._pg
}
\`\`\`

Restart \`npm run dev\` after env changes.`
          ),
          tasks("t", "Hands-on", [
            { id: "env", label: "DATABASE_URL is in .env.local" },
          ]),
        ],
      },
    ],
  }),
  "moshka-sql-api": lesson({
    id: "moshka-sql-api",
    name: "API endpoints",
    description: "Repo uses SQL. Route stays thin. Same /api/logs the frontend already calls.",
    sections: [
      {
        id: "do",
        title: "SQL repo",
        blocks: [
          md(
            "p",
            `\`src/repo/logs-sql.repo.ts\`:

\`\`\`ts:src/repo/logs-sql.repo.ts
import { getPool } from "@/db/postgres"
import { randomUUID } from "crypto"

export async function listLogsSql(tenantId: string) {
  const pool = getPool()
  const result = await pool.query(
    \`SELECT id, text, tenant_id AS "tenantId", created_at AS "createdAt"
     FROM logs
     WHERE tenant_id = $1
     ORDER BY created_at DESC
     LIMIT 50\`,
    [tenantId]
  )
  return result.rows
}

export async function insertLogSql(input: { text: string; tenantId: string }) {
  const pool = getPool()
  const id = randomUUID()
  const result = await pool.query(
    \`INSERT INTO logs (id, text, tenant_id)
     VALUES ($1, $2, $3)
     RETURNING id, text, tenant_id AS "tenantId", created_at AS "createdAt"\`,
    [id, input.text, input.tenantId]
  )
  return result.rows[0]
}
\`\`\`

\`$1, $2\` are **parameters**. Do not glue user text into the SQL string. That is how SQL injection happens.

Point \`listHarborLogs\` / \`createHarborLog\` at these functions, or add a \`?db=sql\` flag. Simplest: switch the service to call the SQL repo for this project.

Keep \`export const dynamic = "force-dynamic"\` on the route.`
          ),
          md(
            "term",
            `Run this in the terminal:

\`\`\`bash
curl http://localhost:3000/api/logs
curl -X POST http://localhost:3000/api/logs \\
  -H "Content-Type: application/json" \\
  -d '{"text":"SQL save"}'
\`\`\``
          ),
          tasks("t", "Hands-on", [
            { id: "get", label: "GET returns the row you inserted in psql" },
            { id: "post", label: "POST adds a row you can SELECT in psql" },
          ]),
        ],
      },
    ],
  }),
  "moshka-sql-actions": lesson({
    id: "moshka-sql-actions",
    name: "Server actions",
    description: "The form still calls createLog. The service now writes SQL.",
    sections: [
      {
        id: "do",
        title: "No change to the form if the service moved",
        blocks: [
          md(
            "m",
            `If \`createHarborLog\` already calls the repo, switching repo implementation is enough. The action stays:

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

Open /logs. Submit. \`SELECT * FROM logs;\` in psql should show the new row.

That is the repo/service payoff: the form did not need a rewrite.`
          ),
          tasks("t", "Hands-on", [
            { id: "form", label: "The /logs form writes a Postgres row" },
          ]),
        ],
      },
    ],
  }),
  "moshka-sql-query": lesson({
    id: "moshka-sql-query",
    name: "TanStack Query and cache",
    description: "Same queryKey. Same invalidate. SQL is behind the API.",
    sections: [
      {
        id: "do",
        title: "Client does not know SQL",
        blocks: [
          md(
            "m",
            `\`LogList\` still:

\`\`\`ts
useQuery({
  queryKey: ["logs"],
  queryFn: () => fetch("/api/logs").then((r) => r.json()),
})
\`\`\`

After a client POST, \`invalidateQueries({ queryKey: ["logs"] })\`.

Do not cache this fetch as static. Logs are live data.

\`\`\`ts
export const dynamic = "force-dynamic"
\`\`\`

If you add \`tenantId\` later, put it in the queryKey: \`["logs", tenantId]\`.`
          ),
          tip("n", "Next", "Supabase Harbor: hosted Postgres plus auth helpers."),
          tasks("t", "Hands-on", [
            { id: "list", label: "The Query list shows SQL rows" },
          ]),
        ],
      },
    ],
  }),
}
