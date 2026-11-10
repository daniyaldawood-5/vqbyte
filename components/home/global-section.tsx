import { CircleCheck } from "lucide-react";
import { Globe } from "./globe";

const points = ["Multi-company & multi-currency", "English, Arabic & right-to-left", "Remote delivery across time zones"];

export function GlobalSection() {
  return (
    <section className="global-section" aria-labelledby="global-title">
      <div className="container global-head" data-reveal>
        <p className="eyebrow">Global by design</p>
        <h2 id="global-title">
          Software for the industries that keep the world moving<span className="caret" aria-hidden="true">_</span>
        </h2>
        <p className="lede">
          Oil &amp; gas, logistics and manufacturing run across borders, currencies and time zones. We build ERP, warehouse and CRM systems that work the same way, and deliver them remotely wherever you operate.
        </p>
        <ul className="global-points">
          {points.map((p) => (
            <li key={p}>
              <CircleCheck size={18} aria-hidden="true" />
              {p}
            </li>
          ))}
        </ul>
      </div>
      <div className="global-stage">
        <svg className="orbits" viewBox="0 0 1000 600" aria-hidden="true">
          <defs>
            <path id="orbit-a" d="M60 470 C 220 250, 780 250, 940 470 C 780 560, 220 560, 60 470 Z" />
            <path id="orbit-b" d="M120 360 C 330 120, 670 120, 880 360 C 670 470, 330 470, 120 360 Z" />
          </defs>
          <use href="#orbit-a" className="orbit-path" />
          <use href="#orbit-b" className="orbit-path" />
          {[
            { path: "#orbit-a", dur: "16s", begin: "0s", color: "#06a8e6" },
            { path: "#orbit-a", dur: "16s", begin: "-8s", color: "#7c5cff" },
            { path: "#orbit-b", dur: "11s", begin: "-3s", color: "#f59e0b" },
          ].map((s, i) => (
            <g key={i}>
              <circle r="14" fill={s.color} opacity="0.15">
                <animateMotion dur={s.dur} begin={s.begin} repeatCount="indefinite" rotate="auto">
                  <mpath href={s.path} />
                </animateMotion>
                <animate attributeName="r" values="8;18;8" dur="2s" repeatCount="indefinite" />
              </circle>
              <g>
                <animateMotion dur={s.dur} begin={s.begin} repeatCount="indefinite" rotate="auto">
                  <mpath href={s.path} />
                </animateMotion>
                <rect x="-9" y="-3" width="6" height="6" rx="1" fill={s.color} />
                <rect x="3" y="-3" width="6" height="6" rx="1" fill={s.color} />
                <circle r="4" fill="#fff" stroke={s.color} strokeWidth="2" />
              </g>
            </g>
          ))}
        </svg>
        <Globe />
        <ul className="globe-legend" aria-label="Map legend">
          <li><span style={{ background: "#f59e0b" }} />Oil &amp; gas hubs</li>
          <li><span style={{ background: "#06a8e6" }} />Logistics &amp; trade</li>
          <li><span style={{ background: "#7c5cff" }} />Manufacturing</li>
          <li><span className="lane" />Supply-chain lanes</li>
        </ul>
        <p className="globe-hint" aria-hidden="true">Drag to explore</p>
      </div>
    </section>
  );
}
