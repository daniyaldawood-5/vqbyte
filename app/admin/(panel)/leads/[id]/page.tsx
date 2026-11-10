import Link from "next/link";
import { notFound } from "next/navigation";
import { getLead, leadStatuses } from "@/lib/leads";
import { requireAdmin } from "@/lib/admin-auth";
import { deleteLeadAction, updateLeadAction } from "../../../actions";

export default async function LeadPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const { saved } = await searchParams;
  const lead = await getLead(id);
  if (!lead) notFound();

  const rows: [string, string][] = [
    ["Received", new Date(lead.createdAt).toLocaleString("en-GB")],
    ["Email", lead.email],
    ["Phone", lead.phone],
    ["Company", lead.company],
    ["Country", lead.country],
    ["Service", lead.interest],
    ["Company size", lead.companySize],
    ["Timeline", lead.timeline],
    ["Prefers", lead.contactMethod],
    ["Page", lead.sourcePath],
    ["Referrer", lead.referrer],
    ["IP", lead.ip],
    ["Admin email", lead.delivery.adminEmail],
    ["Customer email", lead.delivery.autoReply],
    ["Webhook", lead.delivery.webhook],
  ];
  const wa = lead.phone ? `https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}` : "";

  return (
    <>
      <p><Link href="/admin">← All leads</Link></p>
      <div className="adm-head">
        <h1>{lead.name}</h1>
        <div className="adm-actions">
          <a className="adm-btn" href={`mailto:${lead.email}?subject=${encodeURIComponent(`Re: your ${lead.interest} enquiry`)}`}>Reply by email</a>
          {wa && <a className="adm-btn adm-btn-ghost" href={wa} target="_blank" rel="noopener noreferrer">WhatsApp</a>}
        </div>
      </div>
      {saved && <p className="adm-ok">Saved.</p>}
      <div className="adm-grid2">
        <section className="adm-card">
          <h2>Message</h2>
          <p className="adm-pre">{lead.message}</p>
          <dl className="adm-dl">
            {rows.filter(([, v]) => v).map(([k, v]) => (
              <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
        </section>
        <section className="adm-card">
          <h2>Follow-up</h2>
          <form action={updateLeadAction}>
            <input type="hidden" name="id" value={lead.id} />
            <label>
              Status
              <select name="status" defaultValue={lead.status}>
                {leadStatuses.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
            <label>
              Notes
              <textarea name="notes" rows={8} defaultValue={lead.notes} />
            </label>
            <button type="submit">Save</button>
          </form>
          <form action={deleteLeadAction} className="adm-danger-zone">
            <input type="hidden" name="id" value={lead.id} />
            <button type="submit" className="adm-btn-danger">Delete lead</button>
          </form>
        </section>
      </div>
    </>
  );
}
