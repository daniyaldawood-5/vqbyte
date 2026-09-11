import type { NavGroup } from "./types";
export const navigation: NavGroup[] = [
  { label: "Products", featured: { label: "All products", href: "/products", description: "Compare four connected starting points." }, items: [
    { label: "VQ ERP", href: "/products/erp", description: "Connect sales, purchasing and operations." },
    { label: "VQ Inventory", href: "/products/inventory-management", description: "Control stock across locations." },
    { label: "VQ POS", href: "/products/pos", description: "Connect checkout, customers and inventory." },
    { label: "VQ WhatsApp CRM", href: "/products/whatsapp-crm", description: "Assign and follow up conversations." },
  ]},
  { label: "Solutions", featured: { label: "All solutions", href: "/solutions", description: "Start with the operational problem." }, items: [
    { label: "Multi-Branch Operations", href: "/solutions/multi-branch-operations" }, { label: "Inventory Control", href: "/solutions/inventory-control" }, { label: "Sales & Order Management", href: "/solutions/sales-order-management" }, { label: "WhatsApp Sales & Support", href: "/solutions/whatsapp-sales-support" }, { label: "Reporting & Dashboards", href: "/solutions/business-dashboards" },
  ]},
  { label: "Services", featured: { label: "All services", href: "/services", description: "Engineering for software that must fit." }, items: [
    { label: "Custom Software", href: "/services/custom-software-development" }, { label: "Web Applications", href: "/services/web-application-development" }, { label: "Websites & E-commerce", href: "/services/ecommerce-development" }, { label: "Android & iOS Apps", href: "/services/mobile-app-development" }, { label: "Integrations & Automation", href: "/services/api-integration-automation" }, { label: "Implementation & Migration", href: "/implementation" },
  ]},
  { label: "Industries", featured: { label: "All industries", href: "/industries", description: "See workflows in context." }, items: [
    { label: "Retail & Multi-Location", href: "/industries/retail" }, { label: "Wholesale & Distribution", href: "/industries/wholesale-distribution" }, { label: "Service Operations", href: "/industries/service-business" },
  ]},
  { label: "Resources", featured: { label: "Resource library", href: "/resources" }, items: [
    { label: "Guides", href: "/resources" }, { label: "Product Walkthroughs", href: "/work" }, { label: "Product Updates", href: "/resources#updates" },
  ]},
  { label: "Company", items: [{ label: "About", href: "/company/about" }, { label: "Contact", href: "/contact" }] },
];
