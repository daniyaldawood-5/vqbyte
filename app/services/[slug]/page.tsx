import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, CircleCheck, X } from "lucide-react";
import { services, serviceBySlug } from "@/content/services";
import { industryBySlug } from "@/content/industries";
import { insights } from "@/content/insights";
import { PageHero } from "@/components/sections/page-hero";
import { SectionHeading } from "@/components/sections/section-heading";
import { FeatureGrid, IndustryCard, ServiceCard } from "@/components/sections/cards";
import { ProcessSteps } from "@/components/sections/process-steps";
import { FaqSection } from "@/components/sections/faq-section";
import { CtaBand } from "@/components/sections/cta-band";
import { SiteBreadcrumbs } from "@/components/ui/site-breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata, serviceSchema } from "@/lib/seo";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = serviceBySlug[slug];
  if (!s) return {};
  return buildMetadata({ title: s.metaTitle, description: s.metaDescription, path: `/services/${s.slug}`, keywords: s.keywords });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = serviceBySlug[slug];
  if (!s) notFound();
  const relatedIndustries = s.industries.map((i) => industryBySlug[i]).filter(Boolean);
  const relatedServices = s.related.map((r) => serviceBySlug[r]).filter(Boolean);
  const relatedInsights = insights.filter((i) => i.services.includes(s.slug)).slice(0, 3);

  return (
    <main id="main">
      <JsonLd data={serviceSchema(s.name, s.metaDescription, `/services/${s.slug}`)} />
      <SiteBreadcrumbs items={[{ label: "Services", href: "/services" }, { label: s.short, href: `/services/${s.slug}` }]} />
      <PageHero
        eyebrow={s.eyebrow}
        title={s.h1}
        intro={s.intro}
        image={s.image}
        imageAlt={s.imageAlt}
        primary={{ label: "Get a free consultation", href: `/contact?interest=${s.slug}` }}
        secondary={{ label: "See features", href: "#features" }}
      />

      <section className="section section-soft">
        <div className="container pains-layout">
          <div>
            <p className="eyebrow">Sound familiar?</p>
            <h2>Is this happening in your business?</h2>
            <p className="muted">If any of these describe your business today, you&apos;re in the right place.</p>
          </div>
          <ul className="pain-list">
            {s.pains.map((p) => (
              <li key={p}>
                <span className="pain-icon"><X size={16} aria-hidden="true" /></span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Business outcomes" title={`How ${s.short} from VQBYTE helps your business`} />
          <div className="outcome-grid">
            {s.outcomes.map((o) => (
              <article className="outcome" key={o.title}>
                <CircleCheck size={24} aria-hidden="true" />
                <h3>{o.title}</h3>
                <p>{o.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft" id="features">
        <div className="container">
          <SectionHeading eyebrow="Features" title={s.featuresTitle} intro="Every solution is configured to your workflow — choose what you need now and add more as you grow." />
          <FeatureGrid items={s.features} />
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div className="split-media">
            <Image src={s.spotlight.image} alt={s.spotlight.imageAlt} width={1200} height={800} sizes="(max-width: 900px) 100vw, 50vw" />
          </div>
          <div>
            <p className="eyebrow">How we deliver</p>
            <h2>{s.spotlight.title}</h2>
            <p className="lede">{s.spotlight.body}</p>
            <ul className="check-list">
              {s.spotlight.points.map((p) => (
                <li key={p}><Check size={18} aria-hidden="true" />{p}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container">
          <SectionHeading eyebrow="Our process" title="From first call to go-live — and beyond" intro="A clear, step-by-step process so you always know what happens next." />
          <ProcessSteps />
          <div className="deliverables">
            <h3>What you get</h3>
            <ul>
              {s.deliverables.map((d) => (
                <li key={d}><Check size={16} aria-hidden="true" />{d}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {relatedIndustries.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeading eyebrow="Industries" title={`${s.short} for your industry`} intro="We tailor every project to the way your sector works." />
            <div className="card-grid">
              {relatedIndustries.map((i) => (
                <IndustryCard industry={i} key={i.slug} />
              ))}
            </div>
          </div>
        </section>
      )}

      <FaqSection faqs={s.faqs} title={`${s.short}: common questions`} />

      <section className="section section-soft">
        <div className="container">
          <SectionHeading eyebrow="Related services" title="Works even better together" />
          <div className="card-grid">
            {relatedServices.map((r) => (
              <ServiceCard service={r} key={r.slug} />
            ))}
          </div>
          {relatedInsights.length > 0 && (
            <div className="related-reading">
              <h3>Further reading</h3>
              <ul>
                {relatedInsights.map((i) => (
                  <li key={i.slug}>
                    <Link href={`/insights/${i.slug}`}>{i.title} <ArrowRight size={14} aria-hidden="true" /></Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <CtaBand title={`Ready to talk about ${s.short}?`} interest={s.slug} />
    </main>
  );
}
