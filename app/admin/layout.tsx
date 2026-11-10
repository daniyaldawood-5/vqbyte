import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: { absolute: "Admin" },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export const dynamic = "force-dynamic";

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="adm">{children}</div>;
}
