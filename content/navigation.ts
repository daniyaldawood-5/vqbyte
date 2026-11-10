import type { NavGroup } from "./types";
import { services } from "./services";
import { industries } from "./industries";

const byCategory = (category: string) =>
  services.filter((s) => s.category === category).map((s) => ({ label: s.short, href: `/services/${s.slug}` }));

export const navigation: NavGroup[] = [
  {
    label: "Services",
    href: "/services",
    columns: [
      { title: "Business software", items: byCategory("business-software") },
      { title: "Custom engineering", items: byCategory("engineering") },
      { title: "Growth marketing", items: byCategory("growth") },
    ],
  },
  {
    label: "Industries",
    href: "/industries",
    columns: [{ title: "Industries we serve", items: industries.map((i) => ({ label: i.short, href: `/industries/${i.slug}` })) }],
  },
  {
    label: "Company",
    columns: [
      {
        title: "Company",
        items: [
          { label: "About us", href: "/about" },
          { label: "Our process", href: "/process" },
          { label: "Insights", href: "/insights" },
          { label: "Contact", href: "/contact" },
        ],
      },
    ],
  },
];
