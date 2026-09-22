import type { NoteBlock } from "@/lib/notes-types"

function md(id: string, content: string): NoteBlock {
  return { type: "markdown", id, content }
}

function info(id: string, title: string, body: string): NoteBlock {
  return { type: "callout", id, tone: "info", title, body }
}

/** Opening callout: plain English plan for the lesson */
export function beforeYouStart(
  id: string,
  whatYouWillDo: string,
  doneLooksLike: string,
  files?: string[]
): NoteBlock {
  const fileLine = files?.length
    ? `\n\n**Files you will touch:** ${files.map((f) => `\`${f}\``).join(", ")}.`
    : ""
  return info(
    id,
    "Before you start",
    `**What you will do:** ${whatYouWillDo}\n\n**Done looks like:** ${doneLooksLike}${fileLine}`
  )
}

/** ### Step N: title + body */
export function step(n: number, title: string, body: string): NoteBlock {
  return md(`step-${n}-${title.replace(/\s+/g, "-").slice(0, 24)}`, `### Step ${n}: ${title}\n\n${body}`)
}

export function steps(...parts: NoteBlock[]): NoteBlock[] {
  return parts
}

/**
 * Markdown code fence. Optional highlight=8-12 marks lines (lime bar in UI; copy is still full file).
 * Example: fence("js", "app.js", code, "10-18")
 */
export function fence(
  lang: string,
  filename: string,
  code: string,
  highlight?: string
): string {
  const hl = highlight ? ` highlight=${highlight}` : ""
  return `\`\`\`${lang}:${filename}${hl}\n${code.replace(/\n$/, "")}\n\`\`\``
}

/** Plain-English concept box before code (absolute-beginner topics). */
export function concept(id: string, title: string, body: string): NoteBlock {
  return info(id, title, body)
}

/** Step intro + code block. Optional afterCode: line-by-line read of the highlighted part. */
export function teachStep(
  n: number,
  title: string,
  explain: string,
  lang: string,
  filename: string,
  code: string,
  highlight?: string,
  afterCode?: string
): NoteBlock[] {
  const blocks: NoteBlock[] = [
    step(n, title, explain),
    md(`code-${n}-${filename}`, fence(lang, filename, code, highlight)),
  ]
  if (afterCode) {
    blocks.push(
      md(
        `after-${n}-${filename.replace(/\./g, "-")}`,
        `**What the new lines mean (read slowly):**\n\n${afterCode}`
      )
    )
  }
  return blocks
}

/** Short plain-English line for terminal commands */
export function termStep(
  n: number,
  title: string,
  explain: string,
  commands: string
): NoteBlock[] {
  return [
    step(n, title, explain),
    md(`term-${n}`, fence("bash", "terminal", commands)),
  ]
}
