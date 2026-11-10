// Run on the server from the project folder: `npm run prelaunch` (reads .env.production / .env if present)
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
for (const file of [".env.production", ".env.local", ".env"]) {
  const p = join(root, file);
  if (!existsSync(p)) continue;
  for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const env = process.env;
const blockers = [];
const warnings = [];

const imageDir = join(root, "public/images");
if (!existsSync(imageDir) || readdirSync(imageDir).filter((f) => f.endsWith(".svg")).length < 24)
  blockers.push("public/images is missing illustrations.");

if (!env.NEXT_PUBLIC_SITE_URL || /localhost|127\.0\.0\.1/.test(env.NEXT_PUBLIC_SITE_URL))
  blockers.push("NEXT_PUBLIC_SITE_URL must be your public https:// address (e.g. https://vqbyte.cloud).");
if (!env.ADMIN_USERNAME || !env.ADMIN_PASSWORD) blockers.push("Set ADMIN_USERNAME and ADMIN_PASSWORD in .env.");
if (env.ADMIN_PASSWORD === "vqbyteadmin" && !existsSync(join(root, "data/admin.json")))
  warnings.push("Admin still uses the default password — sign in to /admin and change it.");

const settingsFile = join(root, "data/settings.json");
const settings = existsSync(settingsFile) ? JSON.parse(readFileSync(settingsFile, "utf8")) : {};
if (!settings.resendApiKey || !settings.fromEmail)
  warnings.push("Email not set up — leads are saved in /admin but no emails are sent (Admin → Email).");

for (const w of warnings) console.warn(`⚠ ${w}`);
if (blockers.length) {
  console.error("VQBYTE prelaunch blocked:\n- " + blockers.join("\n- "));
  process.exit(1);
}
console.log("✓ VQBYTE prelaunch checks passed.");
