export type DiffLineKind = "add" | "remove" | "context"

export type ParsedNoteCode = {
  /** Code sent to Shiki (prefixes stripped, optional [!code] markers kept) */
  displayCode: string
  /** What Copy writes: needed file, no removed lines, no markers */
  copyCode: string
  kinds: DiffLineKind[]
  hasDiff: boolean
}

const NOTATION_RE = /(?:\/\/|<!--|#|--)\s*\[!code\s*(\+\+|--)]\s*(?:-->)?\s*$/
const JSX_NOTATION_RE = /\{\s*\/\*\s*\[!code\s*(\+\+|--)]\s*\*\/\s*\}\s*$/
const PREFIX_RE = /^([+-])(?: |$)/

export function parseLineRanges(spec: string): number[] {
  const out: number[] = []
  for (const part of spec.split(",")) {
    const p = part.trim()
    if (!p) continue
    if (p.includes("-")) {
      const [start, end] = p.split("-").map((x) => Number(x.trim()))
      if (Number.isNaN(start) || Number.isNaN(end)) continue
      for (let i = start; i <= end; i++) out.push(i)
    } else {
      const n = Number(p)
      if (!Number.isNaN(n)) out.push(n)
    }
  }
  return [...new Set(out)].sort((a, b) => a - b)
}

export type CodeFenceMeta = {
  lang: string
  filename?: string
  addLines?: number[]
  removeLines?: number[]
}

export function parseCodeMeta(raw: string): CodeFenceMeta {
  const label = raw.replace(/^language-/, "").trim() || "plaintext"
  let rest = label
  let addLines: number[] | undefined
  let removeLines: number[] | undefined

  const addMatch = rest.match(/\b(?:add|highlight)=([0-9,\-\s]+)/i)
  if (addMatch) {
    addLines = parseLineRanges(addMatch[1]!)
    rest = rest.replace(addMatch[0], "").trim()
  }
  const removeMatch = rest.match(/\b(?:remove|del)=([0-9,\-\s]+)/i)
  if (removeMatch) {
    removeLines = parseLineRanges(removeMatch[1]!)
    rest = rest.replace(removeMatch[0], "").trim()
  }

  const colon = rest.indexOf(":")
  if (colon > 0) {
    const lang = rest.slice(0, colon)
    const filename = rest.slice(colon + 1).trim()
    if (filename.includes("/") || filename.includes(".")) {
      return { lang, filename, addLines, removeLines }
    }
  }
  const space = rest.indexOf(" ")
  if (space > 0) {
    return {
      lang: rest.slice(0, space),
      filename: rest.slice(space + 1).replace(/^filepath=/, "").trim(),
      addLines,
      removeLines,
    }
  }
  return { lang: rest, addLines, removeLines }
}

function stripNotation(line: string): { text: string; kind?: DiffLineKind } {
  let kind: DiffLineKind | undefined
  let text = line
  const jsx = text.match(JSX_NOTATION_RE)
  if (jsx) {
    kind = jsx[1] === "++" ? "add" : "remove"
    text = text.replace(JSX_NOTATION_RE, "").trimEnd()
  }
  const cmt = text.match(NOTATION_RE)
  if (cmt) {
    kind = cmt[1] === "++" ? "add" : "remove"
    text = text.replace(NOTATION_RE, "").trimEnd()
  }
  return { text, kind }
}

function stripPrefix(line: string): { text: string; kind?: DiffLineKind } {
  const m = line.match(PREFIX_RE)
  if (!m) return { text: line }
  return {
    text: line.slice(m[0].length),
    kind: m[1] === "+" ? "add" : "remove",
  }
}

export function parseNoteCodeDiff(
  code: string,
  meta?: Pick<CodeFenceMeta, "addLines" | "removeLines">
): ParsedNoteCode {
  const rawLines = code.replace(/\n$/, "").split("\n")
  const kinds: DiffLineKind[] = []
  const displayLines: string[] = []
  const copyLines: string[] = []

  rawLines.forEach((raw, i) => {
    const prefixed = stripPrefix(raw)
    const noted = stripNotation(prefixed.text)
    let kind: DiffLineKind = prefixed.kind ?? noted.kind ?? "context"
    const lineNo = i + 1
    if (meta?.removeLines?.includes(lineNo)) kind = "remove"
    else if (meta?.addLines?.includes(lineNo) && kind === "context") kind = "add"

    kinds.push(kind)
    displayLines.push(noted.text)
    if (kind !== "remove") copyLines.push(noted.text)
  })

  const hasDiff = kinds.some((k) => k !== "context")
  return {
    displayCode: displayLines.join("\n"),
    copyCode: copyLines.join("\n"),
    kinds,
    hasDiff,
  }
}
