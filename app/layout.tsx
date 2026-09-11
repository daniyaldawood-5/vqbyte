import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import "./overrides.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CookiePreferences } from "@/components/layout/cookie-preferences";
import { JsonLd } from "@/components/seo/json-ld";
import { siteUrl } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Connected Business Software for Growing Companies | VQBYTE", template: "%s | VQBYTE" },
  description: "Connect operations, inventory, sales and customer conversations with VQBYTE products and custom software solutions.",
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body><JsonLd data={{"@context":"https://schema.org","@graph":[{"@type":"Organization",name:"VQBYTE",url:siteUrl},{"@type":"WebSite",name:"VQBYTE",url:siteUrl}]}}/><Header />{children}<Footer /><CookiePreferences /></body>
    </html>
  );
}
