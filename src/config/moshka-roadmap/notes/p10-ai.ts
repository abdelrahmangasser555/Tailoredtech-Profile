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
  VID,
  ytWatch,
  beforeYouStart,
} from "@/config/moshka-roadmap/helpers"
import type { NoteDocument } from "@/lib/notes-types"

export const moshkaAiNotes: Record<string, NoteDocument> = {
  "moshka-ai-learn": lesson({
    id: "moshka-ai-learn",
    name: "What you will learn",
    description:
      "Vercel AI SDK for chat UI. LangChain when the job is long on AWS.",
    sections: [
      {
        id: "goal",
        title: "Two tools, two jobs",
        blocks: [
          beforeYouStart(
            "plan",
            "Learn chat UI (AI SDK) vs long jobs on AWS, and when each fits.",
            "You can name which box handles a quick chat vs a heavy worker.",
            []
          ),
          ...figureN(
            1,
            "ai-boxes",
            "moshka-ai-two-boxes.png",
            "Chat vs worker",
            `Vercel AI SDK handles chat UI. LangGraph-style workers run longer jobs on AWS. ${figLink(1, "ai-boxes")} splits the two boxes.`
          ),
          md(
            "g",
            `TailoredTech split:

- **Vercel AI SDK**: chatbots, streaming, generative UI on Next.js
- **LangChain / LangGraph**: long backend jobs. Hosted as a container on AWS ECR, hit by Lambda if under 15 minutes`
          ),
          mermaid(
            "f",
            `flowchart TB
  C[Chat in the Next app] --> S[Vercel AI SDK]
  J[Long job, tools, retries] --> L[LangGraph]
  L --> E[ECR container]
  E --> A[Lambda or always-on]`,
            "Two AI lanes",
            undefined,
            {
              C: "chat",
              S: "ai-sdk",
              J: "long-job",
              L: "langgraph",
              E: "ecr",
              A: "lambda",
            }
          ),
          link(
            "ai",
            "https://ai-sdk.dev/docs/getting-started/nextjs-app-router",
            "AI SDK Next.js App Router",
            "Official current docs."
          ),
          tasks("t", "Start", [{ id: "read", label: "You know which tool is for chat vs long jobs" }]),
        ],
      },
    ],
    explains: [
      explain(
        "chat",
        "Chat",
        "Chat in the Next app",
        `A box on a page. Streaming tokens. This is a product feature, not Cursor.`
      ),
      explain(
        "ai-sdk",
        "AI SDK",
        "Vercel AI SDK",
        `\`useChat\`, \`streamText\`, a \`route.ts\`. Fits Next. Keys stay on the server.`
      ),
      explain(
        "long-job",
        "Job",
        "Long job",
        `Tools, retries, a graph of steps. Too much for a single chat request.`
      ),
      explain(
        "langgraph",
        "LangGraph",
        "LangGraph",
        `Backend graphs. Hosted as a container. Not inside a random client component.`
      ),
      explain(
        "ecr",
        "ECR",
        "ECR container",
        `The image lives on AWS. Lambda can start it if the job is under 15 minutes.`
      ),
      explain(
        "lambda",
        "Lambda",
        "Lambda or always-on",
        `Short jobs: Lambda. Longer: a box that stays up. You will see Docker in Ship.`
      ),
    ],
  }),
  "moshka-ai-env": lesson({
    id: "moshka-ai-env",
    name: "Keys and .env.local",
    description: "The model needs a key. It never belongs in git or in a client component.",
    sections: [
      {
        id: "do",
        title: "Env",
        blocks: [
          md(
            "m",
            `Ask Abdelrahman which provider Harbor should use (OpenRouter, Groq, or similar). Add the key locally.`
          ),
          md(
            "p",
            `\`.env.local\` (example names):

\`\`\`txt:.env.local
OPENAI_API_KEY=sk-...
\`\`\`

Or:

\`\`\`txt:.env.local
OPENROUTER_API_KEY=sk-or-...
\`\`\`

Restart \`npm run dev\`. Confirm \`.gitignore\` includes \`.env*\`. If it does not, add \`.env.local\`.`
          ),
          info(
            "key",
            "API keys",
            "Never commit them. Never paste them into notes chat."
          ),
          tasks("t", "Hands-on", [
            { id: "env", label: "A key is in .env.local and git status does not show it" },
          ]),
        ],
      },
    ],
  }),
  "moshka-ai-sdk": lesson({
    id: "moshka-ai-sdk",
    name: "Vercel AI SDK chat",
    description: "route.ts streams. useChat draws. You type. It answers.",
    sections: [
      {
        id: "do",
        title: "The smallest chat",
        blocks: [
          ytWatch(
            "v",
            VID.aiSdk,
            "Vercel AI SDK in React",
            "0:00",
            "12:00",
            "Follow until the first working useChat demo. Stop at 12:00 even if it keeps going."
          ),
          md(
            "term",
            `Run this in the terminal:

\`\`\`bash
cd ~/Desktop/next-harbor
npm install ai @ai-sdk/react @ai-sdk/openai
\`\`\`

Package names move. If install fails, follow the current AI SDK Next.js App Router docs linked in What you will learn.`
          ),
          md(
            "p",
            `\`src/app/api/chat/route.ts\` (shape, adjust the model import to the provider you use):

\`\`\`ts:src/app/api/chat/route.ts
import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: Request) {
  const { messages } = await req.json()
  const result = streamText({
    model: openai("gpt-4o-mini"),
    messages,
  })
  return result.toUIMessageStreamResponse()
}
\`\`\`

If \`toUIMessageStreamResponse\` is not in your version, the docs page will show the current helper (\`toDataStreamResponse\` on older SDKs). Copy from the docs, not from memory.

This notes site already streams in ask mode. Copy the idea, not the whole file.`
          ),
          tasks("t", "Hands-on", [
            { id: "route", label: "POST /api/chat exists and the server starts" },
          ]),
        ],
      },
    ],
  }),
  "moshka-ai-stream": lesson({
    id: "moshka-ai-stream",
    name: "Streaming on the page",
    description: "A client page with a text box. Tokens appear as they arrive.",
    sections: [
      {
        id: "do",
        title: "useChat",
        blocks: [
          md(
            "m",
            `Try first: a \`"use client"\` page that calls \`useChat\` from \`@ai-sdk/react\`. Point it at \`/api/chat\`.`
          ),
          md(
            "p",
            `\`src/app/chat/page.tsx\`:

\`\`\`tsx:src/app/chat/page.tsx
"use client"

import { useChat } from "@ai-sdk/react"

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    api: "/api/chat",
  })
  return (
    <main>
      <h1>Harbor chat</h1>
      <ul>
        {messages.map((m) => (
          <li key={m.id}>
            {m.role}: {m.content}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} placeholder="Ask" />
        <button type="submit" disabled={status !== "ready"}>
          Send
        </button>
      </form>
    </main>
  )
}
\`\`\`

The \`useChat\` API shifts between SDK versions. If this snippet errors, open the official getting started page and paste their current example into this file. The lesson is: streaming route plus a client hook.`
          ),
          tasks("t", "Hands-on", [
            { id: "chat", label: "You sent a message and saw a streamed reply" },
          ]),
        ],
      },
    ],
  }),
  "moshka-ai-tools": lesson({
    id: "moshka-ai-tools",
    name: "Tools the model can call",
    description: "listLogs. The model chooses. You write the function.",
    sections: [
      {
        id: "do",
        title: "One tool",
        blocks: [
          md(
            "m",
            `Add a tool \`listLogs\` that reads the last 5 Harbor logs through your service.

The model should only call it when the user asks about logs.

This is how the notes chatbot edits notes in edit mode: tools, then a result.`
          ),
          md(
            "p",
            `Shape (names follow current AI SDK \`tool\` helper):

\`\`\`ts
import { tool } from "ai"
import { z } from "zod"
import { listHarborLogs } from "@/services/logs.service"

const listLogs = tool({
  description: "List recent harbor logs",
  inputSchema: z.object({}),
  execute: async () => listHarborLogs(),
})
\`\`\`

Pass \`tools: { listLogs }\` into \`streamText\`. Ask "what are the latest logs?" and watch the server log or network tab.`
          ),
          link(
            "tools",
            "https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling",
            "AI SDK tools",
            "Official. Copy the current example if helper names moved."
          ),
          tasks("t", "Hands-on", [
            { id: "tool", label: "Asking about logs calls your tool" },
          ]),
        ],
      },
    ],
  }),
  "moshka-ai-langchain": lesson({
    id: "moshka-ai-langchain",
    name: "LangChain when the job is long",
    description: "Graphs, retries, tools over 30 seconds. Not the Next request.",
    sections: [
      {
        id: "do",
        title: "Why a graph",
        blocks: [
          link(
            "lg",
            "https://docs.langchain.com/oss/python/langgraph/overview",
            "LangGraph overview",
            "Official. Skim, do not binge."
          ),
          md(
            "m",
            `A Next.js route should answer fast.

If the agent must search 10 sources, write a report, retry, that is LangGraph on a worker.

You do not have to build LangGraph today. You must know **when** Abdelrahman will reach for it.

Example that should not live in \`/api/chat\`: "read 200 PDFs, extract ICB items, write a weekly report."`
          ),
          tasks("t", "Check", [
            { id: "when", label: "You can name one task that should not live in a 10s API route" },
          ]),
        ],
      },
    ],
  }),
  "moshka-ai-hosting": lesson({
    id: "moshka-ai-hosting",
    name: "Where TailoredTech hosts AI",
    description: "Vercel for the chat UI. AWS ECR + Lambda for the long worker.",
    sections: [
      {
        id: "do",
        title: "Picture the boxes",
        blocks: [
          mermaid(
            "h",
            `flowchart LR
  U[User] --> V[Next on Vercel or Azure]
  V --> C[AI SDK chat]
  V --> L[Lambda]
  L --> E[ECR LangGraph]
  E --> S[S3 or Mongo]`,
            "Chat vs worker",
            undefined,
            {
              U: "user",
              V: "next-host",
              C: "ai-sdk",
              L: "lambda",
              E: "ecr",
              S: "store",
            }
          ),
          md(
            "m",
            `Lambda max is 15 minutes. Longer than that: a real container service, not a single Lambda.

You will touch Docker in Ship it.`
          ),
          tip("n", "Next", "Don't break it: one Playwright test so the chat page still opens."),
          tasks("t", "Check", [
            { id: "draw", label: "You sketched chat vs worker on paper" },
          ]),
        ],
      },
    ],
    explains: [
      explain(
        "user",
        "User",
        "User",
        `Types in the Harbor chat box. They never see AWS.`
      ),
      explain(
        "next-host",
        "Next",
        "Next on Vercel or Azure",
        `The UI. Vercel is easy. Azure when the client already lives there.`
      ),
      explain(
        "ai-sdk",
        "Chat",
        "AI SDK chat",
        `Short, streaming, in the Next app. Good for Q and A over a log.`
      ),
      explain(
        "lambda",
        "Lambda",
        "Lambda",
        `Kicks a worker. 15 minute cap. Do not stuff a huge graph in here.`
      ),
      explain(
        "ecr",
        "ECR",
        "ECR LangGraph",
        `The long job image. Tools and retries live here.`
      ),
      explain(
        "store",
        "Store",
        "S3 or Mongo",
        `Files in S3. Logs and chat history in Mongo. The worker writes, the UI reads.`
      ),
    ],
  }),
}
