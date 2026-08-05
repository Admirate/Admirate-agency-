import { SITE, WHATSAPP } from "@/lib/seo";

/**
 * The automatic reply a visitor gets the moment their brief lands.
 *
 * Deliberately NOT built on `templates/shell.ts`. That shell carries the
 * CAN-SPAM footer every bulk campaign needs — a postal address and an
 * unsubscribe link. This message is transactional: it is a receipt for
 * something the person just did, one per submission, and an unsubscribe link on
 * it is both meaningless (there is nothing to unsubscribe from) and actively
 * harmful — it invites the recipient to mark a reply they asked for as bulk
 * mail, which is exactly the signal that pushes the domain toward spam folders.
 * The postal address stays, because it is the only part that earns its place.
 *
 * Everything is table markup with inline styles for the usual reason: Outlook
 * renders with Word's engine, which ignores <div> layout, flexbox, and most of
 * a <style> block.
 */

/**
 * NOT `asset("admirate logo.webp")`, which is what every page on the site uses.
 *
 * That file is a 213x46 WebP with an alpha channel, and both halves of that are
 * wrong in an inbox. WebP renders as nothing in Outlook desktop, Apple Mail
 * before 13 and Yahoo; and Gmail serves every remote image through its own
 * proxy, which flattens transparency onto black rather than white — which is
 * why the mark arrived sitting in a black box.
 *
 * `public/email/admirate-logo.png` is the same artwork at 2x, exported opaque
 * on white. Regenerate it from the source WebP with sharp: resize to 426 wide,
 * `.flatten({ background: "#ffffff" })`, `.png()`.
 */
const LOGO = `${SITE.url}/email/admirate-logo.png`;
const LOGO_W = 213;
const LOGO_H = 46;

const RED = "#E3001B";
const INK = "#0B0B0C";
const GREY = "#8A8A8E";
const LINE = "#E9E9E6";
const PAPER = "#FAFAF8";
const FONT = "'Helvetica Neue',Helvetica,Arial,sans-serif";
const MONO = "'IBM Plex Mono',Consolas,Menlo,monospace";
const W = 600;

const esc = (value: string) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * "Priya Sharma" -> "Priya". The greeting is warmer on a first name, and a
 * single-word name comes back unchanged rather than empty.
 */
const firstNameOf = (name: string) => name.trim().split(/\s+/)[0] || "there";

/**
 * The brief arrives as the multi-line string `composeMessage` builds:
 * `Label: value` lines, then a `———` rule, then free-text notes.
 *
 * Rows are rebuilt here rather than the whole block being printed in a <pre>,
 * because a monospace block that wide wraps badly on a phone and reads like a
 * log file. Lines that are not `Label: value` — the rule, and every line of the
 * notes — fall through as plain paragraphs.
 */
function summaryRows(message: string): string {
  return message
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && line !== "———")
    .map((line) => {
      const pair = /^([A-Za-z ]{2,24}):\s*(.+)$/.exec(line);

      if (!pair) {
        return `<tr><td colspan="2" style="padding:10px 0 0 0;font-family:${FONT};font-size:14px;line-height:22px;color:#4a4a4d;">${esc(
          line,
        )}</td></tr>`;
      }

      return `<tr>
        <td valign="top" style="padding:9px 16px 9px 0;font-family:${MONO};font-size:10px;letter-spacing:1.6px;line-height:18px;color:${GREY};text-transform:uppercase;white-space:nowrap;">${esc(
          pair[1],
        )}</td>
        <td valign="top" style="padding:9px 0;font-family:${FONT};font-size:14px;line-height:22px;color:${INK};">${esc(
          pair[2],
        )}</td>
      </tr>`;
    })
    .join("");
}

export type EnquiryAckProps = {
  /** The submitter's name, as they typed it. */
  name: string;
  /** Their brand or company. Empty on the plain contact form. */
  company?: string;
  /** The composed brief — see `composeMessage` in lib/brief.ts. */
  message: string;
};

/** The subject line. Exported so the send site and any test agree on it. */
export const enquiryAckSubject = (company?: string) =>
  company?.trim()
    ? `We've got your brief — ${company.trim()}`
    : "We've got your enquiry";

/**
 * The plain-text half of the message.
 *
 * Not decoration. Mail sent as HTML alone is a shape almost nothing but bulk
 * senders produces, and both Gmail's tab classifier and the spam filters weigh
 * it; a real `multipart/alternative` is one of the cheapest signals available
 * that this is a person-to-person reply. It is also what actually gets read on
 * a watch, by a screen reader in text mode, and by anyone whose client blocks
 * remote images by default.
 *
 * Kept deliberately close in wording to the HTML. A text part that says
 * something different from the HTML part is itself a spam heuristic.
 */
export function renderEnquiryAckText({
  name,
  company,
  message,
}: EnquiryAckProps): string {
  const brand = company?.trim();

  return [
    `Hi ${firstNameOf(name)},`,
    "",
    `Your ${brand ? `brief for ${brand}` : "enquiry"} has reached us, and it's already in front of the team. We read every one properly rather than firing back a quote, so give us a little time — someone will come back to you within one working day with the next steps.`,
    "",
    "What happens next:",
    "  01  We read your brief in full",
    "  02  We call you within one working day",
    "  03  Plan + quote in your inbox",
    "",
    "What you sent us:",
    ...message
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && line !== "———")
      .map((line) => `  ${line}`),
    "",
    "Anything to add or change, just reply to this email — it comes straight to us.",
    `WhatsApp: ${WHATSAPP}`,
    "",
    "—",
    `${SITE.name} — ${SITE.tagline}`,
    `${SITE.area}, ${SITE.city}, ${SITE.region}, ${SITE.country}`,
    SITE.url,
    "",
    "You're getting this because you submitted a project brief on admirate.in.",
    "It's a one-off reply — you haven't been added to any mailing list.",
  ].join("\n");
}

export function renderEnquiryAck({
  name,
  company,
  message,
}: EnquiryAckProps): string {
  const brand = company?.trim();
  const subject = enquiryAckSubject(brand);

  const step = (n: string, text: string) => `
    <tr>
      <td valign="top" style="padding:0 14px 12px 0;font-family:${MONO};font-size:11px;line-height:20px;color:${RED};">${n}</td>
      <td valign="top" style="padding:0 0 12px 0;font-family:${MONO};font-size:11px;letter-spacing:1.4px;line-height:20px;color:#5a5a5e;">${text}</td>
    </tr>`;

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
  a[x-apple-data-detectors]{color:inherit !important;text-decoration:none !important;font-size:inherit !important;font-family:inherit !important;font-weight:inherit !important;line-height:inherit !important}
  :root{color-scheme:light;supported-color-schemes:light}
  @media screen and (max-width:600px){
    .wrap{width:100% !important;max-width:100% !important}
    .px{padding-left:24px !important;padding-right:24px !important}
    .h1{font-size:30px !important;line-height:34px !important}
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:${PAPER};">

<!-- Preheader: what the inbox prints beside the subject, and nowhere else.
     The zero-width joiners stop Gmail dragging the footer up to pad the line. -->
<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;font-family:sans-serif;">
  Thank you for reaching out. We'll come back to you within one working day.&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
</div>

<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:${PAPER};">
<tr><td align="center" style="padding:0;">
<!--[if mso]><table role="presentation" align="center" cellpadding="0" cellspacing="0" border="0" width="${W}"><tr><td><![endif]-->
<table role="presentation" class="wrap" cellpadding="0" cellspacing="0" border="0" width="${W}" style="width:${W}px;max-width:${W}px;background-color:#ffffff;">

  <!-- red hairline, the site's one recurring device -->
  <tr><td style="padding:0;line-height:0;font-size:0;background-color:${RED};height:4px;">&nbsp;</td></tr>

  <tr><td class="px" style="padding:36px 40px 0 40px;">
    <a href="${SITE.url}"><img src="${LOGO}" width="${LOGO_W}" height="${LOGO_H}" alt="${esc(
      SITE.name,
    )}" style="display:block;width:${LOGO_W}px;height:${LOGO_H}px;border:0;outline:none;" /></a>
  </td></tr>

  <tr><td class="px" style="padding:30px 40px 0 40px;font-family:${MONO};font-size:10px;letter-spacing:2.4px;color:${RED};">
    // ENQUIRY RECEIVED
  </td></tr>

  <tr><td class="px h1" style="padding:14px 40px 0 40px;font-family:${FONT};font-size:36px;line-height:40px;font-weight:bold;letter-spacing:-0.5px;color:${INK};">
    Thank you for reaching out.
  </td></tr>

  <tr><td class="px" style="padding:18px 40px 0 40px;font-family:${FONT};font-size:16px;line-height:26px;color:#4a4a4d;">
    Hi ${esc(firstNameOf(name))},<br /><br />
    Your ${brand ? `brief for <strong style="color:${INK};">${esc(brand)}</strong>` : "enquiry"} has reached us, and it's already in front of the team.
    We read every one properly rather than firing back a quote, so give us a little time &mdash; someone will come back to you <strong style="color:${INK};">within one working day</strong> with the next steps.
  </td></tr>

  <!-- What happens next. Mirrors the three steps on the start-project page, so
       the promise made on the site and the promise made here are the same. -->
  <tr><td class="px" style="padding:30px 40px 0 40px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      ${step("01", "WE READ YOUR BRIEF IN FULL")}
      ${step("02", "WE CALL YOU WITHIN ONE WORKING DAY")}
      ${step("03", "PLAN + QUOTE IN YOUR INBOX")}
    </table>
  </td></tr>

  <!-- Their own words back to them: it confirms nothing was lost in the form,
       and gives them something to correct by simply hitting reply. -->
  <tr><td class="px" style="padding:30px 40px 0 40px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:${PAPER};border-left:3px solid ${RED};">
      <tr><td style="padding:22px 24px;">
        <div style="font-family:${MONO};font-size:10px;letter-spacing:2.2px;color:${GREY};padding-bottom:6px;">WHAT YOU SENT US</div>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          ${summaryRows(message)}
        </table>
      </td></tr>
    </table>
  </td></tr>

  <tr><td class="px" style="padding:28px 40px 0 40px;font-family:${FONT};font-size:15px;line-height:25px;color:#4a4a4d;">
    Anything to add or change, just reply to this email &mdash; it comes straight to us.
  </td></tr>

  <!-- One button, not a row of them. The mailto that used to sit beside it said
       nothing the "just reply" line above does not, and a row of coloured
       buttons is a shape Gmail's tab classifier reads as marketing. -->
  <tr><td class="px" style="padding:22px 40px 0 40px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
      <tr><td style="background-color:${RED};">
        <a href="${WHATSAPP}" style="display:inline-block;padding:14px 24px;font-family:${FONT};font-size:14px;font-weight:bold;color:#ffffff;">Message us on WhatsApp &rarr;</a>
      </td></tr>
    </table>
  </td></tr>

  <tr><td class="px" style="padding:34px 40px 0 40px;">
    <div style="border-top:1px solid ${LINE};line-height:0;font-size:0;">&nbsp;</div>
  </td></tr>

  <!-- No unsubscribe link: this is a one-off reply to something the recipient
       just submitted, not a list they can leave. The line below says so, which
       is what stops it being reported as bulk mail. -->
  <tr><td align="center" class="px" style="padding:22px 40px 40px 40px;font-family:${FONT};font-size:11px;line-height:18px;color:#9a9a9e;">
    You're getting this because you submitted a project brief on admirate.in.<br />
    It's a one-off reply &mdash; you haven't been added to any mailing list.<br /><br />
    ${esc(SITE.name)} &mdash; ${esc(SITE.tagline)}<br />
    ${esc(SITE.area)}, ${esc(SITE.city)}, ${esc(SITE.region)}, ${esc(SITE.country)}<br />
    <a href="${SITE.url}" style="color:#9a9a9e;text-decoration:underline;">admirate.in</a>
  </td></tr>

</table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr>
</table>
</body>
</html>`;
}
