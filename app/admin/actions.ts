"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { changeCredentials, logout, requireAdmin, tryLogin } from "@/lib/admin-auth";
import { groupBySlug } from "@/lib/admin-fields";
import { deleteLead, leadStatuses, migrateLocalLeadsToMongo, testMongo, updateLead, type LeadStatus } from "@/lib/leads";
import { emailReady, sendEmail, testEmail, adminRecipients } from "@/lib/mailer";
import { getSettings, saveSettings, type Settings } from "@/lib/settings";

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const back = (path: string, params: Record<string, string>) => redirect(`${path}?${new URLSearchParams(params)}`);

export async function loginAction(form: FormData) {
  const result = await tryLogin(str(form, "username"), String(form.get("password") ?? ""));
  if (result === "ok") redirect("/admin");
  back("/admin/login", { error: result });
}

export async function logoutAction() {
  await logout();
  redirect("/admin/login");
}

export async function saveSettingsAction(form: FormData) {
  await requireAdmin();
  const group = groupBySlug[str(form, "group")];
  if (!group) redirect("/admin");
  const patch: Partial<Record<keyof Settings, string | boolean>> = {};
  for (const field of group.fields) {
    if (field.type === "checkbox") {
      patch[field.key] = form.get(field.key) === "on";
    } else if (field.type === "secret") {
      if (form.get(`clear_${field.key}`) === "on") patch[field.key] = "";
      else if (str(form, field.key)) patch[field.key] = str(form, field.key);
    } else {
      const value = field.type === "textarea" ? String(form.get(field.key) ?? "").replace(/\r\n/g, "\n").trim() : str(form, field.key);
      if (field.type === "url" && value && !/^https?:\/\//i.test(value)) back(`/admin/settings/${group.slug}`, { error: `${field.label} must start with https://` });
      patch[field.key] = value.slice(0, 5000);
    }
  }
  if (patch.mongoUri && !/^mongodb(\+srv)?:\/\//.test(String(patch.mongoUri))) {
    back(`/admin/settings/${group.slug}`, { error: "MongoDB URL must start with mongodb:// or mongodb+srv://" });
  }
  await saveSettings(patch as Partial<Settings>);
  if (group.revalidateSite) revalidatePath("/", "layout");
  back(`/admin/settings/${group.slug}`, { saved: "1" });
}

export async function testEmailAction() {
  await requireAdmin();
  const s = await getSettings();
  if (!emailReady(s)) back("/admin/settings/email", { error: "Save a Resend API key and From address first." });
  try {
    const mail = testEmail(s);
    await sendEmail(s, { to: adminRecipients(s), ...mail });
  } catch (e) {
    back("/admin/settings/email", { error: e instanceof Error ? e.message : "Sending failed." });
  }
  back("/admin/settings/email", { ok: `Test email sent to ${adminRecipients(s).join(", ")}` });
}

export async function testMongoAction() {
  await requireAdmin();
  const s = await getSettings();
  if (!s.mongoUri) back("/admin/settings/database", { error: "No MongoDB URL saved yet." });
  try {
    await testMongo(s.mongoUri, s.mongoDb);
  } catch (e) {
    back("/admin/settings/database", { error: `Connection failed: ${e instanceof Error ? e.message.slice(0, 200) : "unknown"}` });
  }
  back("/admin/settings/database", { ok: "Connected to MongoDB successfully." });
}

export async function migrateLeadsAction() {
  await requireAdmin();
  let copied = 0;
  try {
    copied = await migrateLocalLeadsToMongo();
  } catch (e) {
    back("/admin/settings/database", { error: e instanceof Error ? e.message.slice(0, 200) : "Migration failed." });
  }
  back("/admin/settings/database", { ok: `Copied ${copied} local lead(s) to MongoDB.` });
}

export async function updateLeadAction(form: FormData) {
  await requireAdmin();
  const id = str(form, "id");
  const status = str(form, "status") as LeadStatus;
  await updateLead(id, {
    status: leadStatuses.includes(status) ? status : "new",
    notes: String(form.get("notes") ?? "").slice(0, 5000),
  });
  back(`/admin/leads/${id}`, { saved: "1" });
}

export async function deleteLeadAction(form: FormData) {
  await requireAdmin();
  await deleteLead(str(form, "id"));
  redirect("/admin");
}

export async function changePasswordAction(form: FormData) {
  await requireAdmin();
  const newPassword = String(form.get("newPassword") ?? "");
  if (newPassword !== String(form.get("confirmPassword") ?? "")) back("/admin/security", { error: "New passwords don't match." });
  const error = await changeCredentials(String(form.get("currentPassword") ?? ""), str(form, "username"), newPassword);
  if (error) back("/admin/security", { error });
  back("/admin/security", { saved: "1" });
}
