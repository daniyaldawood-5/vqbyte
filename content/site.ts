/**
 * Fixed brand facts. Contact details, socials, email delivery and analytics
 * are managed in the admin panel (/admin → Settings), not here.
 */
export const site = {
  name: "VQBYTE",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  tagline: "Business software, custom development and growth marketing",
  description:
    "VQBYTE builds ERP, CRM, LMS, inventory and custom software, and runs SEO and digital marketing for small, mid-sized and enterprise businesses.",
} as const;
