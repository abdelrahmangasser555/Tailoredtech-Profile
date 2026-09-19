import { file, folder, projectChat, STARTERS } from "@/config/moshka-roadmap/helpers"
import type { NotesFolderNode } from "@/lib/notes-types"

export const moshkaTree: NotesFolderNode = folder(
  "moshka",
  "Moshka",
  [
    file("moshka-start-here", "Hey Moshka, start here"),
    folder(
      "moshka-roadmap",
      "Roadmap",
      [
        folder(
          "moshka-p01-pixel-cafe",
          "01 Pixel Cafe",
          [
            file("moshka-cafe-learn", "What you will learn"),
            file("moshka-cafe-unzip", "Unzip and open"),
            file("moshka-cafe-files", "What each file is for"),
            file("moshka-cafe-html", "HTML bones"),
            file("moshka-cafe-html-ids", "ids, buttons, data attributes"),
            file("moshka-cafe-css", "Make it look like a cafe"),
            file("moshka-cafe-css-hover", "Hover and the box model"),
            file("moshka-cafe-js", "Clicks and totals"),
            file("moshka-cafe-js-clear", "Clear the total"),
            file("moshka-cafe-ship", "Show someone"),
          ],
          {
            trackProgress: true,
            starters: [STARTERS.cafe],
            chat: projectChat(
              "Build a tiny cafe menu in HTML, CSS, and JS. First real page on Moshka's machine.",
              "Nothing yet. This is a first-build option."
            ),
          }
        ),
        folder(
          "moshka-p02-harbor-log",
          "01b Harbor Log",
          [
            file("moshka-harbor-learn", "What you will learn"),
            file("moshka-harbor-unzip", "Unzip and open"),
            file("moshka-harbor-html", "HTML bones"),
            file("moshka-harbor-css", "Make it feel like a logbook"),
            file("moshka-harbor-js", "Save a note"),
            file("moshka-harbor-persist", "Keep notes after refresh"),
            file("moshka-harbor-time", "Add a timestamp"),
            file("moshka-harbor-ship", "Show someone"),
          ],
          {
            trackProgress: true,
            starters: [STARTERS.harbor],
            chat: projectChat(
              "Build a captain diary page. Same skills as Pixel Cafe, different story. He picks one first-build.",
              "Nothing required. Parallel starter to Pixel Cafe and Scoreboard."
            ),
          }
        ),
        folder(
          "moshka-p03-pixel-scoreboard",
          "01c Pixel Scoreboard",
          [
            file("moshka-score-learn", "What you will learn"),
            file("moshka-score-unzip", "Unzip and open"),
            file("moshka-score-html", "HTML bones"),
            file("moshka-score-css", "Make it look like a match"),
            file("moshka-score-js", "Plus and minus points"),
            file("moshka-score-reset", "Reset both scores"),
            file("moshka-score-keyboard", "Keyboard shortcuts"),
            file("moshka-score-ship", "Show someone"),
          ],
          {
            trackProgress: true,
            starters: [STARTERS.score],
            chat: projectChat(
              "Build a two-team scoreboard. Same HTML CSS JS skills, game flavor.",
              "Nothing required. Parallel starter to Cafe and Harbor Log."
            ),
          }
        ),
        folder(
          "moshka-p-js-lab",
          "JavaScript lab",
          [
            file("moshka-js-learn", "What this folder is"),
            file("moshka-js-what", "What JavaScript is"),
            file("moshka-js-runtime", "What a runtime is"),
            file("moshka-js-browser", "JS in the browser"),
            file("moshka-js-node", "Install Node and run a file"),
            file("moshka-js-values", "Values, let, and const"),
            file("moshka-js-functions", "Functions"),
            file("moshka-js-if", "if and else"),
            file("moshka-js-loops", "Loops"),
            file("moshka-js-arrays", "Arrays"),
            file("moshka-js-map", "map, filter, find"),
            file("moshka-js-objects", "Objects"),
            file("moshka-js-classes", "Classes"),
            file("moshka-js-errors", "Errors and try/catch"),
            file("moshka-js-async", "async in one page"),
          ],
          {
            trackProgress: true,
            chat: projectChat(
              "JavaScript language lab. Not a zip project. Browser vs Node, functions, loops, map, classes. Type files in js-lab and run with node.",
              "Finished at least one first-build so JS in a page is not a mystery."
            ),
          }
        ),
        folder(
          "moshka-p-git-ship",
          "01d Ship with Git",
          [
            file("moshka-git-learn", "What you will learn"),
            file("moshka-git-account", "GitHub account"),
            file("moshka-git-install", "Install Git and gh"),
            file("moshka-git-snapshots", "Snapshots mental model"),
            file("moshka-git-first-commit", "First commit hands-on"),
            file("moshka-git-cafe-repo", "Put Pixel Cafe in Git"),
            file("moshka-git-push", "Push to GitHub"),
            file("moshka-git-branch", "Branches and merge"),
            file("moshka-git-pr", "What is a pull request"),
            file("moshka-git-gh-pr", "Open a PR with gh"),
            file("moshka-git-rebase", "Rebase vs merge"),
            file("moshka-git-workflow", "Daily workflow"),
            file("moshka-git-fix", "Fix common problems"),
          ],
          {
            trackProgress: true,
            chat: projectChat(
              "Learn Git and GitHub after HTML/CSS/JS. Account, commits, push, branches, PRs, rebase, gh CLI.",
              "Finished at least one first-build (Cafe, Harbor, or Scoreboard) so you have a folder to version."
            ),
          }
        ),
        folder(
          "moshka-p04-port-watch",
          "02 Port Watch",
          [
            file("moshka-port-learn", "What you will learn"),
            file("moshka-port-unzip", "Unzip and open"),
            file("moshka-port-layout", "Dense layout"),
            file("moshka-port-table", "The vessel table"),
            file("moshka-port-components", "Repeatable blocks"),
            file("moshka-port-icons", "Icons that earn their place"),
            file("moshka-port-status", "Status colors that mean something"),
            file("moshka-port-motion", "Tiny motion"),
          ],
          {
            trackProgress: true,
            starters: [STARTERS.port],
            chat: projectChat(
              "Build a real looking operations dashboard. Layout, components, Lucide icons, tiny motion.",
              "He finished one first-build (Cafe, Harbor Log, or Scoreboard)."
            ),
          }
        ),
        folder(
          "moshka-p-react-harbor",
          "02b React Harbor",
          [
            file("moshka-react-learn", "What you will learn"),
            file("moshka-react-why-vite", "Why Vite, not random tools"),
            file("moshka-react-create", "Create the project"),
            file("moshka-react-template", "Which template to pick"),
            file("moshka-react-tour", "Folder tour"),
            file("moshka-react-jsx", "JSX rules"),
            file("moshka-react-main", "main.tsx entry"),
            file("moshka-react-app", "App.tsx first screen"),
            file("moshka-react-component", "Your first component"),
            file("moshka-react-props", "Props are inputs"),
            file("moshka-react-events", "Events and handlers"),
            file("moshka-react-list-keys", "Lists and keys"),
            file("moshka-react-status", "StatusBadge component"),
            file("moshka-react-state", "useState"),
            file("moshka-react-errors", "When the screen goes white"),
            file("moshka-react-devtools", "React DevTools"),
            file("moshka-react-ship", "Show someone"),
          ],
          {
            trackProgress: true,
            chat: projectChat(
              "React + Vite + TypeScript: create app, JSX, package.json, components (VesselRow, StatusBadge), props, events, lists/keys, useState, errors, DevTools. Full copy-paste files.",
              "Port Watch exists. He felt the pain of copying table rows."
            ),
          }
        ),
        folder(
          "moshka-p05-client-eyes",
          "03 Client Eyes",
          [
            file("moshka-ux-learn", "What you will learn"),
            file("moshka-ux-client", "Think like the client"),
            file("moshka-ux-density", "Enterprise density"),
            file("moshka-ux-search", "Search the table"),
            file("moshka-ux-roles", "Different people, different screens"),
            file("moshka-ux-drawers", "Drawers not popups"),
            file("moshka-ux-empty", "Empty states that still work"),
          ],
          {
            trackProgress: true,
            chat: projectChat(
              "Rewrite Port Watch so it fits an enterprise client: density, roles, drawers, search.",
              "Port Watch dashboard exists. He knows HTML CSS JS."
            ),
          }
        ),
        folder(
          "moshka-p08-next-harbor",
          "04 Next Harbor",
          [
            file("moshka-next-learn", "What you will learn"),
            file("moshka-next-install", "Install and run"),
            file("moshka-next-app-router", "App Router tour"),
            file("moshka-next-server-client", "Server vs client"),
            file("moshka-next-api", "API endpoints"),
            file("moshka-next-actions", "Server actions"),
            file("moshka-next-shadcn", "shadcn without the slop"),
            file("moshka-next-query", "TanStack Query"),
            file("moshka-next-zustand", "Zustand for client state"),
            file("moshka-next-cache", "Next.js caching without magic"),
          ],
          {
            trackProgress: true,
            starters: [STARTERS.next],
            chat: projectChat(
              "Rebuild Harbor as a Next.js App Router app with shadcn, TanStack Query, Zustand, and caching.",
              "HTML CSS JS, a dashboard, and a page that can talk to a route."
            ),
          }
        ),
        folder(
          "moshka-p06-harbor-api",
          "05 Mongo Harbor",
          [
            file("moshka-api-learn", "What you will learn"),
            file("moshka-api-db-idea", "What a database even is"),
            file("moshka-api-mongo", "Documents and collections"),
            file("moshka-api-atlas", "Atlas and Compass"),
            file("moshka-api-connect", "Connect from Next.js"),
            file("moshka-api-routes", "API GET and POST"),
            file("moshka-api-actions", "Save with a server action"),
            file("moshka-api-query", "TanStack Query on real data"),
            file("moshka-api-zod", "Check the shape before you save"),
            file("moshka-api-indexes", "Find fast, cache correctly"),
          ],
          {
            trackProgress: true,
            chat: projectChat(
              "MongoDB with Next.js: driver, API routes, server actions, TanStack Query, caching.",
              "Next Harbor runs. He can edit a route.ts file."
            ),
          }
        ),
        folder(
          "moshka-p15-repo",
          "06 Repo and service",
          [
            file("moshka-repo-learn", "What you will learn"),
            file("moshka-repo-why", "Why pages do not talk to Mongo"),
            file("moshka-repo-db", "The db folder"),
            file("moshka-repo-repo", "The repo layer"),
            file("moshka-repo-service", "The service layer"),
            file("moshka-repo-wire", "Wire routes and actions"),
            file("moshka-repo-mistakes", "Mistakes that leak into the UI"),
          ],
          {
            trackProgress: true,
            chat: projectChat(
              "Split Harbor into db, repo, service. Same Next.js app. This is how BBS is cut.",
              "Mongo Harbor works. He has a GET and POST that hit Mongo."
            ),
          }
        ),
        folder(
          "moshka-p16-sql",
          "07 SQL Harbor",
          [
            file("moshka-sql-learn", "What you will learn"),
            file("moshka-sql-what", "Tables, rows, joins"),
            file("moshka-sql-postgres", "Run Postgres"),
            file("moshka-sql-schema", "Create the logs table"),
            file("moshka-sql-connect", "Connect from Next.js"),
            file("moshka-sql-api", "API endpoints"),
            file("moshka-sql-actions", "Server actions"),
            file("moshka-sql-query", "TanStack Query and cache"),
          ],
          {
            trackProgress: true,
            chat: projectChat(
              "SQL and Postgres with Next.js: schema, queries, API, server actions, Query, cache.",
              "He already saved data in Mongo. Now the same product on tables."
            ),
          }
        ),
        folder(
          "moshka-p17-supabase",
          "08 Supabase Harbor",
          [
            file("moshka-sb-learn", "What you will learn"),
            file("moshka-sb-what", "What Supabase actually is"),
            file("moshka-sb-project", "Create a project"),
            file("moshka-sb-tables", "Tables in the dashboard"),
            file("moshka-sb-client", "Server client vs browser client"),
            file("moshka-sb-rls", "Row Level Security"),
            file("moshka-sb-wire", "API, actions, Query"),
            file("moshka-sb-cache", "Cache and when not to"),
          ],
          {
            trackProgress: true,
            chat: projectChat(
              "Supabase as hosted Postgres plus auth helpers, wired into Next.js like TailoredTech would.",
              "SQL Harbor done. He knows tables and a Next route."
            ),
          }
        ),
        folder(
          "moshka-p07-who-are-you",
          "09 Who are you",
          [
            file("moshka-auth-learn", "What you will learn"),
            file("moshka-auth-ways", "Ways people sign in"),
            file("moshka-auth-session", "Cookies and sessions"),
            file("moshka-auth-protect", "Protect a route"),
            file("moshka-auth-saas", "Clerk, WorkOS, or custom"),
            file("moshka-auth-tenant", "Tenants like a real client"),
            file("moshka-auth-middleware", "Middleware and who gets in"),
          ],
          {
            trackProgress: true,
            chat: projectChat(
              "Add identity: sessions, SaaS auth vs custom, tenant onboarding like TailoredTech clients.",
              "He has saved data in Mongo or SQL. He knows a page can talk to a server."
            ),
          }
        ),
        folder(
          "moshka-p09-cursor-hands",
          "10 Cursor, by the hand",
          [
            file("moshka-cursor-learn", "What you will learn"),
            file("moshka-cursor-install", "Install Cursor"),
            file("moshka-cursor-prompt", "Write a real prompt"),
            file("moshka-cursor-project", "Start a project with AI"),
            file("moshka-cursor-review", "Read the diff"),
            file("moshka-cursor-rules", "Rules files"),
            file("moshka-cursor-daily", "Daily AI workflow"),
          ],
          {
            trackProgress: true,
            chat: projectChat(
              "Install Cursor and use it like Abdelrahman: tight prompts, small diffs, review everything.",
              "He has a Next Harbor project on disk. He can open files and run the app."
            ),
          }
        ),
        folder(
          "moshka-p10-talking-app",
          "11 Talking app",
          [
            file("moshka-ai-learn", "What you will learn"),
            file("moshka-ai-env", "Keys and .env.local"),
            file("moshka-ai-sdk", "Vercel AI SDK chat"),
            file("moshka-ai-stream", "Streaming on the page"),
            file("moshka-ai-tools", "Tools the model can call"),
            file("moshka-ai-langchain", "LangChain when the job is long"),
            file("moshka-ai-hosting", "Where TailoredTech hosts AI"),
          ],
          {
            trackProgress: true,
            chat: projectChat(
              "Add a chatbot with Vercel AI SDK. Know when LangChain on AWS is the right tool.",
              "Next Harbor runs. Cursor is installed. He can ship a route."
            ),
          }
        ),
        folder(
          "moshka-p11-dont-break-it",
          "12 Don't break it",
          [
            file("moshka-test-learn", "What you will learn"),
            file("moshka-test-first", "What E2E even is"),
            file("moshka-test-playwright", "Write one Playwright test"),
            file("moshka-test-selectors", "Click what the user sees"),
            file("moshka-test-fail", "Break it on purpose"),
            file("moshka-test-ci", "Run it again tomorrow"),
          ],
          {
            trackProgress: true,
            chat: projectChat(
              "Write a real Playwright test against Harbor so a click path cannot silently die.",
              "Talking app or Next Harbor is running locally."
            ),
          }
        ),
        folder(
          "moshka-p12-ship-ops",
          "13 Ship it",
          [
            file("moshka-ops-learn", "What you will learn"),
            file("moshka-ops-linux", "Linux without fear"),
            file("moshka-ops-account", "Cloud account and billing"),
            file("moshka-ops-docker", "Docker words"),
            file("moshka-ops-dockerfile", "A real Dockerfile"),
            file("moshka-ops-aws", "AWS the TailoredTech way"),
            file("moshka-ops-azure", "Azure when the client lives there"),
            file("moshka-ops-observe", "Logs, errors, autoscaling"),
            file("moshka-ops-tools", "ngrok and here.now"),
          ],
          {
            trackProgress: true,
            chat: projectChat(
              "Ship Harbor: Linux, Docker, AWS, Azure, ngrok, here.now.",
              "He has an app that runs and a test that passes."
            ),
          }
        ),
        folder(
          "moshka-p13-bbs-tour",
          "14 BBS tour",
          [
            file("moshka-bbs-learn", "What you will learn"),
            file("moshka-bbs-folders", "How the repo is cut"),
            file("moshka-bbs-request", "A click through the layers"),
            file("moshka-bbs-db", "db schemas and the repo"),
            file("moshka-bbs-roles", "Crew, office, vessel"),
            file("moshka-bbs-tenant", "tenantId everywhere"),
            file("moshka-bbs-agents", "AGENTS.md is memory"),
          ],
          {
            trackProgress: true,
            chat: projectChat(
              "Walk the real Bahri BBS codebase: features, repo, db, roles. This is how TailoredTech organizes enterprise work.",
              "He can read Next.js App Router files and knows Docker plus a database."
            ),
          }
        ),
        folder(
          "moshka-p14-agency-mode",
          "15 Agency mode",
          [
            file("moshka-agency-learn", "What you will learn"),
            file("moshka-agency-roles", "Who does what"),
            file("moshka-agency-delegate", "Ask, don't drown"),
            file("moshka-agency-pr", "Small PRs"),
            file("moshka-agency-onboard", "Enterprise onboarding"),
            file("moshka-agency-business", "Money, scope, trust"),
          ],
          {
            trackProgress: true,
            chat: projectChat(
              "Work like a TailoredTech contributor: roles, delegation, tenant onboarding, business sense.",
              "BBS tour done. He has seen a real enterprise folder layout."
            ),
          }
        ),
      ],
      {
        trackProgress: true,
        chat: projectChat(
          "Six month project path so Moshka can join TailoredTech work. Projects first, never concept dumps.",
          "He opened Hey Moshka, start here."
        ),
      }
    ),
  ],
  {
    trackProgress: true,
    chat: projectChat(
      "Moshka's whole learning home. Progress, starter zips, and a direct tutor in ask mode.",
      "None. This is the front door."
    ),
  }
)
