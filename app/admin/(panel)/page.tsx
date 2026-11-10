import Link from "next/link";
import { listLeads, leadStatuses, storageLabel } from "@/lib/leads";
import { requireAdmin } from "@/lib/admin-auth";

const fmt = (d: string) => new Date(d).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });

export default async function LeadsPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  await requireAdmin();
  const { status = "", q = "" } = await searchParams;
  let error = "";
  let leads: Awaited<ReturnType<typeof listLeads>> = [];
  try {
    leads = await listLeads();
  } catch (e) {
    error = e instanceof Error ? e.message : "Could not load leads.";
  }
  const counts = Object.fromEntries(leadStatuses.map((s) => [s, leads.filter((l) => l.status === s).length]));
  const needle = q.toLowerCase();
  const shown = leads.filter(
    (l) =>
      (!status || l.status === status) &&
      (!needle || [l.name, l.email, l.company, l.interest, l.message].some((v) => v?.toLowerCase().includes(needle))),
  );

  return (
    <>
      <div className="adm-head">
        <h1>Leads</h1>
        <a className="adm-btn adm-btn-ghost" href="/admin/leads.csv">Export CSV</a>
      </div>
      <p className="adm-muted">Storage: {await storageLabel()}</p>
      {error && <p className="adm-err">{error}</p>}
      <div className="adm-filters">
        <Link href="/admin" className={!status ? "is-active" : ""}>All ({leads.length})</Link>
        {leadStatuses.map((s) => (
          <Link key={s} href={`/admin?status=${s}`} className={status === s ? "is-active" : ""}>
            {s} ({counts[s]})
          </Link>
        ))}
        <form>
          {status && <input type="hidden" name="status" value={status} />}
          <input name="q" defaultValue={q} placeholder="Search name, email, company…" />
        </form>
      </div>
      {shown.length === 0 ? (
        <p className="adm-muted">No leads yet.</p>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Company</th>
                <th>Service</th>
                <th>Status</th>
                <th>Emails</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((l) => (
                <tr key={l.id}>
                  <td>{fmt(l.createdAt)}</td>
                  <td>
                    <Link href={`/admin/leads/${l.id}`}><strong>{l.name}</strong></Link>
                    <br />
                    <span className="adm-muted">{l.email}</span>
                  </td>
                  <td>{l.company}</td>
                  <td>{l.interest}</td>
                  <td><span className={`adm-badge s-${l.status}`}>{l.status}</span></td>
                  <td className="adm-muted">{l.delivery.adminEmail === "sent" && l.delivery.autoReply === "sent" ? "✓ sent" : `${l.delivery.adminEmail.split(":")[0]} / ${l.delivery.autoReply.split(":")[0]}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
