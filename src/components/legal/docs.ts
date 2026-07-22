import { SITE } from "@/lib/seo";

/**
 * The two legal documents, as content rather than markup.
 *
 * Kept as data for the same reason the posts are: the renderer in content.ts
 * owns every decision about how a heading or a list looks, so the two documents
 * cannot drift apart visually, and adding a clause is a line here rather than a
 * hand-formatted block of HTML.
 *
 * Everything stated below describes what this codebase actually does — the
 * fields in `api/contact/route.ts`, the Supabase table it writes to, and the
 * three third-party scripts in `app/layout.tsx`. A policy that describes a
 * generic website instead of this one is worse than no policy: it is a
 * published claim the site itself contradicts.
 */

export type LegalBlock =
  | { t: "p"; c: string }
  | { t: "list"; c: string[] };

export type LegalSection = { h: string; body: LegalBlock[] };

export type LegalDoc = {
  slug: string;
  /** The <h1>. */
  title: string;
  /** The <title>, without the "| ADMIRATE" suffix — pageMeta adds it. */
  metaTitle: string;
  description: string;
  /** ISO. Rendered as the "last updated" line and read by the schema. */
  updated: string;
  intro: string;
  sections: LegalSection[];
};

/* The operator, stated once. ADMIRATE is a sole proprietorship, so the
   proprietor and the business are the same legal person — which is why the
   documents say "we" throughout and name no separate company. */
const OPERATOR = `${SITE.name}, a sole proprietorship based in ${SITE.area}, ${SITE.city}, ${SITE.region}, ${SITE.country}`;

const UPDATED = "2026-07-22";

export const PRIVACY: LegalDoc = {
  slug: "privacy-policy",
  title: "Privacy Policy",
  metaTitle: "Privacy Policy",
  description:
    "How ADMIRATE collects, uses and protects personal data submitted through admirate.in, and your rights under India's DPDP Act 2023.",
  updated: UPDATED,
  intro: `This policy explains what personal data ${SITE.name} collects through ${SITE.url.replace("https://", "")}, why we collect it, who it is shared with, and the rights you have over it. It is written against India's Digital Personal Data Protection Act, 2023 (the "DPDP Act").`,
  sections: [
    {
      h: "Who we are",
      body: [
        {
          t: "p",
          c: `This website is operated by ${OPERATOR}. For anything in this policy, you can reach us at [${SITE.email}](mailto:${SITE.email}) or on ${SITE.phone}.`,
        },
        {
          t: "p",
          c: "Under the DPDP Act we are the Data Fiduciary for the personal data described below — that is, we decide why and how it is processed.",
        },
      ],
    },
    {
      h: "What we collect when you contact us",
      body: [
        {
          t: "p",
          c: "We collect only what our enquiry and project-brief forms actually ask for. Nothing on this site asks for a payment card, a government identifier, or any of the sensitive categories the DPDP Act treats separately.",
        },
        {
          t: "list",
          c: [
            "**Name** and **email address** — required, so we can identify and reply to an enquiry.",
            "**Phone number** — optional, given only if you would rather we call.",
            "**Company name** — optional, collected by the project brief.",
            "**Your message** — the free-text description of what you need.",
            "**Project details** — the services you selected, and any budget range and timeline you chose from the brief form.",
          ],
        },
        {
          t: "p",
          c: "Everything in that list is supplied by you, deliberately, by filling in a form. We do not buy contact data, and we do not scrape it.",
        },
      ],
    },
    {
      h: "What is collected automatically",
      body: [
        {
          t: "p",
          c: "Like most websites, this one runs analytics. Two third-party tools are loaded on every public page:",
        },
        {
          t: "list",
          c: [
            "**Google Analytics 4** — records pages viewed, approximate location derived from your IP address, device and browser type, referring site, and how you move between pages. It sets cookies to distinguish one visit from another.",
            "**Microsoft Clarity** — records how pages are actually used, as an anonymised session replay: clicks, scrolls and pointer movement, aggregated into heatmaps. Clarity applies its default masking to text you type into form fields.",
          ],
        },
        {
          t: "p",
          c: "We use both to understand which work people look at and where pages fail them — not to identify individuals, and never to build a profile for advertising. Neither tool is used to make any automated decision about you.",
        },
        {
          t: "p",
          c: "You can opt out of Google Analytics across every site using [Google's browser add-on](https://tools.google.com/dlpage/gaoptout), and you can block both tools with any standard tracker-blocking extension. The site works normally either way.",
        },
      ],
    },
    {
      h: "Why we use it",
      body: [
        {
          t: "list",
          c: [
            "To answer your enquiry and, if it goes further, to quote and scope the work.",
            "To send you correspondence you asked for about that enquiry or project.",
            "To keep a record of who asked for what, so a conversation picked up weeks later starts where it left off.",
            "To understand aggregate site usage and improve the pages.",
          ],
        },
        {
          t: "p",
          c: "We do not sell personal data. We do not share it with anyone for their own marketing. We do not add you to a mailing list because you sent an enquiry — a project conversation is not consent to be marketed to.",
        },
      ],
    },
    {
      h: "The basis on which we process it",
      body: [
        {
          t: "p",
          c: "Under the DPDP Act, we process your personal data on the basis of the consent you give when you submit a form, having been shown this notice. That consent is limited to the purposes listed above.",
        },
        {
          t: "p",
          c: `You can withdraw it at any time by writing to [${SITE.email}](mailto:${SITE.email}). Withdrawing is as easy as giving it was: one email, no form. It does not undo processing that already happened lawfully, and it may mean we can no longer carry on a project conversation with you.`,
        },
      ],
    },
    {
      h: "Who else touches your data",
      body: [
        {
          t: "p",
          c: "We use a small number of established processors to run this site. Each receives only what it needs, and none is permitted to use your data for its own purposes:",
        },
        {
          t: "list",
          c: [
            "**Supabase** — the database that stores form submissions.",
            "**Resend** — the service that delivers email we send in reply.",
            "**Netlify** — hosting and content delivery for the site itself.",
            "**Google** and **Microsoft** — the analytics tools described above.",
          ],
        },
        {
          t: "p",
          c: "Some of these providers operate servers outside India, so your data may be stored or processed abroad. We will also disclose personal data where a law, a court, or a government authority validly requires it.",
        },
      ],
    },
    {
      h: "How long we keep it",
      body: [
        {
          t: "p",
          c: "Enquiries and project briefs are kept for as long as we are in conversation with you, and afterwards for as long as we may need them for a live or prospective engagement, or to meet a legal, tax or accounting obligation.",
        },
        {
          t: "p",
          c: `When none of that applies any more, we delete them. You can ask us to delete yours sooner — see below. Analytics data is retained according to Google's and Microsoft's own retention settings and is not tied to your name.`,
        },
      ],
    },
    {
      h: "Your rights",
      body: [
        {
          t: "p",
          c: "The DPDP Act gives you the following rights over your personal data, and we will honour them:",
        },
        {
          t: "list",
          c: [
            "**Access** — a summary of the personal data we hold about you and what we do with it.",
            "**Correction** — to have data that is wrong, misleading or incomplete fixed or completed.",
            "**Erasure** — to have your data deleted, unless we are required to keep it.",
            "**Withdraw consent** — at any time, as described above.",
            "**Grievance redressal** — to raise a complaint with us and get a considered answer.",
            "**Nomination** — to nominate another person to exercise these rights on your behalf in the event of your death or incapacity.",
          ],
        },
        {
          t: "p",
          c: `To exercise any of them, email [${SITE.email}](mailto:${SITE.email}) with enough detail for us to find your record. We will respond within a reasonable period and, in any case, within the time the law requires.`,
        },
      ],
    },
    {
      h: "Grievances",
      body: [
        {
          t: "p",
          c: `If you are unhappy with how we have handled your personal data, write to us at [${SITE.email}](mailto:${SITE.email}) with "Grievance" in the subject line. The proprietor of ${SITE.name} acts as the grievance officer and will answer you directly.`,
        },
        {
          t: "p",
          c: "If our answer does not satisfy you, the DPDP Act allows you to complain to the Data Protection Board of India.",
        },
      ],
    },
    {
      h: "Security",
      body: [
        {
          t: "p",
          c: "The site is served over HTTPS, form submissions are validated before they are stored, and the admin area that reads them sits behind authentication and is excluded from search engines. Access is limited to the people who need it.",
        },
        {
          t: "p",
          c: "We take this seriously, but no method of transmission or storage is perfectly secure, and we will not claim otherwise.",
        },
      ],
    },
    {
      h: "Children",
      body: [
        {
          t: "p",
          c: "This site is aimed at businesses and is not directed at children. We do not knowingly collect personal data from anyone under 18. If you believe a child has sent us personal data, tell us and we will delete it.",
        },
      ],
    },
    {
      h: "Messaging us on WhatsApp",
      body: [
        {
          t: "p",
          c: "Some pages link to a WhatsApp chat with us. If you use it, your message and phone number are handled inside WhatsApp under Meta's own privacy policy, not this one. What you send us there, we treat exactly as we treat an enquiry sent through the site.",
        },
      ],
    },
    {
      h: "Changes to this policy",
      body: [
        {
          t: "p",
          c: "If we change what we collect or why, we will update this page and move the date at the top. Material changes will be obvious rather than quietly folded in. The version published here is always the one in force.",
        },
      ],
    },
  ],
};

export const TERMS: LegalDoc = {
  slug: "terms",
  title: "Terms & Conditions",
  metaTitle: "Terms & Conditions",
  description:
    "The terms governing use of admirate.in, enquiries submitted through it, and the relationship between ADMIRATE and its clients.",
  updated: UPDATED,
  intro: `These terms govern your use of ${SITE.url.replace("https://", "")} and any enquiry you send through it. By using this site, you accept them. If you do not, please do not use the site.`,
  sections: [
    {
      h: "Who you are dealing with",
      body: [
        {
          t: "p",
          c: `This site is operated by ${OPERATOR}. "We", "us" and "our" mean ${SITE.name}; "you" means the person or business using the site.`,
        },
      ],
    },
    {
      h: "The site is information, not an offer",
      body: [
        {
          t: "p",
          c: "Everything published here — service descriptions, portfolio work, articles, indicative approaches — is for information. Nothing on this site is a binding offer, a quotation, or a guarantee that we will take on your project.",
        },
        {
          t: "p",
          c: "Sending an enquiry does not create a contract, and neither does our reply to it. We may decline any enquiry, and we are not obliged to explain why.",
        },
      ],
    },
    {
      h: "How work is actually agreed",
      body: [
        {
          t: "p",
          c: "Engagements are governed by a separate written proposal, quotation, statement of work or agreement signed between us. That document controls scope, deliverables, timelines, fees, revisions, payment terms and ownership.",
        },
        {
          t: "p",
          c: "Where anything in that signed document conflicts with these terms, the signed document wins for that engagement. These terms continue to govern your use of the website itself.",
        },
      ],
    },
    {
      h: "What you tell us",
      body: [
        {
          t: "p",
          c: "You agree that what you submit through this site is accurate, is yours to send, and does not infringe anyone else's rights. Do not send us confidential information through the enquiry form expecting it to be treated as confidential — if something is sensitive, tell us and we will put an NDA in place first.",
        },
        {
          t: "p",
          c: "Personal data you submit is handled as described in our [Privacy Policy](/privacy-policy).",
        },
      ],
    },
    {
      h: "Our intellectual property",
      body: [
        {
          t: "p",
          c: `The design, code, copy, photography, illustrations and layout of this site are owned by ${SITE.name} or used with permission, and are protected by Indian and international copyright law.`,
        },
        {
          t: "p",
          c: "You may view the site and share links to it. You may not copy, reproduce, republish, resell or create derivative works from any part of it without our written permission. Framing the site, or scraping it to train a model or populate another service, is not permitted.",
        },
      ],
    },
    {
      h: "Client work shown here",
      body: [
        {
          t: "p",
          c: "The portfolio work, logos and brand names shown on this site remain the property of the respective clients and rights holders, and appear here to identify work we have done. Their appearance is not a claim of ownership by us, and is not an endorsement of you by them.",
        },
        {
          t: "p",
          c: "Ownership of work we produce for a client transfers as set out in that client's signed agreement — typically on full payment. Unless that agreement says otherwise, we keep the right to show completed work in our portfolio and credentials.",
        },
      ],
    },
    {
      h: "Acceptable use",
      body: [
        { t: "p", c: "You agree not to:" },
        {
          t: "list",
          c: [
            "Use the site for any unlawful purpose, or in a way that breaches these terms.",
            "Attempt to gain unauthorised access to the site, its admin area, its database or any connected system.",
            "Introduce malware, or interfere with the site's normal operation.",
            "Use automated means to harvest content or contact details from the site.",
            "Submit anything through our forms that is unlawful, abusive, defamatory or deliberately misleading.",
          ],
        },
      ],
    },
    {
      h: "Links to other sites",
      body: [
        {
          t: "p",
          c: "This site links to third-party destinations, including our social profiles and WhatsApp. We do not control those services and are not responsible for their content, their availability, or how they handle your data. A link is not an endorsement.",
        },
      ],
    },
    {
      h: "Availability",
      body: [
        {
          t: "p",
          c: "We aim to keep the site available and current, but we do not promise it will be uninterrupted or error-free. We may change, suspend or withdraw any part of it, at any time, without notice.",
        },
      ],
    },
    {
      h: "Disclaimer",
      body: [
        {
          t: "p",
          c: "The site and its content are provided \"as is\". To the fullest extent the law allows, we exclude all warranties, express or implied, including as to accuracy, completeness, fitness for a particular purpose, and non-infringement.",
        },
        {
          t: "p",
          c: "Articles and other editorial content on this site are general commentary drawn from our own practice. They are not professional, legal or financial advice, and should not be relied on as a substitute for advice about your specific situation.",
        },
      ],
    },
    {
      h: "Limitation of liability",
      body: [
        {
          t: "p",
          c: "To the fullest extent permitted by law, we are not liable for any indirect, incidental, special or consequential loss, or for any loss of profit, revenue, business, goodwill or data, arising out of your use of this site.",
        },
        {
          t: "p",
          c: "Nothing in these terms excludes or limits liability that cannot lawfully be excluded or limited — including liability for fraud, or for death or personal injury caused by negligence. Liability arising from a specific engagement is governed by that engagement's signed agreement.",
        },
      ],
    },
    {
      h: "Indemnity",
      body: [
        {
          t: "p",
          c: "You agree to indemnify us against claims, losses and reasonable costs arising from your breach of these terms, or from your misuse of the site.",
        },
      ],
    },
    {
      h: "Governing law and jurisdiction",
      body: [
        {
          t: "p",
          c: `These terms are governed by the laws of ${SITE.country}. The courts at ${SITE.city}, ${SITE.region} have exclusive jurisdiction over any dispute arising from them or from your use of this site.`,
        },
      ],
    },
    {
      h: "Changes to these terms",
      body: [
        {
          t: "p",
          c: "We may update these terms. The version published on this page is the one in force, and the date at the top tells you when it last changed. Continuing to use the site after a change means you accept it.",
        },
      ],
    },
    {
      h: "Contact",
      body: [
        {
          t: "p",
          c: `Questions about these terms go to [${SITE.email}](mailto:${SITE.email}), or ${SITE.phone}. Our address is ${SITE.area}, ${SITE.city}, ${SITE.region}, ${SITE.country}.`,
        },
      ],
    },
  ],
};

export const LEGAL_DOCS = [PRIVACY, TERMS];
