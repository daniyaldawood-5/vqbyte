export type AnalyticsEvent = "lead_form_start" | "lead_form_submit" | "cta_click" | "whatsapp_click";

export const CONSENT_KEY = "vqbyte-analytics-consent";
export const gaId = process.env.NEXT_PUBLIC_GA_ID ?? "";

type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window { dataLayer?: unknown[]; gtag?: Gtag }
}

export function readConsent(): string | null {
  try { return localStorage.getItem(CONSENT_KEY); } catch { return null; }
}

/** Loads Google Analytics 4 only after consent and only when NEXT_PUBLIC_GA_ID is set. */
export function loadAnalytics() {
  if (typeof window === "undefined" || !gaId || window.gtag) return;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  // gtag.js requires the native `arguments` object.
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", gaId, { anonymize_ip: true });
}

export function track(event: AnalyticsEvent, detail: Record<string, string> = {}) {
  if (typeof window === "undefined" || readConsent() !== "granted") return;
  window.gtag?.("event", event, detail);
}
