import type { Metadata } from "next";
import Image from "next/image";
import { Check } from "lucide-react";
import { engagementModels, pricingFactors } from "@/content/process";
import { PageHero } from "@/components/sections/page-hero";
import { SectionHeading } from "@/components/sections/section-heading";
import { ProcessSteps } from "@/components/sections/process-steps";
import { FaqSection } from "@/components/sections/faq-section";
import { CtaBand } from "@/components/sections/cta-band";
import { SiteBreadcrumbs } from "@/components/ui/site-breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Our Process — Software Implementation Methodology",
  description:
    "How VQBYTE delivers ERP, CRM, LMS and custom software: discovery, fixed-scope proposal, prototype, sprints, data migration, training, go-live and ongoing support.",
  path: "/process",
});

const faqs = [
  {
    question: "How involved does our team need to be?",
    answer:
      "Plan for a project owner who can make decisions and a few key users for workshops, testing and training. We keep meetings focused and share progress through regular demos.",
  },
  {
    question: "What happens if requirements change during the project?",
    answer:
      "Change is normal. We review each request, explain its impact on cost and timeline, and only proceed once you approve it in writing.",
  },
  {
    question: "Do you sign NDAs?",
    answer: "Yes. We're happy to sign a non-disclosure agreement before you share sensitive information.",
  },
];

export default function ProcessPage() {
  return (
    <main id="main">
      <SiteBreadcrumbs items={[{ label: "Our process", href: "/process" }]} />
      <PageHero
        eyebrow="Our process"
        title="A proven process that gets software live — and used"
        intro="Successful projects aren't just about code. They need clear goals, clean data, trained users and support after launch. Here's exactly how we work."
        image="/images/consultation-meeting.svg"
        imageAlt="Team mapping a business process during a discovery workshop"
        primary={{ label: "Start with a free call", href: "/contact" }}
      />
      <section className="section section-soft">
        <div className="container">
          <SectionHeading eyebrow="Six steps" title="From discovery to continuous improvement" />
          <ProcessSteps />
        </div>
      </section>
      <section className="section">
        <div className="container split">
          <div>
            <p className="eyebrow">Delivery</p>
            <h2>You see progress every two weeks</h2>
            <p className="lede">We build in short sprints. At the end of each one you get a working demo on a test environment — so you can give feedback early, not after launch.</p>
            <ul className="check-list">
              <li><Check size={18} aria-hidden="true" />Dedicated project lead as your single point of contact</li>
              <li><Check size={18} aria-hidden="true" />Shared project board with tasks and status</li>
              <li><Check size={18} aria-hidden="true" />Test environment for your team to try features</li>
              <li><Check size={18} aria-hidden="true" />Written change approvals — no surprise invoices</li>
            </ul>
          </div>
          <div className="split-media">
            <Image src="/images/custom-software.svg" alt="Software architecture and code being reviewed during a sprint" width={1200} height={800} sizes="(max-width: 900px) 100vw, 50vw" />
          </div>
        </div>
      </section>
      <section className="section section-soft">
        <div className="container">
          <SectionHeading eyebrow="Pricing" title="How we price projects" intro="We give you a clear proposal before work starts, based on these factors." />
          <div className="pricing-grid">
            <div className="pricing-factors">
              <h3>What affects the price</h3>
              <ul>
                {pricingFactors.map((f) => (
                  <li key={f.title}>
                    <strong>{f.title}</strong>
                    <span>{f.body}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="engagement-list">
              {engagementModels.map((m) => (
                <article key={m.title}>
                  <h3>{m.title}</h3>
                  <p>{m.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
      <FaqSection faqs={faqs} />
      <CtaBand />
    </main>
  );
}
