import type { MetadataRoute } from "next";
import { services } from "@/content/services";
import { industries } from "@/content/industries";
import { insights } from "@/content/insights";
import { absoluteUrl } from "@/lib/seo";

const LAST_UPDATED = new Date("2026-11-11");

export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (path: string, priority: number, changeFrequency: "weekly" | "monthly" | "yearly" = "monthly", lastModified = LAST_UPDATED) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
  });
  return [
    entry("/", 1, "weekly"),
    entry("/services", 0.9),
    entry("/industries", 0.9),
    ...services.map((s) => entry(`/services/${s.slug}`, 0.9)),
    ...industries.map((i) => entry(`/industries/${i.slug}`, 0.8)),
    entry("/insights", 0.7, "weekly"),
    ...insights.map((i) => entry(`/insights/${i.slug}`, 0.6, "monthly", new Date(i.published))),
    entry("/about", 0.6),
    entry("/process", 0.6),
    entry("/contact", 0.7),
    entry("/legal/privacy", 0.2, "yearly"),
    entry("/legal/terms", 0.2, "yearly"),
    entry("/legal/cookies", 0.2, "yearly"),
  ];
}
