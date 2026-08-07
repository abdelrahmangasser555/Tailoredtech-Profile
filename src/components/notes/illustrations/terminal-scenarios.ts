/**
 * Scripted terminal scenarios for grad-roadmap lessons.
 * Commands are matched loosely (trim, case-insensitive prefix).
 */

export type TerminalLine = {
  type: "input" | "output" | "success" | "error" | "hint"
  text: string
}

export type TerminalScenario = {
  id: string
  title: string
  prompt: string
  cwd: string
  /** Commands the user should try, in order */
  goals: string[]
  /** Optional starter hint shown below the terminal */
  starterHint?: string
}

type ScenarioHandler = (
  cmd: string,
  state: TerminalState
) => { lines: TerminalLine[]; state: TerminalState; goalHit?: boolean }

export type TerminalState = {
  cwd: string
  initialized: boolean
  files: string[]
  staged: string[]
  commits: { hash: string; message: string }[]
  branch: string
  branches: string[]
  onFeature: boolean
  goalIndex: number
  projectCreated: boolean
}

function freshState(scenario: TerminalScenario): TerminalState {
  return {
    cwd: scenario.cwd,
    initialized: false,
    files: ["README.md"],
    staged: [],
    commits: [],
    branch: "main",
    branches: ["main"],
    onFeature: false,
    goalIndex: 0,
    projectCreated: false,
  }
}

function shortHash() {
  return Math.random().toString(16).slice(2, 5)
}

function matchGoal(state: TerminalState, cmd: string, goals: string[]) {
  const goal = goals[state.goalIndex]
  if (!goal) return { state, hit: false }
  const normalized = cmd.trim().toLowerCase()
  const target = goal.toLowerCase()
  if (normalized === target || normalized.startsWith(target)) {
    return { state: { ...state, goalIndex: state.goalIndex + 1 }, hit: true }
  }
  return { state, hit: false }
}

const HANDLERS: Record<string, ScenarioHandler> = {
  "git-first-repo": (cmd, state) => {
    const goals = [
      "git init",
      "git status",
      "git add .",
      'git commit -m "first commit"',
    ]
    const trimmed = cmd.trim()
    const lower = trimmed.toLowerCase()

    if (lower === "help") {
      return {
        lines: [
          {
            type: "hint",
            text: "Try: git init → git status → git add . → git commit -m \"first commit\"",
          },
        ],
        state,
      }
    }

    if (lower === "git init") {
      const next = { ...state, initialized: true }
      const g = matchGoal(state, cmd, goals)
      return {
        lines: [
          { type: "output", text: `Initialized empty Git repository in ${state.cwd}/.git` },
          { type: "success", text: "✓ Repository ready. Run git status next." },
        ],
        state: { ...next, ...g.state },
        goalHit: g.hit,
      }
    }

    if (lower.startsWith("git status")) {
      if (!state.initialized) {
        return {
          lines: [{ type: "error", text: "fatal: not a git repository — run git init first." }],
          state,
        }
      }
      const unstaged = state.files.filter((f) => !state.staged.includes(f))
      const lines: TerminalLine[] = [
        { type: "output", text: `On branch ${state.branch}` },
      ]
      if (state.staged.length) {
        lines.push({
          type: "output",
          text: `Changes to be committed:\n  ${state.staged.map((f) => `new file:   ${f}`).join("\n  ")}`,
        })
      }
      if (unstaged.length) {
        lines.push({
          type: "output",
          text: `Untracked files:\n  ${unstaged.map((f) => f).join("\n  ")}`,
        })
      }
      if (!unstaged.length && !state.staged.length && state.commits.length) {
        lines.push({ type: "output", text: "nothing to commit, working tree clean" })
      }
      const g = matchGoal(state, cmd, goals)
      return { lines, state: g.state, goalHit: g.hit }
    }

    if (lower.startsWith("git add")) {
      if (!state.initialized) {
        return {
          lines: [{ type: "error", text: "fatal: not a git repository" }],
          state,
        }
      }
      const next = { ...state, staged: [...state.files] }
      const g = matchGoal(state, cmd, goals)
      return {
        lines: [
          { type: "output", text: `Staged ${state.files.length} file(s) for commit.` },
          { type: "success", text: "✓ Files staged. Time to commit." },
        ],
        state: { ...next, ...g.state },
        goalHit: g.hit,
      }
    }

    if (lower.startsWith("git commit")) {
      if (!state.initialized) {
        return {
          lines: [{ type: "error", text: "fatal: not a git repository" }],
          state,
        }
      }
      if (!state.staged.length) {
        return {
          lines: [{ type: "error", text: "nothing to commit — run git add . first" }],
          state,
        }
      }
      const hash = shortHash()
      const msgMatch = trimmed.match(/-m\s+["'](.+?)["']/)
      const message = msgMatch?.[1] ?? "commit"
      const next = {
        ...state,
        staged: [],
        commits: [...state.commits, { hash, message }],
      }
      const g = matchGoal(state, cmd, goals)
      return {
        lines: [
          { type: "output", text: `[${state.branch} ${hash}] ${message}` },
          { type: "success", text: "✓ First commit saved. History started." },
        ],
        state: { ...next, ...g.state },
        goalHit: g.hit,
      }
    }

    return {
      lines: [{ type: "error", text: `command not found in this lesson: ${trimmed}` }],
      state,
    }
  },

  "git-branches": (cmd, state) => {
    const goals = [
      "git branch feature-login",
      "git checkout feature-login",
      "git commit -am \"add login form\"",
      "git checkout main",
      "git merge feature-login",
    ]
    const trimmed = cmd.trim()
    const lower = trimmed.toLowerCase()

    if (!state.initialized && lower !== "git init") {
      // Auto-init for branch lesson
      state = { ...state, initialized: true, commits: [{ hash: "a1c", message: "init" }] }
    }

    if (lower === "help") {
      return {
        lines: [
          {
            type: "hint",
            text: "branch → checkout feature → commit → checkout main → merge feature",
          },
        ],
        state,
      }
    }

    if (lower.startsWith("git branch") && !lower.includes("checkout")) {
      const name = trimmed.split(/\s+/).pop() ?? "feature"
      if (state.branches.includes(name)) {
        return {
          lines: [{ type: "error", text: `branch '${name}' already exists` }],
          state,
        }
      }
      const next = { ...state, branches: [...state.branches, name] }
      const g = matchGoal(state, cmd, goals)
      return {
        lines: [
          { type: "output", text: `Created branch '${name}'` },
          { type: "success", text: `✓ Branch ${name} exists. Check it out.` },
        ],
        state: { ...next, ...g.state },
        goalHit: g.hit,
      }
    }

    if (lower.startsWith("git checkout") || lower.startsWith("git switch")) {
      const name = trimmed.split(/\s+/).pop() ?? ""
      if (!state.branches.includes(name)) {
        return {
          lines: [{ type: "error", text: `pathspec '${name}' did not match any branch` }],
          state,
        }
      }
      const onFeature = name !== "main"
      const next = { ...state, branch: name, onFeature }
      const g = matchGoal(state, cmd, goals)
      return {
        lines: [
          { type: "output", text: `Switched to branch '${name}'` },
          { type: "success", text: onFeature ? "✓ You're on the feature lane." : "✓ Back on main." },
        ],
        state: { ...next, ...g.state },
        goalHit: g.hit,
      }
    }

    if (lower.startsWith("git commit")) {
      if (state.branch === "main" && !state.onFeature) {
        return {
          lines: [{ type: "error", text: "Switch to feature-login before committing feature work." }],
          state,
        }
      }
      const hash = shortHash()
      const msgMatch = trimmed.match(/-m\s+["'](.+?)["']/)
      const message = msgMatch?.[1] ?? "work"
      const next = {
        ...state,
        commits: [...state.commits, { hash, message: `[${state.branch}] ${message}` }],
      }
      const g = matchGoal(state, cmd, goals)
      return {
        lines: [
          { type: "output", text: `[${state.branch} ${hash}] ${message}` },
          { type: "success", text: "✓ Feature commit recorded." },
        ],
        state: { ...next, ...g.state },
        goalHit: g.hit,
      }
    }

    if (lower.startsWith("git merge")) {
      const name = trimmed.split(/\s+/).pop() ?? ""
      if (!state.branches.includes(name)) {
        return {
          lines: [{ type: "error", text: `branch '${name}' not found` }],
          state,
        }
      }
      const g = matchGoal(state, cmd, goals)
      return {
        lines: [
          { type: "output", text: `Updating a1c..${shortHash()}` },
          { type: "output", text: `Fast-forward merge of '${name}' into main` },
          { type: "success", text: "✓ Feature merged. One timeline again." },
        ],
        state: { ...g.state, branch: "main", onFeature: false },
        goalHit: g.hit,
      }
    }

    if (lower.startsWith("git status")) {
      return {
        lines: [
          { type: "output", text: `On branch ${state.branch}` },
          { type: "output", text: `${state.commits.length} commit(s) in history` },
        ],
        state,
      }
    }

    return {
      lines: [{ type: "error", text: `command not found in this lesson: ${trimmed}` }],
      state,
    }
  },

  "npm-scaffold": (cmd, state) => {
    const goals = ["npm create vite@latest grad-app -- --template react-ts", "cd grad-app", "npm install", "npm run dev"]
    const trimmed = cmd.trim()
    const lower = trimmed.toLowerCase()

    if (lower === "help") {
      return {
        lines: [
          {
            type: "hint",
            text: "create vite project → cd → npm install → npm run dev",
          },
        ],
        state,
      }
    }

    if (lower.includes("create vite") || lower.includes("npm create")) {
      const g = matchGoal(state, cmd, goals)
      return {
        lines: [
          { type: "output", text: "Scaffolding project in ./grad-app..." },
          { type: "output", text: "Done. Now cd grad-app" },
          { type: "success", text: "✓ React + TypeScript template ready." },
        ],
        state: { ...g.state, projectCreated: true },
        goalHit: g.hit,
      }
    }

    if (lower === "cd grad-app" || lower === "cd ./grad-app") {
      if (!state.projectCreated) {
        return {
          lines: [{ type: "error", text: "grad-app does not exist — create it first." }],
          state,
        }
      }
      const g = matchGoal(state, cmd, goals)
      return {
        lines: [
          { type: "output", text: "→ grad-app/" },
          { type: "success", text: "✓ Inside the project folder." },
        ],
        state: { ...g.state, cwd: "~/projects/grad-app" },
        goalHit: g.hit,
      }
    }

    if (lower === "npm install") {
      if (!state.projectCreated) {
        return {
          lines: [{ type: "error", text: "No package.json here — cd into grad-app first." }],
          state,
        }
      }
      const g = matchGoal(state, cmd, goals)
      return {
        lines: [
          { type: "output", text: "added 142 packages in 4s" },
          { type: "success", text: "✓ Dependencies installed." },
        ],
        state: g.state,
        goalHit: g.hit,
      }
    }

    if (lower === "npm run dev") {
      if (!state.projectCreated) {
        return {
          lines: [{ type: "error", text: "No package.json here." }],
          state,
        }
      }
      const g = matchGoal(state, cmd, goals)
      return {
        lines: [
          { type: "output", text: "VITE v6 ready in 320ms" },
          { type: "output", text: "➜  Local:   http://localhost:5173/" },
          { type: "success", text: "✓ Dev server running — open the URL in your browser." },
        ],
        state: g.state,
        goalHit: g.hit,
      }
    }

    return {
      lines: [{ type: "error", text: `command not found in this lesson: ${trimmed}` }],
      state,
    }
  },
}

export const TERMINAL_SCENARIOS: Record<string, TerminalScenario> = {
  "git-first-repo": {
    id: "git-first-repo",
    title: "Your first repo",
    prompt: "Walk through init → status → add → commit",
    cwd: "~/projects/my-app",
    goals: ["git init", "git status", "git add .", 'git commit -m "first commit"'],
    starterHint: "Type commands exactly as shown in the lesson. Try `help` if stuck.",
  },
  "git-branches": {
    id: "git-branches",
    title: "Branch & merge",
    prompt: "Create a feature branch, commit, merge back",
    cwd: "~/projects/my-app",
    goals: [
      "git branch feature-login",
      "git checkout feature-login",
      'git commit -am "add login form"',
      "git checkout main",
      "git merge feature-login",
    ],
    starterHint: "Imagine you already ran git init. Start with git branch …",
  },
  "npm-scaffold": {
    id: "npm-scaffold",
    title: "Scaffold React",
    prompt: "Create a Vite + React project and start dev server",
    cwd: "~/projects",
    goals: [
      "npm create vite@latest grad-app -- --template react-ts",
      "cd grad-app",
      "npm install",
      "npm run dev",
    ],
    starterHint: "Copy-paste each command from the lesson, then press Enter.",
  },
}

export function runTerminalCommand(
  scenarioId: string,
  cmd: string,
  state: TerminalState
): { lines: TerminalLine[]; state: TerminalState; goalHit?: boolean } {
  const handler = HANDLERS[scenarioId]
  if (!handler) {
    return {
      lines: [{ type: "error", text: `Unknown scenario: ${scenarioId}` }],
      state,
    }
  }
  return handler(cmd, state)
}

export function createTerminalState(scenarioId: string): TerminalState {
  const scenario = TERMINAL_SCENARIOS[scenarioId]
  if (!scenario) {
    return freshState({
      id: "unknown",
      title: "",
      prompt: "",
      cwd: "~",
      goals: [],
    })
  }
  return freshState(scenario)
}
