import { site } from "./site";

type LegalPage = { title: string; description: string; updated: string; sections: { title: string; body: string }[] };

export const legalPages: Record<"privacy" | "terms" | "cookies", LegalPage> = {
  privacy: {
    title: "Privacy Policy",
    description: `How ${site.name} collects, uses and protects personal information submitted through this website.`,
    updated: "11 November 2026",
    sections: [
      {
        title: "Who we are",
        body: `This website is operated by ${site.legalName} ("${site.name}", "we", "us"). For any privacy question, contact us at ${site.email}.`,
      },
      {
        title: "Information we collect",
        body: "When you submit a contact or consultation form we collect the details you provide: name, work email, company, country, phone number (optional), the service you are interested in and your message. We also record the page you submitted from and the time of submission. If you allow analytics, we collect anonymous usage data such as pages visited and device type.",
      },
      {
        title: "How we use it",
        body: "We use your information only to respond to your enquiry, prepare proposals, provide the services you request and improve our website. We do not sell your personal information and we do not send marketing messages unless you ask to receive them.",
      },
      {
        title: "Legal basis",
        body: "We process enquiry data because you asked us to contact you (steps prior to a contract) and on the basis of our legitimate interest in responding to business enquiries. Analytics data is processed only with your consent.",
      },
      {
        title: "Sharing",
        body: "Your information is shared only with service providers that help us operate the website, email and CRM, under confidentiality obligations, or where the law requires it.",
      },
      {
        title: "Retention",
        body: "Enquiries that do not become projects are deleted within 24 months. Client records are kept for the duration of the relationship and as required by law.",
      },
      {
        title: "Your rights",
        body: `You may ask to access, correct, export or delete your personal data, or object to its processing, by emailing ${site.email}. We respond within 30 days.`,
      },
      {
        title: "Security",
        body: "We use encrypted connections (HTTPS), access controls and reputable hosting providers to protect your data. No method of transmission is completely secure, but we take reasonable measures to protect your information.",
      },
      {
        title: "Changes",
        body: "We may update this policy from time to time. The date at the top shows when it was last changed.",
      },
    ],
  },
  terms: {
    title: "Terms of Use",
    description: `The terms that apply when you use the ${site.name} website.`,
    updated: "11 November 2026",
    sections: [
      {
        title: "Using this website",
        body: `By using this website you agree to these terms. The website is provided by ${site.legalName} for information about our services.`,
      },
      {
        title: "Information only",
        body: "Content on this website is general information and does not form an offer or contract. The scope, price and terms of any project are defined in a written proposal or agreement signed by both parties.",
      },
      {
        title: "Intellectual property",
        body: `The ${site.name} name, logo, text, illustrations and design of this website belong to ${site.legalName}. You may not copy or reuse them without written permission.`,
      },
      {
        title: "Third-party services",
        body: "We may mention or integrate with third-party platforms (for example payment gateways, app stores or messaging platforms). Their availability, approval processes and fees are controlled by those providers.",
      },
      {
        title: "Limitation of liability",
        body: "We work to keep this website accurate and available but do not guarantee that it is error-free or uninterrupted. To the extent permitted by law, we are not liable for losses arising from use of this website.",
      },
      {
        title: "Contact",
        body: `Questions about these terms can be sent to ${site.email}.`,
      },
    ],
  },
  cookies: {
    title: "Cookie Policy",
    description: "How this website uses cookies and similar browser storage.",
    updated: "11 November 2026",
    sections: [
      {
        title: "Essential storage",
        body: "We store your cookie choice in your browser so we don't ask again. This is necessary for the site to respect your preference.",
      },
      {
        title: "Analytics (optional)",
        body: "If you click \"Allow analytics\", we may use privacy-friendly analytics to understand which pages are useful. Analytics is never loaded before you give consent.",
      },
      {
        title: "Changing your choice",
        body: "You can change your choice at any time using the \"Cookie settings\" link in the website footer, or by clearing your browser storage.",
      },
    ],
  },
};
