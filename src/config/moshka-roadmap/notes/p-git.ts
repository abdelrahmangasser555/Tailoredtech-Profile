import {
  explain,
  figLink,
  figureN,
  illustration,
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
  beforeYouStart,
  termStep,
} from "@/config/moshka-roadmap/helpers"
import type { NoteDocument } from "@/lib/notes-types"

export const moshkaGitNotes: Record<string, NoteDocument> = {
  "moshka-git-learn": lesson({
    id: "moshka-git-learn",
    name: "What you will learn",
    description:
      "Save history, push to GitHub, branch, open a PR, use gh. After a first-build and JavaScript lab.",
    sections: [
      {
        id: "goal",
        title: "Why Git comes now",
        blocks: [
          beforeYouStart(
            "plan",
            "Learn Git on your machine, GitHub as remote, branches, pull requests, and gh CLI.",
            "Pixel Cafe lives in a repo on GitHub with at least one commit and one PR opened.",
            []
          ),
          md(
            "g",
            `You can already change \`index.html\` and refresh. Git answers the next questions:

1. What did I change?
2. Can I go back?
3. How do I show Abdelrahman without sending a zip every day?

**Git** runs on your machine. **GitHub** is the website that holds a copy in the cloud. They are not the same thing.`
          ),
          ...figureN(
            1,
            "git-vs-github",
            "moshka-git-vs-github.png",
            "Git vs GitHub",
            `Git is the save-history tool on your laptop. GitHub is the remote locker teammates can pull from. ${figLink(1, "git-vs-github")} keeps the two boxes separate in your head.`
          ),
          mermaid(
            "flow",
            `flowchart LR
  W[Working files] -->|git add| S[Staging]
  S -->|git commit| C[Local history]
  C -->|git push| R[GitHub remote]`,
            "The loop",
            "You will type these commands for real in Pixel Cafe folder.",
            {
              W: "working-tree",
              S: "staging",
              C: "commit",
              R: "remote",
            }
          ),
          tasks("t", "Start", [
            { id: "next", label: "Open GitHub account next" },
          ]),
        ],
      },
    ],
    explains: [
      explain(
        "working-tree",
        "Working tree",
        "Files you edit",
        `The folder on disk right now. Uncommitted edits live here.`
      ),
      explain(
        "staging",
        "Staging",
        "git add",
        `The shopping basket for the next snapshot. You choose which files enter the commit.`
      ),
      explain(
        "commit",
        "Commit",
        "Labeled snapshot",
        `A save point with a message. You can return to it later.`
      ),
      explain(
        "remote",
        "Remote",
        "GitHub",
        `A copy on a server. \`origin\` usually means your GitHub repo URL.`
      ),
    ],
  }),

  "moshka-git-account": lesson({
    id: "moshka-git-account",
    name: "GitHub account",
    description: "Create the account you will push to. Use a real email.",
    sections: [
      {
        id: "do",
        title: "Sign up",
        blocks: [
          ...figureN(
            1,
            "github-signup",
            "moshka-github-account.png",
            "GitHub signup",
            `Pick a username you are fine showing on a CV later. Verify email before you push. ${figLink(1, "github-signup")} is the rough screen order.`
          ),
          link("join", "https://github.com/join", "Create GitHub account"),
          md(
            "m",
            `Checklist:

1. Username (short, professional)
2. Email you can access (same one you will put in \`git config\`)
3. Enable 2FA when GitHub asks. Saves you from account lockouts.

Do **not** put passwords or tokens inside lesson notes or chat logs.`
          ),
          tasks("t", "Done when", [
            { id: "acct", label: "You can log in to github.com" },
          ]),
        ],
      },
    ],
  }),

  "moshka-git-install": lesson({
    id: "moshka-git-install",
    name: "Install Git and gh",
    description: "git for history. gh for PRs from the terminal.",
    sections: [
      {
        id: "git",
        title: "Install Git",
        blocks: [
          md(
            "m",
            `Run in the terminal:

\`\`\`bash
git --version
\`\`\`

If you see a version number, skip install. If command not found:

- Linux: \`sudo apt install git\`
- macOS: install Xcode Command Line Tools or download from git-scm.com
- Windows: install Git for Windows from git-scm.com (keep default PATH option)`
          ),
          link(
            "dl",
            "https://git-scm.com/downloads",
            "Download Git",
            "Official installer"
          ),
          md(
            "cfg",
            `Set your name once (use the same email as GitHub):

\`\`\`bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main
\`\`\`

Check:

\`\`\`bash
git config --global --list
\`\`\``
          ),
        ],
      },
      {
        id: "gh",
        title: "Install GitHub CLI (gh)",
        blocks: [
          ...figureN(
            1,
            "gh-cli",
            "moshka-gh-cli.png",
            "gh in the terminal",
            `\`gh\` talks to GitHub without clicking every button in the browser. You will use it to open pull requests. ${figLink(1, "gh-cli")} shows terminal plus GitHub.`
          ),
          md(
            "gh-m",
            `Check:

\`\`\`bash
gh --version
\`\`\`

Install guide: https://github.com/cli/cli#installation

Then log in:

\`\`\`bash
gh auth login
\`\`\`

Choose GitHub.com, HTTPS, and login via browser when asked.`
          ),
          tasks("t", "Done when", [
            { id: "git", label: "git --version works" },
            { id: "gh", label: "gh auth status shows logged in" },
          ]),
        ],
      },
    ],
  }),

  "moshka-git-snapshots": lesson({
    id: "moshka-git-snapshots",
    name: "Snapshots mental model",
    description: "Working tree, staging, commit. Words you will hear at TailoredTech.",
    sections: [
      {
        id: "watch",
        title: "Short video",
        blocks: [
          yt("v", VID.git, "Git in 100 Seconds (Fireship)", "Watch once. Whole short video."),
          ytWatch(
            "v-long",
            VID.gitFcc,
            "Git and GitHub for beginners (freeCodeCamp)",
            "0:00",
            "45:00",
            "Account through push. Pause when you need to type along."
          ),
        ],
      },
      {
        id: "table",
        title: "Words",
        blocks: [
          md(
            "m",
            `| Word | Meaning |
|------|---------|
| Repository (repo) | Folder Git is tracking |
| Working tree | Files as you edit them now |
| Staging | Files marked for the next commit (\`git add\`) |
| Commit | Snapshot with a message |
| Branch | Parallel line of commits |
| Remote | Copy on GitHub (\`origin\`) |
| Pull request (PR) | Ask to merge your branch into main |`
          ),
          ...figureN(
            1,
            "snapshots",
            "moshka-git-snapshots.png",
            "Three layers",
            `Edits start in the working tree, move to staging with \`git add\`, then freeze into a commit. ${figLink(1, "snapshots")} is that stack.`
          ),
          tasks("t", "Check", [
            { id: "say", label: "You can explain commit vs push in one sentence" },
          ]),
        ],
      },
    ],
  }),

  "moshka-git-first-commit": lesson({
    id: "moshka-git-first-commit",
    name: "First commit hands-on",
    description: "Practice folder first. Then you will use Pixel Cafe.",
    sections: [
      {
        id: "local",
        title: "Practice repo",
        blocks: [
          beforeYouStart(
            "fc-plan",
            "Make a practice folder, run git init, then create your first commit.",
            "git log shows one commit. git status is clean.",
            ["README.md"]
          ),
          ...termStep(
            1,
            "Create the folder",
            "Use a throwaway folder on Desktop so mistakes are cheap.",
            `mkdir -p ~/Desktop/git-practice
cd ~/Desktop/git-practice
echo "# Practice" > README.md
git init
git status`
          ),
          ...termStep(
            2,
            "Stage and commit",
            "git add moves files into staging. git commit saves a snapshot with a message.",
            `git add .
git commit -m "add readme"
git log --oneline
git status`
          ),
          illustration(
            "play",
            "git-commit-flow",
            "Type git commands here",
            "Same flow as the terminal. Watch the graph when a commit lands.",
            { mode: "first-repo" }
          ),
          tasks("t", "Done when", [
            { id: "log", label: "git log shows your commit" },
          ]),
        ],
      },
    ],
  }),

  "moshka-git-cafe-repo": lesson({
    id: "moshka-git-cafe-repo",
    name: "Put Pixel Cafe in Git",
    description: "Init inside your cafe folder. Commit the three files you already understand.",
    sections: [
      {
        id: "do",
        title: "Real project folder",
        blocks: [
          md(
            "m",
            `Use the cafe folder you already unzipped (paths may differ):

\`\`\`bash
cd ~/Desktop/pixel-cafe   # or wherever index.html lives
git init
git status
\`\`\`

You should see \`index.html\`, \`styles.css\`, \`app.js\`, maybe \`README.md\`.`
          ),
          md(
            "ignore",
            `Add a \`.gitignore\` so junk never gets committed:

\`\`\`gitignore:.gitignore
# OS noise
.DS_Store
Thumbs.db

# Editor folders (optional)
.vscode/
\`\`\`

Then:

\`\`\`bash
git add .
git commit -m "pixel cafe starter"
git log --oneline
\`\`\`

**Comment habit:** when you edit \`app.js\` next, add a line comment above new logic so future you knows why.`
          ),
          md(
            "js-comment",
            `Example in \`app.js\` (keep your real code, just add comments like this):

\`\`\`js:app.js
// Total in EGP — updates when any Add button fires
let total = 0;

function addPrice(price) {
  total += price;
  document.getElementById("total").textContent = String(total);
}

// Wire every Add button via data-price on the HTML
document.querySelectorAll("button[data-price]").forEach((btn) => {
  btn.addEventListener("click", () => {
    addPrice(Number(btn.getAttribute("data-price")));
  });
});
\`\`\``
          ),
          tasks("t", "Hands-on", [
            { id: "init", label: "git log works inside pixel-cafe" },
            { id: "cmt", label: "At least one commit with the cafe files" },
          ]),
        ],
      },
    ],
  }),

  "moshka-git-push": lesson({
    id: "moshka-git-push",
    name: "Push to GitHub",
    description: "Create an empty repo on GitHub. Link origin. Push main.",
    sections: [
      {
        id: "do",
        title: "Remote",
        blocks: [
          ...figureN(
            1,
            "push",
            "moshka-git-push.png",
            "Local to GitHub",
            `Commits stay local until \`git push\` copies them to GitHub. ${figLink(1, "push")} is laptop arrow cloud.`
          ),
          md(
            "m",
            `On GitHub: **New repository**. Name it \`pixel-cafe\` (or similar). **Do not** add README if you already have one locally.

Copy the HTTPS URL. Then in your cafe folder:

\`\`\`bash
cd ~/Desktop/pixel-cafe
git remote add origin https://github.com/YOUR_USER/pixel-cafe.git
git branch -M main
git push -u origin main
\`\`\`

First push may ask you to log in. Use browser or \`gh auth\` if HTTPS fails.`
          ),
          info(
            "token",
            "HTTPS login",
            "GitHub may ask for a personal access token instead of a password. Create one under Settings → Developer settings → Tokens (classic) with repo scope if needed."
          ),
          tasks("t", "Done when", [
            { id: "see", label: "Files visible on github.com in your repo" },
          ]),
        ],
      },
    ],
  }),

  "moshka-git-branch": lesson({
    id: "moshka-git-branch",
    name: "Branches and merge",
    description: "main stays stable. feature work happens on a branch.",
    sections: [
      {
        id: "do",
        title: "Feature branch",
        blocks: [
          md(
            "m",
            `Story: you will add a fourth drink on a branch, then merge.

\`\`\`bash
cd ~/Desktop/pixel-cafe
git checkout -b feature-fourth-drink
# edit index.html, save
git add index.html
git commit -m "add fourth drink"
git checkout main
git merge feature-fourth-drink
git log --oneline --graph
\`\`\`

If merge says conflict, open the file, pick the lines you want, then \`git add\` and \`git commit\`.`
          ),
          illustration(
            "branch-play",
            "git-commit-flow",
            "Branch practice",
            "Scenario starts with one commit on main.",
            { mode: "branches" }
          ),
          link(
            "lgb",
            "https://learngitbranching.js.org/",
            "Learn Git Branching",
            "Optional visual drills"
          ),
          tasks("t", "Hands-on", [
            { id: "br", label: "You merged a branch into main" },
          ]),
        ],
      },
    ],
  }),

  "moshka-git-pr": lesson({
    id: "moshka-git-pr",
    name: "What is a pull request",
    description: "A PR is a review request, not a magic button.",
    sections: [
      {
        id: "concept",
        title: "PR in plain words",
        blocks: [
          ...figureN(
            1,
            "pr",
            "moshka-git-pr.png",
            "Pull request",
            `You push a branch, then ask to merge into \`main\`. Teammates read the diff before it ships. ${figLink(1, "pr")} shows branch → review → merge.`
          ),
          md(
            "m",
            `At TailoredTech the flow is usually:

1. Branch from \`main\`
2. Commit small chunks with clear messages
3. Push branch
4. Open PR on GitHub
5. Address review comments
6. Merge when CI is green

A PR is **not** the same as \`git push\`. Push uploads. PR asks for merge permission and shows the diff.`
          ),
          tasks("t", "Check", [
            { id: "diff", label: "You can say what a diff shows" },
          ]),
        ],
      },
    ],
  }),

  "moshka-git-gh-pr": lesson({
    id: "moshka-git-gh-pr",
    name: "Open a PR with gh",
    description: "Push a branch, then gh pr create from the terminal.",
    sections: [
      {
        id: "do",
        title: "Terminal PR",
        blocks: [
          md(
            "m",
            `On a feature branch with commits pushed:

\`\`\`bash
cd ~/Desktop/pixel-cafe
git checkout -b docs-readme-tweak
# edit README.md
git add README.md
git commit -m "docs: clarify how to open index.html"
git push -u origin docs-readme-tweak

gh pr create --title "Docs: open in browser" --body "Adds one line to README for Windows users."
\`\`\`

\`gh\` prints a URL. Open it. That is your PR.

\`\`\`bash
gh pr view --web
gh pr list
\`\`\``
          ),
          ytWatch(
            "v",
            VID.ghCli,
            "GitHub CLI overview",
            "0:00",
            "8:00",
            "Install and auth if you skipped earlier."
          ),
          tasks("t", "Done when", [
            { id: "pr", label: "You opened a PR (can be on a test repo)" },
          ]),
        ],
      },
    ],
  }),

  "moshka-git-rebase": lesson({
    id: "moshka-git-rebase",
    name: "Rebase vs merge",
    description: "Rebase replays commits on top of main. Know when not to panic.",
    sections: [
      {
        id: "do",
        title: "Linear history",
        blocks: [
          ...figureN(
            1,
            "rebase",
            "moshka-git-rebase.png",
            "Rebase vs merge",
            `Merge keeps a fork in history. Rebase moves your commits to sit on latest main. ${figLink(1, "rebase")} compares the two shapes.`
          ),
          md(
            "m",
            `**Merge** (what you did already): creates a merge commit. Safe. Easy.

**Rebase** (common on teams): replay your branch on top of updated main:

\`\`\`bash
git checkout main
git pull origin main
git checkout feature-fourth-drink
git rebase main
\`\`\`

If rebase stops with conflict: fix files, \`git add\`, then \`git rebase --continue\`.

**Rule for Moshka now:** do not rebase \`main\` on shared team repos until someone walks you through it. Practice on your own cafe repo only.`
          ),
          tip(
            "force",
            "Never force-push main",
            "Do not run git push --force on shared branches. On your solo cafe repo you can recover from mistakes with git reflog."
          ),
          tasks("t", "Check", [
            { id: "say", label: "You can name one difference between merge and rebase" },
          ]),
        ],
      },
    ],
  }),

  "moshka-git-workflow": lesson({
    id: "moshka-git-workflow",
    name: "Daily workflow",
    description: "Pull, branch, commit, push, PR. Repeat.",
    sections: [
      {
        id: "loop",
        title: "Morning to ship",
        blocks: [
          ...figureN(
            1,
            "workflow",
            "moshka-git-workflow.png",
            "Daily loop",
            `Start on latest main, branch for one task, small commits, push, PR. ${figLink(1, "workflow")} is the cycle Abdelrahman expects on client work.`
          ),
          md(
            "m",
            `\`\`\`bash
# Start of day (team repo)
git checkout main
git pull origin main
git checkout -b fix/table-padding

# ... edit files ...
git add src/App.css
git commit -m "fix: tighten table cell padding"
git push -u origin fix/table-padding
gh pr create --fill
\`\`\`

Commit messages: short imperative. Examples: \`add vessel row\`, \`fix: search filter\`, \`docs: readme unzip steps\`.`
          ),
          tasks("t", "Habit", [
            { id: "pull", label: "You ran git pull before starting new work once this week" },
            { id: "small", label: "Your last commit changed one logical thing" },
          ]),
        ],
      },
    ],
  }),

  "moshka-git-fix": lesson({
    id: "moshka-git-fix",
    name: "Fix common problems",
    description: "Wrong folder, rejected push, merge conflict, detached HEAD scares.",
    sections: [
      {
        id: "table",
        title: "Symptoms",
        blocks: [
          md(
            "m",
            `| Symptom | Try this |
|---------|----------|
| \`not a git repository\` | \`cd\` into the folder that has \`.git\` or run \`git init\` |
| \`failed to push\` / rejected | \`git pull --rebase origin main\` then push again |
| merge conflict markers \`<<<<<<<\` | Edit file, remove markers, \`git add\`, commit or continue rebase |
| committed wrong file | \`git restore --staged file\` before push |
| need undo last commit (not pushed) | \`git reset --soft HEAD~1\` keeps files, drops commit |
| white screen after pull | You are on wrong branch. \`git status\` and \`git branch\` |`
          ),
          ...figureN(
            1,
            "fix",
            "moshka-good-question.png",
            "Ask for help well",
            `When stuck, send file path, exact command, and the error text. ${figLink(1, "fix")} contrasts bad vs good messages (same art as agency lesson).`
          ),
          md(
            "ask",
            `Good message to Abdelrahman:

\`\`\`text
Repo: pixel-cafe
Branch: feature-fourth-drink
Command: git push -u origin feature-fourth-drink
Error: (paste the red text)
What I tried: git pull
\`\`\``
          ),
          tasks("t", "Hands-on", [
            { id: "break", label: "You fixed a git status issue on your own once" },
          ]),
        ],
      },
    ],
  }),
}
