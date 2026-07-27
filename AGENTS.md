<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# TailoredTech site — agent map

Brand-first maritime software marketing site (Next.js App Router). Content is JSON-driven; visuals follow a fixed identity system.

## Branding (do not drift)

| Token | Value | Use |
|--------|--------|-----|
| Accent | `#D4FF00` | CTAs, highlights, pixel accents |
| Accent fg | `#0A0A0A` | Text on accent |
| Dark | `#050505` / black | Heroes, dark sections |
| Light | near-white section | Stats, clients, related |
| Radius | `0` / sharp | Buttons, cards, dialogs |
| Display type | `font-pixel-circle` | Heroes, section titles, key numbers |
| Eyebrows | `font-mono` uppercase tracking | Labels only |
| Body | Geist / muted opacity | Paragraphs, not pixel |

**Prefer:** full-bleed dark heroes, GlyphMatrix atmosphere, lime accent, pixel headlines, no purple/glow/pill clutter.  
**Avoid:** Inter/Roboto defaults, rounded-full pills, generic purple gradients, inset hero cards.

## Content & config

| File | Role |
|------|------|
| `src/config/services.json` | Solutions list + each detail `page` |
| `src/config/hero.json` | Home hero morph, globe, glyphs |
| `src/config/company.json` | Name, contact, stats, SEO |
| `src/config/*.json` | clients, projects, timeline, navigation, theme |
| `src/lib/content.ts` | `site` bag + `getServiceBySlug`, `getServiceSlugs`, `getRelatedServices` |

### Editing a solution

1. Open `src/config/services.json`.
2. Each item needs: `id`, `title`, `short`, `description`, `icon`, `logo` (path or `null`), `href` (`/services/{id}`), `featured`, `page`.
3. Under `page`, customize:
   - `enabled` — show detail route
   - `eyebrow`, `headline`, `headlineAccent`, `tagline`
   - `heroVisual` — `"engine"` \| `"glyph"`
   - `demo` — Book demo labels
   - `outcomes[]` — `{ value, label }`
   - `sections[]` — `{ id, title, body, bullets[] }` (drives content + layer nav)
   - `related[]` — other solution `id`s
4. Optional logo: set `logo` to a public path (e.g. `/logos/fleet.svg`); icon fallback via Lucide name in `icon`.
5. New solution → new item + unique `id` + `href: "/services/your-id"`; route is generated from `getServiceSlugs()`.

Icons for the layer nav are mapped in `src/components/sections/section-layer-nav.tsx` (`SECTION_ICONS` by section `id`). Optional per-section `image` can print on the plate face.

## Routes

| Path | Source |
|------|--------|
| `/` | `src/app/page.tsx` — hero → clients → solutions → layer-collapse → stats → work → timeline → contact |
| `/services` | `src/app/services/page.tsx` — services hero + index list |
| `/services/[slug]` | `src/app/services/[slug]/page.tsx` — solution detail |

Sitemap includes all enabled solution slugs (`src/app/sitemap.ts`).

## Main UI pieces

| Component | Path | Notes |
|-----------|------|--------|
| Home hero | `sections/hero.tsx` | Brand morph, globe, pixel type |
| Services hero | `sections/services-hero.tsx` | Engine shader + CTAs |
| Solution detail | `sections/solution-detail.tsx` | Hero, outcomes, dark sections, float CTA |
| Layer nav | `sections/section-layer-nav.tsx` | Desktop-only isometric section deck |
| Book demo | `sections/book-demo-dialog.tsx` | Dialog form; used in hero + sticky CTA |
| Section shell | `layout/section.tsx` | `tone="light"\|"dark"`, shared header |
| Nav / footer | `layout/navbar.tsx`, `footer.tsx` | Links use `service.href` |
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

**Components**
- `SectionImageGrid` — default on solution pages
- `SectionImageStack` — fanned stack; keep for other surfaces / experiments
- `SectionVideo`, `BrandedMermaid` — video + brand-themed diagrams

### Comparison table (`page.comparison`)

Light section **above** detail sections (not inside them). Grey / black only — no accent lime.

| Field | Notes |
|--------|--------|
| `enabled` | Show/hide |
| `eyebrow`, `title` | Header copy |
| `columns[]` | `{ id, label, highlight? }` — highlight = this solution |
| `rows[]` | `{ label, cells[] }` |
| `cells[].type` | `check` \| `x` \| `number` \| `text` |
| `cells[].value` | boolean / number / string as needed |

Sticky header + sticky capability column; scrolls inside a capped viewport on mobile.

## Preferences when changing UI

1. Keep identity fonts on headlines/numbers; body stays readable sans.
2. Match home/services black + lime language on new surfaces.
3. Prefer config edits over hardcoding copy.
4. Desktop-only experiments (layer nav) must stay `hidden lg:block` (or equivalent).
5. Read Next docs under `node_modules/next/dist/docs/` before new App Router APIs.
