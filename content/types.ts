export type NavItem = { label: string; href: string; description?: string };
export type NavGroup = { label: string; href?: string; columns: { title: string; items: NavItem[] }[] };
export type Faq = { question: string; answer: string };
export type Feature = { title: string; body: string };
export type Step = { title: string; body: string };

export type ServiceCategory = "business-software" | "engineering" | "growth";

export type Service = {
  slug: string;
  name: string;
  /** Short label for menus and cards */
  short: string;
  category: ServiceCategory;
  icon: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  eyebrow: string;
  h1: string;
  intro: string;
  image: string;
  imageAlt: string;
  /** "Sound familiar?" customer problems */
  pains: string[];
  /** Business outcomes, customer-facing */
  outcomes: Feature[];
  featuresTitle: string;
  features: Feature[];
  /** A deeper explanation block next to an image */
  spotlight: { title: string; body: string; points: string[]; image: string; imageAlt: string };
  deliverables: string[];
  industries: string[];
  related: string[];
  faqs: Faq[];
};

export type Industry = {
  slug: string;
  name: string;
  short: string;
  icon: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  h1: string;
  intro: string;
  image: string;
  imageAlt: string;
  /** Types of businesses inside this industry */
  segments: string[];
  challenges: Feature[];
  solutions: Feature[];
  modules: string[];
  workflow: string[];
  services: string[];
  faqs: Faq[];
};

export type Insight = {
  slug: string;
  title: string;
  metaDescription: string;
  category: string;
  published: string;
  readingMinutes: number;
  summary: string;
  services: string[];
  sections: { title: string; body: string[]; list?: string[] }[];
};
