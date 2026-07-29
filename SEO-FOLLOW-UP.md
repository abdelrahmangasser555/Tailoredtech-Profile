# SEO follow-up roadmap for TailoredTech

This document lists what was implemented in the codebase and what still needs to happen off-site and in content to push rankings for **maritime software solutions** and **maritime risk assessment software**.

---

## Implemented in this codebase

### Technical SEO
- Canonical URLs on home, services index, and every solution page
- `metadataBase` and `SITE_URL` single source (`NEXT_PUBLIC_SITE_URL` or `https://tailoredtech.tech`)
- Expanded keyword set in `src/config/company.json`
- Per-solution metadata with targeted keywords (risk assessment page prioritised)
- `robots.txt` with sitemap reference, host, and crawl rules
- `sitemap.xml` with weekly change frequency and priority weighting for risk assessment
- Web app `manifest.webmanifest`
- Open Graph and Twitter card metadata on all main routes
- `googleBot` directives: large image preview, unlimited snippet length

### Structured data (JSON-LD)
- `Organization` (global, in layout)
- `WebSite` with `SearchAction` (global)
- `ProfessionalService` (home)
- `ItemList` of solutions (home + services index)
- `SoftwareApplication` per solution page
- `BreadcrumbList` per solution page

### Content hygiene
- Removed em dashes from user-facing copy in config and UI strings (reads more natural, less templated)

---

## Critical: do before expecting rankings

### 1. Domain and hosting alignment
- [ ] Confirm production domain: `tailoredtech.tech` vs `tailoredtech.io` (layout previously used `.io`, email uses `.tech`)
- [ ] Set `NEXT_PUBLIC_SITE_URL=https://your-production-domain` in Vercel/hosting env
- [ ] 301 redirect all non-canonical domains to one primary domain
- [ ] SSL certificate on primary domain only

### 2. Google Search Console & Analytics
- [ ] Add property for primary domain in [Google Search Console](https://search.google.com/search-console)
- [ ] Submit `https://your-domain/sitemap.xml`
- [ ] Request indexing for: `/`, `/services`, `/services/digital-risk-assessments`
- [ ] Connect GA4 for behaviour and conversion tracking (demo requests, contact form)
- [ ] Set up conversion events: demo modal submit, contact form submit

### 3. Open Graph images (high impact)
- [ ] Create dedicated OG image (1200×630): logo, headline “Maritime software solutions”, dark brand background
- [ ] Add per-solution OG images or one template with solution name
- [ ] Place assets in `public/og/` and reference in `src/lib/seo.ts`

### 4. Performance (Core Web Vitals)
- [ ] Run Lighthouse on mobile for home and risk assessment page; target 90+ performance
- [ ] Optimise shader-heavy sections for LCP (lazy load below-fold visuals)
- [ ] Ensure images use `next/image` with width/height everywhere
- [ ] Enable Vercel Analytics / Speed Insights

---

## Content SEO (highest leverage for your keywords)

### 5. Landing page depth for risk assessment
- [ ] Add 800–1200 words of indexable copy on `/services/digital-risk-assessments` (currently section-driven; ensure H2/H3 hierarchy matches search intent)
- [ ] Target phrases in copy naturally:
  - maritime risk assessment software
  - digital risk assessment for vessels
  - fleet risk management platform
  - office superintendent risk workflow
- [ ] Add FAQ section with FAQPage JSON-LD (5–8 real buyer questions)

### 6. Maritime software solutions hub
- [ ] Expand `/services` intro paragraph above the list (what you build, who for, 107+ vessels proof)
- [ ] Internal links from home hero, footer, and blog (when live) to risk + solutions hub

### 7. Case studies and proof (E-E-A-T)
- [ ] Publish Bahri / fleet case study page (`/work/bahri-risk-platform` or similar)
- [ ] Add client logos with `alt` text naming sector + relationship
- [ ] Add team or “About” page with real founders, Dubai office, maritime focus

### 8. Blog / resources (ongoing)
Priority articles to outrank generic vendor pages:
1. “Maritime risk assessment software: what fleet operators need in 2026”
2. “Digital risk assessment vs spreadsheet RA for vessels”
3. “How to choose maritime software solutions for your fleet”
4. “MOC software for shipping: building approval workflows”
5. “Behaviour based safety software for vessel and office teams”

Each post: 1500+ words, internal links to solution pages, one primary keyword, author byline.

---

## Authority and off-page SEO

### 9. Backlinks (required to rank #1 for competitive terms)
- [ ] Maritime directories: Lloyd’s List, Splash 247 partner listings, industry associations
- [ ] LinkedIn company page aligned with site copy and link to risk assessment page
- [ ] GitHub org profile linking to site
- [ ] Press / partner announcement when major fleet deployments go public
- [ ] Guest posts on maritime ops blogs (gCaptain, Maritime Executive outreach)

### 10. Local / regional
- [ ] Google Business Profile for Dubai office (if physical presence allows)
- [ ] NAP consistency: name, `admin@tailoredtech.tech`, Dubai UAE across LinkedIn, footer, GBP

---

## Advanced technical (next sprint)

### 11. Rich results expansion
- [ ] `FAQPage` schema on risk assessment page
- [ ] `Review` / `AggregateRating` only when you have verifiable public reviews (do not fake)
- [ ] `VideoObject` if you publish product demo videos on-site

### 12. International
- [ ] If targeting EU operators: `hreflang` only when you ship translated pages (do not add empty hreflang)

### 13. Crawl efficiency
- [ ] `llms.txt` / `ai.txt` optional summary for AI crawlers (emerging practice)
- [ ] Monitor GSC “Crawled, not indexed” for shader-only thin pages

### 14. Conversion SEO
- [ ] Thank-you state on forms with clear next steps (reduces bounce)
- [ ] Phone number in `company.json` when available (local trust signal)

---

## Keyword tracking checklist

Monitor weekly in GSC + rank tracker:

| Priority keyword | Target page |
|------------------|-------------|
| maritime software solutions | `/services`, `/` |
| maritime risk assessment software | `/services/digital-risk-assessments` |
| digital risk assessment maritime | `/services/digital-risk-assessments` |
| custom maritime software | `/`, `/services` |
| vessel risk assessment software | `/services/digital-risk-assessments` |
| maritime safety software | `/services/bbs`, `/services/digital-risk-assessments` |
| management of change software maritime | `/services/moc-pcr` |

---

## Realistic expectations

Ranking **first** for broad terms like “maritime software solutions” competes with DNV, ABS, PRIME Marine, ShipManager, and established SaaS vendors. Your edge is **tailored deployment**, **107+ vessels live**, and **digital risk assessment depth**.

Short-term realistic wins (3–6 months with content + backlinks):
- Long-tail: “digital risk assessment software for vessels”
- “tailored maritime risk assessment platform”
- “custom maritime software Dubai” / “shipping software UAE”

Broad head terms require sustained content, backlinks, and brand search growth over 12–24 months.

---

## Environment variable

```bash
# .env.local (production)
NEXT_PUBLIC_SITE_URL=https://tailoredtech.tech
```

Redeploy after setting so sitemap, canonicals, and JSON-LD URLs match production.
