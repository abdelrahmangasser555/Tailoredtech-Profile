import {
  explain,
  figLink,
  figureN,
  info,
  lesson,
  link,
  md,
  mermaid,
  tasks,
  tip,
  beforeYouStart,
  VID,
  watchPair,
  ytWatch,
} from "@/config/moshka-roadmap/helpers"
import type { NoteDocument } from "@/lib/notes-types"

export const moshkaAuthNotes: Record<string, NoteDocument> = {
  "moshka-auth-learn": lesson({
    id: "moshka-auth-learn",
    name: "What you will learn",
    description: "Who is this person, and which company do they belong to.",
    sections: [
      {
        id: "goal",
        title: "Identity is a product",
        blocks: [
          beforeYouStart(
            "plan",
            "Learn who the user is, which company they belong to, and what they may access.",
            "You can explain session, tenant, and role in plain words.",
            []
          ),
          ...figureN(
            1,
            "auth-doors",
            "moshka-auth-doors.png",
            "Sign-in and tenant",
            `Different clients sign in different ways, then hit a tenant wall on data. ${figLink(1, "auth-doors")} is the mental model.`
          ),
          md(
            "g",
            `Auth is not a login form. It is:
- proving who you are
- remembering you (session)
- knowing your tenant (Bahri vs another client)
- roles (crew vs office)

TailoredTech mixes custom auth and SaaS (Clerk, WorkOS) depending on the client.

You already have a database. Auth sits in front of GET/POST.`
          ),
          ...watchPair(
            {
              blockId: "v-auth",
              url: VID.js,
              title: "JavaScript in 100 Seconds (Fireship)",
              caption: "Refresh: auth routes are still JavaScript on the server.",
            },
            {
              blockId: "v-auth-api",
              url: VID.jsFetchWds,
              title: "Learn fetch API (Web Dev Simplified)",
              from: "0:00",
              to: "6:00",
              why: "Login and session cookies often ride on fetch. Quick primer before API lessons.",
            }
          ),
          link(
            "owasp",
            "https://owasp.org/www-project-top-ten/",
            "OWASP Top 10",
            "What security reviewers worry about. Skim the list, do not memorize."
          ),
          ytWatch(
            "v-next-auth",
            VID.nextNinja,
            "Next.js course (Net Ninja)",
            "0:00",
            "25:00",
            "Auth patterns in Next when you reach Next Harbor. Optional preview only."
          ),
          mermaid(
            "f",
            `flowchart LR
  U[User] --> S[Sign in]
  S --> T[Tenant]
  T --> R[Role]
  R --> P[Page they may see]`,
            "Auth in four words",
            undefined,
            {
              U: "user",
              S: "sign-in",
              T: "tenant",
              R: "role",
              P: "page",
            }
          ),
          tasks("t", "Start", [
            { id: "vocab", label: "You can say user, session, tenant, role out loud" },
          ]),
        ],
      },
    ],
    explains: [
      explain(
        "user",
        "User",
        "User",
        `A person with an account. Not the same as a tenant. One tenant has many users.`
      ),
      explain(
        "sign-in",
        "Sign in",
        "Sign in",
        `Password, magic link, Microsoft, OTP. Pick per client. After this you have a session.`
      ),
      explain(
        "tenant",
        "Tenant",
        "Tenant",
        `Bahri vs another company. Almost every collection is scoped to \`tenantId\`. Never mix them.`
      ),
      explain(
        "role",
        "Role",
        "Role",
        `Crew vs office vs admin. Same tenant, different pages.`
      ),
      explain(
        "page",
        "Page",
        "Page they may see",
        `Middleware and server checks. If the cookie is missing, \`/logs\` redirects. Public pages stay public.`
      ),
    ],
  }),
  "moshka-auth-ways": lesson({
    id: "moshka-auth-ways",
    name: "Ways people sign in",
    description: "Password, magic link, Microsoft, OTP. Pick per client.",
    sections: [
      {
        id: "do",
        title: "Menu of doors",
        blocks: [
          md(
            "m",
            `**Password**: simple, you own it, you get reset-email pain.

**Magic link / OTP**: nicer on phones. BBS uses email OTP in places.

**Microsoft / Google**: enterprise loves "sign in with our company". Azure tenant integration.

Write three lines in a comment at the top of \`src/app/page.tsx\`: which Harbor user would use which door. That is the exercise. Not a new library yet.`
          ),
          tasks("t", "Hands-on", [
            { id: "paper", label: "You listed 3 sign-in ways and who they fit" },
          ]),
        ],
      },
    ],
  }),
  "moshka-auth-session": lesson({
    id: "moshka-auth-session",
    name: "Cookies and sessions",
    description: "The browser holds a cookie. The server trusts it until it expires.",
    sections: [
      {
        id: "do",
        title: "A cookie the server sets",
        blocks: [
          md(
            "m",
            `After sign in, the server sets an HTTP-only cookie. JavaScript should not read the raw secret.

Toy version for Harbor (not production): a route that sets a cookie, and POST /api/logs that rejects if it is missing.`
          ),
          md(
            "p",
            `\`src/app/api/login/route.ts\`:

\`\`\`ts:src/app/api/login/route.ts
import { NextResponse } from "next/server"

export async function POST() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set("harbor_session", "learn-user", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  })
  return res
}
\`\`\`

Call it from the terminal, then POST a log with the cookie jar.`
          ),
          md(
            "term",
            `Run this in the terminal:

\`\`\`bash
curl -c /tmp/harbor-cookies -X POST http://localhost:3000/api/login
curl -b /tmp/harbor-cookies -X POST http://localhost:3000/api/logs \\
  -H "Content-Type: application/json" \\
  -d '{"text":"with cookie"}'
\`\`\`

Real apps use signed JWTs or server sessions (BBS uses auth.js / NextAuth style). This toy only teaches the cookie round trip.`
          ),
          info(
            "http",
            "HTTP-only",
            "If JS can read the cookie, XSS can steal the account."
          ),
          tasks("t", "Hands-on", [
            { id: "login", label: "POST /api/login sets a cookie" },
          ]),
        ],
      },
    ],
  }),
  "moshka-auth-protect": lesson({
    id: "moshka-auth-protect",
    name: "Protect a route",
    description: "No cookie, no insert. GET can stay public for learning or not.",
    sections: [
      {
        id: "do",
        title: "Read the cookie in POST",
        blocks: [
          md(
            "m",
            `Try first: in POST, read cookies. If \`harbor_session\` is missing, return 401.`
          ),
          md(
            "p",
            `Inside \`POST\` in \`src/app/api/logs/route.ts\`:

\`\`\`ts:src/app/api/logs/route.ts
import { cookies } from "next/headers"

export async function POST(req: Request) {
  const session = (await cookies()).get("harbor_session")?.value
  if (!session) {
    return Response.json({ error: "unauthorized" }, { status: 401 })
  }
  const body = await req.json()
  const result = await createHarborLog(body)
  if (!result.ok) return Response.json({ error: result.error }, { status: 400 })
  return Response.json(result.row)
}
\`\`\``
          ),
          md(
            "term",
            `Run this in the terminal:

\`\`\`bash
curl -X POST http://localhost:3000/api/logs \\
  -H "Content-Type: application/json" \\
  -d '{"text":"no cookie"}'
\`\`\`

You should get 401. Then retry with \`-b /tmp/harbor-cookies\`.`
          ),
          tasks("t", "Hands-on", [
            { id: "block", label: "POST without a cookie fails" },
            { id: "ok", label: "POST with the cookie works" },
          ]),
        ],
      },
    ],
  }),
  "moshka-auth-saas": lesson({
    id: "moshka-auth-saas",
    name: "Clerk, WorkOS, or custom",
    description: "Buy the door when the client needs SSO. Build it when you must.",
    sections: [
      {
        id: "do",
        title: "When to buy",
        blocks: [
          link("clerk", "https://clerk.com/docs", "Clerk docs", "SaaS auth. Fast for product apps."),
          link("workos", "https://workos.com/docs", "WorkOS docs", "Enterprise SSO, directories."),
          md(
            "m",
            `**Custom**: full control, more code, more ways to get hacked.

**Clerk**: great DX, hosted UI. Some enterprises say no to a third party on the login.

**WorkOS**: when the client wants SAML / Microsoft Entra.

TailoredTech chooses per contract. You do not pick a favorite religion.

If you want to try Clerk later, their Next.js App Router guide is the one to follow. Do not mix Clerk and the toy cookie in the same route without deleting the toy.`
          ),
          tasks("t", "Check", [
            { id: "say", label: "You can explain one reason to use WorkOS over a homemade form" },
          ]),
        ],
      },
    ],
  }),
  "moshka-auth-tenant": lesson({
    id: "moshka-auth-tenant",
    name: "Tenants like a real client",
    description: "Bahri data never mixes with another company. tenantId on every document.",
    sections: [
      {
        id: "do",
        title: "Walls",
        blocks: [
          md(
            "m",
            `You already store \`tenantId\`. Stop hardcoding \`"learn"\` in the service. Read it from the session.

Toy: cookie value is the tenant id.`
          ),
          md(
            "p",
            `Change \`listHarborLogs\` / \`createHarborLog\` to take \`tenantId: string\`. In the route:

\`\`\`ts
const tenantId = (await cookies()).get("harbor_session")?.value
if (!tenantId) return Response.json({ error: "unauthorized" }, { status: 401 })
const logs = await listLogs(tenantId)
\`\`\`

BBS: almost every collection is scoped to \`tenantId\`. Super admins jump tenants with a header. Office users never see another company.

Azure tenant integration: the client's Microsoft directory is the source of users. Your app maps those users into your tenant document.`
          ),
          mermaid(
            "t",
            `flowchart TB
  B[Bahri tenant] --> L1[logs]
  X[Other client] --> L2[logs]
  L1 -.->|never| L2`,
            "Tenants do not mix",
            undefined,
            {
              B: "bahri",
              L1: "bahri-logs",
              X: "other",
              L2: "other-logs",
            }
          ),
          tasks("t", "Hands-on", [
            { id: "field", label: "Logs store tenantId" },
            { id: "filter", label: "GET only returns the current tenant" },
          ]),
        ],
      },
    ],
    explains: [
      explain(
        "bahri",
        "Bahri",
        "Bahri tenant",
        `One company record. Users, logs, and settings hang off this id.`
      ),
      explain(
        "bahri-logs",
        "Logs",
        "Bahri logs",
        `Every log row has \`tenantId\` for Bahri. GET filters by the session tenant.`
      ),
      explain(
        "other",
        "Other",
        "Other client",
        `A second company. Super admins can jump tenants with a header. Office users never do.`
      ),
      explain(
        "other-logs",
        "Logs",
        "Other logs",
        `A different pile. The dashed line means never. A bug that leaks this is a firing-level bug.`
      ),
    ],
  }),
  "moshka-auth-middleware": lesson({
    id: "moshka-auth-middleware",
    name: "Middleware and who gets in",
    description: "A gate in front of /logs. Public pages stay public.",
    sections: [
      {
        id: "do",
        title: "src/middleware.ts",
        blocks: [
          md(
            "m",
            `Try first: create \`src/middleware.ts\` that redirects to \`/\` if the cookie is missing on \`/logs\`.`
          ),
          md(
            "p",
            `\`src/middleware.ts\`:

\`\`\`ts:src/middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const session = req.cookies.get("harbor_session")
  if (!session) {
    return NextResponse.redirect(new URL("/", req.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/logs/:path*"],
}
\`\`\`

Open /logs in a private window. You should bounce home until you POST /api/login.

This is a toy. Production middleware also checks token expiry and CSRF on mutations.`
          ),
          tip("n", "Next", "Cursor by the hand. You now have a real Next app to open."),
          tasks("t", "Hands-on", [
            { id: "gate", label: "/logs redirects when the cookie is missing" },
          ]),
        ],
      },
    ],
  }),
}
