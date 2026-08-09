let mermaidModule: typeof import("mermaid") | null = null

async function getMermaid() {
  if (mermaidModule) return mermaidModule.default
  mermaidModule = await import("mermaid")
  mermaidModule.default.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    suppressErrorRendering: true,
  })
  return mermaidModule.default
}

/** Catch common label mistakes Mermaid rejects (e.g. PIPE in [labels]). */
function heuristicMermaidIssues(source: string): string | null {
  // Node / stadium / cylinder style labels with a raw pipe
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

/** Validate mermaid source without rendering SVG. Returns error message or null. */
export async function validateMermaidSource(
  diagram: string
): Promise<string | null> {
  const source = sanitizeMermaidSource(diagram)
  if (!source) return "Empty mermaid diagram"

  const heuristic = heuristicMermaidIssues(source)
  if (heuristic) return heuristic

  try {
    const mermaid = await getMermaid()
    await mermaid.parse(source)
    return null
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : typeof err === "string"
          ? err
          : "Invalid mermaid diagram"
    const cleaned = message
      .replace(/^Error:\s*/i, "")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .slice(0, 4)
      .join(" ")
    return cleaned || "Invalid mermaid diagram"
  }
}

export function sanitizeMermaidSource(diagram: string): string {
  return diagram
    .replace(/^```(?:mermaid)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim()
}
