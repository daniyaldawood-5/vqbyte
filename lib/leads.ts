import { randomUUID } from "node:crypto";
import type { Collection, MongoClient } from "mongodb";
import { readJson, updateJson } from "./store";
import { getSettings } from "./settings";
import type { Lead as LeadInput } from "./validation";

export type LeadStatus = "new" | "contacted" | "qualified" | "won" | "lost" | "spam";
export const leadStatuses: LeadStatus[] = ["new", "contacted", "qualified", "won", "lost", "spam"];

export type StoredLead = Omit<LeadInput, "consent" | "website"> & {
  id: string;
  createdAt: string;
  status: LeadStatus;
  notes: string;
  ip: string;
  delivery: { adminEmail: string; autoReply: string; webhook: string };
};

type Patch = Partial<Pick<StoredLead, "status" | "notes" | "delivery">>;

interface LeadStore {
  list(): Promise<StoredLead[]>;
  get(id: string): Promise<StoredLead | null>;
  insert(lead: StoredLead): Promise<void>;
  update(id: string, patch: Patch): Promise<void>;
  remove(id: string): Promise<void>;
}

/* ---------- Local JSON file (default, no setup needed) ---------- */
const FILE = "leads.json";
const fileStore: LeadStore = {
  async list() {
    return readJson<StoredLead[]>(FILE, []);
  },
  async get(id) {
    return (await readJson<StoredLead[]>(FILE, [])).find((l) => l.id === id) ?? null;
  },
  async insert(lead) {
    await updateJson<StoredLead[]>(FILE, [], (all) => [lead, ...all].slice(0, 10000));
  },
  async update(id, patch) {
    await updateJson<StoredLead[]>(FILE, [], (all) => all.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  },
  async remove(id) {
    await updateJson<StoredLead[]>(FILE, [], (all) => all.filter((l) => l.id !== id));
  },
};

/* ---------- MongoDB (enabled when a connection URL is saved in admin settings) ---------- */
const g = globalThis as unknown as { __vqMongo?: { uri: string; client: Promise<MongoClient> } };

export async function mongoClient(uri: string) {
  if (g.__vqMongo?.uri !== uri) {
    const old = g.__vqMongo;
    const { MongoClient } = await import("mongodb");
    g.__vqMongo = {
      uri,
      client: new MongoClient(uri, { serverSelectionTimeoutMS: 8000, maxPoolSize: 5 }).connect(),
    };
    old?.client.then((c) => c.close()).catch(() => undefined);
    g.__vqMongo.client.catch(() => {
      if (g.__vqMongo?.uri === uri) g.__vqMongo = undefined;
    });
  }
  return g.__vqMongo!.client;
}

async function leadsCollection(uri: string, dbName: string): Promise<Collection<StoredLead>> {
  const client = await mongoClient(uri);
  const col = client.db(dbName || "vqbyte").collection<StoredLead>("leads");
  await col.createIndex({ id: 1 }, { unique: true }).catch(() => undefined);
  return col;
}

function mongoStore(uri: string, dbName: string): LeadStore {
  const strip = <T extends object>(doc: T | null) => {
    if (!doc) return null;
    const { _id, ...rest } = doc as T & { _id?: unknown };
    void _id;
    return rest as unknown as StoredLead;
  };
  return {
    async list() {
      const col = await leadsCollection(uri, dbName);
      return (await col.find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).limit(10000).toArray()) as StoredLead[];
    },
    async get(id) {
      return strip(await (await leadsCollection(uri, dbName)).findOne({ id }));
    },
    async insert(lead) {
      await (await leadsCollection(uri, dbName)).insertOne({ ...lead });
    },
    async update(id, patch) {
      await (await leadsCollection(uri, dbName)).updateOne({ id }, { $set: patch });
    },
    async remove(id) {
      await (await leadsCollection(uri, dbName)).deleteOne({ id });
    },
  };
}

async function store(): Promise<LeadStore> {
  const s = await getSettings();
  return s.mongoUri ? mongoStore(s.mongoUri, s.mongoDb) : fileStore;
}

export async function storageLabel() {
  const s = await getSettings();
  return s.mongoUri ? `MongoDB (${s.mongoDb || "vqbyte"})` : "Local file (data/leads.json)";
}

/* ---------- Public API ---------- */
export async function listLeads() {
  const leads = await (await store()).list();
  return leads.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getLead(id: string) {
  return (await store()).get(id);
}

export async function addLead(input: LeadInput, ip: string): Promise<StoredLead> {
  const { consent: _consent, website: _website, ...rest } = input;
  void _consent;
  void _website;
  const lead: StoredLead = {
    ...rest,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    status: "new",
    notes: "",
    ip,
    delivery: { adminEmail: "pending", autoReply: "pending", webhook: "pending" },
  };
  try {
    await (await store()).insert(lead);
  } catch (error) {
    // Never lose a lead: fall back to the local file if MongoDB is unreachable.
    console.error("Primary lead store failed, saving locally", error instanceof Error ? error.message : error);
    await fileStore.insert(lead);
  }
  return lead;
}

export async function updateLead(id: string, patch: Patch) {
  await (await store()).update(id, patch);
}

export async function deleteLead(id: string) {
  await (await store()).remove(id);
}

/** Test a MongoDB URL without saving it. */
export async function testMongo(uri: string, dbName: string) {
  const { MongoClient } = await import("mongodb");
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
  try {
    await client.connect();
    await client.db(dbName || "vqbyte").command({ ping: 1 });
  } finally {
    await client.close().catch(() => undefined);
  }
}

/** Copy leads from the local file into MongoDB (skips ones already there). Returns how many were copied. */
export async function migrateLocalLeadsToMongo() {
  const s = await getSettings();
  if (!s.mongoUri) throw new Error("Save a MongoDB URL first.");
  const local = await fileStore.list();
  if (!local.length) return 0;
  const col = await leadsCollection(s.mongoUri, s.mongoDb);
  const res = await col.bulkWrite(
    local.map((lead) => ({ updateOne: { filter: { id: lead.id }, update: { $setOnInsert: lead }, upsert: true } })),
  );
  return res.upsertedCount;
}
