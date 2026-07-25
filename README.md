# TailoredTech Website

Professional portfolio site for **TailoredTech** — custom maritime software solutions.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui
- Framer Motion + GSAP (scroll animations)
- Lucide icons
- Magic UI / Aceternity-inspired effects (customized to brand)

## Configure content

Edit JSON files in `src/config/`:

| File | Purpose |
|------|---------|
| `company.json` | Name, SEO, contact, stats, logo paths |
| `theme.json` | Color palette (injected as CSS variables) |
| `clients.json` | Client logos / links / sectors |
| `services.json` | Solutions for nav bento + services page |
| `projects.json` | Portfolio / selected work |
| `timeline.json` | Company history |
| `navigation.json` | Nav links + CTA |

### Replace the logo

Put your files in `public/`:

- `logo.svg` — used on light backgrounds
- `logo-light.svg` — used on dark footer

Update paths in `company.json` if needed.

### Theme

`theme.json` drives the maritime palette (navy + teal). Values are injected in the root layout via `buildThemeCss()`. Change tokens there — components use semantic classes (`bg-primary`, `text-accent`, etc.).

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

## Pages

- `/` — Home (alternating dark/light sections)
- `/services` — Full solutions page (SEO-focused)

## SEO

- Metadata + Open Graph from `company.json`
- JSON-LD Organization + ProfessionalService
- `sitemap.xml` + `robots.txt`
- Target keywords: maritime software solutions, maritime custom software solutions
