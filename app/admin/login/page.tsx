import { redirect } from "next/navigation";
import { adminConfigured, isAdmin } from "@/lib/admin-auth";
import { loginAction } from "../actions";

const messages: Record<string, string> = {
  invalid: "Wrong username or password.",
  locked: "Too many attempts. Try again in 15 minutes.",
  disabled: "Admin is disabled: set ADMIN_USERNAME and ADMIN_PASSWORD in .env and restart.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await isAdmin()) redirect("/admin");
  const { error } = await searchParams;
  const configured = await adminConfigured();
  return (
    <main className="adm-login">
      <form action={loginAction} className="adm-card">
        <h1>VQBYTE admin</h1>
        {!configured && <p className="adm-err">{messages.disabled}</p>}
        {error && messages[error] && <p className="adm-err">{messages[error]}</p>}
        <label>
          Username
          <input name="username" autoComplete="username" required autoFocus />
        </label>
        <label>
          Password
          <input name="password" type="password" autoComplete="current-password" required />
        </label>
        <button type="submit">Sign in</button>
      </form>
    </main>
  );
}
