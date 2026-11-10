import Link from "next/link";
import { requireAdmin, usingDefaultPassword } from "@/lib/admin-auth";
import { settingGroups } from "@/lib/admin-fields";
import { logoutAction } from "../actions";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const defaultPw = await usingDefaultPassword();
  return (
    <div className="adm-shell">
      <aside className="adm-nav">
        <strong className="adm-brand">VQBYTE admin</strong>
        <Link href="/admin">Leads</Link>
        <span className="adm-nav-label">Settings</span>
        {settingGroups.map((g) => (
          <Link key={g.slug} href={`/admin/settings/${g.slug}`}>
            {g.title}
          </Link>
        ))}
        <Link href="/admin/security">Password</Link>
        <a href="/" target="_blank" rel="noopener">View website ↗</a>
        <form action={logoutAction}>
          <button type="submit" className="adm-link">Sign out</button>
        </form>
      </aside>
      <main className="adm-main">
        {defaultPw && (
          <p className="adm-warn">
            You are using the default password. <Link href="/admin/security">Change it now</Link>.
          </p>
        )}
        {children}
      </main>
    </div>
  );
}
