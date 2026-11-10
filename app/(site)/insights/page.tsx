import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { insights } from "@/content/insights";
import { SiteBreadcrumbs } from "@/components/ui/site-breadcrumbs";
import { CtaBand } from "@/components/sections/cta-band";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Insights — ERP, CRM, LMS & Digital Marketing Guides",
  description:
    "Practical guides on choosing and implementing ERP, CRM, LMS and warehouse software, plus SEO and digital marketing advice for growing businesses.",
  path: "/insights",
});

const formatDate = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export default function InsightsPage() {
  const sorted = [...insights].sort((a, b) => b.published.localeCompare(a.published));
  return (
    <main id="main">
      <SiteBreadcrumbs items={[{ label: "Insights", href: "/insights" }]} />
      <section className="page-hero page-hero-simple">
        <div className="container">
          <p className="eyebrow">Insights</p>
          <h1>Guides for choosing and using business software</h1>
          <p className="lede">Straightforward advice from our engineers and marketers — no jargon, no sales pitch.</p>
        </div>
      </section>
      <section className="section section-soft">
        <div className="container card-grid">
          {sorted.map((p) => (
            <Link className="insight-card" href={`/insights/${p.slug}`} key={p.slug}>
              <span className="tag">{p.category}</span>
              <h2>{p.title}</h2>
              <p>{p.summary}</p>
              <span className="meta">
                <time dateTime={p.published}>{formatDate(p.published)}</time> · {p.readingMinutes} min read
              </span>
              <span className="card-link">Read guide <ArrowRight size={16} aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
      </section>
      <CtaBand />
    </main>
  );
}
