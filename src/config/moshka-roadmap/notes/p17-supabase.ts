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

export const moshkaSbNotes: Record<string, NoteDocument> = {
  "moshka-sb-learn": lesson({
    id: "moshka-sb-learn",
    name: "What you will learn",
    description:
      "Supabase is hosted Postgres plus auth and APIs. You will wire it into Next.js the TailoredTech way.",
    sections: [
      {
        id: "goal",
        title: "Not a new language",
        blocks: [
          md(
            "g",
            `Supabase is Postgres you do not host, plus a dashboard, plus auth, plus auto APIs.

TailoredTech still often uses Mongo + custom auth. Some products and prototypes use Supabase. You need to know it so you do not freeze when a client already has it, and so AI tools do not invent a random Firebase clone.

You will: create a project, make a \`logs\` table, use the **server** client in routes and actions, respect RLS, keep TanStack Query on the frontend.`
          ),
          mermaid(
            "f",
            `flowchart LR
  N[Next app] --> S[Supabase server client]
  S --> P[Postgres]
  N --> Q[TanStack Query]
  Q --> A[/api/logs]
  A --> S`,
            "Hosted Postgres, our layers",
            undefined,
            {
              N: "next-app",
              S: "sb-client",
              P: "postgres",
              Q: "tanstack",
              A: "api-logs",
            }
          ),
          tasks("t", "Start", [
            { id: "sql", label: "You already created a logs table in SQL Harbor" },
          ]),
        ],
      },
    ],
    explains: [
      explain(
        "next-app",
        "Next",
        "Next app",
        `Same Harbor UI. Query on the client. Routes and actions on the server.`
      ),
      explain(
        "sb-client",
        "Client",
        "Supabase server client",
        `Use the server client in routes and actions. Do not put the service role key in a client component.`
      ),
      explain(
        "postgres",
        "Postgres",
        "Postgres",
        `Still SQL. The dashboard is a nicer shell around the same tables.`
      ),
      explain(
        "tanstack",
        "Query",
        "TanStack Query",
        `Still fetches our \`/api/logs\`. We wrap Supabase so tenant rules stay in our code.`
      ),
      explain(
        "api-logs",
        "API",
        "/api/logs",
        `Our route. Calls the repo. The repo talks to Supabase. The page never imports the Supabase client.`
      ),
    ],
  }),
  "moshka-sb-what": lesson({
    id: "moshka-sb-what",
    name: "What Supabase actually is",
    description: "Postgres. Auth. Storage. Dashboard. You still write SQL.",
    sections: [
      {
        id: "do",
        title: "Short video",
        blocks: [
          yt(
            "v",
            VID.supabase,
            "Supabase in 100 Seconds (Fireship)",
            "Watch from 0:00 to the end. About 2:36."
          ),
          ytWatch(
            "v-long",
            VID.sqlBro,
            "SQL full course (Bro Code)",
            "0:00",
            "20:00",
            "Supabase is still SQL. Rewatch tables and SELECT if that felt thin. Stop at 20:00."
          ),
          md(
            "m",
            `Pieces you will touch:

- **Database**: Postgres. Same SQL as last project.
- **Auth**: email, OAuth. Similar job to Clerk, not the same product.
- **Auto API**: PostgREST. Convenient. In agency work we still often wrap it in our own Next route so we can add tenant rules.
- **RLS**: Row Level Security. SQL policies that decide who can read a row.

What it is not: a reason to skip \`src/repo\`. Keep our layers. Call Supabase from the repo, not from a random button.`
          ),
          link(
            "docs",
            "https://supabase.com/docs/guides/getting-started/quickstarts/nextjs",
            "Supabase Next.js quickstart",
            "Official. Use the App Router section."
          ),
          tasks("t", "Check", [
            { id: "pg", label: "You can say Supabase is Postgres plus extras" },
          ]),
        ],
      },
    ],
  }),
  "moshka-sb-project": lesson({
    id: "moshka-sb-project",
    name: "Create a project",
    description: "Dashboard. URL. anon key. service role key stays on the server.",
    sections: [
      {
        id: "do",
        title: "Keys",
        blocks: [
          link("app", "https://supabase.com/dashboard", "Supabase dashboard", "Create a free project."),
          md(
            "m",
            `Create a project. Region close to you is fine.

Project Settings → API:

- **Project URL** → \`NEXT_PUBLIC_SUPABASE_URL\`
- **anon public** → \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`
- **service_role** → \`SUPABASE_SERVICE_ROLE_KEY\` (server only, never \`NEXT_PUBLIC_\`)

The anon key is allowed in the browser **only** if RLS is on. The service role bypasses RLS. Treat it like \`MONGODB_URI\`.`
          ),
          md(
            "p",
            `\`.env.local\`:

\`\`\`txt:.env.local
NEXT_PUBLIC_SUPABASE_URL=https://YOUR.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
\`\`\`

Restart \`npm run dev\` after saving.`
          ),
          tasks("t", "Hands-on", [
            { id: "keys", label: "Three env vars are set. Service role is not NEXT_PUBLIC" },
          ]),
        ],
      },
    ],
  }),
  "moshka-sb-tables": lesson({
    id: "moshka-sb-tables",
    name: "Tables in the dashboard",
    description: "Same logs table. SQL editor or table UI.",
    sections: [
      {
        id: "do",
        title: "SQL editor",
        blocks: [
          md(
            "m",
            `In the dashboard: SQL Editor. Run:`
          ),
          md(
            "p",
            `\`\`\`sql
CREATE TABLE logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX logs_tenant_created ON logs (tenant_id, created_at DESC);

INSERT INTO logs (text, tenant_id)
VALUES ('Left port at 06:00', 'learn');
\`\`\`

Table Editor should show one row. This is the same mental model as Docker Postgres. Only the host changed.`
          ),
          tasks("t", "Hands-on", [
            { id: "row", label: "Table Editor shows the sample log" },
          ]),
        ],
      },
    ],
  }),
  "moshka-sb-client": lesson({
    id: "moshka-sb-client",
    name: "Server client vs browser client",
    description: "Server client for routes and actions. Browser client only with RLS.",
    sections: [
      {
        id: "do",
        title: "Install",
        blocks: [
          md(
            "term",
            `Run this in the terminal:

\`\`\`bash
cd ~/Desktop/next-harbor
npm install @supabase/supabase-js @supabase/ssr
\`\`\``
          ),
          md(
            "p",
            `Server helper \`src/db/supabase.ts\`:

\`\`\`ts:src/db/supabase.ts
import { createClient } from "@supabase/supabase-js"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const service = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !service) throw new Error("Supabase env missing")

export function getSupabaseService() {
  return createClient(url, service, {
    auth: { persistSession: false },
  })
}
\`\`\`

This uses the service role. Fine for a learning app with no user login yet. After auth exists, prefer the user-scoped client so RLS applies.

Do not import this file in a client component.`
          ),
          info(
            "ssr",
            "@supabase/ssr",
            "Cookie session helpers are for when you add Supabase Auth. Skip them until Who are you."
          ),
          tasks("t", "Hands-on", [
            { id: "file", label: "src/db/supabase.ts exists" },
          ]),
        ],
      },
    ],
  }),
  "moshka-sb-rls": lesson({
    id: "moshka-sb-rls",
    name: "Row Level Security",
    description: "Postgres policies. Default deny. Then allow tenant rows.",
    sections: [
      {
        id: "do",
        title: "Turn it on",
        blocks: [
          md(
            "m",
            `Without RLS, the anon key can read the whole table from the browser. That is not ok.

In SQL Editor:`
          ),
          md(
            "p",
            `\`\`\`sql
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service or none"
ON logs
FOR ALL
TO anon
USING (false);
\`\`\`

That policy means the **anon** role cannot read or write. Your Next **service role** still can, because it bypasses RLS.

For a real user-aware app you would write \`USING (tenant_id = auth.jwt() ->> 'tenant_id')\` or similar. Learn the idea: the database enforces the wall, not only your route.`
          ),
          tasks("t", "Hands-on", [
            { id: "rls", label: "RLS is enabled on logs" },
          ]),
        ],
      },
    ],
  }),
  "moshka-sb-wire": lesson({
    id: "moshka-sb-wire",
    name: "API, actions, Query",
    description: "Repo calls Supabase. Route, action, and Query stay the same shape.",
    sections: [
      {
        id: "do",
        title: "Repo",
        blocks: [
          md(
            "p",
            `\`src/repo/logs-supabase.repo.ts\`:

\`\`\`ts:src/repo/logs-supabase.repo.ts
import { getSupabaseService } from "@/db/supabase"

export async function listLogsSb(tenantId: string) {
  const sb = getSupabaseService()
  const { data, error } = await sb
    .from("logs")
    .select("id, text, tenant_id, created_at")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .limit(50)
  if (error) throw error
  return (data ?? []).map((row) => ({
    _id: row.id,
    text: row.text,
    tenantId: row.tenant_id,
    createdAt: row.created_at,
  }))
}

export async function insertLogSb(input: { text: string; tenantId: string }) {
  const sb = getSupabaseService()
  const { data, error } = await sb
    .from("logs")
    .insert({ text: input.text, tenant_id: input.tenantId })
    .select("id, text, tenant_id, created_at")
    .single()
  if (error) throw error
  return {
    _id: data.id,
    text: data.text,
    tenantId: data.tenant_id,
    createdAt: data.created_at,
  }
}
\`\`\`

Point the service at these functions. Keep \`createHarborLog\` Zod check.

Route GET/POST and \`createLog\` action stay thin.

TanStack Query still uses \`queryKey: ["logs"]\` and \`fetch("/api/logs")\`.`
          ),
          md(
            "term",
            `Run this in the terminal:

\`\`\`bash
curl http://localhost:3000/api/logs
curl -X POST http://localhost:3000/api/logs \\
  -H "Content-Type: application/json" \\
  -d '{"text":"Supabase save"}'
\`\`\`

Refresh Table Editor. The new row should be there.`
          ),
          tasks("t", "Hands-on", [
            { id: "post", label: "POST shows up in the Supabase table" },
            { id: "query", label: "The Query list on /logs shows it too" },
          ]),
        ],
      },
    ],
  }),
  "moshka-sb-cache": lesson({
    id: "moshka-sb-cache",
    name: "Cache and when not to",
    description: "No static cache for tenant logs. Invalidate Query after writes.",
    sections: [
      {
        id: "do",
        title: "Same rules as Mongo and SQL",
        blocks: [
          md(
            "m",
            `Supabase has its own cache story. Ignore it for Harbor logs.

On the Next side:

- Route: \`export const dynamic = "force-dynamic"\`
- Server fetch: \`cache: "no-store"\`
- Action: \`revalidatePath("/logs")\`
- Client: \`invalidateQueries({ queryKey: ["logs"] })\`

Do not put \`NEXT_PUBLIC_\` on the service role even if a tutorial did.

**Next:** Who are you. Auth sits on top of whichever database you kept.`
          ),
          tip("n", "Next", "Who are you: sessions, Clerk/WorkOS, tenants."),
          tasks("t", "Hands-on", [
            { id: "fresh", label: "A new log appears without a hard refresh after invalidate or revalidate" },
          ]),
        ],
      },
    ],
  }),
}
