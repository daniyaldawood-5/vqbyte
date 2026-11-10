import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { siteUrl } from "@/lib/seo";
import { site } from "@/content/site";
import { getSettings } from "@/lib/settings";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    metadataBase: new URL(siteUrl),
    title: { default: `${site.name} | ERP, CRM & Custom Software Development Company`, template: `%s | ${site.name}` },
    description: site.description,
    applicationName: site.name,
    icons: {
      icon: [{ url: "/favicon.ico" }, { url: "/favicon.svg", type: "image/svg+xml" }],
      shortcut: "/favicon.svg",
      apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
    ...(settings.googleVerification ? { verification: { google: settings.googleVerification } } : {}),
  };
}

export const viewport: Viewport = { themeColor: "#0b172a", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
