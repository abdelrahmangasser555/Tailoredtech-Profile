import {
  explain,
  figLink,
  figureN,
  lesson,
  md,
  mermaid,
  tasks,
  tip,
  beforeYouStart,
} from "@/config/moshka-roadmap/helpers"
import type { NoteDocument } from "@/lib/notes-types"

export const moshkaAgencyNotes: Record<string, NoteDocument> = {
  "moshka-agency-learn": lesson({
    id: "moshka-agency-learn",
    name: "What you will learn",
    description: "Roles, delegation, onboarding a company, how money and trust work.",
    sections: [
      {
        id: "goal",
        title: "You are not a ticket machine",
        blocks: [
          beforeYouStart(
            "plan",
            "Practice agency habits: clear asks, small slices, good messages when stuck.",
            "You sent a help message with file path, command, and error text.",
            []
          ),
          ...figureN(
            1,
            "good-question",
            "moshka-good-question.png",
            "Ask well",
            `Bad asks waste everyone's time. Good asks name the file, command, and error. ${figLink(1, "good-question")} is the contrast.`
          ),
          md(
            "g",
            `TailoredTech is an agency. Clients pay for outcomes. You will join as a technical contributor.

This project is people skills with a repo attached.`
          ),
          mermaid(
            "f",
            `flowchart LR
  C[Client] --> A[Abdelrahman]
  A --> M[Moshka]
  M --> P[PR]
  P --> C`,
            "How work moves",
            undefined,
            {
              C: "client",
              A: "abdelrahman",
              M: "moshka",
              P: "pr",
            }
          ),
          tasks("t", "Start", [{ id: "mind", label: "You know this folder is about work, not syntax" }]),
        ],
      },
    ],
    explains: [
      explain(
        "client",
        "Client",
        "Client",
        `Pays for an outcome. Talks to Abdelrahman. Sees the PR as a shipped change, not as code.`
      ),
      explain(
        "abdelrahman",
        "Founder",
        "Abdelrahman",
        `Scopes the work. You do not invent extra scope. You ask if it is unclear.`
      ),
      explain(
        "moshka",
        "You",
        "Moshka",
        `A technical contributor. Small PRs. Honest when stuck.`
      ),
      explain(
        "pr",
        "PR",
        "PR",
        `The unit of work. Reviewable. Reversible. Not a dump of 40 files.`
      ),
    ],
  }),
  "moshka-agency-roles": lesson({
    id: "moshka-agency-roles",
    name: "Who does what",
    description: "Founder, engineer, client champion, designer. Stay in your box until asked.",
    sections: [
      {
        id: "do",
        title: "Boxes",
        blocks: [
          md(
            "m",
            `**You:** small PRs, tests, questions with a screenshot.

**Abdelrahman:** scope, architecture, client.

**Client:** domain. They know vessels. You know Next.

Do not promise dates in a client chat. Do not change brand tokens because it looks nicer.`
          ),
          tasks("t", "Check", [
            { id: "no", label: "You listed one thing you will not decide alone" },
          ]),
        ],
      },
    ],
  }),
  "moshka-agency-delegate": lesson({
    id: "moshka-agency-delegate",
    name: "Ask, don't drown",
    description: "A good question has the file path, the error, and what you tried.",
    sections: [
      {
        id: "do",
        title: "The ask",
        blocks: [
          md(
            "m",
            `Bad: "it doesn't work"

Good:

\`\`\`
File: src/app/api/logs/route.ts
I POST { text: "hi" } and get 500.
I logged the body. Zod parse passes.
Mongo insert throws. Screenshot attached.
\`\`\`

Delegation the other way: Abdelrahman will give you a slice. Repeat the slice back. Then do only that.`
          ),
          tasks("t", "Hands-on", [
            { id: "write", label: "You wrote one fake good question for a 500 error" },
          ]),
        ],
      },
    ],
  }),
  "moshka-agency-pr": lesson({
    id: "moshka-agency-pr",
    name: "Small PRs",
    description: "One slice. Tests. Description. Not a weekend of mixed files.",
    sections: [
      {
        id: "do",
        title: "What a PR looks like",
        blocks: [
          md(
            "m",
            `A PR you can review:

- Title: what it does for the user
- Why: one paragraph
- How to test: commands

Example description:

\`\`\`
Add tenant filter to GET /api/logs.

Office was seeing every tenant in local testing.

Test: POST /api/login, POST a log, GET /api/logs with and without the cookie.
npx playwright test --project=chromium
\`\`\``
          ),
          md(
            "term",
            `Run this in the terminal before you say it is done:

\`\`\`bash
cd ~/Desktop/next-harbor
npx playwright test --project=chromium
git status
git diff
\`\`\``
          ),
          tasks("t", "Hands-on", [
            { id: "desc", label: "You wrote a fake PR description for one Harbor change" },
          ]),
        ],
      },
    ],
  }),
  "moshka-agency-onboard": lesson({
    id: "moshka-agency-onboard",
    name: "Enterprise onboarding",
    description: "Tenant, branding, users, email, training. Utilization after go-live.",
    sections: [
      {
        id: "do",
        title: "After the code ships",
        blocks: [
          md(
            "m",
            `A client is not live when git says so.

Onboarding:
1. Tenant record
2. Brand colors and logo
3. Admin users
4. SSO if they paid for it
5. Email (SES or Graph) tested to a real inbox
6. Training for the people who click every day

Utilization: are they actually filing observations? If not, the feature is not done.

Customization: a tenant toggle in settings, not a fork of the repo.`
          ),
          mermaid(
            "o",
            `flowchart TB
  T[Tenant] --> B[Brand]
  B --> U[Users]
  U --> E[Email test]
  E --> R[Training]
  R --> N[Usage numbers]`,
            "Onboarding",
            undefined,
            {
              T: "tenant",
              B: "brand",
              U: "users",
              E: "email",
              R: "training",
              N: "usage",
            }
          ),
          tasks("t", "Check", [
            { id: "list", label: "You can list 4 onboarding steps without looking" },
          ]),
        ],
      },
    ],
    explains: [
      explain(
        "tenant",
        "Tenant",
        "Tenant",
        `A company record first. Nothing else until this exists.`
      ),
      explain(
        "brand",
        "Brand",
        "Brand",
        `Colors and logo. A toggle, not a fork of the repo.`
      ),
      explain(
        "users",
        "Users",
        "Users",
        `Admin accounts. SSO if they paid for it.`
      ),
      explain(
        "email",
        "Email",
        "Email test",
        `SES or Graph. A real inbox must receive a mail before you call it done.`
      ),
      explain(
        "training",
        "Training",
        "Training",
        `The people who click every day. If they cannot file an observation, the feature is not done.`
      ),
      explain(
        "usage",
        "Usage",
        "Usage numbers",
        `Are they actually using it? Utilization is part of the job.`
      ),
    ],
  }),
  "moshka-agency-business": lesson({
    id: "moshka-agency-business",
    name: "Money, scope, trust",
    description: "Scope creep is unpaid work. Trust is screenshots and honesty.",
    sections: [
      {
        id: "do",
        title: "Stay employed, stay kind",
        blocks: [
          md(
            "m",
            `If a client asks for a new dashboard in a WhatsApp voice note, that is a change request. Flag it. Do not silently build it for three days.

Estimates are ranges. "I don't know yet" is allowed if you then spike for two hours.

Trust: say when you broke staging. Say when you are stuck after 30 minutes.

You are family here, and you are still a professional. Both.`
          ),
          tip(
            "end",
            "You made it",
            "Go back to any project and rebuild a piece with Cursor. Then ask Abdelrahman for a real ticket."
          ),
          tasks("t", "Done when", [
            { id: "talk", label: "You told Abdelrahman you finished Agency mode" },
          ]),
        ],
      },
    ],
  }),
}
