import { Text } from "@react-pdf/renderer"
import type { ReactNode } from "react"

export type ScriptSegment = { text: string; arabic: boolean }

/** Split mixed EN/AR strings so each run can use the correct PDF font. */
export function splitByScript(input: string): ScriptSegment[] {
  if (!input) return []
  const segments: ScriptSegment[] = []
  const re =
    /([\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u0660-\u0669]+)|([^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u0660-\u0669]+)/g
  let match: RegExpExecArray | null
  while ((match = re.exec(input)) !== null) {
    if (match[1]) segments.push({ text: match[1], arabic: true })
    else if (match[2]) segments.push({ text: match[2], arabic: false })
  }
  return segments.length ? segments : [{ text: input, arabic: false }]
}

type MixedTextProps = {
  children: string
  // react-pdf Text style (loose to avoid fighting StyleSheet types)
  style?: object | object[]
  latinFamily?: string
  arabicFamily?: string
}

/**
 * Renders mixed Latin + Arabic in one line with the correct font per run.
 * Fixes mojibake when Arabic is drawn with a Latin-only TTF.
 */
export function MixedText({
  children,
  style,
  latinFamily = "InvoiceSans",
  arabicFamily = "InvoiceArabic",
}: MixedTextProps): ReactNode {
  const segments = splitByScript(children)
  return (
    <Text style={style as never}>
      {segments.map((seg, i) => (
        <Text
          key={i}
          style={{
            fontFamily: seg.arabic ? arabicFamily : latinFamily,
          }}
        >
          {seg.text}
        </Text>
      ))}
    </Text>
  )
}
