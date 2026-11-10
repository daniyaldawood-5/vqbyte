import type { Industry } from "./types";

export const industries: Industry[] = [
  {
    slug: "warehousing-logistics",
    name: "Warehousing & Logistics",
    short: "Warehousing & Logistics",
    icon: "Warehouse",
    metaTitle: "Warehouse Management & Logistics Software",
    metaDescription:
      "Warehouse management, inventory and logistics software for warehouses, 3PLs and stockists. Barcode scanning, bin locations, picking, dispatch and billing.",
    keywords: ["warehouse management software", "3PL software", "logistics software", "stock management for warehouses", "WMS"],
    h1: "Warehouse and logistics software that keeps stock accurate and orders moving",
    intro:
      "Whether you run your own warehouse, a 3PL operation or a network of stock points, we give you real-time stock visibility, faster picking and complete traceability — from inbound truck to delivered order.",
    image: "/images/warehouse-operations.svg",
    imageAlt: "Warehouse with pallet racks, forklift and a worker scanning stock",
    segments: ["Warehouses & stockists", "Third-party logistics (3PL)", "Cold storage", "Freight & courier companies", "Spare-parts depots", "E-commerce fulfilment"],
    challenges: [
      { title: "Stock that doesn't match", body: "System quantities drift from reality, causing failed picks and unhappy customers." },
      { title: "Slow, error-prone picking", body: "Pickers search for items and ship the wrong products or quantities." },
      { title: "No traceability", body: "You can't trace a batch, serial or expiry date when a customer complains." },
      { title: "Client billing headaches", body: "3PL storage and handling charges are calculated manually every month." },
      { title: "Dispatch blind spots", body: "Nobody knows which orders are packed, loaded or delivered." },
    ],
    solutions: [
      { title: "Warehouse management system", body: "Bin locations, guided put-away, wave and batch picking, packing and cycle counts on mobile scanners." },
      { title: "3PL client portal", body: "Your clients see their stock, place orders and download reports themselves." },
      { title: "Automated storage billing", body: "Storage, handling and value-added services billed automatically per client." },
      { title: "Dispatch & proof of delivery", body: "Load planning, driver app, GPS tracking and photo/signature proof of delivery." },
    ],
    modules: ["Inbound receiving (ASN)", "Bin & location management", "Barcode / QR scanning", "Batch, lot & expiry tracking", "Picking & packing", "Cycle counting", "Multi-client stock", "Dispatch & POD", "Billing", "Stock dashboards"],
    workflow: ["Receive & check", "Put away to bin", "Pick & pack", "Load & dispatch", "Deliver & bill"],
    services: ["inventory-warehouse-management", "erp-software", "mobile-app-development", "api-integration-automation", "business-intelligence-dashboards"],
    faqs: [
      {
        question: "Can it handle multiple warehouses and clients?",
        answer: "Yes. Stock is tracked by warehouse, zone, bin and — for 3PLs — by client, with separate permissions and reporting for each.",
      },
      {
        question: "Does it work with our handheld scanners?",
        answer: "Our mobile scanning app runs on Android scanners from common manufacturers as well as on ordinary smartphones.",
      },
      {
        question: "Can it integrate with our clients' e-commerce stores?",
        answer: "Yes. Orders can be imported automatically from online stores and marketplaces, with tracking numbers sent back on dispatch.",
      },
    ],
  },
  {
    slug: "oil-gas",
    name: "Oil & Gas",
    short: "Oil & Gas",
    icon: "Fuel",
    metaTitle: "Oil & Gas ERP and Software Solutions",
    metaDescription:
      "ERP and custom software for oil and gas companies, fuel distributors and petrol stations. Tank inventory, fleet, maintenance, HSE, procurement and finance.",
    keywords: ["oil and gas ERP", "oil and gas software", "fuel distribution software", "petrol station management software", "tank inventory management"],
    h1: "ERP and software for oil, gas and fuel distribution companies",
    intro:
      "From storage depots and fuel stations to field operations and fleets, oil and gas businesses need tight control of product, assets, safety and cash. We build software that tracks every litre, every asset and every shift.",
    image: "/images/oil-gas-operations.svg",
    imageAlt: "Oil and gas facility with storage tanks, pipeline, tanker truck and an engineer with a tablet",
    segments: ["Fuel & lubricant distributors", "Petrol / filling station networks", "LPG & CNG distribution", "Oilfield service companies", "Storage terminals & depots", "Lubricant blending plants"],
    challenges: [
      { title: "Product losses", body: "Evaporation, measurement differences and theft are hard to detect without daily tank reconciliation." },
      { title: "Station visibility", body: "Head office waits for shift reports from every station and depot." },
      { title: "Asset downtime", body: "Pumps, tankers and equipment fail because maintenance is tracked on paper." },
      { title: "Safety & compliance", body: "HSE incidents, permits and inspections need clear records for audits." },
      { title: "Complex pricing", body: "Frequent price changes, credit customers and dealer margins are hard to manage." },
    ],
    solutions: [
      { title: "Tank & product inventory", body: "Daily dip readings, receipts, transfers and variance reports per tank and station." },
      { title: "Station & shift management", body: "Nozzle readings, shift closing, cash, cards and credit sales consolidated in real time." },
      { title: "Fleet & delivery management", body: "Tanker scheduling, trip sheets, fuel delivery tracking and driver apps." },
      { title: "Maintenance & HSE", body: "Preventive maintenance, work orders, permits, inspections and incident reporting." },
      { title: "Fuel ERP", body: "Procurement, pricing, dealer/credit accounts, finance and payroll in one system." },
    ],
    modules: ["Tank dip & variance", "Shift & nozzle readings", "Credit customers & fleet cards", "Tanker dispatch", "Preventive maintenance", "HSE & permits", "Procurement", "Price management", "Finance & payroll", "Management dashboards"],
    workflow: ["Purchase & receive product", "Store & reconcile tanks", "Dispatch to stations", "Sell & close shift", "Report & reconcile"],
    services: ["erp-software", "inventory-warehouse-management", "custom-software-development", "mobile-app-development", "business-intelligence-dashboards"],
    faqs: [
      {
        question: "Can you integrate with automatic tank gauges or fuel dispensers?",
        answer:
          "Where your equipment provides an API, data export or controller interface, we integrate readings directly. Otherwise, a mobile app captures manual readings with photos for verification.",
      },
      {
        question: "Do you support multi-station networks?",
        answer: "Yes. Each station has its own stock, shifts and cash while head office sees a consolidated, real-time view.",
      },
      {
        question: "Can field engineers use it offline?",
        answer: "Yes. Field apps for inspections, maintenance and deliveries work offline and sync when connectivity returns.",
      },
    ],
  },
  {
    slug: "manufacturing",
    name: "Manufacturing",
    short: "Manufacturing",
    icon: "Factory",
    metaTitle: "Manufacturing ERP & Production Software",
    metaDescription:
      "Manufacturing ERP for production planning, bills of materials, work orders, quality control, inventory and costing. Built for discrete and process manufacturers.",
    keywords: ["manufacturing ERP", "production planning software", "MRP software", "factory management software", "shop floor software"],
    h1: "Manufacturing ERP that connects the shop floor to the balance sheet",
    intro:
      "Plan production, control materials and know your true product cost. Our manufacturing software links sales orders, purchasing, inventory, production and quality so your factory runs on facts, not guesswork.",
    image: "/images/manufacturing-floor.svg",
    imageAlt: "Factory production line with conveyor, robotic arm and an operator at a control panel",
    segments: ["Discrete manufacturing", "Process & batch manufacturing", "Food & beverage processing", "Plastics & packaging", "Textiles & garments", "Chemicals & paints"],
    challenges: [
      { title: "Material shortages", body: "Production stops because raw materials weren't ordered in time." },
      { title: "Unknown product cost", body: "You don't know the real cost of materials, labour and overheads per product." },
      { title: "Missed delivery dates", body: "Planning is done in spreadsheets with no view of capacity." },
      { title: "Quality issues", body: "Rejects and rework aren't recorded, so root causes stay hidden." },
      { title: "WIP blind spots", body: "Nobody knows exactly what is on the floor and at which stage." },
    ],
    solutions: [
      { title: "Production planning (MRP)", body: "Plan work orders from sales demand and calculate material requirements automatically." },
      { title: "Bills of materials & routing", body: "Multi-level BOMs, operations, work centres and versions." },
      { title: "Shop-floor tracking", body: "Tablets on the floor record start, stop, output, scrap and downtime." },
      { title: "Quality control", body: "Inspections, test results, non-conformance and corrective actions." },
      { title: "Costing", body: "Actual vs standard cost per batch, product and order." },
    ],
    modules: ["Bills of materials", "MRP / material planning", "Work orders", "Shop-floor data capture", "Quality control", "Batch traceability", "Machine maintenance", "Product costing", "Sales & purchasing", "OEE dashboards"],
    workflow: ["Sales order", "Plan & check materials", "Issue work order", "Produce & inspect", "Finish, store & ship"],
    services: ["erp-software", "inventory-warehouse-management", "business-intelligence-dashboards", "custom-software-development", "lms-development"],
    faqs: [
      {
        question: "Does it support batch and process manufacturing?",
        answer: "Yes — formulas/recipes, batch sizes, yields, by-products and full lot traceability are supported alongside discrete BOMs.",
      },
      {
        question: "Can machine data be captured automatically?",
        answer: "Where machines expose data via PLC, IoT gateways or files, we integrate it. Otherwise operators record data quickly on shop-floor tablets.",
      },
      {
        question: "Can we start with inventory and add production later?",
        answer: "Yes. Many manufacturers start with inventory, purchasing and sales, then add production planning in a second phase.",
      },
    ],
  },
  {
    slug: "wholesale-distribution",
    name: "Wholesale & Distribution",
    short: "Wholesale & Distribution",
    icon: "Truck",
    metaTitle: "Distribution ERP & Wholesale Management Software",
    metaDescription:
      "ERP for wholesalers and distributors: purchasing, multi-warehouse inventory, sales orders, van sales, credit control, route delivery and B2B ordering.",
    keywords: ["distribution ERP", "wholesale software", "distribution management software", "van sales software", "FMCG distribution software"],
    h1: "Distribution software that speeds up orders and protects your margins",
    intro:
      "Wholesale and distribution run on thin margins and fast turnover. We help you buy smarter, sell faster, deliver on time and collect payments — with one connected system for office, warehouse and field.",
    image: "/images/distribution-logistics.svg",
    imageAlt: "Distribution centre loading docks with trucks, pallets of boxes and a delivery route map",
    segments: ["FMCG distributors", "Building materials suppliers", "Electrical & hardware wholesalers", "Pharmaceutical distributors", "Auto parts distributors", "Import & trading companies"],
    challenges: [
      { title: "Overdue receivables", body: "Customers exceed credit limits and collections are chased manually." },
      { title: "Stock-outs and dead stock", body: "Buying decisions are based on gut feeling, not demand data." },
      { title: "Manual order taking", body: "Sales reps phone or WhatsApp orders in, and office staff re-type them." },
      { title: "Delivery delays", body: "Routes are planned by hand and customers don't know when goods will arrive." },
      { title: "Price complexity", body: "Customer-specific prices, schemes and discounts cause billing errors." },
    ],
    solutions: [
      { title: "Distribution ERP", body: "Purchasing, multi-warehouse stock, sales, credit control and accounts in one system." },
      { title: "Sales rep & van sales app", body: "Orders, collections, returns and invoices in the field, synced instantly." },
      { title: "B2B ordering portal", body: "Customers re-order online at their own prices, 24/7." },
      { title: "Route & delivery management", body: "Route planning, load sheets, driver app and proof of delivery." },
    ],
    modules: ["Purchasing & landed cost", "Multi-warehouse inventory", "Price lists & schemes", "Credit limits & collections", "Sales rep app", "Van sales", "B2B portal", "Route delivery", "Finance", "Sales analytics"],
    workflow: ["Forecast & purchase", "Receive & store", "Take order", "Pick, load & deliver", "Invoice & collect"],
    services: ["erp-software", "inventory-warehouse-management", "mobile-app-development", "crm-software", "website-development"],
    faqs: [
      {
        question: "Do you support landed cost for imports?",
        answer: "Yes. Freight, duties, insurance and clearing charges are allocated to items so your margins reflect true cost.",
      },
      {
        question: "Can sales reps work offline?",
        answer: "Yes. The field app works offline for orders and collections and syncs when a connection is available.",
      },
      {
        question: "Can customers order online?",
        answer: "Yes. A B2B portal lets approved customers see their prices, stock availability, order history and balances.",
      },
    ],
  },
  {
    slug: "retail-ecommerce",
    name: "Retail & E-commerce",
    short: "Retail & E-commerce",
    icon: "ShoppingBag",
    metaTitle: "Retail POS, Inventory & E-commerce Software",
    metaDescription:
      "Retail and e-commerce software: multi-branch POS, inventory, online stores, loyalty and omnichannel order management. Plus SEO and digital marketing to grow sales.",
    keywords: ["retail management software", "retail ERP", "omnichannel retail software", "multi-store POS", "e-commerce integration"],
    h1: "Retail and e-commerce software that sells everywhere from one stock pool",
    intro:
      "Run your shops and online store from one system. Our retail solution connects POS, inventory, e-commerce, loyalty and accounting — and our marketing team helps bring more shoppers through the door and to your website.",
    image: "/images/retail-store.svg",
    imageAlt: "Retail store with shelves, a cashier at the POS counter and a customer",
    segments: ["Fashion & apparel", "Electronics & mobile shops", "Supermarkets & grocery", "Furniture & home", "Pharmacies & cosmetics", "Online-first brands"],
    challenges: [
      { title: "Online and store stock out of sync", body: "You sell online what's already gone from the shelf." },
      { title: "Branch performance unknown", body: "Head office can't compare branches until month-end." },
      { title: "Discounts leaking margin", body: "Unapproved discounts and returns go unnoticed." },
      { title: "Customers don't come back", body: "No loyalty programme or customer data to market to." },
    ],
    solutions: [
      { title: "Multi-branch POS", body: "Fast checkout with central pricing, promotions and cash control." },
      { title: "Omnichannel inventory", body: "One stock pool shared across stores, warehouse and online channels." },
      { title: "E-commerce store", body: "Online store connected to inventory, payments and delivery." },
      { title: "Loyalty & marketing", body: "Points, customer segments, SMS/WhatsApp campaigns, SEO and ads." },
    ],
    modules: ["POS", "Inventory & transfers", "E-commerce", "Click & collect", "Loyalty", "Promotions", "Purchasing", "Branch dashboards", "Accounting", "Marketing automation"],
    workflow: ["Buy & receive", "Distribute to branches", "Sell in store & online", "Reward & re-engage", "Analyse & replenish"],
    services: ["pos-software", "inventory-warehouse-management", "website-development", "digital-marketing", "seo-services"],
    faqs: [
      {
        question: "Which e-commerce platforms do you connect to?",
        answer: "We integrate common platforms such as Shopify and WooCommerce, popular marketplaces, or build a custom store when needed.",
      },
      {
        question: "Can you also handle our marketing?",
        answer: "Yes. Our growth team runs SEO, Google Ads, social media and email/WhatsApp campaigns tied to your sales data.",
      },
    ],
  },
  {
    slug: "construction-real-estate",
    name: "Construction & Real Estate",
    short: "Construction & Real Estate",
    icon: "Building2",
    metaTitle: "Construction ERP & Real Estate Software",
    metaDescription:
      "Construction ERP and real estate software for contractors and developers: project costing, BOQ, procurement, subcontractors, property sales CRM and installments.",
    keywords: ["construction ERP", "construction project management software", "real estate CRM", "property management software", "contractor software"],
    h1: "Construction and real estate software that keeps projects on budget",
    intro:
      "Control project costs, materials, subcontractors and site progress — and sell property with a CRM built for real estate. One system from tender to handover.",
    image: "/images/construction-projects.svg",
    imageAlt: "Construction site with crane and building frame, with a site manager holding a tablet",
    segments: ["General contractors", "Real estate developers", "MEP & fit-out contractors", "Property management companies", "Real estate agencies", "Infrastructure contractors"],
    challenges: [
      { title: "Cost overruns", body: "Budget vs actual is only known when the project is over." },
      { title: "Material wastage", body: "Site stores and purchases aren't tied to project BOQs." },
      { title: "Subcontractor billing", body: "Progress claims, retentions and variations are tracked in spreadsheets." },
      { title: "Lost property leads", body: "Enquiries from portals and ads aren't followed up consistently." },
      { title: "Installment tracking", body: "Payment plans and overdue installments are managed manually." },
    ],
    solutions: [
      { title: "Construction ERP", body: "Project budgets, BOQs, procurement, site stores, subcontractors and job costing." },
      { title: "Site progress app", body: "Daily reports, photos, labour attendance and material requests from site." },
      { title: "Real estate CRM", body: "Leads, site visits, bookings, unit inventory and agent performance." },
      { title: "Installments & property management", body: "Payment plans, reminders, receipts, rent and maintenance requests." },
    ],
    modules: ["Project budgets & BOQ", "Procurement", "Site inventory", "Subcontractor billing", "Equipment management", "Daily site reports", "Real estate CRM", "Unit inventory", "Installment plans", "Project dashboards"],
    workflow: ["Estimate & budget", "Procure & deliver to site", "Build & report progress", "Bill & certify", "Sell, hand over & collect"],
    services: ["erp-software", "crm-software", "mobile-app-development", "seo-services", "digital-marketing"],
    faqs: [
      {
        question: "Can we track cost per project and per BOQ item?",
        answer: "Yes. Every purchase, issue, labour entry and subcontractor bill is tagged to a project and cost code for live budget vs actual.",
      },
      {
        question: "Do you help real estate developers generate leads?",
        answer: "Yes. We combine a real estate CRM with SEO, Google Ads and social campaigns so every lead is captured and followed up.",
      },
    ],
  },
  {
    slug: "education-training",
    name: "Education & Training",
    short: "Education & Training",
    icon: "GraduationCap",
    metaTitle: "LMS & Software for Education and Training Providers",
    metaDescription:
      "Software for schools, academies and training providers: LMS, student management, admissions CRM, fee collection, online classes and education marketing.",
    keywords: ["education software", "school management system", "LMS for training institutes", "student information system", "admissions CRM"],
    h1: "Software for schools, academies and training providers",
    intro:
      "Enrol more students, deliver learning online and run administration without paperwork. We build LMS, student management and admissions systems — and market your programmes to the right audience.",
    image: "/images/education-training.svg",
    imageAlt: "Learners in a training room using laptops with a course progress card",
    segments: ["Schools & colleges", "Training institutes & academies", "Corporate training departments", "Online course creators", "Language & test-prep centres", "Professional certification bodies"],
    challenges: [
      { title: "Admissions leakage", body: "Enquiries from ads and walk-ins aren't followed up." },
      { title: "Fee collection", body: "Fee reminders, receipts and defaulters are tracked manually." },
      { title: "Online delivery", body: "Courses run on a mix of video links and chat groups." },
      { title: "Results & certificates", body: "Exams, grades and certificates take too much admin effort." },
    ],
    solutions: [
      { title: "Learning management system", body: "Courses, live classes, quizzes, assignments and certificates." },
      { title: "Student information system", body: "Admissions, attendance, timetables, exams and report cards." },
      { title: "Admissions CRM", body: "Capture and nurture enquiries through to enrolment." },
      { title: "Fees & payments", body: "Fee plans, online payments, reminders and receipts." },
    ],
    modules: ["LMS", "Admissions CRM", "Student records", "Attendance", "Timetables", "Exams & grading", "Certificates", "Fee management", "Parent/student app", "Education marketing"],
    workflow: ["Attract & enquire", "Enrol & pay", "Learn & attend", "Assess & certify", "Re-enrol & refer"],
    services: ["lms-development", "crm-software", "mobile-app-development", "digital-marketing", "seo-services"],
    faqs: [
      {
        question: "Can students learn on mobile?",
        answer: "Yes. The LMS is fully responsive, and we can also build branded Android and iOS apps.",
      },
      {
        question: "Can parents see attendance and fees?",
        answer: "Yes. A parent portal or app can show attendance, results, announcements and fee balances.",
      },
    ],
  },
  {
    slug: "field-professional-services",
    name: "Field & Professional Services",
    short: "Field & Professional Services",
    icon: "Wrench",
    metaTitle: "Field Service Management & Professional Services Software",
    metaDescription:
      "Field service and professional services software: job scheduling, technician apps, maintenance contracts, timesheets, project billing and client portals.",
    keywords: ["field service management software", "job scheduling software", "service business software", "maintenance contract software", "professional services automation"],
    h1: "Software for service companies that work on site and on the clock",
    intro:
      "Schedule jobs, dispatch technicians, track time and bill accurately. Our field and professional services software helps maintenance, installation, consulting and agency teams deliver more work with less admin.",
    image: "/images/field-services.svg",
    imageAlt: "Field technician beside a service van using a tablet with a job schedule and map pin",
    segments: ["HVAC & facility maintenance", "Security & fire systems", "IT services & support", "Installation contractors", "Consulting & engineering firms", "Marketing & creative agencies"],
    challenges: [
      { title: "Scheduling chaos", body: "Jobs are assigned by phone and technicians double-book." },
      { title: "Paper job sheets", body: "Work details and signatures arrive late or not at all." },
      { title: "Unbilled work", body: "Hours and materials used on site never make it onto the invoice." },
      { title: "Contract renewals missed", body: "Preventive maintenance visits and AMC renewals slip through." },
    ],
    solutions: [
      { title: "Scheduling & dispatch", body: "Drag-and-drop job board with technician availability and skills." },
      { title: "Technician mobile app", body: "Job details, checklists, photos, parts used and customer signature." },
      { title: "Contracts & maintenance", body: "Annual maintenance contracts with automatic visit scheduling." },
      { title: "Time, projects & billing", body: "Timesheets, project budgets and invoices from approved work." },
    ],
    modules: ["Job scheduling", "Dispatch board", "Technician app", "Checklists & forms", "Parts & van stock", "Maintenance contracts", "Timesheets", "Project billing", "Client portal", "Service dashboards"],
    workflow: ["Request received", "Schedule & dispatch", "Complete on site", "Approve & invoice", "Follow up & renew"],
    services: ["custom-software-development", "mobile-app-development", "crm-software", "web-application-development", "erp-software"],
    faqs: [
      {
        question: "Can customers book and track jobs online?",
        answer: "Yes. A client portal lets customers raise requests, see technician arrival and download reports and invoices.",
      },
      {
        question: "Does the technician app work offline?",
        answer: "Yes. Job data, checklists and photos are stored on the device and synced when connectivity returns.",
      },
    ],
  },
];

export const industryBySlug: Record<string, (typeof industries)[number]> = Object.fromEntries(
  industries.map((i) => [i.slug, i]),
);
