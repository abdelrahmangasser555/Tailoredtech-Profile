import type { NoteDocument } from "@/lib/notes-types"

const D = "2026-08-07"
const V = { sidebarNav: true, compactHero: true, showMeta: false } as const

export const gradGitNotes: Record<string, NoteDocument> = {
  "grad-git-overview": {
    id: "grad-git-overview",
    name: "What Git does",
    title: "What Git does",
    description:
      "Git stores snapshots of your project over time. It is not the same as GitHub.",
    createdAt: D,
    updatedAt: D,
    enabled: true,
    variants: V,
    sections: [
      {
        id: "concept",
        title: "The idea",
        blocks: [
          {
            type: "markdown",
            id: "m1",
            content: `You just installed VS Code and Node. Next you need a way to **save history** of your code.

Git answers three questions:

1. What changed?
2. When did it change?
3. Can I go back?

| Word | Meaning |
|------|---------|
| Working folder | Files you edit right now |
| Staging | The files you chose for the next snapshot |
| Commit | A labeled snapshot with a message |
| Branch | A parallel line of commits (often one feature) |
| Remote | A copy on a server (usually GitHub) |

Git runs **on your machine**. GitHub is a website that hosts remotes so teammates can push and pull.`,
          },
          {
            type: "mermaid",
            id: "mm1",
            diagram: `flowchart TB
  W[Working files] -->|git add| S[Staging]
  S -->|git commit| C[Commit history]
  C -->|git push| R[GitHub remote]`,
          },
          {
            type: "youtube",
            id: "yt1",
            url: "https://www.youtube.com/watch?v=hwP7WQkmECE",
            title: "Git explained in 100 seconds (Fireship)",
            caption: "Watch once for the mental model. Practice comes in the next lessons.",
          },
        ],
      },
      {
        id: "links",
        title: "Practice resources",
        blocks: [
          {
            type: "link",
            id: "lr1",
            href: "https://roadmap.sh/git-github",
            label: "roadmap.sh Git & GitHub",
          },
          {
            type: "link",
            id: "l1",
            href: "https://www.freecodecamp.org/news/git-and-github-for-beginners/",
            label: "freeCodeCamp: Git and GitHub for beginners",
          },
          {
            type: "link",
            id: "l2",
            href: "https://learngitbranching.js.org/",
            label: "Learn Git Branching",
            description: "Visual practice. Best after the branches lesson.",
          },
          {
            type: "callout",
            id: "c1",
            tone: "tip",
            title: "Next",
            body: "Create a GitHub account and clone a repo so remotes feel real before you make your first commit.",
          },
        ],
      },
    ],
  },

  "grad-github-setup": {
    id: "grad-github-setup",
    name: "GitHub account & clone",
    title: "GitHub account & clone",
    description:
      "Create an account, install Git if needed, then clone a repo into your projects folder.",
    createdAt: D,
    updatedAt: D,
    enabled: true,
    variants: V,
    sections: [
      {
        id: "account",
        title: "Account + Git install",
        blocks: [
          {
            type: "markdown",
            id: "m1",
            content: `From the last lesson you know Git locally. Now give yourself a remote home.`,
          },
          {
            type: "link",
            id: "l1",
            href: "https://github.com/join",
            label: "Create a GitHub account",
          },
          {
            type: "link",
            id: "l2",
            href: "https://git-scm.com/downloads",
            label: "Download Git",
            description: "Install if git --version fails in the terminal",
          },
          {
            type: "markdown",
            id: "m2",
            content: `In VS Code terminal, set your identity once:

\`\`\`bash
git config --global user.name "Your Name"
git config --global user.email "you@email.com"
\`\`\`

Use the same email as your GitHub account when possible.`,
          },
          {
            type: "youtube",
            id: "yt1",
            url: "https://www.youtube.com/watch?v=RGOj5yH7evk",
            title: "Git and GitHub for beginners (freeCodeCamp)",
            caption: "Account, clone, push. Follow along in your own projects folder.",
          },
          {
            type: "link",
            id: "l3",
            href: "https://www.youtube.com/watch?v=mAFoROnOfHs",
            label: "Alternative: Git & GitHub crash course 2026",
            description: "Newer freeCodeCamp walkthrough if you want a second pass",
          },
        ],
      },
      {
        id: "clone",
        title: "Clone into your projects folder",
        blocks: [
          {
            type: "markdown",
            id: "m3",
            content: `1. On any public GitHub repo click the green **Code** button
2. Copy the HTTPS URL
3. In VS Code terminal:

\`\`\`bash
cd ~/Documents/projects
# Windows PowerShell example:
# cd $HOME\\Documents\\projects

git clone https://github.com/OWNER/REPO.git
cd REPO
code .
\`\`\`

\`code .\` opens the folder in VS Code if PATH was set during install.

You now have a local copy linked to \`origin\`. Later you will create your own empty repo and push the portfolio app into it.`,
          },
          {
            type: "callout",
            id: "c1",
            tone: "tip",
            title: "Done when",
            body: "git --version works, your name/email are set, and you have cloned at least one repo into projects/.",
          },
        ],
      },
    ],
  },

  "grad-git-first-repo": {
    id: "grad-git-first-repo",
    name: "First repo (hands on)",
    title: "First repo (hands on)",
    description:
      "Create a folder, init Git, stage, commit. Use the live graph below.",
    createdAt: D,
    updatedAt: D,
    enabled: true,
    variants: V,
    sections: [
      {
        id: "local",
        title: "On your machine",
        blocks: [
          {
            type: "markdown",
            id: "m1",
            content: `Keep the same projects folder from cloning. Create a new practice folder:

\`\`\`bash
mkdir ~/Documents/projects/my-app
cd ~/Documents/projects/my-app
echo "# My app" > README.md
code .
\`\`\`

Then run these in order in the terminal:

\`\`\`bash
git init
git status
git add .
git commit -m "first commit"
git log
\`\`\`

After \`git status\` you should see \`README.md\` as untracked. After \`git add .\` it moves under "Changes to be committed". After commit, status is clean.`,
          },
        ],
      },
      {
        id: "play",
        title: "Practice in the note",
        blocks: [
          {
            type: "markdown",
            id: "m2",
            content: `Use the playground below the same way. Click a suggested command or type it. Watch the graph grow when you commit.`,
          },
          {
            type: "illustration",
            id: "i1",
            component: "git-commit-flow",
            title: "Interactive git",
            caption: "Type commands. The graph updates when commits land.",
            props: { mode: "first-repo" },
          },
          {
            type: "callout",
            id: "c1",
            tone: "tip",
            title: "Continuity",
            body: "Keep my-app. The next lesson adds a feature branch inside this same repo.",
          },
        ],
      },
    ],
  },

  "grad-git-branches": {
    id: "grad-git-branches",
    name: "Branches & merge",
    title: "Branches & merge",
    description:
      "Build on your first repo. Cut a feature branch, commit there, merge back to main.",
    createdAt: D,
    updatedAt: D,
    enabled: true,
    variants: V,
    sections: [
      {
        id: "flow",
        title: "Feature flow in my-app",
        blocks: [
          {
            type: "markdown",
            id: "m1",
            content: `Open the \`my-app\` folder from last lesson.

**Story:** \`main\` stays stable. You create \`feature-login\`, do work there, then merge.

\`\`\`bash
cd ~/Documents/projects/my-app

# create a file so you have something to commit
echo "login form" > login.txt

git branch feature-login
git checkout feature-login
git add .
git commit -m "add login form"
git checkout main
git merge feature-login
git log --oneline --graph
\`\`\`

What changed conceptually:

1. \`branch\` creates a name pointing at the current commit
2. \`checkout\` moves HEAD to that name
3. Commits on the feature lane only move that pointer
4. \`merge\` brings those commits into \`main\``,
          },
          {
            type: "illustration",
            id: "i1",
            component: "git-branch-flow",
            title: "Branch playground",
            caption: "This scenario starts with one commit already on main.",
            props: { mode: "branches" },
          },
          {
            type: "link",
            id: "l1",
            href: "https://learngitbranching.js.org/",
            label: "Optional: Learn Git Branching",
            description: "Extra visual drills if merge still feels fuzzy",
          },
          {
            type: "callout",
            id: "c1",
            tone: "tip",
            title: "Next folder",
            body: "You can save code history. Next you build a real page with HTML and CSS that will later become the React portfolio.",
          },
        ],
      },
    ],
  },
}
