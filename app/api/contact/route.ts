import { NextRequest, NextResponse } from "next/server";
import { leadSchema } from "@/lib/validation";
import { getSettings } from "@/lib/settings";
import { addLead, updateLead, type StoredLead } from "@/lib/leads";
import { adminEmail, adminRecipients, customerEmail, emailReady, sendEmail } from "@/lib/mailer";

export const dynamic = "force-dynamic";

const attempts = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const outcome = (r: PromiseSettledResult<unknown>, skipped: boolean) =>
  skipped ? "skipped" : r.status === "fulfilled" ? "sent" : `failed: ${String((r as PromiseRejectedResult).reason?.message ?? r.reason).slice(0, 160)}`;

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const allowed = process.env.NEXT_PUBLIC_SITE_URL;
  if (allowed && origin) {
    try {
      if (new URL(origin).origin !== new URL(allowed).origin) throw new Error("origin");
    } catch {
      return NextResponse.json({ error: "Request origin was not accepted." }, { status: 403 });
    }
  }

  const ip =
    request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const record = attempts.get(ip);
  if (record && record.reset > now && record.count >= MAX_ATTEMPTS) {
    return NextResponse.json({ error: "Too many attempts. Please try again in a few minutes." }, { status: 429 });
  }
  attempts.set(ip, {
    count: record && record.reset > now ? record.count + 1 : 1,
    reset: record && record.reset > now ? record.reset : now + WINDOW_MS,
  });

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    // Quietly accept honeypot (bot) submissions without storing them.
    if (issue?.path[0] === "website") return NextResponse.json({ ok: true });
    return NextResponse.json({ error: issue?.message ?? "Please check the form and try again." }, { status: 422 });
  }

  const settings = await getSettings();
  let lead: StoredLead;
  try {
    lead = await addLead(parsed.data, ip);
  } catch (error) {
    console.error("Could not store lead", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: `Sorry, your message could not be sent. Please email us at ${settings.email}.` }, { status: 500 });
  }

  const canEmail = emailReady(settings);
  const admins = adminRecipients(settings);
  const admin = adminEmail(settings, lead);
  const customer = customerEmail(settings, lead);

  const [adminResult, replyResult, hookResult] = await Promise.allSettled([
    canEmail && admins.length
      ? sendEmail(settings, { to: admins, subject: admin.subject, html: admin.html, replyTo: lead.email })
      : Promise.resolve(),
    canEmail && settings.autoReplyEnabled
      ? sendEmail(settings, {
          to: [lead.email],
          subject: customer.subject,
          html: customer.html,
          text: customer.text,
          replyTo: admins[0] || settings.email,
        })
      : Promise.resolve(),
    settings.webhookUrl
      ? fetch(settings.webhookUrl, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            ...(settings.webhookToken ? { authorization: `Bearer ${settings.webhookToken}` } : {}),
          },
          body: JSON.stringify(lead),
          signal: AbortSignal.timeout(10_000),
        }).then((r) => {
          if (!r.ok) throw new Error(`Webhook returned ${r.status}`);
        })
      : Promise.resolve(),
  ]);

  await updateLead(lead.id, {
    delivery: {
      adminEmail: outcome(adminResult, !canEmail || !admins.length),
      autoReply: outcome(replyResult, !canEmail || !settings.autoReplyEnabled),
      webhook: outcome(hookResult, !settings.webhookUrl),
    },
  }).catch(() => undefined);

  return NextResponse.json({ ok: true });
}
