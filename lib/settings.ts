import { cache } from "react";
import { readJson, updateJson } from "./store";

export type Settings = {
  // Company & contact (shown on the website)
  legalName: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  hours: string;
  linkedin: string;
  facebook: string;
  instagram: string;
  x: string;
  // Email delivery (Resend)
  resendApiKey: string;
  fromEmail: string;
  notifyEmails: string;
  autoReplyEnabled: boolean;
  autoReplySubject: string;
  autoReplyBody: string;
  // Integrations
  webhookUrl: string;
  webhookToken: string;
  // SEO & analytics
  gaId: string;
  googleVerification: string;
  // Database
  mongoUri: string;
  mongoDb: string;
};

export const defaultSettings: Settings = {
  legalName: "VQBYTE",
  email: "hello@vqbyte.cloud",
  phone: "",
  whatsapp: "",
  address: "",
  hours: "Monday–Friday, 9:00–18:00",
  linkedin: "",
  facebook: "",
  instagram: "",
  x: "",
  resendApiKey: "",
  fromEmail: "",
  notifyEmails: "",
  autoReplyEnabled: true,
  autoReplySubject: "Thanks for contacting VQBYTE, {name}",
  autoReplyBody:
    "Hi {name},\n\nThank you for reaching out about {service}. We've received your message and a member of our team will get back to you within one business day.\n\nKind regards,\nThe VQBYTE team",
  webhookUrl: "",
  webhookToken: "",
  gaId: "",
  googleVerification: "",
  mongoUri: "",
  mongoDb: "vqbyte",
};

/** Fields that are secrets: never sent to the browser in full. */
export const secretFields = ["resendApiKey", "webhookToken", "mongoUri"] as const;

const FILE = "settings.json";

export const getSettings = cache(async (): Promise<Settings> => {
  const saved = await readJson<Partial<Settings>>(FILE, {});
  return { ...defaultSettings, ...saved };
});

export async function saveSettings(patch: Partial<Settings>) {
  return updateJson<Partial<Settings>>(FILE, {}, (current) => ({ ...current, ...patch }));
}

/** Public, non-secret settings used by website pages. */
export async function getPublicSettings() {
  const s = await getSettings();
  return {
    legalName: s.legalName || "VQBYTE",
    email: s.email,
    phone: s.phone,
    whatsapp: s.whatsapp,
    whatsappLink: s.whatsapp ? `https://wa.me/${s.whatsapp.replace(/[^0-9]/g, "")}` : "",
    address: s.address,
    hours: s.hours,
    socials: [
      { label: "LinkedIn", href: s.linkedin },
      { label: "Facebook", href: s.facebook },
      { label: "Instagram", href: s.instagram },
      { label: "X", href: s.x },
    ].filter((x) => x.href),
    gaId: s.gaId,
    googleVerification: s.googleVerification,
  };
}

export type PublicSettings = Awaited<ReturnType<typeof getPublicSettings>>;
