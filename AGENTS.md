<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# TailoredTech site — agent map

Brand-first maritime software marketing site (Next.js App Router). Content is JSON-driven; visuals follow a fixed identity system.

## Branding (do not drift)

| Token | Value | Use |
|--------|--------|-----|
| Accent | `#D4FF00` | **Dark surfaces only** — CTAs, highlights, pixel accents |
| Accent fg | `#0A0A0A` | Text on accent |
| Dark | `#050505` / black | Heroes, dark sections |
| Light | near-white section | Stats, clients, related, timeline |
| Radius | `0` / sharp | Buttons, cards, dialogs |
| Display type | `font-pixel-circle` | Heroes, section titles, key numbers |
| Eyebrows | `font-mono` uppercase tracking | Labels only |
| Body | Geist / muted opacity | Paragraphs, not pixel |

**Light surfaces:** black + grey + brand fonts only. **Never** put `#D4FF00` on white / `--section-light` (looks washed). Marks, bullets, underlines, watermarks → black/grey.

**Prefer:** full-bleed dark heroes, GlyphMatrix atmosphere, lime accent on dark, pixel headlines, no purple/glow/pill clutter.  
**Avoid:** Inter/Roboto defaults, rounded-full pills, generic purple gradients, inset hero cards, lime on light.

## Content & config

| File | Role |
|------|------|
| `src/config/services.json` | Solutions list + each detail `page` |
| `src/config/presentations.json` | Client presentations (direct URL; no nav/footer/CTAs) |
| `src/config/hero.json` | Home hero morph, globe, glyphs |
| `src/config/company.json` | Name, contact, stats, SEO |
| `src/config/*.json` | clients, projects, timeline, navigation, theme |
| `src/lib/content.ts` | `site` bag + service/presentation helpers |

### Editing a solution

1. Open `src/config/services.json`.
2. Each item needs: `id`, `title`, `short`, `description`, `icon`, `logo` (path or `null`), `href` (`/services/{id}`), `featured`, `page`.
3. Under `page`, customize:
   - `enabled` — show detail route
   - `eyebrow`, `headline`, `headlineAccent`, `tagline`
   - `heroVisual` — right-side hero shader (see **Solution hero visual** below)
   - `demo` — Book demo labels
   - `outcomes[]` — `{ value, label, icon? }` — optional Phosphor icon name (bold watermark behind the number)
   - `comparison` — optional comparison table (see below); set `enabled: true` to show
   - `sections[]` — `{ id, title, body, bullets[] }` (drives content + layer nav)
   - `related[]` — other solution `id`s
4. Optional logo: set `logo` to a public path (e.g. `/logos/fleet.svg`). Solution **hero** shows the logo only when set — otherwise just the `eyebrow` text (no Lucide/generic icon box). List cards may still use Lucide via top-level `icon`.
5. New solution → new item + unique `id` + `href: "/services/your-id"`; route is generated from `getServiceSlugs()`.

### Solution hero visual (`page.heroVisual`)

Edit in `src/config/services.json` → each item’s `page.heroVisual`. Wired by `SolutionHeroVisual`.

| Value | Visual |
|--------|--------|
| `"engine"` | ColorPanels engine (default) |
| `"ocean"` | Dithering swirl — brand lime `#D4FF00` |
| `"heatmap"` / `"heatmap-diamond"` | Heatmap through diamond shape |
| `"heatmap-eyes"` | Heatmap through eyes (`/assets/heatmap-eyes.svg`) |
| `"glyph"` / `"none"` | No right visual (glyph backdrop only) |

Try variants by changing Fleet’s value, e.g. `"heroVisual": "ocean"`, then open `/services/fleet-operations`.

Icons for the layer nav are mapped in `src/components/sections/section-layer-nav.tsx` (`SECTION_ICONS` by section `id`). Optional per-section `image` can print on the plate face.

**Outcome watermark icons** use **Phosphor** (`@phosphor-icons/react`, `weight="bold"`) — thicker, modern strokes that fit the sharp/pixel brand better than Lucide for large backdrops. Curated names live in `src/components/sections/outcome-icon.tsx` (`Broadcast`, `Binoculars`, `Table`, `Boat`, `Eye`, …). Add a name there before using it in JSON.

## Routes

| Path | Source |
|------|--------|
| `/` | `src/app/page.tsx` — hero → clients → solutions → layer-collapse → stats → work → timeline → contact |
| `/services` | `src/app/services/page.tsx` — services hero + index list |
| `/services/[slug]` | `src/app/services/[slug]/page.tsx` — solution detail |
| `/presentations` | `src/app/presentations/page.tsx` — direct-URL list (noindex, no nav/footer) |
| `/presentations/[slug]` | `src/app/presentations/[slug]/page.tsx` — presentation detail |

Sitemap includes all enabled solution slugs (`src/app/sitemap.ts`). Presentations are **not** in the sitemap / robots (direct URL only).

## Main UI pieces

| Component | Path | Notes |
|-----------|------|--------|
| Home hero | `sections/hero.tsx` | Brand morph, globe, pixel type |
| Services hero | `sections/services-hero.tsx` | Engine shader + CTAs |
| Solution detail | `sections/solution-detail.tsx` | Hero, outcomes (+ icons), comparison, dark sections, float CTA |
| Presentation detail | `sections/presentation-detail.tsx` | Like solution, no CTAs/related; `brandClass` + client logo |
| Presentation list | `sections/presentation-list.tsx` | Mini-hero cards + created/updated dates |
| Solution hero visual | `sections/solution-hero-visual.tsx` | `page.heroVisual`: engine / ocean / heatmap / glyph |
| Comparison table | `sections/solution-comparison-table.tsx` | Optional `page.comparison`; sticky heads; dashed divider |
| Section chart | `sections/section-chart.tsx` | Config-driven bar/line/area/pie/radar (shadcn + Recharts) |
| Outcome icons | `sections/outcome-icon.tsx` | Phosphor bold watermarks for outcomes |
| Layer nav | `sections/section-layer-nav.tsx` | Desktop-only isometric section deck |
| Book demo | `sections/book-demo-dialog.tsx` | Dialog form; used in hero + sticky CTA |
| Section shell | `layout/section.tsx` | `tone="light"\|"dark"`, shared header |
| Nav / footer | `layout/navbar.tsx`, `footer.tsx` | Hidden on `/presentations` via `SiteChrome` |
| Motion | `motion/reveal.tsx`, `gsap-reveal.tsx` | Framer + GSAP; Lenis smooth scroll in layout |

## Solution detail behavior

- Desktop: sticky isometric layer nav tracks scroll; hover spreads; active plate slides out; dashed perpendicular callout shows title.
- Mobile: layer nav hidden — only section content (titles + body + bullets).
- After hero leaves view: fixed bottom-right Book demo CTA.
- Demo copy and sections all come from `services.json` → `page`.

### Solution section media (in `page.sections[]`)

| Field | Type | Notes |
|--------|------|--------|
| `video` | `string \| null` | e.g. `/assets/hero_section.mp4` |
| `images` | `{ src, label }[]` | Grid gallery by default; hover shows `label` in pixel font |
| `mermaid` | `string \| null` | Prefer dashed links (`-.->` / `-->>`) |
| `mermaidTitle` | `string \| null` | Block title (not generic “Diagram”) |
| `mermaidCaption` | `string \| null` | Optional line under the diagram |
| `chart` | object \| `null` | Optional shadcn/Recharts chart — see below |

**Components**
- `SectionImageGrid` — default on solution pages
- `SectionImageStack` — fanned stack; keep for other surfaces / experiments
- `SectionVideo`, `BrandedMermaid` — video + brand-themed diagrams
- `SectionChart` — config-driven charts (bar / line / area / pie / radar)

### Section chart (`page.sections[].chart`)

Works on **solutions and presentations**. Set `"enabled": false` or omit/`null` to hide.

| Field | Notes |
|--------|--------|
| `type` | `bar` \| `line` \| `area` \| `pie` \| `radar` |
| `title`, `description`, `caption` | Optional chrome around the chart |
| `xKey` | Category field in each data row |
| `valueKey` | Pie only — numeric field (defaults to first series key) |
| `series[]` | `{ key, label, color? }` — `color` like `"var(--chart-1)"` |
| `data[]` | Rows of numbers/strings keyed by `xKey` + series keys |
| `stacked`, `showLegend`, `showGrid`, `curve` | Optional (`curve`: `natural` \| `linear` \| `step`) |

### Presentations (`src/config/presentations.json`)

Same section/outcomes/comparison shape as solutions, plus:

| Field | Notes |
|--------|--------|
| `brandClass` | e.g. `"brand-bahri"` — CSS class in `globals.css` that remaps `--accent` / sections / charts |
| `clientLogo`, `clientName` | Top-left hero logo |
| `createdAt`, `updatedAt` | ISO dates — list page only, not inside the deck |
| No `demo` / `related` | No Book demo, float CTA, related links, or site footer |

Bahri brand tokens: navy `#003C71`, orange `#FF681D`, gray `#A8A8AA`, dark navy surfaces `#001F3D`.

### Comparison table (`page.comparison`)

Optional light section **above** detail sections (not inside them). Grey / black only — no accent lime. When `enabled` and outcomes exist, a dashed divider renders between them.

| Field | Notes |
|--------|--------|
| `enabled` | Show/hide the whole block |
| `eyebrow`, `title` | Header copy |
| `columns[]` | `{ id, label, highlight? }` — highlight = this solution |
| `rows[]` | `{ label, cells[] }` |
| `cells[].type` | `check` \| `x` \| `number` \| `text` |
| `cells[].value` | boolean / number / string as needed |

Sticky column headers on **page scroll** at `top: 0` (no max-height). Horizontal scroll on narrow screens only. Toggle with `"enabled": false` to hide.

### Outcomes (`page.outcomes[]`)

| Field | Notes |
|--------|--------|
| `value` | Big pixel number / string |
| `label` | Caption under the value |
| `icon` | Optional Phosphor name (see `outcome-icon.tsx`) — bold grey watermark behind the number |

## Preferences when changing UI

1. Keep identity fonts on headlines/numbers; body stays readable sans.
2. Match home/services black + lime language on new surfaces.
3. Prefer config edits over hardcoding copy.
4. Desktop-only experiments (layer nav) must stay `hidden lg:block` (or equivalent).
5. Read Next docs under `node_modules/next/dist/docs/` before new App Router APIs.
