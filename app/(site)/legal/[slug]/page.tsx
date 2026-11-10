import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLegalPages, legalSlugs, type LegalSlug } from "@/content/legal";
import { getPublicSettings } from "@/lib/settings";
import { SiteBreadcrumbs } from "@/components/ui/site-breadcrumbs";
import { buildMetadata } from "@/lib/seo";

type Slug = LegalSlug;
const pagesFor = async () => getLegalPages(await getPublicSettings());

export function generateStaticParams() {
  return legalSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = (await pagesFor())[slug as Slug];
  return page ? buildMetadata({ title: page.title, description: page.description, path: `/legal/${slug}` }) : {};
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = (await pagesFor())[slug as Slug];
  if (!page) notFound();
  return (
    <main id="main">
      <SiteBreadcrumbs items={[{ label: page.title, href: `/legal/${slug}` }]} />
      <article className="article legal container">
        <header>
          <p className="eyebrow">Legal</p>
          <h1>{page.title}</h1>
          <p className="lede">{page.description}</p>
          <p className="meta">Last updated: {page.updated}</p>
        </header>
        {page.sections.map((s) => (
          <section key={s.title}>
            <h2>{s.title}</h2>
            <p>{s.body}</p>
          </section>
        ))}
      </article>
    </main>
  );
}
