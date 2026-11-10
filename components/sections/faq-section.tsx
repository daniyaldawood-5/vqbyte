import type { Faq } from "@/content/types";
import { JsonLd } from "@/components/seo/json-ld";
import { faqSchema } from "@/lib/seo";

export function FaqSection({ faqs, title = "Frequently asked questions", intro }: { faqs: Faq[]; title?: string; intro?: string }) {
  if (!faqs.length) return null;
  return (
    <section className="section" id="faq">
      <JsonLd data={faqSchema(faqs)} />
      <div className="container faq-layout">
        <div>
          <p className="eyebrow">FAQ</p>
          <h2>{title}</h2>
          {intro && <p className="muted">{intro}</p>}
        </div>
        <div className="faq-list">
          {faqs.map((item) => (
            <details key={item.question}>
              <summary>{item.question}<span aria-hidden="true" /></summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
