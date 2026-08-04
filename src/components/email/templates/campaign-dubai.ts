import { emailerAsset, optimized } from "@/lib/cdn";
import { SITE } from "@/lib/seo";
import type { EmailTemplateModule } from "./types";
import { esc, shell, FONT, INK, W } from "./shell";

/**
 * The ADMIRATE campaign email: the creative as four linked slices of flat
 * artwork, with the shared legal footer beneath it.
 *
 * WHAT VARIES: `subject` becomes the subject line. `body` becomes the preheader
 * — the grey snippet the inbox shows next to the subject — and nothing else;
 * there is no copy block in a flat-image layout for it to fill.
 *
 * WHY FLAT ARTWORK RATHER THAN LIVE TEXT. An earlier revision set every word as
 * real HTML text over the artwork. It was sharper, it survived blocked images,
 * and in the Gmail Android app's dark mode it fell apart: that client forces a
 * colour inversion which rewrites text but cannot touch a background image, so
 * the black copy over the skyline turned white on a white photograph and
 * disappeared, and the plain white cells between the artwork bands turned
 * near-black and cut the creative into stripes. It is not fixable from here —
 * the Gmail app ignores `color-scheme`, `prefers-color-scheme` and
 * `!important`. Images are the one thing its dark mode leaves alone, so for a
 * design whose copy sits on top of photography they are what holds the
 * composition in both schemes.
 *
 * The softness that argued against images is answered with resolution instead:
 * `emailer/build-slices.js` cuts these at 1200px and they are displayed at 600,
 * where the previous artwork was 825px native at 600. Sharper, and at 352KB for
 * the set, no heavier.
 *
 * WHY FOUR SLICES. Each is wrapped in a single anchor, so the creative is cut
 * where its calls to action change destination — the story leads to the site,
 * the pricing block to /pricing, and the two closing controls to their own
 * targets. The boundaries sit on rows that are pure white across the full
 * width, so a hairline gap in any client falls on white and cannot be seen.
 * No slice exceeds 1728px displayed: Outlook on Windows renders through Word,
 * which truncates any image taller than that.
 *
 * ALT TEXT IS THE EMAIL. Gmail and Outlook block remote images on first open
 * from an unknown sender. With the message carried entirely by artwork, these
 * alt strings are the whole of what those recipients read, so they carry the
 * full argument rather than naming the file.
 */

type Slice = {
  file: string;
  /** Display height. Stated on the tag because Outlook will not infer it. */
  height: number;
  /** Which of the template's destinations the whole slice links to. */
  to: "knowMore" | "pricing" | "contact";
  alt: string;
};

const SLICES: Slice[] = [
  {
    file: "creative-1-story.jpg",
    height: 1484,
    to: "knowMore",
    alt: "ADMIRATE is now accepting new clients. There are 10,000+ real estate offices in Dubai and 11 new ones open every day — every one is your competition. Visibility alone doesn't grow a business. The journey does. For real estate and service businesses, growth isn't driven by a website alone. It's clear messaging, meaningful design across every touchpoint, a consistent social media presence, and a customer journey that turns attention into enquiries.",
  },
  {
    file: "creative-2-pricing.jpg",
    height: 491,
    to: "pricing",
    alt: "That's what we build. Plans starting from AED 3,613 — explore plans and pricing.",
  },
  {
    file: "creative-3-knowmore.png",
    height: 36,
    to: "knowMore",
    alt: "Know more",
  },
  {
    file: "creative-4-contact.png",
    height: 116,
    to: "contact",
    alt: "Contact ADMIRATE",
  },
];

export type CampaignHrefs = {
  knowMoreHref?: string;
  pricingHref?: string;
  contactHref?: string;
};

export type EmailTemplateProps = { subject: string; body: string } & CampaignHrefs;

export function renderCampaignDubai({
  subject,
  body,
  knowMoreHref = SITE.url,
  pricingHref = `${SITE.url}/pricing`,
  contactHref = `${SITE.url}/start-project`,
}: EmailTemplateProps): string {
  const href = { knowMore: knowMoreHref, pricing: pricingHref, contact: contactHref };

  /* Zero font-size and line-height on the cells: a td inherits the body's
     leading and would otherwise print a few pixels of white under each image,
     which shows as a gap at every join. */
  const rows = SLICES.map((s) => {
    const src = emailerAsset(s.file);
    return `  <tr><td style="padding:0;font-size:0;line-height:0;">
    <a href="${href[s.to]}" style="display:block;text-decoration:none;">
      <img src="${src}" width="${W}" height="${s.height}" alt="${esc(s.alt)}" class="fluid" style="display:block;width:100%;max-width:${W}px;height:auto;border:0;outline:none;font-family:${FONT};font-size:16px;line-height:24px;color:${INK};text-align:center;" />
    </a>
  </td></tr>`;
  }).join("\n");

  return shell({
    subject,
    body,
    content: `  <!-- 1 — THE CREATIVE, in four linked slices. -->\n${rows}`,
  });
}

const campaignDubai: EmailTemplateModule = {
  id: "campaign-dubai",
  name: "Dubai Campaign — Real Estate",
  description:
    "The four-slice creative: the market story, pricing from AED 3,613, and the two closing calls to action.",
  /* No thumbnail file is shipped. The card shows this template's own first
     slice, already hosted in the emailer bucket, through Next's image
     optimizer — the Supabase host is in next.config.ts remotePatterns and 384
     is one of Next's default imageSizes, so this needs no configuration and
     adds no bytes to the repo. */
  thumbnail: optimized(emailerAsset("creative-1-story.jpg"), 384),
  render: renderCampaignDubai,
};

export default campaignDubai;
