import { emailerAsset } from "@/lib/cdn";
import { SITE } from "@/lib/seo";

/**
 * The ADMIRATE campaign email: the creative as flat artwork, with two calls to
 * action beneath it.
 *
 * Returns an HTML string rather than JSX. Email that survives Outlook needs VML
 * and MSO conditional comments — a `<v:roundrect>` for every button — and those
 * live inside `<!--[if mso]>` comments, which JSX cannot emit. The send routes
 * therefore pass this to Resend's `html:` option instead of `react:`.
 *
 * WHAT VARIES: `subject` becomes the subject line. `body` becomes the preheader
 * — the grey snippet the inbox shows next to the subject — and nothing else;
 * there is no copy block in a flat-image layout for it to fill. Everything the
 * recipient sees in the message body is the artwork plus the two buttons.
 *
 * WHY TWO IMAGES: the creative is 825x2560, which renders 1862px tall at the
 * 600px email width. Outlook on Windows renders through Word, which truncates
 * any image past 1728px — a single <img> would be visibly cut off. The artwork
 * is therefore sliced at y=1815 of the source, inside the 44px band of pure
 * white between the skyline photo and the closing paragraph. Stacked in
 * adjacent zero-leading rows the halves reassemble seamlessly, and because the
 * join lands in white, a hairline gap in any client stays invisible.
 *
 * ALT TEXT IS THE EMAIL. Gmail and Outlook block remote images on first open
 * from an unknown sender. With the message carried entirely by artwork, these
 * alt strings are the whole of what those recipients read, so they carry the
 * full argument rather than naming the file.
 */

/** Artwork red. The site token is #E3001B; the emailer art is this brighter red. */
const RED = "#ED1C24";
const INK = "#1a1a1a";
const FONT = "'Helvetica Neue',Helvetica,Arial,sans-serif";

/** Display width of the email body. The strips are 825px native — 1.4x for retina. */
const W = 600;

/**
 * The two artwork halves, in the "emailer" bucket. Heights are the rendered
 * sizes at 600px wide, stated on the tags because Outlook will not infer them
 * and collapses the row without.
 */
const STRIP = [
  {
    src: emailerAsset("campaign-top.jpg"),
    height: 1320,
    alt: "ADMIRATE is now accepting new clients. There are 10,000+ real estate offices in Dubai and 11 new ones open every day — every one is your competition. Visibility alone doesn't grow a business. The journey does.",
  },
  {
    src: emailerAsset("campaign-bottom.jpg"),
    height: 542,
    alt: "For real estate and service businesses, growth isn't driven by a website alone. It's clear messaging, meaningful design across every touchpoint, a consistent social media presence, and a customer journey that turns attention into enquiries. That's what we build. Plans starting from AED 3,613.",
  },
];

const esc = (value: string) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * Dashboard copy arrives as plain text over many lines. The preheader is a
 * single run of text, and clients cut it around 100-150 characters, so it is
 * flattened and trimmed rather than shown whole.
 */
const preheader = (value: string) => {
  const flat = String(value ?? "").replace(/\s+/g, " ").trim();
  return esc(flat.length > 140 ? `${flat.slice(0, 139).trimEnd()}…` : flat);
};

/**
 * A call to action. VML draws the rounded rectangle for Outlook, which supports
 * neither border-radius nor padded anchors; every other client gets the padded
 * anchor beneath it, hidden from Outlook by `mso-hide`.
 */
const button = ({
  href,
  label,
  filled,
}: {
  href: string;
  label: string;
  filled: boolean;
}) => `
          <!--[if mso]>
          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${href}" style="height:52px;v-text-anchor:middle;width:260px;" arcsize="50%" ${
            filled
              ? `stroke="f" fillcolor="${RED}"`
              : `strokecolor="${RED}" strokeweight="1.5pt" fillcolor="#ffffff"`
          }>
            <w:anchorlock/>
            <center style="color:${filled ? "#ffffff" : INK};font-family:${FONT};font-size:19px;font-weight:700;">${esc(label)}</center>
          </v:roundrect>
          <![endif]-->
          <!--[if !mso]><!-- -->
          <a href="${href}" class="cta" style="display:inline-block;min-width:184px;text-align:center;background-color:${
            filled ? RED : "#ffffff"
          };color:${filled ? "#ffffff" : INK};font-family:${FONT};font-size:19px;line-height:19px;font-weight:700;text-decoration:none;padding:${
            filled ? "17px 38px" : "15.5px 36.5px"
          };border:1.5px solid ${RED};border-radius:30px;mso-hide:all;">${esc(label)}</a>
          <!--<![endif]-->`;

export type EmailTemplateProps = {
  subject: string;
  /** Fills the inbox preview text. Does not appear in the message body. */
  body: string;
  knowMoreHref?: string;
  pricingHref?: string;
};

export function EmailTemplate({
  subject,
  body,
  knowMoreHref = SITE.url,
  pricingHref = `${SITE.url}/pricing`,
}: EmailTemplateProps): string {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="x-apple-disable-message-reformatting" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>${esc(subject)}</title>
<!--[if mso]>
<noscript><xml><o:OfficeDocumentSettings>
  <o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings></xml></noscript>
<![endif]-->
<style type="text/css">
  body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}
  table,td{mso-table-lspace:0pt;mso-table-rspace:0pt}
  img{-ms-interpolation-mode:bicubic;border:0;height:auto;line-height:100%;outline:none;text-decoration:none;display:block}
  table{border-collapse:collapse !important}
  body{margin:0 !important;padding:0 !important;width:100% !important;height:100% !important}
  a{text-decoration:none}
  /* Stops iOS turning addresses and numbers into blue underlines the design
     never had. */
  a[x-apple-data-detectors]{color:inherit !important;text-decoration:none !important;font-size:inherit !important;font-family:inherit !important;font-weight:inherit !important;line-height:inherit !important}
  /* The artwork is red and gold on white. Forced dark mode inverts the canvas
     and the gold then sits on black behind a white halo, so it is pinned. */
  :root{color-scheme:light;supported-color-schemes:light}
  @media screen and (max-width:600px){
    .wrap{width:100% !important;max-width:100% !important}
    .fluid{width:100% !important;height:auto !important}
    .px{padding-left:24px !important;padding-right:24px !important}
    .cta{font-size:18px !important;min-width:0 !important;width:78% !important}
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:#ffffff;">

<!-- Preheader. The dashboard's body text, and the only place it appears: it is
     what the inbox prints beside the subject. The zero-width joiners stop
     Gmail pulling the footer in behind it to pad the line. -->
<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;font-family:sans-serif;">
  ${preheader(body)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
</div>

<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#ffffff;">
<tr><td align="center" style="padding:0;">
<!--[if mso]><table role="presentation" align="center" cellpadding="0" cellspacing="0" border="0" width="${W}"><tr><td><![endif]-->
<table role="presentation" class="wrap" cellpadding="0" cellspacing="0" border="0" width="${W}" style="width:${W}px;max-width:${W}px;background-color:#ffffff;">

  <!-- 1 — THE ARTWORK, in two halves. Zero font-size and line-height on the
       cells: a td inherits the body's leading and would otherwise print a few
       pixels of white under each image, which would show as a gap at the join
       and a hairline above the buttons. -->
${STRIP.map(
  (s) => `  <tr><td style="padding:0;font-size:0;line-height:0;">
    <a href="${knowMoreHref}" style="display:block;text-decoration:none;">
      <img src="${s.src}" width="${W}" height="${s.height}" alt="${esc(s.alt)}" class="fluid" style="display:block;width:100%;max-width:${W}px;height:auto;border:0;outline:none;font-family:${FONT};font-size:16px;line-height:24px;color:${INK};text-align:center;" />
    </a>
  </td></tr>`
).join("\n")}

  <!-- 2 — CALLS TO ACTION. Stacked rather than side by side: two cells in a row
       need a media query to stack on a phone, and Gmail's app strips <style>
       from some messages, which would leave them squeezed at 50% width. -->
  <tr><td align="center" style="padding:38px 30px 0 30px;">${button({
    href: knowMoreHref,
    label: "Know More",
    filled: true,
  })}
  </td></tr>

  <tr><td align="center" style="padding:14px 30px 42px 30px;">${button({
    href: pricingHref,
    label: "Pricing",
    filled: false,
  })}
  </td></tr>

  <!-- 3 — LEGAL. Not in the artwork. It is here because a commercial bulk send
       without a postal address and an unsubscribe path breaches CAN-SPAM and
       most ESP terms, and both Gmail and Outlook weigh its absence when
       deciding the spam folder. Styled to stay quiet. -->
  <tr><td align="center" class="px" style="padding:0 40px 40px 40px;font-family:${FONT};font-size:11px;line-height:18px;color:#9a9a9e;">
    ${esc(SITE.name)} &mdash; ${esc(SITE.tagline)}<br />
    ${esc(SITE.area)}, ${esc(SITE.city)}, ${esc(SITE.region)}, ${esc(SITE.country)}<br />
    <a href="${SITE.url}" style="color:#9a9a9e;text-decoration:underline;">admirate.in</a>
    &nbsp;&middot;&nbsp;
    <a href="mailto:${esc(SITE.email)}?subject=Unsubscribe" style="color:#9a9a9e;text-decoration:underline;">Unsubscribe</a>
  </td></tr>

</table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr>
</table>
</body>
</html>`;
}

export default EmailTemplate;
