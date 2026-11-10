import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { industries } from "@/content/industries";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBand } from "@/components/sections/cta-band";
import { Icon } from "@/components/sections/icon";
import { SiteBreadcrumbs } from "@/components/ui/site-breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Industries We Serve — ERP & Software by Industry",
  description:
    "Industry-specific ERP, inventory, CRM and custom software for warehousing, oil and gas, manufacturing, distribution, retail, construction, education and services.",
  path: "/industries",
});

export default function IndustriesPage() {
  return (
    <main id="main">
      <SiteBreadcrumbs items={[{ label: "Industries", href: "/industries" }]} />
      <PageHero
        eyebrow="Industries"
        title="Software that understands how your industry works"
        intro="Every industry has its own workflows, regulations and pressure points. We bring proven patterns for your sector and tailor them to your business."
        image="/images/distribution-logistics.svg"
        imageAlt="Distribution centre with trucks at loading docks and pallets ready for dispatch"
        primary={{ label: "Talk to us about your industry", href: "/contact" }}
      />
      <section className="section section-soft">
        <div className="container industry-list">
          {industries.map((ind) => (
            <article className="industry-row" key={ind.slug}>
              <div className="industry-row-media">
                <Image src={ind.image} alt={ind.imageAlt} width={1200} height={800} sizes="(max-width: 900px) 100vw, 40vw" />
              </div>
              <div>
                <span className="icon-badge"><Icon name={ind.icon} /></span>
                <h2>{ind.name}</h2>
                <p>{ind.intro}</p>
                <ul className="tag-list">
                  {ind.modules.slice(0, 5).map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
                <Link className="text-link" href={`/industries/${ind.slug}`}>
                  {ind.name} solutions <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <CtaBand title="Don't see your industry?" body="Our approach works for any business with complex operations. Tell us about yours and we'll show you how we'd approach it." />
    </main>
  );
}
