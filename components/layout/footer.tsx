import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { services } from "@/content/services";
import { industries } from "@/content/industries";
import type { PublicSettings } from "@/lib/settings";
import { site as brand } from "@/content/site";
import { CookieSettingsLink } from "./cookie-preferences";

export function Footer({ settings }: { settings: PublicSettings }) {
  const site = settings;
  const whatsappLink = settings.whatsappLink;
  const groups = [
    { title: "Services", items: services.map((s) => ({ label: s.short, href: `/services/${s.slug}` })) },
    { title: "Industries", items: industries.map((i) => ({ label: i.short, href: `/industries/${i.slug}` })) },
    {
      title: "Company",
      items: [
        { label: "About us", href: "/about" },
        { label: "Our process", href: "/process" },
        { label: "Insights", href: "/insights" },
        { label: "Contact", href: "/contact" },
      ],
    },
  ];
  return (
    <footer className="footer">
      <div className="container footer-top">
        <div className="footer-brand">
          <Image src="/brand/vqbyte-logo.svg" alt="VQBYTE" width={150} height={50} className="footer-logo" />
          <p>{brand.description}</p>
          <ul className="footer-contact">
            <li>
              <Mail size={16} aria-hidden="true" />
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
            {site.phone && (
              <li>
                <Phone size={16} aria-hidden="true" />
                <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a>
              </li>
            )}
            {whatsappLink && (
              <li>
                <MessageCircle size={16} aria-hidden="true" />
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  WhatsApp us
                </a>
              </li>
            )}
            {site.address && (
              <li>
                <MapPin size={16} aria-hidden="true" />
                <span>{site.address}</span>
              </li>
            )}
          </ul>
          {site.socials.length > 0 && (
            <ul className="footer-socials">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="footer-links">
          {groups.map((g) => (
            <div key={g.title}>
              <h2>{g.title}</h2>
              <ul>
                {g.items.map((i) => (
                  <li key={i.href}>
                    <Link href={i.href}>{i.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="container footer-bottom">
        <p>
          © {new Date().getFullYear()} {site.legalName}. All rights reserved.
        </p>
        <nav aria-label="Legal">
          <Link href="/legal/privacy">Privacy</Link>
          <Link href="/legal/terms">Terms</Link>
          <Link href="/legal/cookies">Cookies</Link>
          <CookieSettingsLink />
        </nav>
      </div>
    </footer>
  );
}
