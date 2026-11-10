import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import "./motion.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CookiePreferences } from "@/components/layout/cookie-preferences";
import { RevealObserver } from "@/components/motion/reveal-observer";
import { CustomCursor } from "@/components/motion/custom-cursor";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationSchema, siteUrl } from "@/lib/seo";
import { site } from "@/content/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
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
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export const viewport: Viewport = { themeColor: "#0b172a", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body>
        <JsonLd data={organizationSchema()} />
        <Header />
        {children}
        <Footer />
        <CookiePreferences />
        <RevealObserver />
        <CustomCursor />
      </body>
    </html>
  );
}
