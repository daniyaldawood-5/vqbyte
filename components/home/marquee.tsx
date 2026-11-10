import { DuotoneIcon } from "@/components/icons/duotone";

const items: [string, string][] = [
  ["LayoutDashboard", "ERP systems"],
  ["Users", "CRM & WhatsApp inbox"],
  ["GraduationCap", "Learning platforms"],
  ["Warehouse", "Warehouse management"],
  ["ScanBarcode", "Point of sale"],
  ["Code2", "Custom software"],
  ["Smartphone", "Mobile apps"],
  ["Workflow", "Integrations"],
  ["BarChart3", "BI dashboards"],
  ["Search", "SEO"],
  ["Megaphone", "Digital marketing"],
  ["Globe", "Websites & e-commerce"],
];

export function Marquee() {
  const row = items.map(([icon, label]) => (
    <li key={label}>
      <DuotoneIcon name={icon} size={24} />
      {label}
    </li>
  ));
  return (
    <div className="marquee" aria-label="What we build">
      <ul className="marquee-track">
        {row}
        {items.map(([icon, label]) => (
          <li key={`dup-${label}`} aria-hidden="true">
            <DuotoneIcon name={icon} size={24} />
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}
