export function SectionHeading({ eyebrow, title, intro, align = "split" }: { eyebrow?: string; title: string; intro?: string; align?: "split" | "center" }) {
  return (
    <div className={`section-heading ${align === "center" ? "is-center" : ""}`}>
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
      </div>
      {intro && <p>{intro}</p>}
    </div>
  );
}
