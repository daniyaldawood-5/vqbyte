import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DuotoneIcon } from "@/components/icons/duotone";

const words = ["Design.", "Build.", "Launch.", "Repeat."];

const floats = [
  { icon: "Users", title: "New lead captured", meta: "Website form → CRM", cls: "f1" },
  { icon: "Warehouse", title: "Stock synced", meta: "3 warehouses · live", cls: "f2" },
  { icon: "Search", title: "Page 1 on Google", meta: "“warehouse software”", cls: "f3" },
];

export function HomeHero() {
  return (
    <section className="hx">
      <div className="hx-bg" aria-hidden="true">
        <span className="blob b1" />
        <span className="blob b2" />
        <span className="blob b3" />
        <span className="hx-grid" />
      </div>
      <div className="container hx-inner">
        <div className="hx-copy">
          <p className="hx-pill">
            <span className="pulse" aria-hidden="true" />
            ERP · CRM · LMS · Custom software · SEO
          </p>
          <h1>
            <span className="sr-only">Design. Build. Launch. Repeat. </span>
            <span className="slogan" aria-hidden="true">
              {words.map((w, i) => (
                <span className="word" style={{ "--i": i } as React.CSSProperties} key={w}>
                  {w}
                </span>
              ))}
            </span>
            <span className="h1-sub">ERP, CRM and custom software, plus the SEO and marketing that grow your business.</span>
          </h1>
          <div className="actions">
            <Link className="button button-primary button-glow" href="/contact">
              Start your project <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link className="button button-ghost" href="/services">
              Explore services
            </Link>
          </div>
          <p className="hx-note">Free consultation · Fixed-scope proposals · Support after launch</p>
        </div>
        <div className="hx-visual">
          <svg className="orbit" viewBox="0 0 600 600" aria-hidden="true">
            <circle cx="300" cy="300" r="260" />
            <circle cx="300" cy="300" r="200" />
            <circle className="dot" cx="560" cy="300" r="6" />
          </svg>
          <div className="hx-screen">
            <Image
              src="/images/hero-platform.svg"
              alt="VQ ERP dashboard with sales, inventory and finance data alongside a mobile app and CRM chat"
              width={1200}
              height={800}
              priority
              sizes="(max-width: 900px) 100vw, 55vw"
            />
          </div>
          {floats.map((f) => (
            <div className={`float-card ${f.cls}`} key={f.title} aria-hidden="true">
              <span className="float-icon"><DuotoneIcon name={f.icon} size={26} /></span>
              <span>
                <strong>{f.title}</strong>
                <small>{f.meta}</small>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
