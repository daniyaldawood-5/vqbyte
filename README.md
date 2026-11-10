# VQBYTE company website

Marketing site for VQBYTE: ERP, CRM, LMS, inventory/WMS, POS, custom software, integrations, BI, SEO and digital marketing.
Built with Next.js 16 (App Router) and deployed on Vercel.

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev                  # http://localhost:3000
```

## Configuration

Only three values live in `.env` (see `.env.example`):

| Key | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public address (e.g. `https://vqbyte.cloud`). Used for canonical URLs, sitemap, social cards, links in emails and to reject form posts from other sites. Rebuild after changing. |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | First login for `/admin`. Change the password inside the panel afterwards. |

Everything else is managed at **`/admin`** (hidden from search engines, not linked anywhere):
- **Leads** — every contact-form submission, with status, notes, CSV export
- **Company & contact** — email, phone, WhatsApp, address, socials (empty = hidden on the site)
- **Email (Resend)** — API key, from address, who gets lead alerts, the branded customer confirmation (with preview)
- **Database (MongoDB)** — optional Atlas URL; without it leads are stored in `data/leads.json`
- **Webhook**, **SEO & analytics** (GA4, Search Console), **Password**

Admin data lives in `./data/` on the server (git-ignored). Back it up; deleting `data/admin.json` resets the login to the `.env` values.

## Where things live

| What | Where |
|---|---|
| Services (13) | `content/services.ts` → `/services/{slug}` |
| Industries (8) | `content/industries.ts` → `/industries/{slug}` |
| Guides / blog | `content/insights.ts` → `/insights/{slug}` |
| Process, pricing, why-us copy | `content/process.ts` |
| Legal pages | `content/legal.ts` |
| Illustrations | `public/images/*.svg` (regenerate with `node scripts/generate-illustrations.mjs`) |
| Home page motion (hero, globe, loop) | `components/home/`, `app/motion.css` |
| Admin panel | `app/admin/`, `lib/admin-*.ts`, `lib/settings.ts`, `lib/leads.ts`, `lib/mailer.ts` |
| Lead API | `app/api/contact/route.ts` |
| Old-URL redirects, security headers | `next.config.ts` |

Adding a service or industry = adding one object to the content file. Navigation, footer, sitemap, cross-links and schema update automatically.

Read **[docs/SITE-RULES.md](docs/SITE-RULES.md)** before adding pages. Competitor research: [docs/COMPETITOR-AUDIT.md](docs/COMPETITOR-AUDIT.md).

## Leads

The contact form posts to `/api/contact`, which validates input, rate-limits, ignores bots (honeypot), **stores the lead** (MongoDB or local file — it never loses a lead), then — if configured in the admin panel — emails your team, sends the customer a branded confirmation and calls your webhook. Delivery results are shown on each lead.

## Launch checklist

```bash
npm run lint && npm run typecheck && npm run build
npm run prelaunch   # with production env vars set
```

After deploying: submit `/sitemap.xml` in Google Search Console, test the contact form end-to-end, and check the pages with PageSpeed Insights.
