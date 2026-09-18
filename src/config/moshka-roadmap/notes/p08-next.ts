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

export const moshkaNextNotes: Record<string, NoteDocument> = {
  "moshka-next-learn": lesson({
    id: "moshka-next-learn",
    name: "What you will learn",
    description:
      "Rebuild Harbor as Next.js App Router. Routes, server vs client, API, server actions, shadcn, Query, Zustand, cache.",
    sections: [
      {
        id: "goal",
        title: "Same product, real stack",
        blocks: [
          md(
            "g",
            `This is TailoredTech's main frontend stack.

Unzip **Next Harbor**. No node_modules in the zip. You install on your machine.

After this project you will wire Mongo, SQL, and Supabase into the same app. Do not skip install.`
          ),
          mermaid(
            "f",
            `flowchart TB
  A[app/ routes] --> U[ui components]
  U --> Q[TanStack Query]
  Q --> Z[Zustand]
  Z --> C[cache]`,
            "The stack in this zip",
            undefined,
            {
              A: "app-routes",
              U: "ui-components",
              Q: "tanstack",
              Z: "zustand",
              C: "cache",
            }
          ),
          link(
            "next-learn",
            "https://nextjs.org/docs/app/getting-started",
            "Next.js App Router getting started",
            "Official. This repo's Next is newer than old tutorials. Prefer these docs."
          ),
          tasks("t", "Start", [
            { id: "unzip", label: "Unzip Next Harbor onto your Desktop" },
          ]),
        ],
      },
    ],
    explains: [
      explain(
        "app-routes",
        "App Router",
        "app/ routes",
        `Folders under \`src/app\` are URLs. \`page.tsx\` is a route. \`layout.tsx\` wraps children. \`route.ts\` is an API.`
      ),
      explain(
        "ui-components",
        "UI",
        "ui components",
        `Buttons and inputs you reuse. Later: shadcn. Sharp corners. No purple pills.`
      ),
      explain(
        "tanstack",
        "Query",
        "TanStack Query",
        `Fetches \`/api/logs\`, caches the list, refetches after a save. The page does not own the server data.`
      ),
      explain(
        "zustand",
        "Zustand",
        "Zustand",
        `Client UI state: filters, which row is open. Not the source of truth for logs.`
      ),
      explain(
        "cache",
        "Cache",
        "cache",
        `Next cache is for public-ish data. User logs: skip or revalidate on write. Do not blindly cache private lists.`
      ),
    ],
  }),
  "moshka-next-install": lesson({
    id: "moshka-next-install",
    name: "Install and run",
    description: "Node 20+. npm install. npm run dev. Browser at localhost:3000.",
    sections: [
      {
        id: "do",
        title: "Terminal, not the browser",
        blocks: [
          md(
            "m",
            `You need Node 20 or newer. Check first.`
          ),
          md(
            "term",
            `Run this in the terminal:

\`\`\`bash
node -v
\`\`\`

If it prints v20 or v22 (or newer), you are fine. If the command is missing, install Node from https://nodejs.org then open a **new** terminal.

Then:

\`\`\`bash
cd ~/Desktop
unzip ~/Downloads/next-harbor.zip
cd next-harbor
npm install
npm run dev
\`\`\`

Leave that terminal open. Open http://localhost:3000

You should see **Next Harbor**.`
          ),
          info(
            "port",
            "Port busy",
            "If 3000 is taken, Next prints another port. Use that URL. Do not guess."
          ),
          tasks("t", "Done when", [
            { id: "install", label: "npm install finished without an error" },
            { id: "dev", label: "The home page loads in the browser" },
          ]),
        ],
      },
    ],
  }),
  "moshka-next-app-router": lesson({
    id: "moshka-next-app-router",
    name: "App Router tour",
    description: "Folders are URLs. page.tsx is a route. layout.tsx wraps children.",
    sections: [
      {
        id: "do",
        title: "Walk the files",
        blocks: [
          yt(
            "v",
            VID.next,
            "Next.js in 100 Seconds (Fireship)",
            "Watch from 0:00 to 2:10. That is the 100 seconds bit. Skip the rest of that video."
          ),
          ytWatch(
            "v2",
            VID.appRouterMistakes,
            "10 common App Router mistakes (Lee Robinson)",
            "0:00",
            "8:00",
            "App Router habits we actually use. Stop at 8:00 unless you want extra."
          ),
          md(
            "m",
            `In the zip:

- \`src/app/page.tsx\` is \`/\`
- \`src/app/logs/page.tsx\` is \`/logs\`
- \`src/app/api/health/route.ts\` is \`/api/health\`
- \`src/app/layout.tsx\` wraps every page

Try first: add \`src/app/about/page.tsx\`. Visit \`/about\`.`
          ),
          md(
            "p",
            `Create \`src/app/about/page.tsx\`:

\`\`\`tsx:src/app/about/page.tsx
export default function AboutPage() {
  return (
    <main>
      <h1>About Harbor</h1>
      <p>This route is a folder named about.</p>
    </main>
  )
}
\`\`\`

Save. The terminal running \`npm run dev\` should compile. Open http://localhost:3000/about`
          ),
          tasks("t", "Hands-on", [
            { id: "about", label: "/about renders your heading" },
          ]),
        ],
      },
    ],
  }),
  "moshka-next-server-client": lesson({
    id: "moshka-next-server-client",
    name: "Server vs client",
    description: "Default is a Server Component. use client only when you need state or a click.",
    sections: [
      {
        id: "why",
        title: "Two runtimes",
        blocks: [
          md(
            "m",
            `A Server Component runs on the server. It can read files, talk to a database, use secrets. It cannot use \`useState\` or \`onClick\`.

A Client Component starts with \`"use client"\` at the top of the file. It runs in the browser. Clicks, forms, TanStack Query, Zustand live here.

The App Router idea: keep as much as possible on the server. Push a small client leaf down for the interactive bit.`
          ),
          info(
            "client",
            "use client",
            "Only add it when you need state or a click. Default is a Server Component."
          ),
        ],
      },
      {
        id: "try",
        title: "Try first, then paste",
        blocks: [
          md(
            "p",
            `Create \`src/components/counter.tsx\`:

\`\`\`tsx:src/components/counter.tsx
"use client"

import { useState } from "react"

export function Counter() {
  const [n, setN] = useState(0)
  return (
    <button type="button" onClick={() => setN((x) => x + 1)}>
      Count {n}
    </button>
  )
}
\`\`\`

Use it from a Server Component page (\`src/app/page.tsx\` has no "use client"):

\`\`\`tsx:src/app/page.tsx
import { Counter } from "@/components/counter"

export default function Page() {
  return (
    <main>
      <h1>Next Harbor</h1>
      <Counter />
    </main>
  )
}
\`\`\`

If you put \`useState\` in \`page.tsx\` without \`"use client"\`, Next will error. Read that error. It is teaching you.`
          ),
          tasks("t", "Hands-on", [
            { id: "click", label: "The counter increments on click" },
            { id: "split", label: "page.tsx has no use client, counter.tsx does" },
          ]),
        ],
      },
    ],
  }),
  "moshka-next-api": lesson({
    id: "moshka-next-api",
    name: "API endpoints",
    description: "app/api/.../route.ts exports GET and POST. The browser calls fetch.",
    sections: [
      {
        id: "do",
        title: "Read the starter route",
        blocks: [
          md(
            "m",
            `Open \`src/app/api/health/route.ts\` and \`src/app/api/logs/route.ts\`.

Try first: open http://localhost:3000/api/health in the browser. You should see JSON.

Then POST a log with curl from the terminal.`
          ),
          md(
            "term",
            `Run this in the terminal (dev server still running in the other tab):

\`\`\`bash
curl http://localhost:3000/api/health
curl -X POST http://localhost:3000/api/logs \\
  -H "Content-Type: application/json" \\
  -d '{"text":"Left port at 06:00"}'
curl http://localhost:3000/api/logs
\`\`\``
          ),
          md(
            "p",
            `The logs route in the zip is already this shape. If you deleted it, paste:

\`\`\`ts:src/app/api/logs/route.ts
const logs = [{ id: "1", text: "Left port at 06:00" }]

export async function GET() {
  return Response.json(logs)
}

export async function POST(req: Request) {
  const body = (await req.json()) as { text?: string }
  const text = body.text?.trim()
  if (!text) return Response.json({ error: "text required" }, { status: 400 })
  const row = { id: String(Date.now()), text }
  logs.unshift(row)
  return Response.json(row)
}
\`\`\`

This array lives in memory. Restarting \`npm run dev\` wipes it. Mongo comes next.`
          ),
          tasks("t", "Hands-on", [
            { id: "get", label: "GET /api/logs returns JSON" },
            { id: "post", label: "POST adds a line you can GET back" },
          ]),
        ],
      },
    ],
  }),
  "moshka-next-actions": lesson({
    id: "moshka-next-actions",
    name: "Server actions",
    description: "A function that runs on the server, called from a form. No extra /api file required.",
    sections: [
      {
        id: "why",
        title: "When to use which",
        blocks: [
          md(
            "m",
            `**API route**: good for fetch from the client, mobile apps, webhooks, TanStack Query.

**Server action**: good for a form on a Server Component. Next posts it for you.

TailoredTech uses both. BBS uses server actions a lot for mutations, Query for lists.`
          ),
          link(
            "sa",
            "https://nextjs.org/docs/app/getting-started/mutating-data",
            "Next.js mutating data",
            "Official server actions."
          ),
        ],
      },
      {
        id: "paste",
        title: "A form that saves a log",
        blocks: [
          md(
            "m",
            `Try first: create \`src/app/logs/actions.ts\` with \`"use server"\` and a function that pushes into a shared array. Then a form with \`action={createLog}\`.`
          ),
          md(
            "p",
            `\`src/lib/memory-logs.ts\`:

\`\`\`ts:src/lib/memory-logs.ts
export const memoryLogs: { id: string; text: string }[] = [
  { id: "1", text: "Left port at 06:00" },
]
\`\`\`

\`src/app/logs/actions.ts\`:

\`\`\`ts:src/app/logs/actions.ts
"use server"

import { memoryLogs } from "@/lib/memory-logs"
import { revalidatePath } from "next/cache"

export async function createLog(formData: FormData) {
  const text = String(formData.get("text") ?? "").trim()
  if (!text) return { error: "text required" }
  memoryLogs.unshift({ id: String(Date.now()), text })
  revalidatePath("/logs")
  return { ok: true }
}
\`\`\`

\`src/app/logs/page.tsx\`:

\`\`\`tsx:src/app/logs/page.tsx
import { memoryLogs } from "@/lib/memory-logs"
import { createLog } from "./actions"

export default function LogsPage() {
  return (
    <main>
      <h1>Logs</h1>
      <form action={createLog}>
        <input name="text" placeholder="Left port at 06:00" />
        <button type="submit">Save</button>
      </form>
      <ul>
        {memoryLogs.map((row) => (
          <li key={row.id}>{row.text}</li>
        ))}
      </ul>
    </main>
  )
}
\`\`\`

Open /logs. Submit. The list should update. \`revalidatePath\` tells Next to render the page again.`
          ),
          tasks("t", "Hands-on", [
            { id: "form", label: "Submitting the form adds a log on /logs" },
          ]),
        ],
      },
    ],
  }),
  "moshka-next-shadcn": lesson({
    id: "moshka-next-shadcn",
    name: "shadcn without the slop",
    description: "Copy a Button. Keep radius sharp. No purple dashboard template.",
    sections: [
      {
        id: "do",
        title: "One component",
        blocks: [
          link("shad", "https://ui.shadcn.com", "shadcn/ui", "From Freesets components. TailoredTech uses it."),
          md(
            "m",
            `Run shadcn init in Next Harbor. Add a Button.

Keep corners sharp (this brand uses radius 0). Do not install 40 components. Add what you click.`
          ),
          md(
            "term",
            `Run this in the terminal from the Next Harbor folder (stop guessing the path):

\`\`\`bash
cd ~/Desktop/next-harbor
npx shadcn@latest init
npx shadcn@latest add button
\`\`\`

If it asks for a style, pick a plain one. Then open the generated button file and set border radius to 0 if it is rounded.`
          ),
          link(
            "magic",
            "https://magicui.design",
            "Magic UI",
            "Optional later for one animated bit. Do not dump a whole landing."
          ),
          tasks("t", "Hands-on", [
            { id: "btn", label: "A shadcn Button is on a page and you clicked it" },
          ]),
        ],
      },
    ],
  }),
  "moshka-next-query": lesson({
    id: "moshka-next-query",
    name: "TanStack Query",
    description: "Server state: fetch, cache, refetch. Not useEffect spaghetti.",
    sections: [
      {
        id: "do",
        title: "useQuery for logs",
        blocks: [
          link(
            "tq",
            "https://tanstack.com/query/latest/docs/framework/react/overview",
            "TanStack Query",
            "From Freesets libraries. BBS uses it for logs and infinite inboxes."
          ),
          md(
            "term",
            `Run this in the terminal:

\`\`\`bash
cd ~/Desktop/next-harbor
npm install @tanstack/react-query
\`\`\``
          ),
          md(
            "p",
            `Provider in \`src/app/providers.tsx\`:

\`\`\`tsx:src/app/providers.tsx
"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient())
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
\`\`\`

Wrap children in \`src/app/layout.tsx\` with \`<Providers>\`.

Then a client list:

\`\`\`tsx:src/components/log-list.tsx
"use client"

import { useQuery } from "@tanstack/react-query"

export function LogList() {
  const { data, isPending, error } = useQuery({
    queryKey: ["logs"],
    queryFn: async () => {
      const res = await fetch("/api/logs")
      if (!res.ok) throw new Error("failed")
      return res.json() as Promise<{ id: string; text: string }[]>
    },
  })
  if (isPending) return <p>Loading logs…</p>
  if (error) return <p>Could not load logs.</p>
  return (
    <ul>
      {data.map((row) => (
        <li key={row.id}>{row.text}</li>
      ))}
    </ul>
  )
}
\`\`\`

After POST, \`queryClient.invalidateQueries({ queryKey: ["logs"] })\`.`
          ),
          tasks("t", "Hands-on", [
            { id: "list", label: "Logs load with useQuery" },
            { id: "inv", label: "Create invalidates and the list updates" },
          ]),
        ],
      },
    ],
  }),
  "moshka-next-zustand": lesson({
    id: "moshka-next-zustand",
    name: "Zustand for client state",
    description: "UI state: which row is open, which role is selected. Not the database.",
    sections: [
      {
        id: "do",
        title: "Tiny store",
        blocks: [
          link("z", "https://zustand.docs.pmnd.rs", "Zustand", "From Freesets. Simple store."),
          md(
            "term",
            `Run this in the terminal:

\`\`\`bash
cd ~/Desktop/next-harbor
npm install zustand
\`\`\``
          ),
          md(
            "m",
            `Query is for server data. Zustand is for "drawer open" and "current role".`
          ),
          md(
            "p",
            `\`src/store/ui.ts\`:

\`\`\`ts:src/store/ui.ts
import { create } from "zustand"

type Role = "crew" | "office" | "admin"

export const useUi = create<{
  role: Role
  setRole: (role: Role) => void
}>((set) => ({
  role: "office",
  setRole: (role) => set({ role }),
}))
\`\`\`

Read it from two components. If both update when you click, the store works.`
          ),
          tasks("t", "Hands-on", [
            { id: "role", label: "Role lives in Zustand and two components read it" },
          ]),
        ],
      },
    ],
  }),
  "moshka-next-cache": lesson({
    id: "moshka-next-cache",
    name: "Next.js caching without magic",
    description: "fetch cache, revalidate, and when to skip cache for user data.",
    sections: [
      {
        id: "do",
        title: "Know what is cached",
        blocks: [
          link(
            "cache",
            "https://nextjs.org/docs/app/guides/caching",
            "Next.js caching guide",
            "Official. Read the diagrams, then come back."
          ),
          md(
            "m",
            `Public marketing pages can cache.

Harbor logs are per user. Use \`cache: "no-store"\` or a route that is dynamic.

If a page looks stuck on old data, you cached something personal. That is the bug.

In a server fetch:

\`\`\`ts
await fetch("http://localhost:3000/api/logs", { cache: "no-store" })
\`\`\`

In a Route Handler you can also:

\`\`\`ts
export const dynamic = "force-dynamic"
\`\`\`

TanStack Query has its own cache in the browser. That is separate from Next's server cache. Invalidate Query after a POST. Call \`revalidatePath\` after a server action.`
          ),
          tip("n", "Next", "Mongo Harbor: the same GET and POST, but the data survives restart."),
          tasks("t", "Hands-on", [
            { id: "dynamic", label: "Logs route is not serving a stale public cache" },
          ]),
        ],
      },
    ],
  }),
}
