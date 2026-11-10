/**
 * Single source of truth for company facts.
 * Values can be overridden with environment variables so nothing sensitive
 * or unconfirmed is hard-coded. Empty values are hidden on the site.
 */
export const site = {
  name: "VQBYTE",
  legalName: process.env.NEXT_PUBLIC_LEGAL_NAME ?? "VQBYTE",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  tagline: "Business software, custom development and growth marketing",
  description:
    "VQBYTE builds ERP, CRM, LMS, inventory and custom software, and runs SEO and digital marketing for small, mid-sized and enterprise businesses.",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@vqbyte.com",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS ?? "",
  hours: process.env.NEXT_PUBLIC_BUSINESS_HOURS ?? "Monday–Friday, 9:00–18:00",
  socials: [
    { label: "LinkedIn", href: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "" },
    { label: "Facebook", href: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "" },
    { label: "Instagram", href: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "" },
    { label: "X", href: process.env.NEXT_PUBLIC_X_URL ?? "" },
  ].filter((s) => s.href),
} as const;

export const whatsappLink = site.whatsapp
  ? `https://wa.me/${site.whatsapp.replace(/[^0-9]/g, "")}`
  : "";
