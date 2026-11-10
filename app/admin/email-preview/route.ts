import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { getSettings } from "@/lib/settings";
import { adminEmail, customerEmail } from "@/lib/mailer";
import type { StoredLead } from "@/lib/leads";

export const dynamic = "force-dynamic";

const sample: StoredLead = {
  id: "preview",
  createdAt: new Date().toISOString(),
  status: "new",
  notes: "",
  ip: "",
  name: "Sara Ahmed",
  email: "sara@example.com",
  company: "Northwind Distribution",
  country: "Pakistan",
  interest: "Inventory & Warehouse Management Software",
  companySize: "51–250 employees",
  budget: "",
  timeline: "Within 1–3 months",
  message: "We run 3 warehouses and our stock never matches the system. We'd like barcode scanning and a proper WMS connected to our accounting.",
  contactMethod: "whatsapp",
  phone: "+92 300 0000000",
  sourcePath: "/services/inventory-warehouse-management",
  referrer: "",
  delivery: { adminEmail: "", autoReply: "", webhook: "" },
};

/** /admin/email-preview?type=customer|admin — shows the emails with a sample lead. */
export async function GET(req: NextRequest) {
  if (!(await isAdmin())) return new NextResponse("Not found", { status: 404 });
  const s = await getSettings();
  const mail = req.nextUrl.searchParams.get("type") === "admin" ? adminEmail(s, sample) : customerEmail(s, sample);
  return new NextResponse(mail.html, {
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex" },
  });
}
