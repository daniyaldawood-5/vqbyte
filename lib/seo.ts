import type { Metadata } from "next";
import type { Faq } from "@/content/types";
import { site } from "@/content/site";
import type { PublicSettings } from "@/lib/settings";

export const siteUrl = site.url.replace(/\/$/, "");

export const absoluteUrl = (path: string) => new URL(path, siteUrl + "/").toString();

export function buildMetadata({
  title,
  description,
  path,
  image,
  keywords,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
  type?: "website" | "article";
}): Metadata {
  return {
    title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url: path,
      siteName: site.name,
      type,
      locale: "en_US",
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: { card: "summary_large_image", title: `${title} | ${site.name}`, description },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function serviceSchema(name: string, description: string, path: string, audience?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: absoluteUrl(path),
    serviceType: name,
    areaServed: "Worldwide",
    provider: { "@type": "Organization", name: site.name, url: siteUrl },
    ...(audience ? { audience: { "@type": "BusinessAudience", name: audience } } : {}),
  };
}

export function organizationSchema(settings: PublicSettings) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: site.name,
        legalName: settings.legalName,
        url: siteUrl,
        logo: absoluteUrl("/brand/vqbyte-logo.svg"),
        description: site.description,
        email: settings.email,
        ...(settings.phone ? { telephone: settings.phone } : {}),
        ...(settings.address ? { address: settings.address } : {}),
        ...(settings.socials.length ? { sameAs: settings.socials.map((s) => s.href) } : {}),
        knowsAbout: [
          "ERP software",
          "CRM software",
          "Learning management systems",
          "Warehouse management systems",
          "Custom software development",
          "Search engine optimisation",
          "Digital marketing",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: site.name,
        url: siteUrl,
        publisher: { "@id": `${siteUrl}/#organization` },
      },
    ],
  };
}
