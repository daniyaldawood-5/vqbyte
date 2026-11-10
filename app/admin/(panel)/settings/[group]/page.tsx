import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { groupBySlug } from "@/lib/admin-fields";
import { getSettings } from "@/lib/settings";
import { migrateLeadsAction, saveSettingsAction, testEmailAction, testMongoAction } from "../../../actions";

const mask = (v: string) => (v ? `saved ••••${v.slice(-4)}` : "not set");

export default async function SettingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ group: string }>;
  searchParams: Promise<{ saved?: string; error?: string; ok?: string }>;
}) {
  await requireAdmin();
  const { group: slug } = await params;
  const { saved, error, ok } = await searchParams;
  const group = groupBySlug[slug];
  if (!group) notFound();
  const s = await getSettings();

  return (
    <>
      <h1>{group.title}</h1>
      <p className="adm-muted">{group.description}</p>
      {saved && <p className="adm-ok">Saved.{group.revalidateSite ? " The website is updated." : ""}</p>}
      {ok && <p className="adm-ok">{ok}</p>}
      {error && <p className="adm-err">{error}</p>}

      <form action={saveSettingsAction} className="adm-card adm-form">
        <input type="hidden" name="group" value={group.slug} />
        {group.fields.map((f) => {
          const value = s[f.key];
          if (f.type === "checkbox")
            return (
              <label key={f.key} className="adm-check">
                <input type="checkbox" name={f.key} defaultChecked={Boolean(value)} /> {f.label}
              </label>
            );
          if (f.type === "secret")
            return (
              <div key={f.key}>
                <label>
                  {f.label} <span className="adm-muted">({mask(String(value))})</span>
                  <input name={f.key} type="password" autoComplete="off" placeholder={value ? "Leave empty to keep the saved value" : f.placeholder} />
                </label>
                {value ? (
                  <label className="adm-check">
                    <input type="checkbox" name={`clear_${f.key}`} /> Remove saved value
                  </label>
                ) : null}
              </div>
            );
          return (
            <label key={f.key}>
              {f.label}
              {f.type === "textarea" ? (
                <textarea name={f.key} rows={8} defaultValue={String(value)} />
              ) : (
                <input name={f.key} type={f.type === "url" ? "url" : f.type === "email" ? "email" : "text"} defaultValue={String(value)} placeholder={f.placeholder} />
              )}
              {f.help && <small className="adm-muted">{f.help}</small>}
            </label>
          );
        })}
        <button type="submit">Save</button>
      </form>

      {group.slug === "email" && (
        <form action={testEmailAction} className="adm-inline">
          <button type="submit" className="adm-btn-ghost">Send test email</button>
          <a className="adm-btn adm-btn-ghost" href="/admin/email-preview?type=customer" target="_blank">Preview customer email</a>
          <a className="adm-btn adm-btn-ghost" href="/admin/email-preview?type=admin" target="_blank">Preview lead notification</a>
        </form>
      )}
      {group.slug === "database" && (
        <div className="adm-inline">
          <form action={testMongoAction}>
            <button type="submit" className="adm-btn-ghost">Test connection</button>
          </form>
          <form action={migrateLeadsAction}>
            <button type="submit" className="adm-btn-ghost">Copy local leads to MongoDB</button>
          </form>
        </div>
      )}
    </>
  );
}
