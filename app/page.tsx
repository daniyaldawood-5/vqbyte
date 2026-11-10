import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { serviceCategories, services } from "@/content/services";
import { industries } from "@/content/industries";
import { insights } from "@/content/insights";
import { whyUs } from "@/content/process";
import { SectionHeading } from "@/components/sections/section-heading";
import { IndustryCard } from "@/components/sections/cards";
import { FaqSection } from "@/components/sections/faq-section";
import { CtaBand } from "@/components/sections/cta-band";
import { Icon } from "@/components/sections/icon";
import { buildMetadata } from "@/lib/seo";
import { HomeHero } from "@/components/home/hero";
import { Marquee } from "@/components/home/marquee";
import { DeliveryLoop } from "@/components/home/loop";
import { CountUp } from "@/components/home/count-up";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "ERP, CRM & Custom Software Development Company",
    description:
      "VQBYTE builds ERP, CRM, LMS, inventory and custom software, and grows businesses with SEO and digital marketing. Free consultation for SMEs and enterprises.",
    path: "/",
  }),
  title: { absolute: "VQBYTE | ERP, CRM & Custom Software Development Company" },
};

const intents = [
  { icon: "LayoutDashboard", title: "Replace spreadsheets with one system", body: "Connect finance, sales, purchasing and stock in an ERP.", href: "/services/erp-software" },
  { icon: "Warehouse", title: "Get control of stock and warehouses", body: "Barcode scanning, bin locations and real-time stock levels.", href: "/services/inventory-warehouse-management" },
  { icon: "Users", title: "Stop losing leads and follow-ups", body: "A CRM and WhatsApp inbox that gives every lead an owner.", href: "/services/crm-software" },
  { icon: "GraduationCap", title: "Train staff or sell courses online", body: "A branded learning platform with certificates and payments.", href: "/services/lms-development" },
  { icon: "Code2", title: "Build a custom app or portal", body: "Web and mobile software designed around your process.", href: "/services/custom-software-development" },
  { icon: "Search", title: "Get more customers online", body: "SEO, Google Ads and websites that generate enquiries.", href: "/services/seo-services" },
];

const stats = [
  { value: services.length, suffix: "", label: "Services under one roof" },
  { value: industries.length, suffix: "", label: "Industries with ready solutions" },
  { value: 4, suffix: "", label: "Steps: design, build, launch, repeat" },
  { value: 1, suffix: "", label: "Team for software and marketing" },
];

const homeFaqs = [
  {
    question: "What does VQBYTE do?",
    answer:
      "We are a software development and digital marketing company. We build and implement ERP, CRM, LMS, inventory, POS and custom software, and we help businesses grow with SEO, digital marketing and high-converting websites.",
  },
  {
    question: "Do you work with small businesses or only enterprises?",
    answer:
      "Both. Small businesses usually start with one or two modules and grow from there; mid-sized and enterprise clients often need multi-branch, multi-company or custom integrations. We scale the solution to your size and budget.",
  },
  {
    question: "Do you use ready-made software or build from scratch?",
    answer:
      "Whichever fits best. We configure our proven platforms when they meet your needs — faster and more affordable — and build custom features or complete systems where your process is unique.",
  },
  {
    question: "Can you work with clients in other countries?",
    answer:
      "Yes. We work remotely with clients across different regions and time zones, with online workshops, shared project boards and regular video demos.",
  },
  {
    question: "How do we get started?",
    answer:
      "Book a free consultation. We'll discuss your goals, recommend the best approach and send a clear proposal with scope, price and timeline.",
  },
];

export default function Home() {
  const latest = [...insights].sort((a, b) => b.published.localeCompare(a.published)).slice(0, 3);
  return (
    <main id="main">
      <HomeHero />
      <Marquee />

      <section className="stats-band">
        <div className="container stats-grid">
          {stats.map((st, i) => (
            <div className="stat" key={st.label} data-reveal style={{ "--d": `${i * 90}ms` } as React.CSSProperties}>
              <strong>
                <CountUp value={st.value} />
                {st.suffix}
              </strong>
              <span>{st.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <SectionHeading eyebrow="Start with your goal" title="What does your business need right now?" intro="Pick the challenge closest to yours. Each page explains how we solve it, what's included and how to get started." />
          <div className="intent-grid">
            {intents.map((i, n) => (
              <Link className="intent-card" href={i.href} key={i.title} data-reveal style={{ "--d": `${n * 70}ms` } as React.CSSProperties}>
                <span className="icon-badge"><Icon name={i.icon} /></span>
                <div>
                  <h3>{i.title}</h3>
                  <p>{i.body}</p>
                </div>
                <ArrowRight size={18} aria-hidden="true" className="intent-arrow" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Services" title="Software, engineering and growth — under one roof" intro="Use one service or combine them. Because everything is built by one team, your systems and marketing work together from day one." />
          <div className="category-grid">
            {serviceCategories.map((cat) => (
              <article className="category-card" key={cat.id} data-reveal>
                <h3>{cat.title}</h3>
                <p>{cat.description}</p>
                <ul>
                  {services
                    .filter((s) => s.category === cat.id)
                    .map((s) => (
                      <li key={s.slug}>
                        <Link href={`/services/${s.slug}`}>
                          <Icon name={s.icon} size={18} />
                          {s.short}
                          <ArrowRight size={15} aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container split">
          <div className="split-media" data-reveal>
            <Image src="/images/analytics-reporting.svg" alt="Management dashboard combining sales, operations and marketing data" width={1200} height={800} sizes="(max-width: 900px) 100vw, 50vw" />
          </div>
          <div>
            <p className="eyebrow">Build it and fill it</p>
            <h2>Your systems and your marketing, finally connected</h2>
            <p className="lede">
              Most companies hire one vendor for software and another for marketing — and the data never meets. We connect them: campaigns feed your CRM, your CRM feeds your ERP, and your dashboards show exactly which marketing produces revenue.
            </p>
            <ul className="check-list">
              <li><Check size={18} aria-hidden="true" />Leads from SEO, ads and WhatsApp land straight in your CRM</li>
              <li><Check size={18} aria-hidden="true" />Orders flow into inventory and accounting automatically</li>
              <li><Check size={18} aria-hidden="true" />One dashboard from marketing spend to profit</li>
            </ul>
            <Link className="button button-primary" href="/contact">Plan your connected setup <ArrowRight size={18} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Industries" title="Solutions shaped for your industry" intro="We know the workflows, terminology and pressure points of the sectors we serve." />
          <div className="card-grid cols-4">
            {industries.map((i, n) => (
              <div key={i.slug} data-reveal style={{ "--d": `${(n % 4) * 80}ms` } as React.CSSProperties}>
                <IndustryCard industry={i} withImage />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container split split-reverse">
          <div>
            <p className="eyebrow">Why VQBYTE</p>
            <h2>A technology partner that cares about your results</h2>
            <div className="why-grid">
              {whyUs.map((w) => (
                <div key={w.title}>
                  <h3>{w.title}</h3>
                  <p>{w.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="split-media" data-reveal>
            <Image src="/images/consultation-meeting.svg" alt="VQBYTE consultants running a discovery workshop with a client team" width={1200} height={800} sizes="(max-width: 900px) 100vw, 45vw" />
          </div>
        </div>
      </section>

      <section className="section section-dark loop-section">
        <div className="container">
          <SectionHeading eyebrow="How we work" title="Design. Build. Launch. Repeat." intro="One continuous cycle that takes your idea live and keeps improving it, so your software and your marketing get better every month." />
          <DeliveryLoop />
          <div className="center-action">
            <Link className="button button-light" href="/process">See our full process <ArrowRight size={18} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Insights" title="Practical guides for business owners" intro="Plain-language advice on choosing, implementing and getting value from business software and marketing." />
          <div className="card-grid">
            {latest.map((p) => (
              <Link className="insight-card" href={`/insights/${p.slug}`} key={p.slug} data-reveal>
                <span className="tag">{p.category}</span>
                <h3>{p.title}</h3>
                <p>{p.summary}</p>
                <span className="card-link">Read guide <ArrowRight size={16} aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FaqSection faqs={homeFaqs} intro="Can't find your answer? Ask us directly — we're happy to help." />
      <CtaBand />
    </main>
  );
}
