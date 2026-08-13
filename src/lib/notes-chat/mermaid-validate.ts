/**
 * Server-side mermaid validation — DOM-free.
 *
 * We deliberately do NOT import `mermaid` here. Mermaid 11 imports `dompurify`,
 * whose ESM build calls `createDOMPurify()` at module load. In a Node server
 * runtime (no `window`/`document`) that returns a partial mock object that is
 * missing `addHook`, so `mermaid.parse(...)` throws
 * `dompurify.default.addHook is not a function`. Rendering already happens in
 * the browser, which surfaces real syntax errors visually; this validator is
 * only a cheap guardrail to catch obvious mistakes before we persist a block.
 */

export function sanitizeMermaidSource(diagram: string): string {
  return diagram
    .replace(/^```(?:mermaid)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim()
}

/** Catch common label mistakes Mermaid rejects (e.g. PIPE in [labels]). */
function heuristicMermaidIssues(source: string): string | null {
  if (/\[[^\]\n]*\|[^\]\n]*\]/.test(source)) {
    return "Node label contains '|' which Mermaid rejects. Use short labels without pipes (e.g. MIGRATE ~6mo)."
  }
  if (/\([^)\n]*\|[^)\n]*\)/.test(source)) {
    return "Rounded node label contains '|'. Remove the pipe from the label text."
  }
  if (/\{[^}\n]*\|[^}\n]*\}/.test(source)) {
    return "Diamond node label contains '|'. Remove the pipe from the label text."
  }
  return null
}

/** Validate mermaid source without rendering. Returns error message or null. */
export async function validateMermaidSource(
  diagram: string
): Promise<string | null> {
  const source = sanitizeMermaidSource(diagram)
  if (!source) return "Empty mermaid diagram"
  return heuristicMermaidIssues(source)
}
