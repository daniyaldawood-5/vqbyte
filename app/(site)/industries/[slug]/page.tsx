import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AlertTriangle, Check } from "lucide-react";
import { industries, industryBySlug } from "@/content/industries";
import { serviceBySlug } from "@/content/services";
import { PageHero } from "@/components/sections/page-hero";
import { SectionHeading } from "@/components/sections/section-heading";
import { FeatureGrid, IndustryCard, ServiceCard } from "@/components/sections/cards";
import { Workflow } from "@/components/sections/workflow";
import { FaqSection } from "@/components/sections/faq-section";
import { CtaBand } from "@/components/sections/cta-band";
import { SiteBreadcrumbs } from "@/components/ui/site-breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, serviceSchema } from "@/lib/seo";

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const i = industryBySlug[slug];
  if (!i) return {};
  return buildMetadata({ title: i.metaTitle, description: i.metaDescription, path: `/industries/${i.slug}`, keywords: i.keywords });
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ind = industryBySlug[slug];
  if (!ind) notFound();
  const relatedServices = ind.services.map((s) => serviceBySlug[s]).filter(Boolean);
  const others = industries.filter((i) => i.slug !== ind.slug).slice(0, 4);

  return (
    <main id="main">
      <JsonLd data={serviceSchema(`${ind.name} software solutions`, ind.metaDescription, `/industries/${ind.slug}`, `${ind.name} companies`)} />
      <SiteBreadcrumbs items={[{ label: "Industries", href: "/industries" }, { label: ind.short, href: `/industries/${ind.slug}` }]} />
      <PageHero
        eyebrow={`${ind.name} solutions`}
        title={ind.h1}
        intro={ind.intro}
        image={ind.image}
        imageAlt={ind.imageAlt}
        primary={{ label: "Talk to an industry expert", href: `/contact?industry=${ind.slug}` }}
        secondary={{ label: "See what we build", href: "#solutions" }}
      />

      <section className="section-tight">
        <div className="container">
          <p className="segments-label">Who we work with in {ind.name.toLowerCase()}</p>
          <ul className="segments">
            {ind.segments.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <SectionHeading eyebrow="Challenges" title={`What holds ${ind.name.toLowerCase()} companies back`} intro="These are the problems we hear most often from operations, finance and sales leaders in your sector." />
          <div className="challenge-grid">
            {ind.challenges.map((c) => (
              <article className="challenge" key={c.title}>
                <AlertTriangle size={20} aria-hidden="true" />
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="solutions">
        <div className="container">
          <SectionHeading eyebrow="Our solutions" title={`How VQBYTE helps ${ind.name.toLowerCase()} businesses`} />
          <FeatureGrid items={ind.solutions} numbered />
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <SectionHeading eyebrow="End-to-end workflow" title="One connected flow from start to finish" intro="Every step is recorded in one system, so managers see what's happening without chasing reports." />
          <Workflow steps={ind.workflow} dark />
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <p className="eyebrow">Modules</p>
            <h2>Modules {ind.name.toLowerCase()} companies use most</h2>
            <p className="lede">Start with the modules that solve your biggest problem today. Add the rest when you&apos;re ready.</p>
            <ul className="module-list">
              {ind.modules.map((m) => (
                <li key={m}><Check size={16} aria-hidden="true" />{m}</li>
              ))}
            </ul>
          </div>
          <div className="split-media">
            <Image src={ind.image} alt={ind.imageAlt} width={1200} height={800} sizes="(max-width: 900px) 100vw, 50vw" />
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <SectionHeading eyebrow="Services" title={`Services for ${ind.name.toLowerCase()}`} />
          <div className="card-grid">
            {relatedServices.map((s) => (
              <ServiceCard service={s} key={s.slug} />
            ))}
          </div>
        </div>
      </section>

      <FaqSection faqs={ind.faqs} title={`${ind.name} software: common questions`} />

      <section className="section section-soft">
        <div className="container">
          <SectionHeading eyebrow="More industries" title="Other industries we serve" />
          <div className="card-grid">
            {others.map((o) => (
              <IndustryCard industry={o} key={o.slug} />
            ))}
          </div>
        </div>
      </section>

      <CtaBand title={`Let's map your ${ind.name.toLowerCase()} workflow`} body="Tell us how your operation runs today. We'll show you which processes to digitise first and what it would take — free, with no obligation." href={`/contact?industry=${ind.slug}`} />
    </main>
  );
}
