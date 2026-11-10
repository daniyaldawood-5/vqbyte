# VQBYTE website rules

These rules keep the site consistent, crawlable and focused on customers. Read them before adding or changing a page.

## 1. Information architecture (one page per intent)

| Section | URL pattern | Purpose |
|---|---|---|
| Home | `/` | Who we help, what we build, why us, next step |
| Services hub | `/services` | All services grouped: Business software, Engineering, Growth marketing |
| Service page | `/services/{slug}` | One service, one primary keyword cluster |
| Industries hub | `/industries` | All industries we serve |
| Industry page | `/industries/{slug}` | Industry problems → our software and services for them |
| Process | `/process` | How a project runs from discovery to support |
| Insights | `/insights` + `/insights/{slug}` | Guides that target informational keywords and link to services |
| Company | `/about`, `/contact` | Trust and conversion |
| Legal | `/legal/{privacy,terms,cookies}` | Required notices |

Rules:
- **No duplicate pages.** A topic gets one URL. The old `/products/*`, `/solutions/*`, `/work/*`, `/book-a-demo`, `/implementation`, `/resources/*` and `/company/about` URLs 301-redirect to their replacement (see `next.config.ts`). Never re-create them.
- All content lives in `content/*.ts`. Pages and templates render data; they don't hard-code copy that is repeated elsewhere.
- Company facts (email, phone, address, socials, domain) live only in `content/site.ts` and env vars.
- Healthcare / hospitals are out of scope. Do not add them as an industry.

## 2. SEO rules

- Every indexable page has a unique `title` (≤ 60 characters before the `| VQBYTE` suffix), a unique meta description (140–160 characters), one `<h1>`, a canonical URL and Open Graph data. Use `buildMetadata()` from `lib/seo.ts`.
- Primary keyword appears in the title, the H1 (or its close variant), the first paragraph and at least one H2. Write for people first: no keyword stuffing, no hidden text.
- Each service page targets one cluster (e.g. *ERP software development*, *custom ERP*, *ERP for small business*). Each industry page targets *"{industry} ERP / software"* terms.
- Structured data: `Organization` + `WebSite` sitewide; `Service` on service pages; `BreadcrumbList` on every inner page; `FAQPage` wherever FAQs are shown; `Article` on insights.
- Internal linking: service ↔ industry pages cross-link; every insight links to at least one service; every page ends with a related-links block and a CTA.
- Images: descriptive `alt` text, explicit width/height, lazy loading below the fold, files in `public/images/`.
- New URLs are added to the content arrays so `app/sitemap.ts` picks them up automatically.

## 3. Content rules

- Customer-first: lead with the customer's problem and the outcome, then explain how we deliver it.
- Plain, confident language. No filler like "leverage synergies". Short paragraphs, scannable lists.
- **Never invent proof.** No fake client logos, testimonials, awards, certifications or statistics. Add them only when they are real and approved.
- Use "we" for VQBYTE and "you" for the reader.
- Each page has one primary CTA (free consultation) and at most one secondary CTA.

## 4. Design rules

- Clean and calm; enhancement over decoration. One accent colour (brand cyan `#06a8e6`, primary `#0078a8`), dark ink `#0b172a` for contrast sections.
- Section rhythm: alternate white / soft / (occasional) dark sections. Max two dark sections per page.
- Reusable sections only (see `components/sections/`). Don't create one-off layouts for a single page.
- Accessibility: colour contrast ≥ 4.5:1 for text, visible focus states, keyboard-usable navigation, semantic headings in order, `prefers-reduced-motion` respected.
- Mobile first: every section must work at 360 px wide with no horizontal scroll.

## 5. Launch checklist

Run `npm run prelaunch` on the server. It fails when `NEXT_PUBLIC_SITE_URL` is missing/localhost or the admin login is not set, and warns when the default admin password or email delivery is not configured.

Then: `npm run lint`, `npm run typecheck`, `npm run build`, sign in to `/admin`, set up email, submit a test enquiry and click through the sitemap.

## 6. Admin panel rules

- `/admin` is never linked from the site or listed in `robots.txt`; it sends `noindex` headers and meta tags.
- Every admin page and server action calls `requireAdmin()`.
- Secrets (Resend key, webhook token, MongoDB URL) are never sent back to the browser — only a masked hint.
