import type { Settings } from "./settings";
import type { StoredLead } from "./leads";
import { siteUrl } from "./seo";

const esc = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const FONT = "font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;";
const INK = "#0b172a";
const BODY = "#344054";
const MUTED = "#667085";
const PRIMARY = "#0078a8";
const CYAN = "#06a8e6";

export function emailReady(s: Settings) {
  return Boolean(s.resendApiKey && s.fromEmail);
}

export async function sendEmail(s: Settings, msg: { to: string[]; subject: string; html: string; text?: string; replyTo?: string }) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${s.resendApiKey}`, "content-type": "application/json" },
    body: JSON.stringify({ from: s.fromEmail, to: msg.to, subject: msg.subject, html: msg.html, text: msg.text, reply_to: msg.replyTo }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Resend ${res.status}: ${text.slice(0, 200)}`);
  }
}

export function adminRecipients(s: Settings) {
  return (s.notifyEmails || s.email)
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
}

export function fillTemplate(template: string, lead: StoredLead) {
  return template
    .replaceAll("{name}", lead.name.split(" ")[0] || lead.name)
    .replaceAll("{fullName}", lead.name)
    .replaceAll("{company}", lead.company)
    .replaceAll("{service}", lead.interest);
}

/** Shared branded shell: logo header, cyan accent bar, white card, footer. Table-based for email-client support. */
function shell(s: Settings, preheader: string, inner: string) {
  const logo = `${siteUrl}/email-logo.png`;
  const contact = [
    s.email && `<a href="mailto:${esc(s.email)}" style="color:${PRIMARY};text-decoration:none">${esc(s.email)}</a>`,
    s.phone && esc(s.phone),
    s.whatsapp && `<a href="https://wa.me/${s.whatsapp.replace(/[^0-9]/g, "")}" style="color:${PRIMARY};text-decoration:none">WhatsApp</a>`,
  ]
    .filter(Boolean)
    .join(" &nbsp;·&nbsp; ");
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>VQBYTE</title></head>
<body style="margin:0;padding:0;background:#eef5f9;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef5f9;padding:32px 12px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;">
  <tr><td align="center" style="padding:8px 0 22px;">
    <a href="${siteUrl}" style="text-decoration:none"><img src="${logo}" width="150" height="50" alt="VQBYTE" style="display:block;border:0;width:150px;height:auto;"></a>
  </td></tr>
  <tr><td style="background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 10px 30px rgba(11,23,42,0.08);">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="height:6px;background:${CYAN};background-image:linear-gradient(90deg,${CYAN},${PRIMARY});font-size:0;line-height:0;">&nbsp;</td></tr>
      ${inner}
    </table>
  </td></tr>
  <tr><td align="center" style="padding:24px 16px 8px;${FONT}font-size:13px;line-height:1.6;color:${MUTED};">
    <strong style="color:${INK}">${esc(s.legalName || "VQBYTE")}</strong><br>
    ERP · CRM · LMS · Custom software · SEO · Digital marketing<br>
    ${contact ? contact + "<br>" : ""}
    <a href="${siteUrl}" style="color:${PRIMARY};text-decoration:none">${siteUrl.replace(/^https?:\/\//, "")}</a>
  </td></tr>
</table>
</td></tr></table></body></html>`;
}

/** Branded confirmation sent to the customer who filled in the form. */
export function customerEmail(s: Settings, lead: StoredLead) {
  const body = fillTemplate(s.autoReplyBody, lead);
  const paragraphs = body
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 16px;${FONT}font-size:16px;line-height:1.65;color:${BODY};">${esc(p).replace(/\n/g, "<br>")}</p>`)
    .join("");
  const excerpt = lead.message.length > 280 ? lead.message.slice(0, 280) + "…" : lead.message;
  const steps = [
    ["1", "We review your request", "A specialist reads your message and prepares questions."],
    ["2", "Free discovery call", "We discuss your goals, current setup and priorities."],
    ["3", "Clear proposal", "You receive scope, timeline and price — no obligation."],
  ]
    .map(
      ([n, t, d]) => `<tr>
        <td width="44" valign="top" style="padding:0 0 14px;"><div style="width:32px;height:32px;border-radius:16px;background:#e3f5fd;color:${PRIMARY};${FONT}font-weight:800;font-size:14px;line-height:32px;text-align:center;">${n}</div></td>
        <td valign="top" style="padding:4px 0 14px;${FONT}font-size:15px;line-height:1.5;color:${BODY};"><strong style="color:${INK}">${t}</strong><br>${d}</td>
      </tr>`,
    )
    .join("");

  const inner = `
      <tr><td style="padding:36px 36px 8px;">
        <p style="margin:0 0 6px;${FONT}font-size:12px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:${PRIMARY};">Request received</p>
        <h1 style="margin:0 0 20px;${FONT}font-size:26px;line-height:1.25;color:${INK};">Thanks, ${esc(lead.name.split(" ")[0] || lead.name)}! We're on it.</h1>
        ${paragraphs}
      </td></tr>
      <tr><td style="padding:4px 36px 8px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f9fc;border:1px solid #d9e5ec;border-radius:14px;">
          <tr><td style="padding:20px 22px;${FONT}font-size:14px;line-height:1.6;color:${BODY};">
            <p style="margin:0 0 10px;font-size:12px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:${MUTED};">Your request</p>
            <strong style="color:${INK}">Service:</strong> ${esc(lead.interest)}<br>
            <strong style="color:${INK}">Company:</strong> ${esc(lead.company)}<br>
            ${lead.timeline ? `<strong style="color:${INK}">Timeline:</strong> ${esc(lead.timeline)}<br>` : ""}
            <p style="margin:12px 0 0;padding-left:12px;border-left:3px solid ${CYAN};color:${MUTED};font-style:italic;">${esc(excerpt).replace(/\n/g, "<br>")}</p>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:24px 36px 6px;">
        <p style="margin:0 0 14px;${FONT}font-size:17px;font-weight:700;color:${INK};">What happens next</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${steps}</table>
      </td></tr>
      <tr><td align="center" style="padding:6px 36px 36px;">
        <a href="${siteUrl}/services" style="display:inline-block;background:${PRIMARY};color:#ffffff;${FONT}font-size:15px;font-weight:700;text-decoration:none;padding:14px 28px;border-radius:10px;">Explore our services →</a>
        <p style="margin:16px 0 0;${FONT}font-size:13px;color:${MUTED};">Need to add something? Just reply to this email.</p>
      </td></tr>`;

  return {
    subject: fillTemplate(s.autoReplySubject, lead),
    html: shell(s, "We've received your request and will reply within one business day.", inner),
    text: `${body}\n\nYour request: ${lead.interest} — ${lead.company}\n\n${siteUrl}`,
  };
}

/** Notification to the VQBYTE team. */
export function adminEmail(s: Settings, lead: StoredLead) {
  const rows: [string, string][] = [
    ["Name", lead.name],
    ["Email", lead.email],
    ["Company", lead.company],
    ["Country", lead.country],
    ["Service", lead.interest],
    ["Company size", lead.companySize],
    ["Timeline", lead.timeline],
    ["Contact via", lead.contactMethod],
    ["Phone", lead.phone],
    ["Page", lead.sourcePath],
  ];
  const table = rows
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #eef2f5;${FONT}font-size:13px;color:${MUTED};width:130px;">${k}</td><td style="padding:8px 0;border-bottom:1px solid #eef2f5;${FONT}font-size:14px;color:${INK};">${esc(v)}</td></tr>`,
    )
    .join("");
  const inner = `
      <tr><td style="padding:32px 36px 8px;">
        <p style="margin:0 0 6px;${FONT}font-size:12px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:${PRIMARY};">New lead</p>
        <h1 style="margin:0 0 18px;${FONT}font-size:22px;line-height:1.3;color:${INK};">${esc(lead.name)} · ${esc(lead.company)}</h1>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${table}</table>
        <p style="margin:20px 0 8px;${FONT}font-size:13px;font-weight:700;color:${INK};">Message</p>
        <p style="margin:0;${FONT}font-size:15px;line-height:1.6;color:${BODY};white-space:pre-wrap;">${esc(lead.message)}</p>
      </td></tr>
      <tr><td style="padding:22px 36px 34px;">
        <a href="${siteUrl}/admin/leads/${lead.id}" style="display:inline-block;background:${PRIMARY};color:#fff;${FONT}font-size:14px;font-weight:700;text-decoration:none;padding:12px 22px;border-radius:10px;">Open in admin</a>
        &nbsp; <a href="mailto:${esc(lead.email)}" style="${FONT}font-size:14px;color:${PRIMARY};">Reply to ${esc(lead.name.split(" ")[0] || lead.name)}</a>
      </td></tr>`;
  return {
    subject: `New enquiry: ${lead.interest} — ${lead.company}`,
    html: shell(s, `${lead.name} from ${lead.company} is interested in ${lead.interest}.`, inner),
  };
}

/** Simple test message used by the admin "send test email" button. */
export function testEmail(s: Settings) {
  const inner = `<tr><td style="padding:32px 36px;${FONT}font-size:16px;line-height:1.6;color:${BODY};">
    <h1 style="margin:0 0 12px;font-size:22px;color:${INK};">Email is working ✓</h1>
    This test was sent from your VQBYTE admin panel. Contact-form notifications and customer confirmations will be delivered with these settings.
  </td></tr>`;
  return { subject: "VQBYTE admin: test email", html: shell(s, "Your email settings work.", inner) };
}
