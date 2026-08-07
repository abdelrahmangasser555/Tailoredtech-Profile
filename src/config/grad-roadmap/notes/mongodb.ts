import type { NoteDocument } from "@/lib/notes-types"

const D = "2026-08-07"
const V = { sidebarNav: true, compactHero: true, showMeta: false } as const

export const gradMongoNotes: Record<string, NoteDocument> = {
  "grad-mongo-install": {
    id: "grad-mongo-install",
    name: "Install MongoDB",
    title: "Install MongoDB",
    description:
      "Pick Atlas (cloud) or a local install. You need a connection string for the Next app.",
    createdAt: D,
    updatedAt: D,
    enabled: true,
    variants: V,
    sections: [
      {
        id: "options",
        title: "Two paths",
        blocks: [
          {
            type: "markdown",
            id: "m1",
            content: `Your \`/api/projects\` route still returns hard-coded JSON. MongoDB will hold real documents.

**Option A: Atlas (recommended for teams)**
1. Register and create a free M0 cluster
2. Database Access: create a user + password
3. Network Access: allow your IP (or 0.0.0.0/0 for learning only)
4. Connect → Drivers → copy the connection string

**Option B: Local Community Server**
Follow the official install for your OS, start the service, then use \`mongodb://127.0.0.1:27017\`.`,
          },
          {
            type: "link",
            id: "l1",
            href: "https://www.mongodb.com/cloud/atlas/register",
            label: "MongoDB Atlas register",
          },
          {
            type: "link",
            id: "l2",
            href: "https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/",
            label: "Install MongoDB on Windows",
          },
          {
            type: "link",
            id: "l3",
            href: "https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/",
            label: "Install MongoDB on macOS",
          },
          {
            type: "link",
            id: "l4",
            href: "https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/",
            label: "Install MongoDB on Ubuntu",
          },
          {
            type: "youtube",
            id: "yt1",
            url: "https://www.youtube.com/watch?v=CnaDoHAsk2E",
            title: "Deploy a cloud database with MongoDB Atlas",
            caption: "Account, free cluster, connection string.",
          },
          {
            type: "link",
            id: "lr1",
            href: "https://roadmap.sh/mongodb",
            label: "roadmap.sh MongoDB",
          },
          {
            type: "link",
            id: "l5",
            href: "https://learn.mongodb.com/learning-paths/introduction-to-mongodb",
            label: "MongoDB University: Introduction",
          },
        ],
      },
      {
        id: "verify",
        title: "Verify with Compass",
        blocks: [
          {
            type: "link",
            id: "l6",
            href: "https://www.mongodb.com/products/tools/compass",
            label: "Download MongoDB Compass",
            description: "GUI to browse collections",
          },
          {
            type: "markdown",
            id: "m2",
            content: `Paste your connection string → Connect. Create a database named \`grad\` and a collection \`projects\` with one document:

\`\`\`json
{
  "title": "Fleet dashboard",
  "summary": "Maritime ops UI"
}
\`\`\`

**Done when:** Compass shows that document.`,
          },
        ],
      },
    ],
  },

  "grad-mongo-connect": {
    id: "grad-mongo-connect",
    name: "Connect from Next.js",
    title: "Connect from Next.js",
    description:
      "Wire MONGODB_URI into grad-portfolio and read projects from the database.",
    createdAt: D,
    updatedAt: D,
    enabled: true,
    variants: V,
    sections: [
      {
        id: "env",
        title: "Environment + client",
        blocks: [
          {
            type: "markdown",
            id: "m1",
            content: `In \`grad-portfolio\`:

\`\`\`bash
npm install mongodb
\`\`\`

**\`.env.local\`** (never commit this file):

\`\`\`
MONGODB_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/grad
\`\`\`

**Create** \`src/lib/mongodb.ts\`:

\`\`\`ts
import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Missing MONGODB_URI");

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const client = new MongoClient(uri);
const clientPromise =
  global._mongoClientPromise ?? client.connect();

if (process.env.NODE_ENV !== "production") {
  global._mongoClientPromise = clientPromise;
}

export async function getDb(): Promise<Db> {
  const connected = await clientPromise;
  return connected.db("grad");
}
\`\`\`

**Update** \`src/app/api/projects/route.ts\`:

\`\`\`ts
import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  const db = await getDb();
  const projects = await db.collection("projects").find({}).toArray();
  return NextResponse.json(projects);
}
\`\`\`

Restart \`npm run dev\`. Refresh the page. Your Compass document should show in the UI.`,
          },
          {
            type: "callout",
            id: "c1",
            tone: "warn",
            title: "Secrets",
            body: "Keep .env.local out of git. On Vercel, set the same env var in the project settings.",
          },
          {
            type: "link",
            id: "l1",
            href: "https://www.mongodb.com/docs/drivers/node/current/quick-start/",
            label: "MongoDB Node driver quick start",
          },
        ],
      },
    ],
  },

  "grad-mongo-in-project": {
    id: "grad-mongo-in-project",
    name: "Repo pattern in the project",
    title: "Repo pattern in the project",
    description:
      "How grad-fullstack splits route, service, and repo. Same idea as your getDb call, with more structure.",
    createdAt: D,
    updatedAt: D,
    enabled: true,
    variants: V,
    sections: [
      {
        id: "layers",
        title: "Three layers",
        blocks: [
          {
            type: "markdown",
            id: "m1",
            content: `In your learning app, the route file talks to Mongo directly. That is fine for learning. In the grad repo we split concerns:

| Layer | Job | Example |
|-------|-----|---------|
| Route | HTTP in/out, auth | \`app/api/workspaces/[id]/portfolio/route.ts\` |
| Service | Business rules | \`workspace-profile.service.ts\` |
| Repo | Raw queries | \`workspace-profile.repo.ts\` |

UI never imports the Mongo driver. Hooks call the API. The API calls the service. The service calls the repo.`,
          },
          {
            type: "mermaid",
            id: "mm1",
            diagram: `flowchart TB
  UI[React + TanStack Query] --> API[Route handler]
  API --> SVC[workspace-profile.service]
  SVC --> REPO[workspace-profile.repo]
  REPO --> MONGO[(MongoDB)]`,
          },
        ],
      },
      {
        id: "crud",
        title: "From your app to theirs",
        blocks: [
          {
            type: "markdown",
            id: "m2",
            content: `Your learning GET:

\`\`\`ts
const projects = await db.collection("projects").find().toArray();
\`\`\`

Grad repo style (conceptually):

\`\`\`ts
// repo
export async function findProfileByWorkspaceId(workspaceId: string) {
  return profiles.findOne({ workspaceId });
}

// service
export async function getWorkspaceProfile(workspaceId: string) {
  const doc = await findProfileByWorkspaceId(workspaceId);
  if (!doc) throw new Error("Not found");
  return toDTO(doc);
}

// route
export async function GET(_req, { params }) {
  const data = await getWorkspaceProfile(params.workspaceId);
  return NextResponse.json(data);
}
\`\`\`

**Try in your learning app:** insert another project in Compass, refresh the React list. Then move on to codebase structure so the real folders make sense.`,
          },
        ],
      },
    ],
  },
}
