import type { Metadata } from "next";
import { serviceCategories, services } from "@/content/services";
import { engagementModels, pricingFactors } from "@/content/process";
import { PageHero } from "@/components/sections/page-hero";
import { SectionHeading } from "@/components/sections/section-heading";
import { ServiceCard } from "@/components/sections/cards";
import { CtaBand } from "@/components/sections/cta-band";
import { SiteBreadcrumbs } from "@/components/ui/site-breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Software Development & Digital Marketing Services",
  description:
    "ERP, CRM, LMS, inventory and POS software, custom web and mobile development, integrations, BI dashboards, SEO and digital marketing — all from one team.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <main id="main">
      <SiteBreadcrumbs items={[{ label: "Services", href: "/services" }]} />
      <PageHero
        eyebrow="Our services"
        title="Everything your business needs to run better and grow faster"
        intro="We build the software that runs your operations and the marketing that brings in customers. Choose a single service or combine them — one team, one point of contact."
        image="/images/team-collaboration.svg"
        imageAlt="VQBYTE team of developers and marketers working together at their desks"
        primary={{ label: "Get a free consultation", href: "/contact" }}
      />
      {serviceCategories.map((cat, idx) => (
        <section className={`section ${idx % 2 === 0 ? "section-soft" : ""}`} key={cat.id} id={cat.id}>
          <div className="container">
            <SectionHeading eyebrow={cat.title} title={cat.description} />
            <div className="card-grid">
              {services
                .filter((s) => s.category === cat.id)
                .map((s) => (
                  <ServiceCard service={s} key={s.slug} />
                ))}
            </div>
          </div>
        </section>
      ))}
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Pricing" title="How pricing works" intro="Every business is different, so we price each project on its real scope. You get a clear, fixed proposal before any work starts." />
          <div className="pricing-grid">
            <div className="pricing-factors">
              <h3>What affects the price</h3>
              <ul>
                {pricingFactors.map((f) => (
                  <li key={f.title}>
                    <strong>{f.title}</strong>
                    <span>{f.body}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="engagement-list">
              {engagementModels.map((m) => (
                <article key={m.title}>
                  <h3>{m.title}</h3>
                  <p>{m.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
      <CtaBand />
    </main>
  );
}
