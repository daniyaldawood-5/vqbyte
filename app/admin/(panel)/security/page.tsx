import { currentUsername, requireAdmin, usingDefaultPassword } from "@/lib/admin-auth";
import { changePasswordAction } from "../../actions";

export default async function SecurityPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  await requireAdmin();
  const { saved, error } = await searchParams;
  const username = await currentUsername();
  return (
    <>
      <h1>Username & password</h1>
      <p className="adm-muted">
        {(await usingDefaultPassword())
          ? "You're using the login from .env. Once you change it here, the .env password stops working."
          : "Your login is stored securely (hashed) on the server. Changing it signs out all other sessions."}
      </p>
      {saved && <p className="adm-ok">Login updated.</p>}
      {error && <p className="adm-err">{error}</p>}
      <form action={changePasswordAction} className="adm-card adm-form">
        <label>
          Username
          <input name="username" defaultValue={username} required minLength={3} autoComplete="username" />
        </label>
        <label>
          Current password
          <input name="currentPassword" type="password" required autoComplete="current-password" />
        </label>
        <label>
          New password <small className="adm-muted">(min 10 characters)</small>
          <input name="newPassword" type="password" required minLength={10} autoComplete="new-password" />
        </label>
        <label>
          Confirm new password
          <input name="confirmPassword" type="password" required minLength={10} autoComplete="new-password" />
        </label>
        <button type="submit">Update login</button>
      </form>
      <p className="adm-muted">Forgot it? Delete <code>data/admin.json</code> on the server and restart; the .env login works again.</p>
    </>
  );
}
