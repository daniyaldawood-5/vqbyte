import { createHash, createHmac, randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { DATA_DIR, readJson, updateJson } from "./store";

const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;

export const SESSION_COOKIE = "vq_admin";
const SESSION_HOURS = 12;
const MAX_ATTEMPTS = 5;
const LOCK_MS = 15 * 60 * 1000;
const CRED_FILE = "admin.json";

type StoredCredentials = { username: string; salt: string; hash: string; changedAt: string };

const attempts = new Map<string, { count: number; until: number }>();

async function storedCredentials() {
  return readJson<StoredCredentials | null>(CRED_FILE, null);
}

/** Username in use: the one saved from the panel, otherwise ADMIN_USERNAME from .env. */
export async function currentUsername() {
  return (await storedCredentials())?.username ?? process.env.ADMIN_USERNAME ?? "";
}

export async function adminConfigured() {
  return Boolean((await storedCredentials()) || (process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD));
}

/** True while the panel still uses the default password from .env. */
export async function usingDefaultPassword() {
  return !(await storedCredentials()) && process.env.ADMIN_PASSWORD === "vqbyteadmin";
}

function safeEqual(a: string, b: string) {
  return timingSafeEqual(createHash("sha256").update(a).digest(), createHash("sha256").update(b).digest());
}

async function verifyPassword(username: string, password: string) {
  const stored = await storedCredentials();
  if (stored) {
    const hash = await scrypt(password, Buffer.from(stored.salt, "hex"), 64);
    return safeEqual(username, stored.username) && timingSafeEqual(hash, Buffer.from(stored.hash, "hex"));
  }
  const envUser = process.env.ADMIN_USERNAME;
  const envPass = process.env.ADMIN_PASSWORD;
  if (!envUser || !envPass) return false;
  return safeEqual(username, envUser) && safeEqual(password, envPass);
}

/** Random server secret in ./data, mixed with the current credentials so a password change logs out every session. */
let secretCache: Buffer | null = null;
async function signingKey() {
  if (!secretCache) {
    const file = path.join(DATA_DIR, "session.key");
    try {
      secretCache = Buffer.from(await fs.readFile(file, "utf8"), "hex");
    } catch {
      secretCache = randomBytes(32);
      await fs.mkdir(DATA_DIR, { recursive: true, mode: 0o700 });
      await fs.writeFile(file, secretCache.toString("hex"), { mode: 0o600 });
    }
  }
  const stored = await storedCredentials();
  const credentialPart = stored ? `${stored.username}\0${stored.hash}` : `${process.env.ADMIN_USERNAME}\0${process.env.ADMIN_PASSWORD}`;
  return createHash("sha256").update(secretCache).update(credentialPart).digest();
}

async function sign(payload: string) {
  return createHmac("sha256", await signingKey()).update(payload).digest("base64url");
}

async function setSession() {
  const expires = String(Date.now() + SESSION_HOURS * 3600 * 1000);
  (await cookies()).set(SESSION_COOKIE, `${expires}.${await sign(expires)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_HOURS * 3600,
  });
}

export async function clientIp() {
  const h = await headers();
  return h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
}

export async function isAdmin() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || !(await adminConfigured())) return false;
  const [expires, sig] = token.split(".");
  if (!expires || !sig || Number(expires) < Date.now()) return false;
  return safeEqual(sig, await sign(expires));
}

/** Call at the top of every admin page and server action. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

export async function tryLogin(username: string, password: string): Promise<"ok" | "invalid" | "locked" | "disabled"> {
  if (!(await adminConfigured())) return "disabled";
  const ip = await clientIp();
  const now = Date.now();
  const rec = attempts.get(ip);
  if (rec && rec.until > now && rec.count >= MAX_ATTEMPTS) return "locked";

  if (!(await verifyPassword(username, password))) {
    const count = rec && rec.until > now ? rec.count + 1 : 1;
    attempts.set(ip, { count, until: now + LOCK_MS });
    return count >= MAX_ATTEMPTS ? "locked" : "invalid";
  }
  attempts.delete(ip);
  await setSession();
  return "ok";
}

export async function changeCredentials(currentPassword: string, newUsername: string, newPassword: string) {
  const username = await currentUsername();
  if (!(await verifyPassword(username, currentPassword))) return "Current password is incorrect.";
  if (newUsername.trim().length < 3) return "Username must be at least 3 characters.";
  if (newPassword.length < 10) return "New password must be at least 10 characters.";
  if (newPassword === "vqbyteadmin") return "Choose a password different from the default.";
  const salt = randomBytes(16);
  const hash = await scrypt(newPassword, salt, 64);
  await updateJson<StoredCredentials | null>(CRED_FILE, null, () => ({
    username: newUsername.trim(),
    salt: salt.toString("hex"),
    hash: hash.toString("hex"),
    changedAt: new Date().toISOString(),
  }));
  await setSession(); // keep this browser signed in; all other sessions are now invalid
  return null;
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
}
