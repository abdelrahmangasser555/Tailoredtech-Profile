/** Shared Mermaid DOM cleanup — kept out of branded-mermaid so notes can import
 *  helpers without next/dynamic chunking the heavy mermaid module. */

export function removeMermaidTempNodes(renderId: string) {
  if (typeof document === "undefined") return
  // Mermaid mounts a temp host as `#d{id}`. The SVG itself also uses `{id}` —
  // never remove by bare id after we copy it into `.mermaid-brand`, or the
  // diagram vanishes and leaves an empty black box.
  const host = document.getElementById(`d${renderId}`)
  if (host && !host.closest(".mermaid-brand, .mermaid-expand-scroll")) {
    host.remove()
  }
  const bare = document.getElementById(renderId)
  if (
    bare &&
    !bare.closest(".mermaid-brand, .mermaid-expand-scroll") &&
    (bare.parentElement === document.body || bare.id.startsWith("d"))
  ) {
    bare.remove()
  }
}

/**
 * Remove only Mermaid "bomb" error SVGs left on the document.
 * Never wipe active `mermaid-*` temp nodes — concurrent renders need them.
 */
export function cleanupMermaidOrphans(renderId?: string) {
  if (typeof document === "undefined") return
  if (renderId) removeMermaidTempNodes(renderId)

  document.querySelectorAll("svg").forEach((svg) => {
    if (svg.closest(".mermaid-brand, .mermaid-expand-scroll")) return
    const text = svg.textContent ?? ""
    if (!text.includes("Syntax error in text")) return
    const parent = svg.parentElement
    if (
      parent &&
      parent !== document.body &&
      parent.childElementCount <= 2 &&
      (/^d?mermaid/i.test(parent.id) || parent.getAttribute("data-mermaid") != null)
    ) {
      parent.remove()
    } else {
      svg.remove()
    }
  })
}
