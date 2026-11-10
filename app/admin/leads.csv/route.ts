import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { listLeads } from "@/lib/leads";

export const dynamic = "force-dynamic";

const cell = (v: unknown) => {
  let s = String(v ?? "");
  if (/^[=+\-@]/.test(s)) s = `'${s}`; // prevent spreadsheet formula injection
  return `"${s.replace(/"/g, '""')}"`;
};

export async function GET() {
  if (!(await isAdmin())) return new NextResponse("Not found", { status: 404 });
  const leads = await listLeads();
  const cols = ["createdAt", "status", "name", "email", "phone", "company", "country", "interest", "companySize", "timeline", "contactMethod", "message", "notes", "sourcePath"] as const;
  const csv = [cols.join(","), ...leads.map((l) => cols.map((c) => cell(l[c])).join(","))].join("\n");
  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="vqbyte-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      "cache-control": "no-store",
      "x-robots-tag": "noindex",
    },
  });
}
