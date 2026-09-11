export type NavItem = { label: string; href: string; description?: string };
export type NavGroup = { label: string; items: NavItem[]; featured?: NavItem };
export type Faq = { question: string; answer: string };
export type ContentSection = { id?: string; eyebrow?: string; title: string; body: string; items?: { title: string; body: string; status?: "verified" | "confirmation-required" }[] };
export type PageContent = { slug: string; label: string; eyebrow: string; title: string; description: string; metaTitle: string; metaDescription: string; primaryCta: { label: string; href: string }; secondaryCta?: { label: string; href: string }; sections: ContentSection[]; workflow?: string[]; faqs?: Faq[]; related?: { label: string; href: string }[] };
