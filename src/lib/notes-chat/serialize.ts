import type { NoteBlock, NoteDocument } from "@/lib/notes-types"

function blockToText(block: NoteBlock): string {
  switch (block.type) {
    case "markdown":
      return block.content
    case "youtube":
      return `[YouTube] ${block.title ?? block.url}\n${block.url}`
    case "stack":
      return `[Stack] ${block.title ?? "Architecture"}\n${JSON.stringify({ layers: block.layers, items: block.items, edges: block.edges }, null, 2)}`
    case "mermaid":
      return `[Mermaid] ${block.title ?? "Diagram"}\n\`\`\`mermaid\n${block.diagram}\n\`\`\``
    case "illustration":
      return `[Illustration] ${block.component}${block.title ? `: ${block.title}` : ""}`
    case "html":
      return `[HTML] ${block.title ?? block.id}\n${block.html.slice(0, 2000)}`
    case "link":
      return `[Link] ${block.label}: ${block.href}${block.description ? ` — ${block.description}` : ""}`
    case "callout":
      return `[Callout ${block.tone ?? "info"}] ${block.title ? `${block.title}: ` : ""}${block.body}`
    case "gallery":
      return `[Gallery] ${block.title ?? ""}\n${block.images.map((i) => `- ${i.label}: ${i.src}`).join("\n")}`
    case "terminal":
      return `[Terminal scenario] ${block.scenario}${block.title ? `: ${block.title}` : ""}`
    case "playground":
      return `[Code playground ${block.language ?? "js"}] ${block.title ?? ""}\n\`\`\`\n${block.initialCode}\n\`\`\``
    case "tasks": {
      const walk = (items: typeof block.items, depth: number): string =>
        items
          .map((t) => {
            const mark = t.done ? "[x]" : "[ ]"
            const line = `${"  ".repeat(depth)}- ${mark} ${t.label}${t.completedAt ? ` (${t.completedAt})` : ""}`
            const kids = t.children?.length ? `\n${walk(t.children, depth + 1)}` : ""
            return line + kids
          })
          .join("\n")
      return `[Tasks] ${block.title ?? ""}\n${walk(block.items, 0)}`
    }
    case "comparison": {
      const header = [
        block.rowHeader ?? "Capability",
        ...block.columns.map((c) => c.label),
      ].join(" | ")
      const body = block.rows
        .map((row) => {
          const cells = row.cells
            .map((c) => {
              if (c.type === "check") return c.value ? "yes" : "no"
              if (c.type === "x") return "no"
              return String(c.value)
            })
            .join(" | ")
          return `${row.label} | ${cells}`
        })
        .join("\n")
      return `[Comparison] ${block.title ?? ""}\n${header}\n${body}`
    }
    default:
      return `[Block ${(block as NoteBlock).type}]`
    }
}

/** Compact text representation for LLM context */
export function serializeNoteForContext(note: NoteDocument): string {
  const lines: string[] = [
    `# ${note.title} (${note.id})`,
    note.description ? `Description: ${note.description}` : "",
    "",
  ]

  for (const section of note.sections) {
    lines.push(`## Section: ${section.title} [${section.id}]`)
    for (const block of section.blocks) {
      lines.push(blockToText(block))
      lines.push("")
    }
  }

  return lines.filter(Boolean).join("\n")
}

/** Full JSON for edit mode */
export function serializeNoteJson(note: NoteDocument): string {
  return JSON.stringify(
    {
      id: note.id,
      name: note.name,
      title: note.title,
      description: note.description,
      sections: note.sections,
      explains: note.explains,
      questionnaires: note.questionnaires,
      variants: note.variants,
    },
    null,
    2
  )
}
