import { DuotoneIcon } from "@/components/icons/duotone";

const steps = [
  { icon: "Design", title: "Design", body: "Workshops, process maps and clickable prototypes, so you see the solution before we build it." },
  { icon: "Build", title: "Build", body: "We configure proven platforms, write custom code and connect your systems, with demos every two weeks." },
  { icon: "Launch", title: "Launch", body: "Data migration, team training, go-live support and the SEO and campaigns that bring customers in." },
  { icon: "Repeat", title: "Repeat", body: "We measure, improve and grow every month: new features, better rankings, more leads." },
];

export function DeliveryLoop() {
  return (
    <div className="loop">
      <svg className="loop-line" viewBox="0 0 1000 20" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 10H1000" />
        <path className="loop-pulse" d="M0 10H1000" />
      </svg>
      <ol>
        {steps.map((s, i) => (
          <li key={s.title} data-reveal style={{ "--d": `${i * 120}ms` } as React.CSSProperties}>
            <span className="loop-icon" style={{ "--i": i } as React.CSSProperties}>
              <DuotoneIcon name={s.icon} size={40} />
            </span>
            <span className="loop-num">0{i + 1}</span>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
