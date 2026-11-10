# VQBYTE company website

Marketing site for VQBYTE: ERP, CRM, LMS, inventory/WMS, POS, custom software, integrations, BI, SEO and digital marketing.
Built with Next.js 16 (App Router) and deployed on Vercel.

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev                  # http://localhost:3000
```

## Where things live

| What | Where |
|---|---|
| Company facts (email, phone, address, socials) | `content/site.ts` + env vars |
| Services (13) | `content/services.ts` → `/services/{slug}` |
| Industries (8) | `content/industries.ts` → `/industries/{slug}` |
| Guides / blog | `content/insights.ts` → `/insights/{slug}` |
| Process, pricing, why-us copy | `content/process.ts` |
| Legal pages | `content/legal.ts` |
| Illustrations | `public/images/*.svg` (regenerate with `node scripts/generate-illustrations.mjs`) |
| Reusable sections | `components/sections/` |
| Lead form + API | `components/forms/lead-form.tsx`, `app/api/contact/route.ts` |
| Old-URL redirects, security headers | `next.config.ts` |

Adding a service or industry = adding one object to the content file. Navigation, footer, sitemap, cross-links and schema update automatically.

Read **[docs/SITE-RULES.md](docs/SITE-RULES.md)** before adding pages. Competitor research: [docs/COMPETITOR-AUDIT.md](docs/COMPETITOR-AUDIT.md).

## Leads

The contact form posts to `/api/contact`, which validates input, rate-limits, blocks bots with a honeypot and delivers the lead to:
- `LEAD_WEBHOOK_URL` (Zapier, Make, n8n, your CRM), and/or
- email via [Resend](https://resend.com) (`RESEND_API_KEY`, `LEAD_TO_EMAIL`, `LEAD_FROM_EMAIL`).

In production with no destination configured, the form tells visitors to email you instead of silently dropping leads.

## Launch checklist

```bash
npm run lint && npm run typecheck && npm run build
npm run prelaunch   # with production env vars set
```

After deploying: submit `/sitemap.xml` in Google Search Console, test the contact form end-to-end, and check the pages with PageSpeed Insights.
