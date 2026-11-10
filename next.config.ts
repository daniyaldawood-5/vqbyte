import type { NextConfig } from "next";

/** Old URLs from the previous site structure → their single replacement page. */
const legacyRedirects: [string, string][] = [
  ["/products", "/services"],
  ["/products/erp", "/services/erp-software"],
  ["/products/inventory-management", "/services/inventory-warehouse-management"],
  ["/products/pos", "/services/pos-software"],
  ["/products/whatsapp-crm", "/services/crm-software"],
  ["/solutions", "/services"],
  ["/solutions/multi-branch-operations", "/services/erp-software"],
  ["/solutions/inventory-control", "/services/inventory-warehouse-management"],
  ["/solutions/sales-order-management", "/services/crm-software"],
  ["/solutions/whatsapp-sales-support", "/services/crm-software"],
  ["/solutions/business-dashboards", "/services/business-intelligence-dashboards"],
  ["/services/ecommerce-development", "/services/website-development"],
  ["/industries/retail", "/industries/retail-ecommerce"],
  ["/industries/service-business", "/industries/field-professional-services"],
  ["/implementation", "/process"],
  ["/book-a-demo", "/contact"],
  ["/company/about", "/about"],
  ["/work", "/services"],
  ["/work/:slug", "/services"],
  ["/resources", "/insights"],
  ["/resources/guides/whatsapp-crm-guide", "/insights/crm-for-small-business"],
  ["/resources/guides/erp-requirements-checklist", "/insights/erp-implementation-checklist"],
  ["/resources/guides/spreadsheets-to-erp-migration", "/insights/spreadsheets-to-erp-migration"],
  ["/resources/guides/:slug", "/insights"],
];

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  serverExternalPackages: ["mongodb"],
  images: { dangerouslyAllowSVG: true, contentDispositionType: "inline", unoptimized: true },
  async redirects() {
    return legacyRedirects.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "Cache-Control", value: "no-store" },
        ],
      },
      { source: "/admin", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }, { key: "Cache-Control", value: "no-store" }] },
    ];
  },
};

export default nextConfig;
