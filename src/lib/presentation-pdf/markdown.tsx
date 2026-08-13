import { Text, View, StyleSheet } from "@react-pdf/renderer"
import type { PresentationPdfBrand } from "@/lib/presentation-pdf/brand"

type Block =
  | { type: "h3"; text: string }
  | { type: "p"; parts: InlinePart[] }
  | { type: "ul"; items: InlinePart[][] }
  | { type: "table"; headers: InlinePart[][]; rows: InlinePart[][][] }

type InlinePart = { text: string; bold?: boolean }

function parseInline(text: string): InlinePart[] {
  const parts: InlinePart[] = []
  const re = /\*\*(.+?)\*\*/g
  let last = 0
  let match: RegExpExecArray | null
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      parts.push({ text: text.slice(last, match.index) })
    }
    parts.push({ text: match[1]!, bold: true })
    last = match.index + match[0].length
  }
  if (last < text.length) parts.push({ text: text.slice(last) })
  return parts.length ? parts : [{ text }]
}

/** Parse light markdown used in presentation section bodies. */
export function parsePresentationMarkdown(source: string): Block[] {
  const lines = source.replace(/\r\n/g, "\n").split("\n")
  const blocks: Block[] = []
  let paragraph: string[] = []
  let listItems: string[] = []
  let tableLines: string[] = []

  const flushParagraph = () => {
    if (!paragraph.length) return
    const text = paragraph.join(" ").trim()
    if (text) blocks.push({ type: "p", parts: parseInline(text) })
    paragraph = []
  }

  const flushList = () => {
    if (!listItems.length) return
    blocks.push({
      type: "ul",
      items: listItems.map((item) => parseInline(item)),
    })
    listItems = []
  }

  const flushTable = () => {
    if (tableLines.length < 2) {
      // Not enough for a table; treat as paragraph
      if (tableLines.length) {
        paragraph.push(...tableLines)
      }
      tableLines = []
      return
    }

    const parseRow = (line: string): string[] =>
      line
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map((cell) => cell.trim())

    const headers = parseRow(tableLines[0]!).map(parseInline)
    // Skip separator row (line 1: |---|---|)
    const rows = tableLines.slice(2).map((line) =>
      parseRow(line).map(parseInline)
    )

    blocks.push({ type: "table", headers, rows })
    tableLines = []
  }

  for (const raw of lines) {
    const line = raw.trimEnd()
    const trimmed = line.trim()

    // Table detection: line starts and ends with |
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      flushParagraph()
      flushList()
      tableLines.push(trimmed)
      continue
    }

    // Non-table line: flush any accumulated table
    if (tableLines.length) {
      flushTable()
    }

    if (!trimmed) {
      flushParagraph()
      flushList()
      continue
    }

    if (trimmed.startsWith("### ")) {
      flushParagraph()
      flushList()
      blocks.push({ type: "h3", text: trimmed.slice(4).trim() })
      continue
    }

    if (/^[-*]\s+/.test(trimmed)) {
      flushParagraph()
      listItems.push(trimmed.replace(/^[-*]\s+/, ""))
      continue
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      flushParagraph()
      listItems.push(trimmed.replace(/^\d+\.\s+/, ""))
      continue
    }

    flushList()
    paragraph.push(trimmed)
  }

  flushTable()
  flushParagraph()
  flushList()
  return blocks
}

const styles = StyleSheet.create({
  h3: {
    fontFamily: "GeistPixel",
    fontSize: 13,
    marginTop: 14,
    marginBottom: 6,
  },
  p: {
    fontFamily: "GeistSans",
    fontSize: 10,
    lineHeight: 1.55,
    marginBottom: 8,
  },
  bold: {
    fontFamily: "GeistSans",
    fontWeight: 500,
  },
  liRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 5,
    paddingRight: 8,
  },
  bullet: {
    width: 5,
    height: 5,
    marginTop: 4,
  },
  liText: {
    flex: 1,
    fontFamily: "GeistSans",
    fontSize: 10,
    lineHeight: 1.5,
  },
  table: {
    borderWidth: 0.75,
    borderColor: "rgba(10,10,10,0.22)",
    marginBottom: 10,
    marginTop: 4,
  },
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#F0F0EE",
    borderBottomWidth: 0.75,
    borderBottomColor: "rgba(10,10,10,0.22)",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(10,10,10,0.18)",
  },
  tableCell: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 6,
    fontSize: 9,
  },
  tableHeaderText: {
    fontFamily: "GeistSans",
    fontWeight: 500,
    fontSize: 9,
  },
  tableCellText: {
    fontFamily: "GeistSans",
    fontSize: 9,
  },
})

export function PdfMarkdownBody({
  source,
  brand,
}: {
  source: string
  brand: PresentationPdfBrand
}) {
  const blocks = parsePresentationMarkdown(source)

  return (
    <View>
      {blocks.map((block, i) => {
        if (block.type === "h3") {
          return (
            <Text key={i} style={[styles.h3, { color: brand.ink }]}>
              {block.text}
            </Text>
          )
        }

        if (block.type === "table") {
          const colCount = block.headers.length || 1
          return (
            <View key={i} style={styles.table} wrap={false}>
              <View style={styles.tableHeaderRow}>
                {block.headers.map((header, j) => (
                  <View
                    key={j}
                    style={[styles.tableCell, { flex: 1 / colCount }]}
                  >
                    <Text style={[styles.tableHeaderText, { color: brand.ink }]}>
                      {header.map((part, k) =>
                        part.bold ? (
                          <Text key={k} style={[styles.bold, { color: brand.ink }]}>
                            {part.text}
                          </Text>
                        ) : (
                          <Text key={k}>{part.text}</Text>
                        )
                      )}
                    </Text>
                  </View>
                ))}
              </View>
              {block.rows.map((row, r) => (
                <View
                  key={r}
                  style={[
                    styles.tableRow,
                    ...(r === block.rows.length - 1
                      ? [{ borderBottomWidth: 0 }]
                      : []),
                  ]}
                >
                  {row.map((cell, j) => (
                    <View
                      key={j}
                      style={[styles.tableCell, { flex: 1 / colCount }]}
                    >
                      <Text style={[styles.tableCellText, { color: brand.muted }]}>
                        {cell.map((part, k) =>
                          part.bold ? (
                            <Text key={k} style={[styles.bold, { color: brand.ink }]}>
                              {part.text}
                            </Text>
                          ) : (
                            <Text key={k}>{part.text}</Text>
                          )
                        )}
                      </Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )
        }

        if (block.type === "ul") {
          return (
            <View key={i} style={{ marginBottom: 8, marginTop: 2 }}>
              {block.items.map((item, j) => (
                <View key={j} style={styles.liRow} wrap={false}>
                  <View style={[styles.bullet, { backgroundColor: brand.accent }]} />
                  <Text style={[styles.liText, { color: brand.muted }]}>
                    {item.map((part, k) =>
                      part.bold ? (
                        <Text key={k} style={[styles.bold, { color: brand.ink }]}>
                          {part.text}
                        </Text>
                      ) : (
                        <Text key={k}>{part.text}</Text>
                      )
                    )}
                  </Text>
                </View>
              ))}
            </View>
          )
        }

        return (
          <Text key={i} style={[styles.p, { color: brand.muted }]}>
            {block.parts.map((part, k) =>
              part.bold ? (
                <Text key={k} style={[styles.bold, { color: brand.ink }]}>
                  {part.text}
                </Text>
              ) : (
                <Text key={k}>{part.text}</Text>
              )
            )}
          </Text>
        )
      })}
    </View>
  )
}
