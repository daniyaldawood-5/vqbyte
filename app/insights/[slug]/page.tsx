import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { insights, insightBySlug } from "@/content/insights";
import { serviceBySlug } from "@/content/services";
import { site } from "@/content/site";
import { ServiceCard } from "@/components/sections/cards";
import { CtaBand } from "@/components/sections/cta-band";
import { SiteBreadcrumbs } from "@/components/ui/site-breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl, buildMetadata, siteUrl } from "@/lib/seo";

export function generateStaticParams() {
  return insights.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = insightBySlug[slug];
  if (!p) return {};
  return buildMetadata({ title: p.title, description: p.metaDescription, path: `/insights/${p.slug}`, type: "article" });
}

const formatDate = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = insightBySlug[slug];
  if (!p) notFound();
  const related = p.services.map((s) => serviceBySlug[s]).filter(Boolean);
  const more = insights.filter((i) => i.slug !== p.slug).slice(0, 3);

  return (
    <main id="main">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: p.title,
          description: p.metaDescription,
          datePublished: p.published,
          dateModified: p.published,
          mainEntityOfPage: absoluteUrl(`/insights/${p.slug}`),
          author: { "@type": "Organization", name: site.name, url: siteUrl },
          publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: absoluteUrl("/brand/vqbyte-logo.svg") } },
        }}
      />
      <SiteBreadcrumbs items={[{ label: "Insights", href: "/insights" }, { label: p.title, href: `/insights/${p.slug}` }]} />
      <article className="article container">
        <header>
          <span className="tag">{p.category}</span>
          <h1>{p.title}</h1>
          <p className="lede">{p.summary}</p>
          <p className="meta">
            By the {site.name} team · <time dateTime={p.published}>{formatDate(p.published)}</time> · {p.readingMinutes} min read
          </p>
        </header>
        {p.sections.map((s) => (
          <section key={s.title}>
            <h2>{s.title}</h2>
            {s.body.map((b) => (
              <p key={b.slice(0, 32)}>{b}</p>
            ))}
            {s.list && (
              <ul>
                {s.list.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
        <aside className="article-cta">
          <h2>Need help putting this into practice?</h2>
          <p>Talk to our team for free advice tailored to your business.</p>
          <Link className="button button-primary" href={`/contact?interest=${p.services[0]}`}>
            Book a free consultation <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </aside>
      </article>
      <section className="section section-soft">
        <div className="container">
          <h2 className="h-sub">Related services</h2>
          <div className="card-grid">
            {related.map((s) => (
              <ServiceCard service={s} key={s.slug} />
            ))}
          </div>
          <h2 className="h-sub">More guides</h2>
          <ul className="more-guides">
            {more.map((m) => (
              <li key={m.slug}>
                <Link href={`/insights/${m.slug}`}>{m.title} <ArrowRight size={14} aria-hidden="true" /></Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand />
    </main>
  );
}
