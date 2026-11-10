import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Icon } from "./icon";
import type { Industry, Service } from "@/content/types";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link className="service-card" href={`/services/${service.slug}`}>
      <span className="icon-badge"><Icon name={service.icon} /></span>
      <h3>{service.short}</h3>
      <p>{service.metaDescription.split(". ")[0]}.</p>
      <span className="card-link">Learn more <ArrowRight size={16} aria-hidden="true" /></span>
    </Link>
  );
}

export function IndustryCard({ industry, withImage = false }: { industry: Industry; withImage?: boolean }) {
  return (
    <Link className={`industry-card ${withImage ? "has-image" : ""}`} href={`/industries/${industry.slug}`}>
      {withImage && (
        <span className="industry-thumb">
          <Image src={industry.image} alt="" width={1200} height={800} sizes="(max-width: 640px) 100vw, (max-width: 1120px) 50vw, 25vw" />
        </span>
      )}
      <span className="icon-badge"><Icon name={industry.icon} /></span>
      <h3>{industry.name}</h3>
      <p>{industry.segments.slice(0, 3).join(" · ")}</p>
      <span className="card-link">See solutions <ArrowRight size={16} aria-hidden="true" /></span>
    </Link>
  );
}

export function FeatureGrid({ items, numbered = false }: { items: { title: string; body: string }[]; numbered?: boolean }) {
  return (
    <div className="feature-grid">
      {items.map((f, i) => (
        <article className="feature" key={f.title}>
          {numbered && <span className="feature-num">{String(i + 1).padStart(2, "0")}</span>}
          <h3>{f.title}</h3>
          <p>{f.body}</p>
        </article>
      ))}
    </div>
  );
}
