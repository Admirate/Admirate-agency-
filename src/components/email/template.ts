import { asset } from "@/lib/cdn";
import { SITE } from "@/lib/seo";

/**
 * The ADMIRATE campaign email, built from the AdmirateEmailer artwork.
 *
 * Returns an HTML string rather than JSX. Email that survives Outlook needs
 * VML and MSO conditional comments — a `<v:roundrect>` for every button, a
 * `<v:rect>` behind every background image — and those live inside
 * `<!--[if mso]>` comments, which JSX cannot emit. The send routes therefore
 * pass this to Resend's `html:` option instead of `react:`.
 *
 * WHAT VARIES: `body` fills the centred copy block. `subject` becomes the
 * subject line and the inbox preview text. Everything else — the mark, the
 * gold ribbons, the skyline, the three calls to action — is the artwork, and
 * the headline/tagline props exist so a later campaign can change the words
 * without a new template.
 *
 * FONTS: the artwork is set in Articulat CF, an Adobe Font. It cannot be
 * licensed into an email and was not packaged with the file, so every client
 * substitutes. The stack below is the closest widely-available geometric
 * grotesque; Helvetica Neue carries the same open letterforms on Apple Mail
 * and iOS, Arial everywhere else.
 */

/** Artwork red. The site token is #E3001B; the emailer art is this brighter red. */
const RED = "#ED1C24";
const INK = "#1a1a1a";
const FONT = "'Helvetica Neue',Helvetica,Arial,sans-serif";

/**
 * The five artwork exports, in the "emailer" folder of the website assets
 * bucket. Until these are uploaded the email renders with alt text in their
 * place — the copy and the buttons are live text and do not depend on them.
 */
const IMG = {
  mark: asset("emailer/admirate-mark.png"),
  masthead: asset("emailer/masthead-pattern.png"),
  wave: asset("emailer/gold-wave-top.png"),
  skyline: asset("emailer/dubai-skyline.jpg"),
  ribbon: asset("emailer/gold-ribbon-lower.png"),
  grid: asset("emailer/grid-pattern.png"),
};

const esc = (value: string) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Dashboard copy arrives as plain text; blank lines become paragraph breaks. */
const richText = (value: string) =>
  esc(value)
    .split(/\n{2,}/)
    .map((para) => para.replace(/\n/g, "<br />"))
    .join('</p><p style="margin:18px 0 0 0;">');

export type EmailTemplateProps = {
  subject: string;
  body: string;
  /** Small line above the headline. Defaults to the artwork. */
  eyebrow?: string;
  /** The red headline. Defaults to the artwork. */
  headline?: string;
  /** The two-line promise under the gold wave. Defaults to the artwork. */
  promise?: string;
  promiseAccent?: string;
  /** The red line under the copy block. Defaults to the artwork. */
  signoff?: string;
  /** Where the primary button goes. */
  ctaHref?: string;
  ctaLabel?: string;
};

export function EmailTemplate({
  subject,
  body,
  eyebrow = "We are now accepting",
  headline = "NEW CLIENTS",
  promise = "Visibility alone doesn’t grow a business.",
  promiseAccent = "The journey does.",
  signoff = "That’s what we build.",
  ctaHref = `${SITE.url}/pricing`,
  ctaLabel = "Explore Plans & Pricing",
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
    .h1{font-size:28px !important;line-height:32px !important}
    .h2{font-size:19px !important;line-height:26px !important}
    .copy{font-size:15px !important;line-height:24px !important}
    .cta-text{font-size:19px !important;padding-left:36px !important;padding-right:36px !important}
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:#ffffff;">

<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;font-family:sans-serif;">
  ${esc(subject)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
</div>

<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#ffffff;">
<tr><td align="center" style="padding:0;">
<!--[if mso]><table role="presentation" align="center" cellpadding="0" cellspacing="0" border="0" width="600"><tr><td><![endif]-->
<table role="presentation" class="wrap" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:600px;background-color:#ffffff;">

  <!-- 1 — MASTHEAD. The gold line-art is a cell background so the mark and
       headline stay live text on top of it; Outlook ignores CSS backgrounds
       on a td, which is what the VML rect repeats it for. -->
  <tr>
    <td align="center" background="${IMG.masthead}" bgcolor="#ffffff" style="background-color:#ffffff;background-image:url('${IMG.masthead}');background-repeat:no-repeat;background-position:top center;background-size:600px auto;padding:0;">
      <!--[if gte mso 9]>
      <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px;height:390px;">
        <v:fill type="frame" src="${IMG.masthead}" color="#ffffff" />
        <v:textbox inset="0,0,0,0"><div>
      <![endif]-->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr><td align="center" class="px" style="padding:62px 40px 0 40px;">
          <img src="${IMG.mark}" width="126" height="126" alt="${esc(SITE.name)}" style="display:block;width:126px;height:126px;border:0;outline:none;margin:0 auto;" />
        </td></tr>
        <tr><td align="center" class="px" style="padding:104px 40px 0 40px;font-family:${FONT};font-size:20px;line-height:28px;color:${INK};font-weight:400;">
          ${esc(eyebrow)}
        </td></tr>
        <tr><td align="center" class="px h1" style="padding:6px 40px 46px 40px;font-family:${FONT};font-size:33px;line-height:38px;color:${RED};font-weight:700;letter-spacing:0.4px;">
          ${esc(headline)}
        </td></tr>
      </table>
      <!--[if gte mso 9]></div></v:textbox></v:rect><![endif]-->
    </td>
  </tr>

  <!-- Gold wave. Its own row rather than an overlay: overlapping image and
       text is unreliable in Outlook, and the artwork does not require it. -->
  <tr><td style="padding:0;font-size:0;line-height:0;">
    <img src="${IMG.wave}" width="600" height="118" alt="" class="fluid" style="display:block;width:100%;max-width:600px;height:auto;border:0;outline:none;" />
  </td></tr>

  <!-- 2 — THE PROMISE -->
  <tr><td align="center" class="px" style="padding:52px 46px 12px 46px;font-family:${FONT};font-size:19px;line-height:27px;color:${INK};font-weight:400;">
    ${esc(promise)}
  </td></tr>
  <tr><td align="center" class="px h2" style="padding:0 46px 44px 46px;font-family:${FONT};font-size:23px;line-height:31px;color:${RED};font-weight:700;">
    ${esc(promiseAccent)}
  </td></tr>

  <!-- 3 — SKYLINE. Pre-cropped to the layout's square frame: the source photo
       is 16:9 and no email client can crop, so the hosted file must be the
       crop. -->
  <tr><td style="padding:0;font-size:0;line-height:0;">
    <img src="${IMG.skyline}" width="600" height="598" alt="The Dubai skyline, with the Burj Khalifa at its centre" class="fluid" style="display:block;width:100%;max-width:600px;height:auto;border:0;outline:none;" />
  </td></tr>

  <!-- 4 — THE MESSAGE. Live text, not a flattened image: it is the argument of
       the email and has to survive images-off and reach a screen reader. This
       is the block the dashboard's body fills. -->
  <tr><td align="center" class="px copy" style="padding:44px 62px 0 62px;font-family:${FONT};font-size:16.5px;line-height:26px;color:${INK};font-weight:400;">
    <p style="margin:0;">${richText(body)}</p>
  </td></tr>
  <tr><td align="center" class="px h2" style="padding:38px 46px 0 46px;font-family:${FONT};font-size:25px;line-height:32px;color:${RED};font-weight:700;">
    ${esc(signoff)}
  </td></tr>

  <!-- Lower gold ribbon. Left-anchored in the artwork, so the export is the
       full 600px width with its own transparency — floats do not survive
       Outlook. -->
  <tr><td style="padding:22px 0 0 0;font-size:0;line-height:0;">
    <img src="${IMG.ribbon}" width="600" height="150" alt="" class="fluid" style="display:block;width:100%;max-width:600px;height:auto;border:0;outline:none;" />
  </td></tr>

  <!-- 5 — CALLS TO ACTION, over the tiled grid. -->
  <tr>
    <td align="center" background="${IMG.grid}" bgcolor="#ffffff" style="background-color:#ffffff;background-image:url('${IMG.grid}');background-repeat:repeat;background-position:top center;padding:0;">
      <!--[if gte mso 9]>
      <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px;height:330px;">
        <v:fill type="tile" src="${IMG.grid}" color="#ffffff" />
        <v:textbox inset="0,0,0,0"><div>
      <![endif]-->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">

        <!-- Bulletproof: VML draws the rounded rectangle for Outlook, which
             supports neither border-radius nor padded anchors. Every other
             client gets the padded anchor beneath it. -->
        <tr><td align="center" style="padding:34px 30px 0 30px;">
          <!--[if mso]>
          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${ctaHref}" style="height:58px;v-text-anchor:middle;width:424px;" arcsize="50%" stroke="f" fillcolor="${RED}">
            <w:anchorlock/>
            <center style="color:#ffffff;font-family:${FONT};font-size:26px;font-weight:400;">${esc(ctaLabel)}</center>
          </v:roundrect>
          <![endif]-->
          <!--[if !mso]><!-- -->
          <a href="${ctaHref}" class="cta-text" style="display:inline-block;background-color:${RED};color:#ffffff;font-family:${FONT};font-size:26px;line-height:26px;font-weight:400;text-decoration:none;padding:19px 68px;border-radius:32px;mso-hide:all;">${esc(ctaLabel)}</a>
          <!--<![endif]-->
        </td></tr>

        <tr><td align="center" style="padding:62px 30px 0 30px;">
          <a href="${SITE.url}/services" style="font-family:${FONT};font-size:18px;line-height:24px;color:${INK};font-weight:400;text-decoration:none;">Know More &rsaquo;</a>
        </td></tr>

        <tr><td align="center" style="padding:26px 30px 46px 30px;">
          <!--[if mso]>
          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${SITE.url}/start-project" style="height:46px;v-text-anchor:middle;width:152px;" arcsize="50%" strokecolor="${RED}" strokeweight="1.5pt" fillcolor="#ffffff">
            <w:anchorlock/>
            <center style="color:${INK};font-family:${FONT};font-size:18px;font-weight:400;">Contact</center>
          </v:roundrect>
          <![endif]-->
          <!--[if !mso]><!-- -->
          <a href="${SITE.url}/start-project" style="display:inline-block;background-color:#ffffff;color:${INK};font-family:${FONT};font-size:18px;line-height:18px;font-weight:400;text-decoration:none;padding:13px 38px;border:1.5px solid ${RED};border-radius:24px;mso-hide:all;">Contact</a>
          <!--<![endif]-->
        </td></tr>
      </table>
      <!--[if gte mso 9]></div></v:textbox></v:rect><![endif]-->
    </td>
  </tr>

  <!-- 6 — LEGAL. Not in the artwork. It is here because a commercial bulk send
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
