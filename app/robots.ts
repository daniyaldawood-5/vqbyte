import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    // /admin is deliberately not listed here (that would advertise it); it sends noindex headers instead.
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
