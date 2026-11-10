import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { site } from "@/content/site";

export function CtaBand({
  title = "Let's talk about what your business needs",
  body = "Book a free 30-minute consultation. We'll listen, ask the right questions and suggest the fastest way to solve your problem — no obligation.",
  interest,
  href: hrefOverride,
}: { title?: string; body?: string; interest?: string; href?: string }) {
  const href = hrefOverride ?? (interest ? `/contact?interest=${interest}` : "/contact");
  return (
    <section className="cta-band">
      <div className="container cta-grid">
        <div>
          <p className="eyebrow">Free consultation</p>
          <h2>{title}</h2>
          <p>{body}</p>
        </div>
        <div className="cta-actions">
          <Link className="button button-light" href={href}>Book a free consultation <ArrowRight size={18} aria-hidden="true" /></Link>
          <a className="text-link on-dark" href={`mailto:${site.email}`}>or email {site.email}</a>
        </div>
      </div>
    </section>
  );
}
