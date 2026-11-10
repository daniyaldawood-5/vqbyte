import type { Metadata } from "next";
import Image from "next/image";
import { Check } from "lucide-react";
import { whyUs } from "@/content/process";
import { services } from "@/content/services";
import { industries } from "@/content/industries";
import { PageHero } from "@/components/sections/page-hero";
import { SectionHeading } from "@/components/sections/section-heading";
import { CtaBand } from "@/components/sections/cta-band";
import { SiteBreadcrumbs } from "@/components/ui/site-breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About VQBYTE — Software & Digital Growth Partner",
  description:
    "VQBYTE is a software development and digital marketing company helping businesses run better with ERP, CRM, LMS and custom software, and grow with SEO and marketing.",
  path: "/about",
});

const values = [
  { title: "Customer outcomes first", body: "We measure success by what changes in your business — time saved, errors removed, customers won." },
  { title: "Honest advice", body: "If you don't need custom software, we'll tell you. If something is out of scope, we'll say so up front." },
  { title: "Craft and quality", body: "Clean code, thoughtful design and proper testing — because you'll live with this system for years." },
  { title: "Long-term partnership", body: "We stay after launch to support, improve and grow your systems with you." },
];

export default function AboutPage() {
  return (
    <main id="main">
      <SiteBreadcrumbs items={[{ label: "About", href: "/about" }]} />
      <PageHero
        eyebrow="About VQBYTE"
        title="We help businesses run better and grow faster with technology"
        intro="VQBYTE is a team of software engineers, business analysts, designers and digital marketers. We build the systems that run day-to-day operations — and the marketing that brings in new customers — for small businesses, growing companies and enterprises."
        image="/images/team-collaboration.svg"
        imageAlt="VQBYTE engineers, analysts and marketers collaborating in the office"
        primary={{ label: "Work with us", href: "/contact" }}
      />
      <section className="section section-soft">
        <div className="container split">
          <div>
            <p className="eyebrow">Our mission</p>
            <h2>Make powerful business software accessible to every growing company</h2>
            <p className="lede">
              Enterprise-grade systems used to be out of reach for small and mid-sized businesses. We change that by combining proven platforms with focused custom engineering, delivered in phases that fit your budget.
            </p>
            <ul className="check-list">
              <li><Check size={18} aria-hidden="true" />{services.length} services across software, engineering and marketing</li>
              <li><Check size={18} aria-hidden="true" />Specialist solutions for {industries.length} industries</li>
              <li><Check size={18} aria-hidden="true" />Remote-first delivery for clients in any region</li>
            </ul>
          </div>
          <div className="split-media">
            <Image src="/images/consultation-meeting.svg" alt="Discovery workshop mapping a client's business process" width={1200} height={800} sizes="(max-width: 900px) 100vw, 50vw" />
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Our values" title="How we work with clients" />
          <div className="feature-grid">
            {values.map((v) => (
              <article className="feature" key={v.title}>
                <h3>{v.title}</h3>
                <p>{v.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section section-soft">
        <div className="container">
          <SectionHeading eyebrow="Why clients choose us" title="What makes VQBYTE different" />
          <div className="feature-grid">
            {whyUs.map((w) => (
              <article className="feature" key={w.title}>
                <h3>{w.title}</h3>
                <p>{w.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </main>
  );
}
