import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Tiny JSON file store for the admin panel (settings + leads).
 * Files live in ./data (git-ignored, never served publicly).
 * Writes are serialised and atomic (write temp file, then rename).
 */
export const DATA_DIR = path.join(process.cwd(), "data");

let queue: Promise<unknown> = Promise.resolve();

export async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, file), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJsonNow(file: string, data: unknown) {
  await fs.mkdir(DATA_DIR, { recursive: true, mode: 0o700 });
  const target = path.join(DATA_DIR, file);
  const tmp = `${target}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), { encoding: "utf8", mode: 0o600 });
  await fs.rename(tmp, target);
}

/** Read-modify-write under a process-wide lock so concurrent requests never lose data. */
export function updateJson<T>(file: string, fallback: T, update: (current: T) => T | Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const current = await readJson<T>(file, fallback);
    const next = await update(current);
    await writeJsonNow(file, next);
    return next;
  });
  queue = run.catch(() => undefined);
  return run;
}
