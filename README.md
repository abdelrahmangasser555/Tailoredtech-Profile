# TailoredTech Website

Professional portfolio site for **TailoredTech** — custom maritime software solutions.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Framer Motion + GSAP + Lenis
- Lucide icons

## Configure content

Edit JSON files in `src/config/`:

| File | Purpose |
|------|---------|
| `company.json` | Name, SEO, contact, stats (`target` for counter), logo, hero video |
| `theme.json` | Color palette (CSS variables) |
| `clients.json` | Client list + links |
| `services.json` | Solutions — set `logo` path **or** `icon` (Lucide name) |
| `projects.json` | Portfolio / selected work |
| `timeline.json` | Company history |
| `navigation.json` | Nav links + CTA |

### Service icons vs logos

In `services.json`, each item can use an icon:

```json
"icon": "Ship",
"logo": null
```

or a custom mark (wins over icon in the Solutions menu):

```json
"icon": "Ship",
"logo": "/services/fleet.svg"
```

### Replace the brand logo

- `public/logo.svg` — light backgrounds
- `public/logo-light.svg` — dark backgrounds / footer

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm start
```
