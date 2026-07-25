import theme from "@/config/theme.json"

type ThemeTokens = Record<string, string>

function tokensToCss(tokens: ThemeTokens, prefix = "") {
  return Object.entries(tokens)
    .filter(([key]) => key !== "radius" || prefix === "")
    .map(([key, value]) => {
      if (key === "radius") return `--radius: ${value};`
      return `--${key}: ${value};`
    })
    .join("\n  ")
}

/** Builds CSS custom properties from `src/config/theme.json` */
export function buildThemeCss() {
  const light = tokensToCss(theme.light as ThemeTokens)
  const dark = tokensToCss(theme.dark as ThemeTokens)

  return `
:root {
  ${light}
  --section-dark: ${theme.section.dark};
  --section-light: ${theme.section.light};
  --section-mesh: ${theme.section.mesh};
}
.dark, [data-theme="dark"] {
  ${dark}
}
`.trim()
}
