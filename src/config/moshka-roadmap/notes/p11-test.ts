import {
  figLink,
  figureN,
  lesson,
  link,
  md,
  tasks,
  tip,
  beforeYouStart,
} from "@/config/moshka-roadmap/helpers"
import type { NoteDocument } from "@/lib/notes-types"

export const moshkaTestNotes: Record<string, NoteDocument> = {
  "moshka-test-learn": lesson({
    id: "moshka-test-learn",
    name: "What you will learn",
    description: "One E2E test that clicks like a person. Then run it tomorrow.",
    sections: [
      {
        id: "goal",
        title: "A robot user",
        blocks: [
          beforeYouStart(
            "plan",
            "Write one Playwright test that opens the app and clicks like a real user.",
            "Test passes locally twice in a row.",
            []
          ),
          ...figureN(
            1,
            "playwright",
            "moshka-playwright-robot.png",
            "Robot clicks UI",
            `Playwright drives a real browser and fails when the page lies. ${figLink(1, "playwright")} is the idea.`
          ),
          md(
            "g",
            `Unit tests poke functions. E2E tests open the browser.

TailoredTech cares about the path a client actually clicks.`
          ),
          link(
            "pw",
            "https://playwright.dev/docs/intro",
            "Playwright intro",
            "Official install. Short."
          ),
          tasks("t", "Start", [{ id: "docs", label: "Open the Playwright intro tab" }]),
        ],
      },
    ],
  }),
  "moshka-test-first": lesson({
    id: "moshka-test-first",
    name: "What E2E even is",
    description: "Goto, click, expect. If the heading is gone, the test yells.",
    sections: [
      {
        id: "idea",
        title: "A scripted person",
        blocks: [
          md(
            "m",
            `Playwright starts Chrome. It goes to your URL. It looks for a heading. It clicks Save.

If your CSS class rename broke the heading, you want that yell before Bahri sees it.

E2E is slow compared to a unit test. You write a few of them, on the paths that make money.`
          ),
          tasks("t", "Check", [
            { id: "say", label: "You can say why E2E is not the same as console.log" },
          ]),
        ],
      },
    ],
  }),
  "moshka-test-playwright": lesson({
    id: "moshka-test-playwright",
    name: "Write one Playwright test",
    description: "Install. One spec. Harbor heading visible.",
    sections: [
      {
        id: "do",
        title: "The first spec",
        blocks: [
          md(
            "term",
            `Run this in the terminal from Next Harbor:

\`\`\`bash
cd ~/Desktop/next-harbor
npm init playwright@latest
\`\`\`

Accept Chromium. Tests in \`e2e\`. GitHub Action optional.`
          ),
          md(
            "p",
            `Replace the sample spec with \`e2e/harbor.spec.ts\`:

\`\`\`ts:e2e/harbor.spec.ts
import { test, expect } from "@playwright/test"

test("harbor opens", async ({ page }) => {
  await page.goto("http://localhost:3000")
  await expect(page.getByRole("heading", { name: /harbor/i })).toBeVisible()
})
\`\`\`

Dev server must be running, or set \`webServer\` in \`playwright.config.ts\` to \`npm run dev\`.`
          ),
          md(
            "term",
            `Run this in the terminal:

\`\`\`bash
cd ~/Desktop/next-harbor
npx playwright test --project=chromium
\`\`\``
          ),
          tasks("t", "Hands-on", [
            { id: "pass", label: "One test is green on Chromium" },
          ]),
        ],
      },
    ],
  }),
  "moshka-test-selectors": lesson({
    id: "moshka-test-selectors",
    name: "Click what the user sees",
    description: "getByRole, getByLabel. Not .css-hash-xyz.",
    sections: [
      {
        id: "do",
        title: "Stable locators",
        blocks: [
          md(
            "m",
            `If you select a class that shadcn generated, the test will die on the next UI tweak.

Prefer:

\`\`\`ts
page.getByRole("button", { name: "Save" })
page.getByLabel("Filter vessels")
page.getByRole("heading", { name: "Logs" })
\`\`\`

Add a real test for /logs: fill the text box, click Save, expect the text on the page.

Try first. Then paste:

\`\`\`ts:e2e/logs.spec.ts
import { test, expect } from "@playwright/test"

test("can save a log", async ({ page }) => {
  await page.goto("http://localhost:3000/logs")
  await page.getByPlaceholder("Left port at 06:00").fill("E2E line")
  await page.getByRole("button", { name: "Save" }).click()
  await expect(page.getByText("E2E line")).toBeVisible()
})
\`\`\`

Adjust placeholder and button name to match your page.`
          ),
          tasks("t", "Hands-on", [
            { id: "save", label: "A test saves a log without using a CSS class selector" },
          ]),
        ],
      },
    ],
  }),
  "moshka-test-fail": lesson({
    id: "moshka-test-fail",
    name: "Break it on purpose",
    description: "Change the heading. Watch the test go red. Put it back.",
    sections: [
      {
        id: "do",
        title: "Red then green",
        blocks: [
          md(
            "m",
            `In \`src/app/page.tsx\`, change the heading to something that does not include Harbor. Run the first test. It should fail.

That failure is the point. Then undo.

If a test cannot fail, it is not testing anything.`
          ),
          md(
            "term",
            `Run this in the terminal:

\`\`\`bash
npx playwright test --project=chromium
\`\`\``
          ),
          tasks("t", "Hands-on", [
            { id: "red", label: "You saw a failing test, then a passing one after revert" },
          ]),
        ],
      },
    ],
  }),
  "moshka-test-ci": lesson({
    id: "moshka-test-ci",
    name: "Run it again tomorrow",
    description: "Same command. Optional GitHub Action. Do not skip locally.",
    sections: [
      {
        id: "do",
        title: "Make it boring",
        blocks: [
          md(
            "m",
            `Write the command in README.`
          ),
          md(
            "p",
            `At the bottom of \`README.md\`:

\`\`\`md:README.md
## Tests

npx playwright test --project=chromium
\`\`\``
          ),
          md(
            "term",
            `Run this in the terminal:

\`\`\`bash
npx playwright test --project=chromium
\`\`\``
          ),
          tip("n", "Next", "Ship it: Docker, Linux, AWS, Azure."),
          tasks("t", "Hands-on", [
            { id: "readme", label: "Test command is in README" },
          ]),
        ],
      },
    ],
  }),
}
