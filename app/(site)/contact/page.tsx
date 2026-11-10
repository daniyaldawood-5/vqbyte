import type { Metadata } from "next";
import { Suspense } from "react";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { LeadForm } from "@/components/forms/lead-form";
import { SiteBreadcrumbs } from "@/components/ui/site-breadcrumbs";
import { getPublicSettings } from "@/lib/settings";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact Us — Free Consultation",
  description:
    "Book a free consultation with VQBYTE about ERP, CRM, LMS, inventory, custom software, SEO or digital marketing. We reply within one business day.",
  path: "/contact",
});

export default async function ContactPage() {
  const site = await getPublicSettings();
  const whatsappLink = site.whatsappLink;
  return (
    <main id="main">
      <SiteBreadcrumbs items={[{ label: "Contact", href: "/contact" }]} />
      <section className="form-page">
        <div className="container form-layout">
          <div className="contact-intro">
            <p className="eyebrow">Free consultation</p>
            <h1>Tell us what you want to achieve</h1>
            <p className="lede">Share a few details and we&apos;ll arrange a free 30-minute call to understand your needs and suggest the best way forward.</p>
            <ol className="next-steps">
              <li><strong>We review your message</strong><span>and reply within one business day.</span></li>
              <li><strong>Free discovery call</strong><span>to understand your goals and current setup.</span></li>
              <li><strong>Clear proposal</strong><span>with scope, timeline and price — no obligation.</span></li>
            </ol>
            <ul className="contact-details">
              <li><Mail size={18} aria-hidden="true" /><a href={`mailto:${site.email}`}>{site.email}</a></li>
              {site.phone && <li><Phone size={18} aria-hidden="true" /><a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a></li>}
              {whatsappLink && <li><MessageCircle size={18} aria-hidden="true" /><a href={whatsappLink} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a></li>}
              {site.address && <li><MapPin size={18} aria-hidden="true" /><span>{site.address}</span></li>}
              <li><Clock size={18} aria-hidden="true" /><span>{site.hours}</span></li>
            </ul>
          </div>
          <div className="form-card">
            <Suspense fallback={<p>Loading form…</p>}>
              <LeadForm />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
}
