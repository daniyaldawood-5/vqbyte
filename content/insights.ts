import type { Insight } from "./types";

export const insights: Insight[] = [
  {
    slug: "erp-implementation-checklist",
    title: "ERP Implementation Checklist: 12 Steps for a Smooth Go-Live",
    metaDescription:
      "A practical ERP implementation checklist for growing businesses: scope, data migration, testing, training and go-live steps that reduce risk.",
    category: "ERP",
    published: "2026-11-01",
    readingMinutes: 7,
    summary: "The steps that separate ERP projects that go live on time from the ones that stall — written for owners and operations managers.",
    services: ["erp-software", "business-intelligence-dashboards"],
    sections: [
      {
        title: "Start with business goals, not features",
        body: [
          "Most failed ERP projects start with a long feature list. Successful ones start with three to five business goals: close the month faster, cut stock-outs, see branch profitability daily. Every module and configuration decision should trace back to one of them.",
        ],
      },
      {
        title: "The 12-step checklist",
        body: ["Use this list to plan your rollout and hold your implementation partner accountable."],
        list: [
          "Name an internal project owner with authority to make decisions",
          "Document current processes and where they break",
          "Agree scope and phases — start with the module that hurts most",
          "Define success measures for each phase",
          "Clean master data: customers, suppliers, items, chart of accounts",
          "Decide what history to migrate and what to archive",
          "Configure roles, approvals and permissions",
          "Run a test migration and reconcile totals",
          "Test real scenarios end-to-end with real users",
          "Train each role on the tasks they actually perform",
          "Plan cutover: data freeze, opening balances, go-live day support",
          "Review after 30 days and prioritise improvements",
        ],
      },
      {
        title: "Phase it to reduce risk",
        body: [
          "A phased rollout gets value to your team sooner and limits disruption. A typical sequence is sales, inventory and accounting first, then purchasing and production, then HR and advanced reporting.",
        ],
      },
    ],
  },
  {
    slug: "choose-warehouse-management-system",
    title: "How to Choose a Warehouse Management System (WMS) in 2026",
    metaDescription:
      "What to look for in a warehouse management system: barcode scanning, bin locations, picking methods, 3PL billing, integrations and total cost.",
    category: "Inventory & Warehouse",
    published: "2026-10-20",
    readingMinutes: 6,
    summary: "A buyer's guide to WMS features that actually improve accuracy and speed on the warehouse floor.",
    services: ["inventory-warehouse-management", "erp-software"],
    sections: [
      {
        title: "Inventory software vs a true WMS",
        body: [
          "Basic inventory software tells you how much stock you have. A warehouse management system tells you exactly where it is, directs people to move it and records every scan. If you have more than a few hundred SKUs, multiple pickers or bin locations, you need WMS capabilities.",
        ],
      },
      {
        title: "Must-have features",
        body: ["Evaluate every option against your real daily operations."],
        list: [
          "Barcode or QR scanning for every movement",
          "Bin, rack and zone locations",
          "Guided put-away and picking (order, batch or wave)",
          "Batch, lot, serial and expiry tracking",
          "Cycle counting without shutting down",
          "Integration with ERP, POS and e-commerce",
          "Multi-client stock and billing for 3PLs",
          "Mobile apps that work offline",
        ],
      },
      {
        title: "Calculate the real return",
        body: [
          "Look beyond licence cost. Measure picking speed, mis-picks, stock-count time, write-offs and customer complaints today, then set targets. Those numbers make the business case — and tell you whether the system is working after go-live.",
        ],
      },
    ],
  },
  {
    slug: "crm-for-small-business",
    title: "CRM for Small Business: Do You Need One and What Should It Do?",
    metaDescription:
      "Signs your business needs a CRM, the features that matter most for small teams, and how to connect WhatsApp, your website and sales pipeline.",
    category: "CRM",
    published: "2026-10-08",
    readingMinutes: 5,
    summary: "If leads arrive from your website, phone and WhatsApp and nobody is sure who followed up, it's time for a CRM.",
    services: ["crm-software", "digital-marketing"],
    sections: [
      {
        title: "Five signs you've outgrown spreadsheets",
        body: ["A CRM is worth it as soon as missed follow-ups start costing you deals."],
        list: [
          "Leads are scattered across inboxes, phones and notebooks",
          "You can't say how many deals are in progress or what they're worth",
          "Customer history leaves when a salesperson leaves",
          "Follow-ups depend on memory",
          "You don't know which marketing channel brings customers",
        ],
      },
      {
        title: "Features that matter most",
        body: [
          "Keep it simple: automatic lead capture, a visual pipeline, tasks and reminders, a shared WhatsApp and email inbox, and basic reports. Advanced automation can come later once the team uses the basics every day.",
        ],
      },
      {
        title: "Connect marketing and sales",
        body: [
          "The biggest win comes from connecting your website forms and ad campaigns to the CRM. Every lead is tagged with its source, so you can see which campaigns produce revenue and spend accordingly.",
        ],
      },
    ],
  },
  {
    slug: "custom-lms-vs-off-the-shelf",
    title: "Custom LMS vs Off-the-Shelf Course Platforms: Which Is Right for You?",
    metaDescription:
      "Compare custom LMS development with off-the-shelf course platforms on cost, branding, ownership, integrations and scalability.",
    category: "LMS",
    published: "2026-09-25",
    readingMinutes: 5,
    summary: "When renting a course platform makes sense — and when building your own LMS pays off.",
    services: ["lms-development", "mobile-app-development"],
    sections: [
      {
        title: "When off-the-shelf works",
        body: [
          "If you're testing a few courses with a small audience and don't need special workflows, a hosted course platform is a quick, low-cost start.",
        ],
      },
      {
        title: "When a custom LMS pays off",
        body: ["A custom LMS becomes the better investment when any of these apply:"],
        list: [
          "Platform fees or per-sale commissions are growing with your revenue",
          "You need full branding, your own domain and mobile apps",
          "You train employees and need HR or ERP integration",
          "You run franchises, partner institutes or multiple brands",
          "You need custom assessments, certifications or compliance records",
        ],
      },
      {
        title: "Own your learner data",
        body: [
          "With a custom LMS you own the platform and learner data, can export it any time and are free to add features as your academy grows.",
        ],
      },
    ],
  },
  {
    slug: "seo-for-b2b-companies",
    title: "SEO for B2B Companies: A Practical Plan That Generates Leads",
    metaDescription:
      "A practical B2B SEO plan: keyword research by buyer intent, service and industry pages, technical SEO, content and measuring SEO in leads.",
    category: "SEO & Marketing",
    published: "2026-09-12",
    readingMinutes: 6,
    summary: "How B2B companies can turn their website into a steady source of qualified enquiries.",
    services: ["seo-services", "website-development", "digital-marketing"],
    sections: [
      {
        title: "Target buyer intent, not vanity keywords",
        body: [
          "B2B buyers search for specific solutions: \"construction ERP\", \"warehouse management system\", \"custom LMS development\". These keywords have lower volume than generic terms but convert far better. Build your keyword list around services, industries and problems.",
        ],
      },
      {
        title: "Build pages that match each search",
        body: ["Every important keyword cluster deserves its own focused page."],
        list: [
          "One page per service with clear benefits, features and FAQs",
          "One page per industry explaining how you solve their problems",
          "Guides that answer questions buyers ask before they're ready to talk",
          "Strong internal links between related pages",
        ],
      },
      {
        title: "Fix the technical foundation",
        body: [
          "Fast loading, mobile-friendly layouts, clean URLs, structured data and an XML sitemap make it easy for search engines to crawl and understand your site.",
        ],
      },
      {
        title: "Measure SEO in leads",
        body: [
          "Track form submissions and calls from organic search in your CRM. Rankings are a leading indicator; qualified leads and revenue are what matter.",
        ],
      },
    ],
  },
  {
    slug: "spreadsheets-to-erp-migration",
    title: "From Spreadsheets to ERP: A Low-Risk Data Migration Plan",
    metaDescription:
      "How to move from spreadsheets to ERP safely: profile data, clean master records, test-migrate, reconcile and control cutover.",
    category: "ERP",
    published: "2026-08-28",
    readingMinutes: 5,
    summary: "Migration succeeds when your team trusts the numbers on day one. Here's how to get there.",
    services: ["erp-software", "api-integration-automation"],
    sections: [
      {
        title: "Profile before you map",
        body: [
          "Identify owners, duplicates, missing codes and inconsistent formats. Decide which records must be active in the new system, which should be archived and which can be dropped.",
        ],
      },
      {
        title: "Test with real scenarios",
        body: [
          "Import a sample, then ask users to process normal transactions and run reports. Reconcile totals back to the source before planning the final cutover.",
        ],
      },
      {
        title: "Control the cutover",
        body: ["Agree the details in advance:"],
        list: [
          "Data freeze date and final extraction",
          "Opening balances and who signs them off",
          "Who fixes data issues found after go-live",
          "Fallback plan if a critical issue appears",
        ],
      },
    ],
  },
];

export const insightBySlug: Record<string, Insight> = Object.fromEntries(insights.map((i) => [i.slug, i]));
