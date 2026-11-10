import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export function PageHero({
  eyebrow, title, intro, image, imageAlt, points, primary, secondary,
}: {
  eyebrow: string; title: string; intro: string; image?: string; imageAlt?: string; points?: string[];
  primary?: { label: string; href: string }; secondary?: { label: string; href: string };
}) {
  return (
    <section className="page-hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="lede">{intro}</p>
          {points && <ul className="hero-points">{points.map((p) => <li key={p}><Check size={16} aria-hidden="true" />{p}</li>)}</ul>}
          {(primary || secondary) && (
            <div className="actions">
              {primary && <Link className="button button-primary" href={primary.href}>{primary.label} <ArrowRight size={18} aria-hidden="true" /></Link>}
              {secondary && <Link className="button button-secondary" href={secondary.href}>{secondary.label}</Link>}
            </div>
          )}
        </div>
        {image && (
          <div className="hero-media">
            <Image src={image} alt={imageAlt ?? ""} width={1200} height={800} priority sizes="(max-width: 900px) 100vw, 50vw" />
          </div>
        )}
      </div>
    </section>
  );
}
