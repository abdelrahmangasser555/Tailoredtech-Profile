/**
 * Bind mermaid SVG nodes to explain-sheet ids.
 * Mermaid ids look like flowchart-H-0 or actor-Crew.
 */

export function mermaidSvgIdToNodeKey(svgId: string): string {
  return svgId
    .replace(/^(flowchart|graph|actor|seq|statediagram|class|er|mindmap)-/i, "")
    .replace(/-\d+$/, "")
}

export function bindMermaidNodeExplains(
  root: HTMLElement,
  nodeExplains: Record<string, string>,
  onExplain: (id: string) => void
): () => void {
  const keys = Object.keys(nodeExplains)
  if (keys.length === 0) return () => undefined

  const keySet = new Set(keys)
  const listeners: Array<{ el: Element; fn: EventListener }> = []

  const groups = root.querySelectorAll<SVGGElement>(
    "g.node, g.actor, g.actor-top, g.actor-bottom"
  )

  groups.forEach((g) => {
    const svgId = g.getAttribute("id") ?? ""
    const fromId = mermaidSvgIdToNodeKey(svgId)
    let key = keySet.has(fromId) ? fromId : undefined
    if (!key) {
      key = keys.find(
        (k) =>
          svgId === k ||
          svgId.includes(`-${k}-`) ||
          svgId.endsWith(`-${k}`) ||
          svgId.includes(k)
      )
    }
    if (!key) return
    const explainId = nodeExplains[key]
    if (!explainId) return

    g.style.cursor = "pointer"
    g.setAttribute("tabindex", "0")
    g.setAttribute("role", "button")
    g.setAttribute("aria-label", `More about ${key}`)
    g.classList.add("mermaid-explain-node")

    const fn: EventListener = (event) => {
      event.stopPropagation()
      onExplain(explainId)
    }
    g.addEventListener("click", fn)
    g.addEventListener("keydown", (event) => {
      const ke = event as KeyboardEvent
      if (ke.key === "Enter" || ke.key === " ") {
        ke.preventDefault()
        onExplain(explainId)
      }
    })
    listeners.push({ el: g, fn })
  })

  return () => {
    listeners.forEach(({ el, fn }) => el.removeEventListener("click", fn))
  }
}
