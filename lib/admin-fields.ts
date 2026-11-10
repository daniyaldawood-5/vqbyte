import type { Settings } from "./settings";

export type FieldType = "text" | "email" | "url" | "secret" | "textarea" | "checkbox";
export type Field = { key: keyof Settings; label: string; type: FieldType; help?: string; placeholder?: string };
export type Group = { slug: string; title: string; description: string; fields: Field[]; revalidateSite?: boolean };

export const settingGroups: Group[] = [
  {
    slug: "company",
    title: "Company & contact",
    description: "Shown in the website footer, contact page, legal pages and search-engine data.",
    revalidateSite: true,
    fields: [
      { key: "legalName", label: "Company / legal name", type: "text" },
      { key: "email", label: "Public contact email", type: "email", help: "Shown on the website and used as the default notification address." },
      { key: "phone", label: "Phone", type: "text", placeholder: "+92 300 0000000" },
      { key: "whatsapp", label: "WhatsApp number", type: "text", placeholder: "+92 300 0000000", help: "Digits with country code. Leave empty to hide." },
      { key: "address", label: "Address", type: "text" },
      { key: "hours", label: "Business hours", type: "text" },
      { key: "linkedin", label: "LinkedIn URL", type: "url" },
      { key: "facebook", label: "Facebook URL", type: "url" },
      { key: "instagram", label: "Instagram URL", type: "url" },
      { key: "x", label: "X (Twitter) URL", type: "url" },
    ],
  },
  {
    slug: "email",
    title: "Email (Resend)",
    description: "Sends new-lead notifications to you and a branded confirmation to the customer. Create a free key at resend.com and verify your domain there.",
    fields: [
      { key: "resendApiKey", label: "Resend API key", type: "secret", placeholder: "re_..." },
      { key: "fromEmail", label: "From address", type: "text", placeholder: "VQBYTE <hello@vqbyte.cloud>", help: "Must be on a domain verified in Resend." },
      { key: "notifyEmails", label: "Send new leads to", type: "text", placeholder: "you@vqbyte.cloud, sales@vqbyte.cloud", help: "Comma-separated. Empty = public contact email." },
      { key: "autoReplyEnabled", label: "Send confirmation email to the customer", type: "checkbox" },
      { key: "autoReplySubject", label: "Confirmation subject", type: "text", help: "Placeholders: {name} {fullName} {company} {service}" },
      { key: "autoReplyBody", label: "Confirmation message", type: "textarea", help: "Blank line = new paragraph. Same placeholders as the subject." },
    ],
  },
  {
    slug: "database",
    title: "Database (MongoDB)",
    description: "Optional. Paste your MongoDB Atlas connection URL to store leads in MongoDB. Without it, leads are saved in data/leads.json on the server.",
    fields: [
      { key: "mongoUri", label: "MongoDB connection URL", type: "secret", placeholder: "mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/" },
      { key: "mongoDb", label: "Database name", type: "text", placeholder: "vqbyte" },
    ],
  },
  {
    slug: "integrations",
    title: "Webhook",
    description: "Optional. Every new lead is also POSTed as JSON to this URL (Zapier, Make, n8n, your CRM).",
    fields: [
      { key: "webhookUrl", label: "Webhook URL", type: "url" },
      { key: "webhookToken", label: "Bearer token", type: "secret" },
    ],
  },
  {
    slug: "seo",
    title: "SEO & analytics",
    description: "Google Analytics loads only after a visitor accepts cookies.",
    revalidateSite: true,
    fields: [
      { key: "gaId", label: "Google Analytics 4 ID", type: "text", placeholder: "G-XXXXXXXXXX" },
      { key: "googleVerification", label: "Google Search Console verification code", type: "text", help: "Only the content value of the meta tag." },
    ],
  },
];

export const groupBySlug = Object.fromEntries(settingGroups.map((g) => [g.slug, g]));
