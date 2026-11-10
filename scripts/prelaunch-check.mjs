// Run with production environment variables loaded: `npm run prelaunch`
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const env = process.env;
const blockers = [];
const warnings = [];

const required = [
  "public/brand/vqbyte-logo.svg",
  "public/favicon.svg",
  "app/sitemap.ts",
  "app/robots.ts",
  "app/contact/page.tsx",
  "app/legal/[slug]/page.tsx",
];
const missing = required.filter((f) => !existsSync(join(root, f)));
if (missing.length) blockers.push(`Missing files: ${missing.join(", ")}`);

const expectedImages = [
  "hero-platform", "erp-dashboard", "crm-pipeline", "lms-platform", "inventory-wms", "pos-system", "seo-analytics",
  "digital-marketing", "custom-software", "mobile-apps", "integrations", "web-development", "analytics-reporting",
  "team-collaboration", "warehouse-operations", "oil-gas-operations", "manufacturing-floor", "distribution-logistics",
  "retail-store", "construction-projects", "education-training", "data-center", "field-services", "consultation-meeting",
];
const imageDir = join(root, "public/images");
const present = existsSync(imageDir) ? readdirSync(imageDir) : [];
const missingImages = expectedImages.filter((n) => !present.includes(`${n}.svg`));
if (missingImages.length) blockers.push(`Missing illustrations in public/images: ${missingImages.join(", ")}`);

if (!env.NEXT_PUBLIC_SITE_URL || /localhost|127\.0\.0\.1/.test(env.NEXT_PUBLIC_SITE_URL))
  blockers.push("NEXT_PUBLIC_SITE_URL must be the public https:// origin (e.g. https://www.vqbyte.com).");

const hasWebhook = Boolean(env.LEAD_WEBHOOK_URL);
const hasEmail = Boolean(env.RESEND_API_KEY && env.LEAD_TO_EMAIL);
if (!hasWebhook && !hasEmail)
  blockers.push("No lead destination: set LEAD_WEBHOOK_URL, or RESEND_API_KEY + LEAD_TO_EMAIL (and LEAD_FROM_EMAIL on a verified domain).");
if (hasEmail && !env.LEAD_FROM_EMAIL) warnings.push("LEAD_FROM_EMAIL not set — Resend's test sender only delivers to your own account.");

if (!env.NEXT_PUBLIC_CONTACT_EMAIL) blockers.push("NEXT_PUBLIC_CONTACT_EMAIL is not set (site falls back to hello@vqbyte.com).");
if (!env.NEXT_PUBLIC_CONTACT_PHONE && !env.NEXT_PUBLIC_WHATSAPP_NUMBER) warnings.push("No phone or WhatsApp number configured.");
if (!env.NEXT_PUBLIC_LEGAL_NAME) warnings.push("NEXT_PUBLIC_LEGAL_NAME not set — legal pages show 'VQBYTE'.");
if (!env.NEXT_PUBLIC_GA_ID) warnings.push("NEXT_PUBLIC_GA_ID not set — analytics disabled.");
if (!env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION) warnings.push("NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION not set — verify Search Console another way.");

for (const w of warnings) console.warn(`⚠ ${w}`);
if (blockers.length) {
  console.error("VQBYTE prelaunch blocked:\n- " + blockers.join("\n- "));
  process.exit(1);
}
console.log("✓ VQBYTE prelaunch checks passed.");
