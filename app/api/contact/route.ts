import { NextRequest, NextResponse } from "next/server";
import { leadSchema, type Lead } from "@/lib/validation";
import { site } from "@/content/site";

const attempts = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

async function sendWebhook(lead: Lead) {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return false;
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (process.env.LEAD_WEBHOOK_TOKEN) headers.authorization = `Bearer ${process.env.LEAD_WEBHOOK_TOKEN}`;
  const res = await fetch(url, { method: "POST", headers, body: JSON.stringify({ ...lead, receivedAt: new Date().toISOString() }) });
  if (!res.ok) throw new Error(`Webhook returned ${res.status}`);
  return true;
}

async function sendEmail(lead: Lead) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_TO_EMAIL;
  if (!key || !to) return false;
  const from = process.env.LEAD_FROM_EMAIL ?? `${site.name} Website <onboarding@resend.dev>`;
  const rows: [string, string][] = [
    ["Name", lead.name],
    ["Email", lead.email],
    ["Company", lead.company],
    ["Country", lead.country],
    ["Interest", lead.interest],
    ["Company size", lead.companySize],
    ["Timeline", lead.timeline],
    ["Contact method", lead.contactMethod],
    ["Phone", lead.phone],
    ["Page", lead.sourcePath],
    ["Referrer", lead.referrer],
  ];
  const html = `<h2>New website enquiry</h2><table cellpadding="6">${rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><th align="left">${k}</th><td>${escapeHtml(v)}</td></tr>`)
    .join("")}</table><h3>Message</h3><p style="white-space:pre-wrap">${escapeHtml(lead.message)}</p>`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({
      from,
      to: to.split(",").map((s) => s.trim()),
      reply_to: lead.email,
      subject: `New enquiry: ${lead.interest} — ${lead.company}`,
      html,
    }),
  });
  if (!res.ok) throw new Error(`Email provider returned ${res.status}`);
  return true;
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const allowed = process.env.NEXT_PUBLIC_SITE_URL;
  if (allowed && origin) {
    try {
      if (new URL(origin).origin !== new URL(allowed).origin) {
        return NextResponse.json({ error: "Request origin was not accepted." }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: "Request origin was not accepted." }, { status: 403 });
    }
  }

  const key =
    request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const record = attempts.get(key);
  if (record && record.reset > now && record.count >= MAX_ATTEMPTS) {
    return NextResponse.json({ error: "Too many attempts. Please try again in a few minutes." }, { status: 429 });
  }
  attempts.set(key, { count: record && record.reset > now ? record.count + 1 : 1, reset: record && record.reset > now ? record.reset : now + WINDOW_MS });

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    // Silently accept honeypot submissions so bots learn nothing.
    if (issue?.path[0] === "website") return NextResponse.json({ ok: true });
    return NextResponse.json({ error: issue?.message ?? "Please check the form and try again." }, { status: 422 });
  }

  try {
    const results = await Promise.all([sendWebhook(parsed.data), sendEmail(parsed.data)]);
    if (results.some(Boolean)) return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Lead routing failed", error instanceof Error ? error.message : "unknown error");
    return NextResponse.json(
      { error: `Sorry, your message could not be sent. Please email us at ${site.email}.` },
      { status: 502 },
    );
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("Lead validated (no destination configured in development)", { interest: parsed.data.interest });
    return NextResponse.json({ ok: true, mode: "development" });
  }
  console.error("No lead destination configured: set LEAD_WEBHOOK_URL or RESEND_API_KEY + LEAD_TO_EMAIL");
  return NextResponse.json(
    { error: `Our form is temporarily unavailable. Please email us at ${site.email}.` },
    { status: 503 },
  );
}
